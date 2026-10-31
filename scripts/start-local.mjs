import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, openSync, closeSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const logs = path.join(tmpdir(), "nexus-local-preview");
const children = [];
let stopping = false;

function stop() {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode !== null || !child.pid) continue;
    if (process.platform === "win32") {
      spawnSync("taskkill.exe", ["/PID", String(child.pid), "/T", "/F"], {
        windowsHide: true,
        stdio: "ignore",
      });
    } else {
      child.kill("SIGTERM");
    }
  }
}

for (const signal of ["SIGINT", "SIGTERM", "SIGBREAK"]) {
  process.on(signal, () => {
    stop();
    process.exit(0);
  });
}
process.on("exit", stop);

async function availablePort(preferred) {
  for (let port = preferred; port < preferred + 10; port++) {
    const free = await new Promise((resolve) => {
      const server = createServer();
      server.once("error", () => resolve(false));
      server.listen(port, "0.0.0.0", () => server.close(() => resolve(true)));
    });
    if (free) return port;
  }
  throw new Error(
    `No free port near ${preferred}. Close an unused local preview and try again.`,
  );
}

function start(name, directory, args, environment) {
  const logPath = path.join(logs, `${name}.log`);
  const output = openSync(logPath, "w");
  const child = spawn(process.execPath, args, {
    cwd: path.join(root, directory),
    env: { ...process.env, ...environment },
    windowsHide: true,
    stdio: ["ignore", output, output],
  });
  closeSync(output);
  children.push(child);
  child.on("error", (error) => {
    console.error(`${name}: ${error.message}`);
    stop();
    process.exit(1);
  });
  child.on("exit", (code) => {
    if (stopping) return;
    console.error(`${name} stopped (exit ${code}). Details: ${logPath}`);
    stop();
    process.exit(1);
  });
}

async function waitFor(url, validate) {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
      if (response.ok && validate(await response.text())) return;
    } catch {
      // Services need a moment to bind their ports and compile the first page.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Startup timed out for ${url}. Logs: ${logs}`);
}

try {
  for (const file of [
    "Client/node_modules/next/dist/bin/next",
    "Server/dist/main.js",
  ]) {
    if (!existsSync(path.join(root, file))) {
      throw new Error(
        `Missing ${file}. Install dependencies and build the server first.`,
      );
    }
  }
  mkdirSync(logs, { recursive: true });
  const apiPort = await availablePort(4010);
  const webPort = await availablePort(3010);
  const apiUrl = `http://localhost:${apiPort}/api`;
  const webUrl = `http://localhost:${webPort}`;

  console.log("\nNEXUS Conf — local preview\n");
  console.log("Starting the API and website...");
  start("api", "Server", ["dist/main.js"], {
    PORT: String(apiPort),
    CLIENT_ORIGIN: webUrl,
  });
  await waitFor(`${apiUrl}/health`, (body) => body.includes("NEXUS Conf"));
  start(
    "website",
    "Client",
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--port",
      String(webPort),
      "--hostname",
      "0.0.0.0",
    ],
    {
      NEXT_PUBLIC_API_URL: apiUrl,
    },
  );
  await waitFor(webUrl, (body) => body.includes("Big ideas."));
  console.log(`\nReady: ${webUrl}`);
  console.log(`API:   ${apiUrl}`);
  console.log("\nKeep this window open while viewing the site.");
  console.log("Press Ctrl+C to stop both services.");
  console.log(`Logs: ${logs}\n`);

  if (process.platform === "win32") {
    const browser = spawn(
      "rundll32.exe",
      ["url.dll,FileProtocolHandler", webUrl],
      {
        windowsHide: true,
        stdio: "ignore",
      },
    );
    browser.on("error", () => console.log(`Open ${webUrl} in your browser.`));
  }
} catch (error) {
  console.error(`\n${error.message}`);
  stop();
  process.exitCode = 1;
}

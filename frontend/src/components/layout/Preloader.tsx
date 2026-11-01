"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setShow(false), 1200);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!show) document.body.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          <motion.div
            className="font-display text-6xl text-neon sm:text-8xl"
            initial={{ opacity: 0, scale: 0.72, filter: "blur(16px)" }}
            animate={{
              opacity: 1,
              scale: [0.72, 1.06, 1],
              filter: ["blur(16px)", "blur(0px)", "blur(0px)"],
            }}
            transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          >
            NEXUS
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

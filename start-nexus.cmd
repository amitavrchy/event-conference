@echo off
title NEXUS Conf - Local preview
cd /d "%~dp0"
node scripts/start-local.mjs
if errorlevel 1 (
  echo.
  echo NEXUS could not start. Check the message above.
  pause
)

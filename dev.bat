@echo off
REM OasisWaker v2.0 — Development Startup Script
REM Starts both backend and frontend servers.
REM
REM Usage:
REM   .\dev.bat          Start both servers
REM   .\dev.bat backend  Start backend only
REM   .\dev.bat frontend Start frontend only

echo ═══════════════════════════════════════════════
echo  OasisWaker v2.0 — Development Mode
echo ═══════════════════════════════════════════════

if "%1"=="backend" goto backend
if "%1"=="frontend" goto frontend

REM Default: start both
start "OasisWaker Backend" cmd /c "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
start "OasisWaker Frontend" cmd /c "cd /d %~dp0frontend && npx next dev -p 3000"
echo Both servers starting...
echo   Backend:  http://127.0.0.1:8000/docs
echo   Frontend: http://127.0.0.1:3000
goto end

:backend
cd /d %~dp0backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
goto end

:frontend
cd /d %~dp0frontend
npx next dev -p 3000
goto end

:end
echo.
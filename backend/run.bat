@echo off
cd /d "%~dp0"
echo ==========================================
echo   Starting Virtual Office AI Backend (Win)
echo ==========================================

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment in venv...
    python -m venv venv
    call venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

REM Check dependencies
echo Checking dependencies...
python -c "import httpx, fastapi, uvicorn" 2>nul || (
    echo Installing missing dependencies...
    pip install -r requirements.txt
)

REM Run FastAPI uvicorn server
echo Starting FastAPI server on port 8000...
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
pause

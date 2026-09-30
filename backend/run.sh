#!/usr/bin/env bash
set -e

# Change directory to backend directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  Starting Virtual Office AI Backend      "
echo "=========================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment in venv..."
    if command -v uv &> /dev/null; then
        uv venv venv --python 3.11
        source venv/bin/activate
        uv pip install -r requirements.txt
    else
        python3 -m venv venv
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r requirements.txt
    fi
else
    source venv/bin/activate
fi

# Ensure requirements are satisfied
echo "Checking dependencies..."
python -c "import httpx, fastapi, uvicorn" 2>/dev/null || {
    echo "Installing missing dependencies..."
    pip install -r requirements.txt
}

# Run FastAPI uvicorn server
echo "Starting FastAPI server..."
exec python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000

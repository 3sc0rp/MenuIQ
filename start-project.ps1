# MenuIQ Project Startup Script
# This script starts both the backend and frontend services

Write-Host "🚀 Starting MenuIQ Project..." -ForegroundColor Green

# Function to kill processes on specific ports
function Kill-ProcessOnPort {
    param([int]$Port)
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    foreach ($process in $processes) {
        $processId = $process.OwningProcess
        $processName = (Get-Process -Id $processId -ErrorAction SilentlyContinue).ProcessName
        Write-Host "Killing process $processName (PID: $processId) on port $Port" -ForegroundColor Yellow
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
}

# Kill any existing processes on our ports
Write-Host "🔧 Cleaning up existing processes..." -ForegroundColor Yellow
Kill-ProcessOnPort 3000
Kill-ProcessOnPort 3001

# Wait a moment for processes to fully terminate
Start-Sleep -Seconds 2

# Start backend
Write-Host "🔧 Starting backend server..." -ForegroundColor Blue
Set-Location "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev:sqlite" -WindowStyle Normal

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start frontend
Write-Host "🔧 Starting frontend server..." -ForegroundColor Blue
Set-Location "../frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal

# Return to project root
Set-Location ".."

Write-Host "✅ MenuIQ project started successfully!" -ForegroundColor Green
Write-Host "📊 Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📋 Health check: http://localhost:3001/api/health" -ForegroundColor Cyan 
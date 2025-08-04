# MenuIQ Backend Deployment Script
Write-Host "🚀 Deploying MenuIQ Backend to Vercel..." -ForegroundColor Green

# Navigate to backend directory
Set-Location backend

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Deploy to Vercel
Write-Host "📦 Deploying backend..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Backend deployment complete!" -ForegroundColor Green
Write-Host "📝 Please note your backend URL and set it as REACT_APP_API_URL in your frontend environment variables." -ForegroundColor Cyan
Write-Host "🔗 You can find the URL in your Vercel dashboard." -ForegroundColor Cyan

# Return to root directory
Set-Location .. 
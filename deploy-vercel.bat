@echo off
echo ========================================
echo Vercel Deployment - Beam Analysis
echo ========================================
echo.

cd frontend

echo Setting environment variables...
set REACT_APP_API_URL=https://beam-analysis-api.onrender.com

echo.
echo Building production bundle...
call npm run build

echo.
echo Deploying to Vercel...
call vercel --prod

echo.
echo ========================================
echo Deployment Complete!
echo ========================================
echo.
echo Your app should now be live on Vercel!
echo Check the URL provided above.
echo.
pause

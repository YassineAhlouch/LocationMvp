@echo off
REM Eyris MCP Server Setup Script for Windows
REM Run this from the mcp-server directory

echo.
echo Eyris MCP Server Setup
echo ==========================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js v18+ first.
    exit /b 1
)

echo Node.js detected
node -v
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed
echo.

REM Build the server
echo Building MCP server...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Failed to build server
    exit /b 1
)

echo ✅ Server built successfully
echo.

REM Get absolute path
set "SERVER_PATH=%CD%\dist\index.js"

echo Setup Complete!
echo.
echo Server location: %SERVER_PATH%
echo.
echo Next steps:
echo ===========
echo.
echo 1. Configure your AI assistant:
echo.
echo    For Claude Desktop, add to claude_desktop_config.json:
echo    {
echo      "mcpServers": {
echo        "eyris": {
echo          "command": "node",
echo          "args": ["%SERVER_PATH%"]
echo        }
echo      }
echo    }
echo.
echo    For Cursor/Windsurf/Kiro, add to .kiro/settings/mcp.json:
echo    {
echo      "mcpServers": {
echo        "eyris": {
echo          "command": "node",
echo          "args": ["./mcp-server/dist/index.js"],
echo          "disabled": false
echo        }
echo      }
echo    }
echo.
echo 2. Restart your AI assistant
echo.
echo 3. Test it by asking: 'What components are available in Eyris?'
echo.
echo For detailed instructions, see: README.md
echo.

pause

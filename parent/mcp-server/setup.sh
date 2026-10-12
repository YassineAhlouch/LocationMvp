#!/bin/bash

# Eyris MCP Server Setup Script
# Run this from the mcp-server directory

echo " Eyris MCP Server Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js version is $NODE_VERSION. Version 18+ is recommended."
fi

echo "Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo "Dependencies installed"
echo ""

# Build the server
echo "Building MCP server..."
npm run build

if [ $? -ne 0 ]; then
    echo "Failed to build server"
    exit 1
fi

echo "Server built successfully"
echo ""

# Get absolute path
ABSOLUTE_PATH=$(pwd)
SERVER_PATH="$ABSOLUTE_PATH/dist/index.js"

echo "Setup Complete!"
echo ""
echo "Server location: $SERVER_PATH"
echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "1. Configure your AI assistant:"
echo ""
echo "   For Claude Desktop, add to claude_desktop_config.json:"
echo "   {"
echo "     \"mcpServers\": {"
echo "       \"eyris\": {"
echo "         \"command\": \"node\","
echo "         \"args\": [\"$SERVER_PATH\"]"
echo "       }"
echo "     }"
echo "   }"
echo ""
echo "   For Cursor/Windsurf/Kiro, add to .kiro/settings/mcp.json:"
echo "   {"
echo "     \"mcpServers\": {"
echo "       \"eyris\": {"
echo "         \"command\": \"node\","
echo "         \"args\": [\"./mcp-server/dist/index.js\"],"
echo "         \"disabled\": false"
echo "       }"
echo "     }"
echo "   }"
echo ""
echo "2. Restart your AI assistant"
echo ""
echo "3. Test it by asking: 'What components are available in Eyris?'"
echo ""
echo "For detailed instructions, see: README.md"
echo ""

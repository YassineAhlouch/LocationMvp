# Eyris MCP Server

AI-powered documentation server for the Eyris React Admin Template. Connect it to your AI assistant and it will understand all of Eyris's components, hooks, utilities, and patterns.

## Setup

The server is pre-built and dependencies are bundled. No setup is required.

### Modifying the Server
If you want to modify the server source code, you'll need to install dependencies and rebuild:

```bash
cd mcp-server
npm install
npm run build
```

## Connect to Your AI Assistant

**Claude Code (CLI)** — Run this command in your project root:
```bash
claude mcp add eyris node /absolute/path/to/project/mcp-server/dist/index.js
```

**Cursor**
1. Open Cursor Settings ( Cmd/Ctrl + Shift + P -> search "Cursor Settings").
2. Select "Tools & MCP"
3. Click "New MCP Server"
4. Add Server Configuration: Add a new entry to the mcpServers JSON object with the command to run your local server:

```json
{
  "mcpServers": {
    "eyris": {
      "command": "node",
      "args": ["/absolute/path/to/project/mcp-server/dist/index.js"]
    }
  }
}
```

**Kiro** 
1. Open the Kiro Panel: Click the Kiro Ghost icon in the activity bar on the left sidebar of the Kiro IDE.
2. Navigate to MCP Servers: Expand the "MCP Servers" section in the Kiro panel.
3. Open the Configuration File: Click the edit button (pencil icon) next to "MCP" or select the + button and choose to edit the configuration file. This opens the mcp.json file, which can be configured at a workspace level (.kiro/settings/mcp.json) or user level (~/.kiro/settings/mcp.json).
4. Add Server Configuration: Add a new entry to the mcpServers JSON object with the command to run your local server:
```json
{
  "mcpServers": {
    "eyris": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/mcp-server/dist/index.js"],
      "disabled": false
    }
  }
}
```

**Antigravity**
1. Click the **"..."** menu at the top of the Agent pane
2. Select **MCP Servers** > **Manage MCP Servers**
3. Click **"View raw config"** to edit the JSON helper
4. Add the following to the `mcpServers` object (ensure valid JSON):

```json
{
  "mcpServers": {
    "eyris": {
      "command": "node",
      "args": ["/absolute/path/to/your/project/mcp-server/dist/index.js"]
    }
  }
}
```

Restart your AI assistant after configuring.

**Absolute Paths Example**:
> - **Windows Example**: `C:\Users\Username\Projects\eyris\mcp-server\dist\index.js`
> - **macOS / Linux Example**: `/Users/username/projects/eyris/mcp-server/dist/index.js`


## Try It

```
"What components are available in Eyris?"
"Show me code examples for the DataTable component"
"How do I build a CRUD list page with Eyris?"
"Show me all form components"
"What hooks can I use for theming?"
```

# SAP System Discovery MCP Server (Trial version)

A read-only Model Context Protocol server for discovering SAP systems
configured in the current Windows user's local SAP Logon landscape.

The server is distributed as:

```text
sap-system-discovery-mcp

The server currently exposes two MCP tools:

1. `list_sap_systems`
   - Returns only the configured SAP System ID and entry name.
2. `calculate_effort` (ignore this)
   - Calculates project effort from the number of people, working days and working hours per day.

## Purpose

The main purpose of this project is to demonstrate how a narrowly scoped MCP tool can provide Claude Code with a predictable interface for reading configured SAP systems from SAP Logon.

Without this tool, Claude Code may use general shell capabilities to locate and inspect SAP configuration files, subject to user approval. This MCP server instead provides a named, reusable and read-only tool that returns only the required fields.

## Supported environment

This proof of concept currently requires:

- Windows 11 or higher
- SAP Logon (GUI) for Windows
- Node.js (ignore if installed already)
- npm (ignore if installed already)
- Claude Code (ignore if installed already)
- A user-specific `SAPUILandscape.xml` file in the standard SAP configuration location

## Current tools

### `list_sap_systems`

Lists SAP systems from the current user's SAP Logon.

The tool currently returns only:

- System ID
- SAP Logon entry name

Example output:

```text
Configured SAP systems:
DXX | DXX [Development]
QXX | QXX [Quality]
PXX | PXX [Production]
```

The actual result depends on the SAP systems configured for the user running the MCP server.

The tool does not return:

- Application server or hostname
- Port or instance details
- SAP client number
- Username or credentials
- UUID
- SNC settings
- Live connection status

### `calculate_effort` (Optional)

Calculates total project effort using:

- Number of people
- Working days
- Working hours per day

Example:

```text
7 people × 15 working days × 8 hours per day = 840 hours
```

## Security and privacy

This server is intended as a read-only learning project and purely for experimental use.

The SAP Logon tool:

- Reads a local SAP landscape file.
- Does not modify the file.
- Does not establish an SAP connection.
- Does not log in to an SAP system.
- Does not execute an SAP transaction.
- Does not read or return credentials.
- Retains only the `systemid` and `name` attributes from each discovered service.

## Installation

### Prerequisites

Before installing the MCP server, confirm that the following are available: 
- Windows 
- SAP Logon for Windows 
- Node.js and npm 
- Claude Code, installed and authenticated


## Register with Claude Code at user scope

Run the following commands from the repository root in PowerShell:

```powershell
claude mcp add --scope user sap-system-discovery sap-system-discovery-mcp
```

- This adds the MCP server to the current user's Claude Code configuration.

- The registration is user-scoped, so it is available across that user's Claude Code projects.

- No manual editing of .claude.json is required.


## Verify the MCP registration

From PowerShell, run:

```powershell
claude mcp get sap-system-discovery
```

You can also list configured MCP servers:

```powershell
claude mcp list
```

## Run in Claude Code

Start Claude Code:

```powershell
claude
```

Inside Claude Code, run:

```text
/mcp
```

Select `sap-system-discovery`. 

A successful registration should show: 
```text 
Status: connected 
Command: sap-system-discovery-mcp 
Capabilities: tools 
Tools: 2 tools 
```

The server should expose:

```text
list_sap_systems
calculate_effort (optional, ignore it)
```

## Example prompts

Claude Code can select the relevant MCP tool from a natural-language request.
The server and tool names normally do not need to be mentioned.

### List configured SAP systems

Ask naturally, without naming the MCP tool:

```text
Show me the SAP systems configured in my SAP Logon.
```

Claude Code should select `list_sap_systems` when the tool is available and relevant.

### Calculate project effort (Optional, you may try)

```text
Calculate the project effort for 7 people working for 15 days at 8 hours per day.
```

## Uninstall
 
First remove the Claude Code registration:
 
```powershell
claude mcp remove --scope user sap-system-discovery
```
 
Then uninstall the npm package:
 
```powershell
npm uninstall -g sap-system-discovery-mcp
```

## Project status

This project is currently a proof of concept for experimental use.

Implemented:

- Local stdio MCP server
- `list_sap_systems`
- `calculate_effort` (optional, ignore this)
- Minimal SAP landscape data exposure
- Claude Code user-scope registration

Next Scope:

- Live SAP GUI connection status

## Disclaimer

This is an independent learning project as developed by myself. 
This is not an SAP product.

SAP and SAP Logon are trademarks or registered trademarks of SAP SE or its affiliates.

Tips: Use the project only in environments where you are authorized to access the local SAP Logon configuration. Just for internal use only. 
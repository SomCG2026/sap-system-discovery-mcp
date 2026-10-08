# SAP Logon MCP Test Server

A small, read-only Model Context Protocol server for experimenting with Claude Code and locally configured SAP Logon systems on Windows.

The server currently exposes two MCP tools:

1. `list_sap_systems`
   - Reads the current Windows user's SAP Logon landscape configuration.
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

The tool looks for:

```text
%APPDATA%\SAP\Common\SAPUILandscape.xml
```

The server derives `%APPDATA%` from the current user's Windows environment. No Windows username or absolute user path is hardcoded.

## Current tools

### `list_sap_systems`

Lists SAP systems from the current user's SAP Logon landscape.

The tool returns only:

- System ID
- SAP Logon entry name

Example output:

```text
Configured SAP systems:
DS4 | DS4 [Development]
QS4 | QS4 [Quality]
PS4 | PS4 [Production]
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

### `calculate_effort` (ignore this)

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

Do not copy or commit any of the following into this repository:

- `SAPUILandscape.xml`
- `SAPUILandscapeGlobal.xml`
- `.claude.json`
- API keys
- Access tokens
- SAP credentials
- Internal system connection details
- `.env` files

Review the source code before registering or running any local MCP server.

## Installation

### 1. Clone the repository

```powershell
git clone <REPOSITORY-URL>
cd sap-mcp-test
```

Replace `<REPOSITORY-URL>` with the actual repository URL.

If the repository folder has a different name, change into that folder instead.

### 2. Install dependencies

```powershell
npm install
```

### 3. Verify the TypeScript code

```powershell
npx tsc --noEmit
```

A successful type-check normally returns to the PowerShell prompt without displaying an error.

## Register with Claude Code at user scope

Run the following commands from the repository root in PowerShell:

```powershell
$serverPath = (Resolve-Path ".\src\index.ts").Path

claude mcp add --transport stdio --scope user sap-mcp-test -- npx tsx "$serverPath"
```

This registers the local MCP server in the current user's Claude Code configuration.

It does not require committing a personal `.claude.json` file to the repository.

## Verify the MCP registration

From PowerShell, run:

```powershell
claude mcp get sap-mcp-test
```

The result should show:

- Scope: user configuration
- Type: stdio
- Command: `npx`
- Connection status: connected

You can also list configured MCP servers:

```powershell
claude mcp list
```

## Test in Claude Code

Start Claude Code:

```powershell
claude
```

Inside Claude Code, run:

```text
/mcp
```

Select `sap-mcp-test`.

The server should expose:

```text
calculate_effort
list_sap_systems
```

## Example prompts

### List configured SAP systems

Ask naturally, without naming the MCP tool:

```text
Show me the SAP systems configured in my SAP Logon.
```

Claude Code should select `list_sap_systems` when the tool is available and relevant.

### Calculate project effort

```text
Calculate the project effort for 7 people working for 15 days at 8 hours per day.
```


## Troubleshooting

### `SAP Logon landscape configuration was not found`

Confirm that this file exists:

```text
%APPDATA%\SAP\Common\SAPUILandscape.xml
```

Some installations may use centrally managed or differently located SAP landscape configuration. This proof of concept currently checks only the standard per-user file location.

## Remove the server

To remove the personal MCP registration:

```powershell
claude mcp remove sap-mcp-test
```

Removing the registration does not delete the cloned repository.

## Project status

This project is currently a proof of concept.

Implemented:

- Local stdio MCP server
- `list_sap_systems`
- `calculate_effort` (ignore this)
- Runtime discovery through `%APPDATA%`
- Minimal SAP landscape data exposure
- MCP Inspector testing
- Claude Code user-scope registration

Next Scope:

- Live SAP GUI connection status

## Disclaimer

This is an independent learning project as developed by myself. 
This is not an SAP product.

SAP and SAP Logon are trademarks or registered trademarks of SAP SE or its affiliates.

Tips: Use the project only in environments where you are authorized to access the local SAP Logon configuration. Just for internal use only. 
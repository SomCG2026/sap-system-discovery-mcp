import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";

serveStdio(() => {
  const server = new McpServer({
    name: "sap-mcp-test",
    version: "1.0.0"
  });

  server.registerTool(
    "calculate_effort",
    {
      description: "Calculate total project effort based on people, working days, and hours per day.",
      inputSchema: z.object({
        people: z.number().positive(),
        workingDays: z.number().positive(),
        hoursPerDay: z.number().positive()
      })
    },
    async ({ people, workingDays, hoursPerDay }) => {
      const totalHours = people * workingDays * hoursPerDay;
       
      return {
        content: [
          {
            type: "text",
            text: `Total project effort: ${totalHours} hours`
          }
        ]
      };
    }
  );

  server.registerTool(
    "list_sap_systems",
    {
      description: "List SAP systems configured in the current user's SAP Logon.",
      inputSchema: z.object({})
    },
    async () => {
      const appData = process.env.APPDATA;

      if (!appData) {
        throw new Error("Windows APPDATA environment variable is not available.");
      }

      const landscapePath = path.join(
        appData,
        "SAP",
        "Common",
        "SAPUILandscape.xml"
      );

      let landscapeXml: string;

      try {
        landscapeXml = await readFile(landscapePath, "utf8");
      } catch (error: unknown) {
        const errorCode =
          typeof error === "object" &&
          error !== null &&
          "code" in error
            ? String(error.code)
            : "";

        if (errorCode === "ENOENT") {
          return {
            content: [
              {
                type: "text",
                text: "SAP Logon landscape configuration was not found for the current Windows user."
              }
            ]
          };
        }

        throw error;
      }

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ""
      });

      const parsedLandscape = parser.parse(landscapeXml);

      const serviceData = parsedLandscape?.Landscape?.Services?.Service;

      const services = Array.isArray(serviceData)
        ? serviceData
        : serviceData
          ? [serviceData]
          : [];

      const systems = services
        .map((service: any) => ({
          systemId: service.systemid,
          name: service.name
        }))
        .filter(
          (system: { systemId?: string; name?: string }) =>
            system.systemId && system.name
        );

      if (systems.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No SAP systems were found in the current user's SAP Logon landscape configuration."
            }
          ]
        };
      }

      const systemList = systems
        .map(
          (system: { systemId: string; name: string }) =>
            `${system.systemId} | ${system.name}`
        )
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Configured SAP systems:\n${systemList}`
          }
        ]
      };
    }
  );

  return server;
});
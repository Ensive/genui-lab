import { z } from "zod";

export const RenderModeSchema = z.enum([
  "markdown",
  "tool-ui",
  "generated-tree",
  "json-render",
  "a2ui",
  "openui",
  "mcp-app",
]);

export type RenderMode = z.infer<typeof RenderModeSchema>;

export interface RenderModeDescriptor {
  id: RenderMode;
  name: string;
  description: string;
  status: "available" | "planned";
}

export const RENDER_MODES: readonly RenderModeDescriptor[] = [
  {
    id: "markdown",
    name: "Markdown",
    description: "Deterministic prose representation of the normalized domain result.",
    status: "available",
  },
  {
    id: "tool-ui",
    name: "Tool UI",
    description: "Fixed React components bound to the same normalized domain result.",
    status: "available",
  },
  {
    id: "generated-tree",
    name: "Generated",
    description: "Catalog-constrained generative component tree (planned).",
    status: "planned",
  },
  {
    id: "json-render",
    name: "json-render",
    description: "Declarative json-render representation (planned).",
    status: "planned",
  },
  {
    id: "a2ui",
    name: "A2UI",
    description: "A2UI declarative generated UI protocol (planned).",
    status: "planned",
  },
  {
    id: "openui",
    name: "OpenUI",
    description: "OpenUI compact streaming UI language (planned).",
    status: "planned",
  },
  {
    id: "mcp-app",
    name: "MCP App",
    description: "Sandboxed portable interactive application UI (planned).",
    status: "planned",
  },
] as const;

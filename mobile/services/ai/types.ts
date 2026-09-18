import type { FunctionDeclaration, ObjectSchemaInterface } from "firebase/ai";

/** Whatever a tool hands back to Gemini as its `functionResponse.response`. */
export type ToolResult = Record<string, unknown>;

export type ToolHandler = (args: Record<string, unknown>) => Promise<ToolResult>;

export type ToolSpec = {
  declaration: FunctionDeclaration;
  handler: ToolHandler;
};

export type ToolRegistry = Record<string, ToolSpec>;

type PropertySchema = {
  type: "string" | "number" | "integer" | "boolean" | "array" | "object";
  description?: string;
  enum?: string[];
  items?: PropertySchema;
  nullable?: boolean;
};

/**
 * Plain-object parameter schemas. The SDK serialises declarations with
 * `JSON.stringify`, so literal objects travel fine and we avoid building
 * Schema class instances for every field.
 */
export function params(
  properties: Record<string, PropertySchema>,
  required: string[] = [],
): ObjectSchemaInterface {
  return {
    type: "object",
    properties,
    required,
  } as unknown as ObjectSchemaInterface;
}

export function str(description: string, options?: { enum?: string[] }): PropertySchema {
  return { type: "string", description, ...(options?.enum ? { enum: options.enum } : {}) };
}

export function int(description: string): PropertySchema {
  return { type: "integer", description };
}

export function bool(description: string): PropertySchema {
  return { type: "boolean", description };
}

export function tool(
  name: string,
  description: string,
  parameters: ObjectSchemaInterface | null,
  handler: ToolHandler,
): [string, ToolSpec] {
  return [
    name,
    {
      declaration: parameters
        ? { name, description, parameters }
        : { name, description },
      handler,
    },
  ];
}

/** Standard shape for a tool the model called with unusable input. */
export function toolError(message: string): ToolResult {
  return { ok: false, error: message };
}

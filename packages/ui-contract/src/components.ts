import { z } from "zod";

/**
 * Controlled UI vocabulary for future catalog-constrained GenUI experiments.
 * Commit #1 defines contracts; only components needed by tool-bound UI are rendered.
 */

export const StatusToneSchema = z.enum(["normal", "warning", "critical", "info"]);
export type StatusTone = z.infer<typeof StatusToneSchema>;

export const HeadingNodeSchema = z.object({
  kind: z.literal("Heading"),
  id: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  text: z.string().min(1),
});

export const TextNodeSchema = z.object({
  kind: z.literal("Text"),
  id: z.string().min(1),
  text: z.string().min(1),
});

export const MetricNodeSchema = z.object({
  kind: z.literal("Metric"),
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  tone: StatusToneSchema.optional(),
});

export const StatusNodeSchema = z.object({
  kind: z.literal("Status"),
  id: z.string().min(1),
  label: z.string().min(1),
  tone: StatusToneSchema,
});

export const AlertNodeSchema = z.object({
  kind: z.literal("Alert"),
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  tone: StatusToneSchema,
});

export const DataTableColumnSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
});

export const DataTableNodeSchema = z.object({
  kind: z.literal("DataTable"),
  id: z.string().min(1),
  columns: z.array(DataTableColumnSchema).min(1),
  rows: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))),
});

export const TimeSeriesChartSeriesSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  unit: z.string().min(1),
  points: z.array(
    z.object({
      timestamp: z.string().datetime(),
      value: z.number(),
    }),
  ),
});

export const TimeSeriesChartNodeSchema = z.object({
  kind: z.literal("TimeSeriesChart"),
  id: z.string().min(1),
  title: z.string().min(1),
  /** Accessible text summary — color must not be the only anomaly cue. */
  summary: z.string().min(1),
  series: z.array(TimeSeriesChartSeriesSchema).min(1),
  highlight: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime(),
      label: z.string().min(1),
    })
    .optional(),
});

export const TimelineItemSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime(),
  label: z.string().min(1),
  detail: z.string().optional(),
  tone: StatusToneSchema.optional(),
});

export const TimelineNodeSchema = z.object({
  kind: z.literal("Timeline"),
  id: z.string().min(1),
  items: z.array(TimelineItemSchema),
});

export const SourceListItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export const SourceListNodeSchema = z.object({
  kind: z.literal("SourceList"),
  id: z.string().min(1),
  items: z.array(SourceListItemSchema),
});

export const StackNodeSchema: z.ZodType<StackNode> = z.lazy(() =>
  z.object({
    kind: z.literal("Stack"),
    id: z.string().min(1),
    gap: z.enum(["sm", "md", "lg"]).optional(),
    children: z.array(UiNodeSchema),
  }),
);

export const GridNodeSchema: z.ZodType<GridNode> = z.lazy(() =>
  z.object({
    kind: z.literal("Grid"),
    id: z.string().min(1),
    columns: z.number().int().min(1).max(4).optional(),
    children: z.array(UiNodeSchema),
  }),
);

export type StackNode = {
  kind: "Stack";
  id: string;
  gap?: "sm" | "md" | "lg";
  children: UiNode[];
};

export type GridNode = {
  kind: "Grid";
  id: string;
  columns?: number;
  children: UiNode[];
};

export const LeafUiNodeSchema = z.discriminatedUnion("kind", [
  HeadingNodeSchema,
  TextNodeSchema,
  MetricNodeSchema,
  StatusNodeSchema,
  AlertNodeSchema,
  DataTableNodeSchema,
  TimeSeriesChartNodeSchema,
  TimelineNodeSchema,
  SourceListNodeSchema,
]);

export type LeafUiNode = z.infer<typeof LeafUiNodeSchema>;

export type UiNode = LeafUiNode | StackNode | GridNode;

export const UiNodeSchema: z.ZodType<UiNode> = z.lazy(() =>
  z.union([LeafUiNodeSchema, StackNodeSchema, GridNodeSchema]),
);

export const ToolUiRepresentationSchema = z.object({
  kind: z.literal("tool-ui"),
  root: UiNodeSchema,
});

export type ToolUiRepresentation = z.infer<typeof ToolUiRepresentationSchema>;

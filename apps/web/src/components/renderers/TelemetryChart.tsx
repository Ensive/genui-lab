import type { UiNode } from "@genui-lab/ui-contract";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartNode = Extract<UiNode, { kind: "TimeSeriesChart" }>;

interface TelemetryChartProps {
  node: ChartNode;
}

function formatTick(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function TelemetryChart({ node }: TelemetryChartProps) {
  const battery = node.series.find((series) => series.id === "chart:battery-temperature");
  const ambient = node.series.find((series) => series.id === "chart:ambient-temperature");

  const rows =
    battery?.points.map((point, index) => ({
      timestamp: point.timestamp,
      battery: point.value,
      ambient: ambient?.points[index]?.value ?? null,
    })) ?? [];

  return (
    <section
      className="space-y-3 rounded-md border border-[var(--color-line)] bg-[var(--color-panel)] p-4"
      aria-labelledby={`${node.id}-title`}
    >
      <div className="space-y-1">
        <h3 id={`${node.id}-title`} className="text-sm font-semibold">
          {node.title}
        </h3>
        <p
          className="text-xs leading-relaxed text-[var(--color-ink-muted)]"
          data-testid="chart-summary"
        >
          {node.summary}
        </p>
        {node.highlight ? (
          <p className="font-mono text-[11px] text-[var(--color-critical)]">
            Highlighted interval (pattern + label): {node.highlight.label} · {node.highlight.start}{" "}
            → {node.highlight.end}
          </p>
        ) : null}
      </div>
      <div className="h-64 w-full" role="img" aria-label={node.summary}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTick}
              tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
              minTickGap={24}
            />
            <YAxis unit="°C" tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }} width={48} />
            <Tooltip
              labelFormatter={(value) => String(value)}
              contentStyle={{
                background: "var(--color-panel)",
                border: "1px solid var(--color-line)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Legend />
            {node.highlight ? (
              <ReferenceArea
                x1={node.highlight.start}
                x2={node.highlight.end}
                fill="var(--color-critical)"
                fillOpacity={0.12}
                stroke="var(--color-critical)"
                strokeOpacity={0.45}
                strokeDasharray="4 3"
              />
            ) : null}
            <Line
              type="monotone"
              dataKey="battery"
              name="Battery °C"
              stroke="var(--color-critical)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="ambient"
              name="Ambient °C"
              stroke="var(--color-accent)"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

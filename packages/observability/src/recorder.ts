import {
  type ExperimentEvent,
  ExperimentEventSchema,
  type ExperimentEventType,
  type ExperimentMetrics,
} from "./events.js";

export interface NowProvider {
  /** Monotonic clock, milliseconds. Defaults to performance.now() when available. */
  now(): number;
  /** Wall clock ISO string. */
  isoNow(): string;
}

function defaultNowProvider(): NowProvider {
  return {
    now: () => {
      const perf = (globalThis as { performance?: { now?: () => number } }).performance;
      if (typeof perf?.now === "function") {
        return perf.now();
      }
      return Date.now();
    },
    isoNow: () => new Date().toISOString(),
  };
}

export class ExperimentRecorder {
  private readonly clock: NowProvider;
  private readonly startMark: number;
  private readonly events: ExperimentEvent[] = [];
  private sequence = 0;

  constructor(clock: NowProvider = defaultNowProvider()) {
    this.clock = clock;
    this.startMark = clock.now();
  }

  record(
    type: ExperimentEventType,
    options: { message?: string; data?: Record<string, unknown> } = {},
  ): ExperimentEvent {
    this.sequence += 1;
    const event = ExperimentEventSchema.parse({
      id: `event:${String(this.sequence).padStart(4, "0")}`,
      type,
      offsetMs: Math.max(0, roundMs(this.clock.now() - this.startMark)),
      at: this.clock.isoNow(),
      message: options.message,
      data: options.data,
    });
    this.events.push(event);
    return event;
  }

  getEvents(): readonly ExperimentEvent[] {
    return this.events;
  }

  elapsedMs(): number {
    return roundMs(this.clock.now() - this.startMark);
  }

  /**
   * Derive honest timing metrics from recorded lifecycle events.
   * Only returns intervals that have matching started/finished pairs.
   */
  deriveMetrics(): ExperimentMetrics {
    const domainStart = this.findOffset("DOMAIN_ANALYSIS_STARTED");
    const domainEnd = this.findOffset("DOMAIN_ANALYSIS_FINISHED");
    const repStart = this.findOffset("REPRESENTATION_STARTED");
    const repEnd = this.findOffset("REPRESENTATION_FINISHED");
    const runEnd = this.findOffset("RUN_COMPLETED") ?? this.elapsedMs();

    return {
      domainAnalysisMs:
        domainStart !== undefined && domainEnd !== undefined
          ? roundMs(domainEnd - domainStart)
          : undefined,
      representationMs:
        repStart !== undefined && repEnd !== undefined ? roundMs(repEnd - repStart) : undefined,
      totalRunMs: runEnd,
      ttftMs: null,
      ttfcMs: null,
      ttiMs: null,
      ttcMs: null,
      inputTokens: null,
      outputTokens: null,
      costUsd: null,
    };
  }

  private findOffset(type: ExperimentEventType): number | undefined {
    return this.events.find((event) => event.type === type)?.offsetMs;
  }
}

function roundMs(value: number): number {
  return Math.round(value * 100) / 100;
}

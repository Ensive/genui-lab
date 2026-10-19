# Experiment: Telemetry 001

## Task

Analyze vehicle telemetry for VIN DEMO-001 and show when battery temperature deviated from normal.

## Domain

Synthetic automotive telemetry fixture `telemetry-demo-001`.

Signals:

- `timestamp`
- `batteryTemperatureC`
- `ambientTemperatureC`
- `stateOfChargePct`
- `chargingState`
- `vehicleSpeedKph`

Normal battery temperature band: **28–42 °C**.

Anomaly: roughly **54–59 °C** for several minutes starting at `2026-03-15T10:10:00.000Z`.

## Modes under test (M1)

| Mode | Status |
| --- | --- |
| Markdown | Available |
| Tool UI | Available |

## Expected observables

- normalized `TelemetryAnalysis` with stable IDs
- one critical temperature anomaly
- chart highlighting the anomaly interval (tool UI)
- inspector showing domain result, representation, events, timing

export interface ForecastSummary {
  current_balance: number;
  projected_30d: number;
  deficit_at_day: number;
  change_from_last_week_pct: number;
}

export interface ForecastPayload {
  cash_summary?: ForecastSummary;
  cash_projection?: Array<{ day: number; label: string; value: number }>;
  inventory_projection?: Array<Record<string, unknown>>;
}

export function normalizeForecast(payload: ForecastPayload | undefined): ForecastSummary | null {
  if (!payload?.cash_summary || typeof payload.cash_summary !== 'object') {
    return null;
  }

  const summary = payload.cash_summary as unknown as Record<string, unknown>;
  return {
    current_balance: Number(summary.current_balance ?? 0),
    projected_30d: Number(summary.projected_30d ?? 0),
    deficit_at_day: Number(summary.deficit_at_day ?? 0),
    change_from_last_week_pct: Number(summary.change_from_last_week_pct ?? 0),
  };
}

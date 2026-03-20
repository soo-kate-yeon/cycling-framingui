import { getRawApiKey } from '../auth/state.js';
import { resolveFraminguiApiUrl } from '../utils/api-url.js';
import { info, error as logError } from '../utils/logger.js';
import type { UsageLedgerEntry } from './usage-ledger.js';

export async function syncUsageEvent(entry: UsageLedgerEntry): Promise<void> {
  if (!entry.userId) {
    return;
  }

  const apiKey = getRawApiKey();
  if (!apiKey) {
    return;
  }

  const { apiUrl } = resolveFraminguiApiUrl(process.env.FRAMINGUI_API_URL);
  const endpoint = `${apiUrl}/api/mcp/usage-events`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolName: entry.toolName,
        toolClass: entry.toolClass,
        units: entry.units,
        outcome: entry.outcome,
        createdAt: entry.timestamp,
      }),
    });

    if (!response.ok) {
      logError(
        `[usage-sync] Failed to sync usage event for ${entry.toolName}: ${response.status} ${response.statusText}`
      );
      return;
    }

    info(`[usage-sync] Synced usage event for ${entry.toolName}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logError(`[usage-sync] Network error while syncing usage event: ${message}`);
  }
}

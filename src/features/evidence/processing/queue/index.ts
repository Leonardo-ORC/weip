/**
 * Queue contracts.
 *
 * Reserved surface for future job queueing. This sprint defines the
 * shape only; no queue implementation ships.
 */

import type { ProcessingJob } from "../types";

export type QueuePriority = "low" | "normal" | "high" | "critical";

export interface QueueEntry {
  readonly job: ProcessingJob;
  readonly enqueuedAt: string;
  readonly priority: QueuePriority;
  readonly attempts: number;
  readonly maxAttempts: number;
}

export interface ProcessingQueue {
  enqueue(entry: QueueEntry): Promise<void>;
  dequeue(): Promise<QueueEntry | undefined>;
  peek(): Promise<QueueEntry | undefined>;
  size(): Promise<number>;
}

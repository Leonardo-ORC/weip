/**
 * Extraction Model contract.
 *
 * Every extraction provider (OpenAI, Anthropic, Gemini, Azure, OSS) MUST
 * conform to this shape. The engine consumes models exclusively through
 * this interface — provider SDKs never leak into the platform.
 */

import type {
  ExtractionCapability,
  ExtractionInputFormat,
  ExtractionModelStatus,
  ExtractionOutputFormat,
  ExtractionProviderId,
} from "../types";

export interface ExtractionModelConfigurationHint {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly required?: boolean;
}

export interface ExtractionModelDefinition {
  readonly id: string;
  readonly name: string;
  readonly provider: ExtractionProviderId;
  readonly version: string;
  readonly description: string;
  readonly status: ExtractionModelStatus;
  readonly supportedCapabilities: readonly ExtractionCapability[];
  readonly supportedInput: readonly ExtractionInputFormat[];
  readonly supportedOutput: readonly ExtractionOutputFormat[];
  readonly maxContextTokens?: number;
  readonly documentationUrl?: string;
  readonly configuration?: readonly ExtractionModelConfigurationHint[];
  readonly tags?: readonly string[];
}

/**
 * Runtime interface. Implementations are attached in future sprints — this
 * sprint ships the shape only. `extract` is intentionally typed but not
 * implemented anywhere.
 */
export interface ExtractionModel {
  readonly definition: ExtractionModelDefinition;
  extract(request: ExtractionRequest): Promise<ExtractionResponse>;
}

export interface ExtractionRequest {
  readonly requestId: string;
  readonly promptId: string;
  readonly promptVersion: string;
  readonly input: {
    readonly format: ExtractionInputFormat;
    readonly payload: unknown;
  };
  readonly targetFormat: ExtractionOutputFormat;
  readonly configuration?: Readonly<Record<string, unknown>>;
}

export interface ExtractionResponse {
  readonly requestId: string;
  readonly modelId: string;
  readonly modelVersion: string;
  readonly output: {
    readonly format: ExtractionOutputFormat;
    readonly payload: unknown;
  };
}

export type ExtractionModelFactory = () => ExtractionModel;

/**
 * Extraction Engine.
 *
 * Reusable orchestrator for extraction models. This sprint ships a
 * plan/describe surface only — `.run()` is deferred until execution
 * logic lands in a future sprint. The engine never imports provider
 * SDKs directly; it resolves everything through the registries.
 */

import type {
  ExtractionModelDefinition,
  ExtractionRequest,
  ExtractionResponse,
} from "../contracts/extraction-model";
import type { PromptDefinition } from "../contracts/prompt";
import type { ParserDefinition } from "../contracts/parser";
import type { ValidatorDefinition } from "../contracts/validator";
import type { ExtractionError } from "../types";
import {
  getExtractionModelById,
  getPromptById,
  getAllParsers,
  getAllValidators,
} from "../registry";

export interface ExtractionPlan {
  readonly model: ExtractionModelDefinition;
  readonly prompt: PromptDefinition;
  readonly parser: ParserDefinition;
  readonly validators: readonly ValidatorDefinition[];
  readonly errors: readonly ExtractionError[];
}

export interface ExtractionEngineOptions {
  readonly modelId: string;
  readonly promptId: string;
  readonly parserId?: string;
}

export class ExtractionEngine {
  private readonly options: ExtractionEngineOptions;

  constructor(options: ExtractionEngineOptions) {
    this.options = options;
  }

  /**
   * Resolve model, prompt, parser and validators into a fully described
   * plan. Missing pieces surface as errors — never thrown.
   */
  plan(): ExtractionPlan | { readonly errors: readonly ExtractionError[] } {
    const errors: ExtractionError[] = [];

    const model = getExtractionModelById(this.options.modelId);
    if (!model) {
      errors.push({
        kind: "provider",
        code: "MODEL_NOT_FOUND",
        message: `Extraction model "${this.options.modelId}" is not registered.`,
      });
    }

    const prompt = getPromptById(this.options.promptId);
    if (!prompt) {
      errors.push({
        kind: "prompt",
        code: "PROMPT_NOT_FOUND",
        message: `Prompt "${this.options.promptId}" is not registered.`,
      });
    }

    const parsers = getAllParsers();
    const parser = this.options.parserId
      ? parsers.find((p) => p.id === this.options.parserId)
      : prompt
        ? parsers.find((p) => p.inputFormat === prompt.targetOutput)
        : undefined;

    if (!parser) {
      errors.push({
        kind: "parsing",
        code: "PARSER_NOT_FOUND",
        message: "No parser matches the prompt's target output format.",
      });
    }

    if (!model || !prompt || !parser) {
      return { errors };
    }

    return {
      model,
      prompt,
      parser,
      validators: getAllValidators(),
      errors,
    };
  }

  /**
   * Reserved for future sprints. Executing extraction requires concrete
   * model + parser + validator implementations bound through the
   * respective registries.
   */
  async run(_request: ExtractionRequest): Promise<ExtractionResponse> {
    throw new Error(
      "ExtractionEngine.run() is not implemented — this sprint delivers the architecture only.",
    );
  }
}

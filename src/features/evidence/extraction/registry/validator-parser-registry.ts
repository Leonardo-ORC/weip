/**
 * Validator & parser registries.
 *
 * Symmetric to the model and prompt registries — provider modules stay
 * isolated behind lookup functions.
 */

import type { ValidatorDefinition, EvidenceValidatorFactory } from "../contracts/validator";
import type { ParserDefinition, EvidenceParserFactory } from "../contracts/parser";
import type { ExtractionOutputFormat, ValidationKind } from "../types";
import { VALIDATOR_DEFINITIONS } from "../validators";
import { PARSER_DEFINITIONS } from "../parsers";

// ── Validators ───────────────────────────────────────────────────────────────

const validatorFactories = new Map<string, EvidenceValidatorFactory>();

export function registerValidator(
  id: string,
  factory: EvidenceValidatorFactory,
): void {
  validatorFactories.set(id, factory);
}

export function getValidatorFactory(
  id: string,
): EvidenceValidatorFactory | undefined {
  return validatorFactories.get(id);
}

export function getAllValidators(): readonly ValidatorDefinition[] {
  return VALIDATOR_DEFINITIONS;
}

export function getValidatorById(id: string): ValidatorDefinition | undefined {
  return VALIDATOR_DEFINITIONS.find((v) => v.id === id);
}

export function getValidatorsByKind(
  kind: ValidationKind,
): readonly ValidatorDefinition[] {
  return VALIDATOR_DEFINITIONS.filter((v) => v.kind === kind);
}

// ── Parsers ──────────────────────────────────────────────────────────────────

const parserFactories = new Map<string, EvidenceParserFactory>();

export function registerParser(
  id: string,
  factory: EvidenceParserFactory,
): void {
  parserFactories.set(id, factory);
}

export function getParserFactory(id: string): EvidenceParserFactory | undefined {
  return parserFactories.get(id);
}

export function getAllParsers(): readonly ParserDefinition[] {
  return PARSER_DEFINITIONS;
}

export function getParserById(id: string): ParserDefinition | undefined {
  return PARSER_DEFINITIONS.find((p) => p.id === id);
}

export function getParsersByFormat(
  format: ExtractionOutputFormat,
): readonly ParserDefinition[] {
  return PARSER_DEFINITIONS.filter((p) => p.inputFormat === format);
}

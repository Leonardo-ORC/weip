/**
 * Validator contracts.
 *
 * Validators verify Evidence Object candidates emitted by extraction
 * models. This sprint ships contracts only; concrete rules land later.
 */

import type { ValidationKind, ValidationSeverity } from "../types";
import type { EvidenceObject } from "../models/evidence-object";

export interface ValidationIssue {
  readonly code: string;
  readonly message: string;
  readonly kind: ValidationKind;
  readonly severity: ValidationSeverity;
  readonly path?: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly issues: readonly ValidationIssue[];
}

export interface EvidenceValidator {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: ValidationKind;
  validate(candidate: Partial<EvidenceObject>): ValidationResult;
}

export type EvidenceValidatorFactory = () => EvidenceValidator;

export interface ValidatorDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly kind: ValidationKind;
  readonly severity: ValidationSeverity;
  readonly tags?: readonly string[];
}

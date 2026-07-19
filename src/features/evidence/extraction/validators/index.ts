/**
 * Validator catalog — contract-only.
 *
 * Each entry describes a validator the platform will register in future
 * sprints. Runtime rules are deferred.
 */

import type { ValidatorDefinition } from "../contracts/validator";

export const SCHEMA_VALIDATOR: ValidatorDefinition = {
  id: "validator.schema",
  name: "Schema validation",
  description:
    "Verifies the candidate conforms to the Evidence Object schema version and typed field constraints.",
  kind: "schema",
  severity: "error",
};

export const REQUIRED_FIELDS_VALIDATOR: ValidatorDefinition = {
  id: "validator.required-fields",
  name: "Required fields",
  description:
    "Ensures identifier, source, citation, publication, study and outcomes are present.",
  kind: "required-fields",
  severity: "error",
};

export const COMPLETENESS_VALIDATOR: ValidatorDefinition = {
  id: "validator.completeness",
  name: "Evidence completeness",
  description:
    "Scores how completely the candidate populates population, intervention, outcomes and quality indicators.",
  kind: "completeness",
  severity: "warning",
};

export const CONFIDENCE_VALIDATOR: ValidatorDefinition = {
  id: "validator.confidence",
  name: "Confidence validation",
  description:
    "Checks that extraction confidence and effect-size confidence intervals fall within plausible bounds.",
  kind: "confidence",
  severity: "warning",
};

export const CONSISTENCY_VALIDATOR: ValidatorDefinition = {
  id: "validator.consistency",
  name: "Consistency validation",
  description:
    "Cross-field checks — population sex vs hormonal status, effect direction vs p-value, trial phase vs design.",
  kind: "consistency",
  severity: "warning",
};

export const VALIDATOR_DEFINITIONS: readonly ValidatorDefinition[] = Object.freeze([
  SCHEMA_VALIDATOR,
  REQUIRED_FIELDS_VALIDATOR,
  COMPLETENESS_VALIDATOR,
  CONFIDENCE_VALIDATOR,
  CONSISTENCY_VALIDATOR,
]);

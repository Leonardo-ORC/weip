/**
 * Parser catalog — contract-only.
 *
 * Each entry describes an output-format parser. Concrete parsers are
 * plugged in during future sprints and consumed exclusively through the
 * EvidenceParser contract.
 */

import type { ParserDefinition } from "../contracts/parser";
import { EVIDENCE_OBJECT_SCHEMA_VERSION } from "../models/evidence-object";

export const JSON_STRUCTURED_PARSER: ParserDefinition = {
  id: "parser.json.structured",
  name: "Structured JSON parser",
  description:
    "Projects a structured JSON response onto an Evidence Object candidate. Default output path.",
  inputFormat: "json.structured",
  outputSchemaVersion: EVIDENCE_OBJECT_SCHEMA_VERSION,
};

export const JSON_SCHEMA_PARSER: ParserDefinition = {
  id: "parser.json.schema",
  name: "JSON Schema parser",
  description:
    "Consumes a JSON Schema-guarded response and validates keys before projection.",
  inputFormat: "json.schema",
  outputSchemaVersion: EVIDENCE_OBJECT_SCHEMA_VERSION,
};

export const XML_EVIDENCE_PARSER: ParserDefinition = {
  id: "parser.xml.evidence",
  name: "XML evidence parser",
  description:
    "Reads XML-formatted extraction responses, primarily for provider payloads that stay in XML end-to-end.",
  inputFormat: "xml.evidence",
  outputSchemaVersion: EVIDENCE_OBJECT_SCHEMA_VERSION,
};

export const MARKDOWN_EVIDENCE_PARSER: ParserDefinition = {
  id: "parser.markdown.evidence",
  name: "Markdown evidence parser",
  description:
    "Extracts evidence from Markdown responses annotated with section headings and provenance blocks.",
  inputFormat: "markdown.evidence",
  outputSchemaVersion: EVIDENCE_OBJECT_SCHEMA_VERSION,
};

export const PARSER_DEFINITIONS: readonly ParserDefinition[] = Object.freeze([
  JSON_STRUCTURED_PARSER,
  JSON_SCHEMA_PARSER,
  XML_EVIDENCE_PARSER,
  MARKDOWN_EVIDENCE_PARSER,
]);

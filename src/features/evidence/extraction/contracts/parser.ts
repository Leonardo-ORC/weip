/**
 * Parser contracts.
 *
 * Parsers project raw extraction model outputs onto Evidence Object
 * candidates. Every input format (JSON, XML, Markdown, future formats)
 * ships as an isolated parser plug-in.
 */

import type { ExtractionOutputFormat } from "../types";
import type { EvidenceObject } from "../models/evidence-object";

export interface ParserDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly inputFormat: ExtractionOutputFormat;
  readonly outputSchemaVersion: string;
}

export interface ParseResult {
  readonly candidate: Partial<EvidenceObject>;
  readonly warnings: readonly string[];
}

export interface EvidenceParser {
  readonly definition: ParserDefinition;
  parse(input: { readonly format: ExtractionOutputFormat; readonly payload: unknown }): ParseResult;
}

export type EvidenceParserFactory = () => EvidenceParser;

import { jsonToPlainText, Options } from "json-to-plain-text";

/**
 * Custom error class for JSON formatting errors
 */
export class JSONFormattingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JSONFormattingError';
  }
}

/**
 * Default options for JSON to plain text conversion
 */
const DEFAULT_OPTIONS: Options = {
  color: false,                     // Whether to apply colors to the output
  spacing: true,                    // Whether to include spacing before colons
  seperator: ":",                   // Separator between keys and values
  squareBracketsForArray: false,    // Whether to use square brackets for arrays
  doubleQuotesForKeys: false,       // Whether to use double quotes for object keys
  doubleQuotesForValues: false,     // Whether to use double quotes for string values
};

/**
 * Validates if the input is a valid JSON object or array
 * @param input - The input to validate
 * @throws {JSONFormattingError} If the input is invalid
 */
const validateJSONInput = (input: unknown): void => {
  if (input === null || input === undefined) {
    throw new JSONFormattingError('Input cannot be null or undefined');
  }
  
  if (typeof input !== 'object') {
    throw new JSONFormattingError('Input must be an object or array');
  }
};

/**
 * Converts a JSON object to human-readable plain text format
 * @param json - The JSON object to convert
 * @param customOptions - Optional custom formatting options
 * @returns A formatted plain text string representation of the JSON
 * @throws {JSONFormattingError} If the input is invalid
 */
export const readHumanReadable = (
  json: Record<string, unknown> | unknown[], 
  customOptions: Partial<Options> = {}
): string => {
  try {
    validateJSONInput(json);
    const options = { ...DEFAULT_OPTIONS, ...customOptions };
    return jsonToPlainText(json, options);
  } catch (error) {
    if (error instanceof JSONFormattingError) {
      throw error;
    }
    throw new JSONFormattingError(`Failed to format JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Converts a JSON object to a compact single-line string
 * @param json - The JSON object to convert
 * @returns A compact string representation of the JSON
 * @throws {JSONFormattingError} If the input is invalid
 */
export const toCompactString = (json: Record<string, unknown> | unknown[]): string => {
  try {
    validateJSONInput(json);
    return JSON.stringify(json);
  } catch (error) {
    if (error instanceof JSONFormattingError) {
      throw error;
    }
    throw new JSONFormattingError(`Failed to compact JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Converts a JSON object to a pretty-printed string with custom indentation
 * @param json - The JSON object to convert
 * @param spaces - Number of spaces for indentation (default: 2)
 * @returns A pretty-printed string representation of the JSON
 * @throws {JSONFormattingError} If the input is invalid
 */
export const toPrettyString = (
  json: Record<string, unknown> | unknown[],
  spaces: number = 2
): string => {
  try {
    validateJSONInput(json);
    return JSON.stringify(json, null, spaces);
  } catch (error) {
    if (error instanceof JSONFormattingError) {
      throw error;
    }
    throw new JSONFormattingError(`Failed to pretty-print JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


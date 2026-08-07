import { RecipientVariableItem } from "./campaign";

export interface ParsedCSVResult {
  variables: string[];
  recipients: RecipientVariableItem[];
  totalParsed: number;
}
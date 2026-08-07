import { RecipientVariableItem } from "@/types/campaign";
import { ParsedCSVResult } from "@/types/csv";

/**
 * Splits a CSV line into cells, supporting quoted strings with commas.
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if ((char === "," || char === "\t") && !inQuotes) {
      result.push(current.trim().replace(/^["']|["']$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^["']|["']$/g, ""));
  return result;
}

/**
 * Auto-parses CSV text, mapping header columns to recipient variable names.
 */
export function parseRecipientCSV(csvText: string): ParsedCSVResult {
  if (!csvText || !csvText.trim()) {
    return { variables: [], recipients: [], totalParsed: 0 };
  }

  const rawLines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (rawLines.length === 0) {
    return { variables: [], recipients: [], totalParsed: 0 };
  }

  const headerLine = rawLines[0];
  const headers = parseCSVLine(headerLine);

  // Find which column index represents email
  let emailColIdx = headers.findIndex((h) =>
    /^(email|e-mail|mail|emailaddress|address)$/i.test(h.trim())
  );

  if (emailColIdx === -1) {
    // Fallback: check first data row for cell containing '@'
    if (rawLines.length > 1) {
      const sampleCells = parseCSVLine(rawLines[1]);
      const foundIdx = sampleCells.findIndex((cell) => cell.includes("@"));
      if (foundIdx !== -1) {
        emailColIdx = foundIdx;
      } else {
        emailColIdx = 0;
      }
    } else {
      emailColIdx = 0;
    }
  }

  // Extract variable column names (excluding email column)
  const variableHeaders: string[] = [];
  const colToVarNameMap: Record<number, string> = {};

  headers.forEach((h, idx) => {
    if (idx === emailColIdx) return;
    let varName = h
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, "")
      .trim();
    if (!varName) varName = `custom${idx}`;
    variableHeaders.push(varName);
    colToVarNameMap[idx] = varName;
  });

  const recipients: RecipientVariableItem[] = [];

  for (let i = 1; i < rawLines.length; i++) {
    const cells = parseCSVLine(rawLines[i]);
    const email = cells[emailColIdx]?.trim() || "";

    if (!email || !email.includes("@")) continue;

    const variables: Record<string, string> = {};
    headers.forEach((_, idx) => {
      if (idx === emailColIdx) return;
      const varName = colToVarNameMap[idx];
      if (varName) {
        variables[varName] = cells[idx]?.trim() || "";
      }
    });

    recipients.push({ email, variables });
  }

  return {
    variables: Array.from(new Set(variableHeaders)),
    recipients,
    totalParsed: recipients.length,
  };
}

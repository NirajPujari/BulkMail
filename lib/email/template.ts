import { PersonalizationValidationResult, RecipientVariableItem } from "@/types/campaign";


/**
 * Extracts all unique merge tag names from a template string (e.g. "{{name}}" -> ["name"]).
 */
export function extractMergeTags(template: string): string[] {
  if (!template) return [];
  const regex = /\{\{\s*([a-zA-Z0-9_\-]+)\s*\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (match[1]) {
      matches.add(match[1].trim());
    }
  }
  return Array.from(matches);
}

/**
 * Renders a template string by replacing all {{tag}} placeholders with corresponding recipient variable values.
 */
export function renderTemplate(
  template: string,
  recipientVariables: Record<string, string> = {},
  fallback: string = ""
): string {
  if (!template) return "";

  // Build a lookup map with lowercase keys for case-insensitive matching
  const lookup: Record<string, string> = {};
  Object.entries(recipientVariables).forEach(([key, val]) => {
    lookup[key.toLowerCase()] = val ?? "";
  });

  return template.replace(/\{\{\s*([a-zA-Z0-9_\-]+)\s*\}\}/g, (_, tagName) => {
    const rawKey = tagName.trim();
    const lowerKey = rawKey.toLowerCase();
    
    if (lowerKey in lookup && lookup[lowerKey] !== undefined && lookup[lowerKey] !== "") {
      return lookup[lowerKey];
    }
    
    // Check exact key match
    if (rawKey in recipientVariables && recipientVariables[rawKey] !== undefined && recipientVariables[rawKey] !== "") {
      return recipientVariables[rawKey];
    }

    return fallback;
  });
}


/**
 * Validates template merge tags against defined variables and checks recipient data completeness.
 */
export function validateCampaignPersonalization(
  subject: string,
  body: string,
  definedVariables: string[],
  recipients: RecipientVariableItem[]
): PersonalizationValidationResult {
  const subjectTags = extractMergeTags(subject);
  const bodyTags = extractMergeTags(body);
  const usedTags = Array.from(new Set([...subjectTags, ...bodyTags]));

  const definedSet = new Set(definedVariables.map((v) => v.toLowerCase()));
  const undefinedTags = usedTags.filter((tag) => !definedSet.has(tag.toLowerCase()));

  const missingValueRecipients: Array<{ email: string; missingTags: string[] }> = [];

  recipients.forEach((rcp) => {
    const missing: string[] = [];
    const varsLookup: Record<string, string> = {};
    Object.entries(rcp.variables || {}).forEach(([k, v]) => {
      varsLookup[k.toLowerCase()] = v;
    });

    usedTags.forEach((tag) => {
      const val = varsLookup[tag.toLowerCase()];
      if (!val || val.trim() === "") {
        missing.push(tag);
      }
    });

    if (missing.length > 0) {
      missingValueRecipients.push({
        email: rcp.email,
        missingTags: missing,
      });
    }
  });

  return {
    usedTags,
    undefinedTags,
    missingValueRecipients,
    isValid: undefinedTags.length === 0,
  };
}

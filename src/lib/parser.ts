import { XMLParser } from 'fast-xml-parser';
import { FilterRule } from './types';

// We generate a quick random ID for our internal logic
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

export function parseFilters(xmlString: string): FilterRule[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });

  try {
    const result = parser.parse(xmlString);
    let entries = result?.feed?.entry;
    
    if (!entries) return [];
    if (!Array.isArray(entries)) {
        entries = [entries];
    }

    const filters: FilterRule[] = entries.map((entry: any) => {
        const rule: FilterRule = { id: generateId(), status: 'active' };
        let properties = entry["apps:property"];
        
        if (!properties) return null;
        if (!Array.isArray(properties)) {
            properties = [properties];
        }

        properties.forEach((prop: any) => {
           const name = prop["@_name"];
           const value = prop["@_value"];
           if (name && value !== undefined) {
               (rule as any)[name] = value;
           }
        });
        
        return rule;
    }).filter(Boolean);

    return filters as FilterRule[];
  } catch (error) {
    console.error("Failed to parse XML", error);
    return [];
  }
}

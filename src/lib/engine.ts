import { FilterRule } from './types';

// Extract domains from email string

export function extractDomains(emailString: string | undefined): string[] {
    if (!emailString) return [];
    
    const regex = /@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const domains = new Set<string>();
    let match;
    while ((match = regex.exec(emailString)) !== null) {
        domains.add(match[1].toLowerCase());
    }
    return Array.from(domains);
}

export function groupFiltersByDomain(filters: FilterRule[]): Record<string, FilterRule[]> {
    const grouped: Record<string, FilterRule[]> = {};
    
    filters.forEach(filter => {
        let domains = [...extractDomains(filter.from), ...extractDomains(filter.to)];
        filter.domains = domains;
        
        if (domains.length === 0) {
            if (!grouped["_Other"]) grouped["_Other"] = [];
            grouped["_Other"].push(filter);
        } else {
            domains.forEach(domain => {
                if (!grouped[domain]) grouped[domain] = [];
                // Avoid duplication in the group array
                if (!grouped[domain].find(f => f.id === filter.id)) {
                  grouped[domain].push(filter);
                }
            });
        }
    });
    
    return grouped;
}

// Generate a deterministic hash for comparison
function generateCriteriaHash(rule: FilterRule): string {
    return [
        rule.from || '',
        rule.to || '',
        rule.subject || '',
        rule.hasTheWord || '',
        rule.doesNotHaveTheWord || '',
        rule.hasAttachment || '',
        rule.excludeChats || '',
        rule.sizeOperator || '',
        rule.sizeUnit || '',
        rule.size || ''
    ].join('|').toLowerCase();
}

// Generate a deterministic hash for actions
function generateActionHash(rule: FilterRule): string {
    return [
        rule.label || '',
        rule.shouldArchive || '',
        rule.shouldMarkAsRead || '',
        rule.shouldStar || '',
        rule.shouldTrash || '',
        rule.shouldNeverSpam || '',
        rule.shouldAlwaysMarkAsImportant || '',
        rule.shouldNeverMarkAsImportant || '',
        rule.forwardTo || '',
        rule.smartLabelToApply || ''
    ].join('|').toLowerCase();
}

function calculateComplexity(rule: FilterRule): number {
    let score = 0;
    const criteriaFields = ['from', 'to', 'subject', 'hasTheWord', 'doesNotHaveTheWord'];
    criteriaFields.forEach(field => {
        const val = (rule as any)[field];
        if (val) {
            score += 1; // 1 point for having the field
            score += (val.toString().match(/ OR | AND |[\(\)\{\}]/ig) || []).length * 2; // more points for logical operators
        }
    });
    return score;
}

export function analyzeFilters(filters: FilterRule[]) {
    let duplicates = 0;
    let conflicts = 0;
    
    // Reset warnings first
    filters.forEach(f => {
        delete f.auditWarning;
        f.complexityScore = calculateComplexity(f);
    });
    
    const criteriaMap = new Map<string, FilterRule[]>();
    
    filters.forEach(filter => {
        const hash = generateCriteriaHash(filter);
        if (!hash.replace(/\|/g, '')) return; // empty rule
        
        if (!criteriaMap.has(hash)) {
            criteriaMap.set(hash, []);
        }
        criteriaMap.get(hash)!.push(filter);
    });
    
    criteriaMap.forEach((matchedFilters, hash) => {
        if (matchedFilters.length > 1) {
            // Check for identical actions
            const actionGroups = new Map<string, FilterRule[]>();
            matchedFilters.forEach(f => {
                const aHash = generateActionHash(f);
                if (!actionGroups.has(aHash)) actionGroups.set(aHash, []);
                actionGroups.get(aHash)!.push(f);
            });
            
            if (actionGroups.size === 1) {
                // All actions are identical, so they are exact duplicates
                matchedFilters.forEach((f, index) => {
                    if (index > 0) { // Mark all but the first one as duplicates
                        f.auditWarning = 'duplicate';
                        duplicates++;
                    }
                });
            } else {
                // Actions differ for identical criteria, which creates a conflict overhead
                matchedFilters.forEach(f => {
                    f.auditWarning = 'conflict';
                });
                conflicts += matchedFilters.length;
            }
        }
    });
    
    return { duplicates, conflicts };
}

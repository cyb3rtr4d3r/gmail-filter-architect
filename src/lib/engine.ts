import { FilterRule } from './types';

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

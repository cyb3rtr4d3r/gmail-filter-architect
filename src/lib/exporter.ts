import { FilterRule } from './types';

function escapeXml(unsafe: string) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}

export function exportFilters(filters: FilterRule[]): string {
    // Only export active filters
    const activeFilters = filters.filter(f => f.status !== 'draft');
    
    let xml = `<?xml version='1.0' encoding='UTF-8'?><feed xmlns='http://www.w3.org/2005/Atom' xmlns:apps='http://schemas.google.com/apps/2006'>\n`;
    xml += `\t<title>Mail Filters</title>\n`;
    
    activeFilters.forEach(rule => {
        xml += `\t<entry>\n`;
        xml += `\t\t<category term='filter'></category>\n`;
        xml += `\t\t<title>Mail Filter</title>\n`;
        xml += `\t\t<content></content>\n`;
        
        // Exclude our internal application state properties
        const excludeFields = ['id', 'status', 'domains', 'auditWarning', 'complexityScore'];
        
        Object.keys(rule).forEach(key => {
            if (!excludeFields.includes(key)) {
                const value = (rule as any)[key];
                if (value !== undefined && value !== null && value !== "") {
                    xml += `\t\t<apps:property name='${escapeXml(key)}' value='${escapeXml(value.toString())}'/>\n`;
                }
            }
        });
        
        xml += `\t</entry>\n`;
    });
    
    xml += `</feed>`;
    return xml;
}

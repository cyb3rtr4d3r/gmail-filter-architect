"use client";

import { useState, useMemo } from 'react';
import { UploadDropzone } from '@/components/UploadDropzone';
import { FilterCard } from '@/components/FilterCard';
import { parseFilters } from '@/lib/parser';
import { exportFilters } from '@/lib/exporter';
import { groupFiltersByDomain, analyzeFilters } from '@/lib/engine';
import { FilterRule } from '@/lib/types';
import { FileText, Save, ListFilter, AlertCircle, CheckCircle2, Archive, Settings2, Trash2 } from 'lucide-react';

export default function Home() {
  const [filters, setFilters] = useState<FilterRule[]>([]);
  
  const handleFileLoaded = (xmlString: string) => {
    const parsed = parseFilters(xmlString);
    setFilters(parsed);
  };
  
  const handleExport = () => {
    const xml = exportFilters(filters);
    const blob = new Blob([xml], { type: 'text/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mailFilters_modified.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const groupedFilters = useMemo(() => groupFiltersByDomain(filters), [filters]);
  const auditStats = useMemo(() => analyzeFilters(filters), [filters]);
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'alphabetical'|'complexity'>('alphabetical');
  const [bulkLabelInput, setBulkLabelInput] = useState("");
  
  const handleSelect = (id: string, selected: boolean) => {
    const next = new Set(selectedIds);
    if (selected) next.add(id);
    else next.delete(id);
    setSelectedIds(next);
  };
  
  const handleBulkAction = (action: string) => {
    setFilters(current => current.map(f => {
      if (!selectedIds.has(f.id)) return f;
      const updated = { ...f };
      switch (action) {
        case 'setDraft': updated.status = 'draft'; break;
        case 'setActive': updated.status = 'active'; break;
        case 'markRead': updated.shouldMarkAsRead = updated.shouldMarkAsRead === 'true' ? 'false' : 'true'; break;
      }
      return updated;
    }).filter(f => action === 'delete' ? !selectedIds.has(f.id) : true));
    
    if (action === 'delete') {
      setSelectedIds(new Set());
    }
  };

  const handleApplyLabel = () => {
    if (!bulkLabelInput.trim()) return;
    setFilters(current => current.map(f => {
      if (!selectedIds.has(f.id)) return f;
      return { ...f, label: bulkLabelInput.trim() };
    }));
    setBulkLabelInput('');
  };

  const totalFilters = filters.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 p-4 md:p-8">
      <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between max-w-7xl mx-auto gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">Gmail Filter Architect</h1>
            <p className="text-sm text-zinc-500 mt-1">Client-side processing. Your data never leaves your browser.</p>
        </div>
        
        {totalFilters > 0 && (
            <button 
                onClick={handleExport}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm"
            >
                <Save size={18} />
                Export XML
            </button>
        )}
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Input / State */}
        <div className="col-span-1 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-zinc-500" />
                    Data Source
                </h2>
                {totalFilters === 0 ? (
                    <UploadDropzone onFileLoaded={handleFileLoaded} />
                ) : (
                    <div className="flex bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl items-center gap-3 border border-green-100 dark:border-green-800/30">
                        <CheckCircle2 size={24} className="flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Loaded Successfully</p>
                            <p className="text-sm opacity-90">{totalFilters} rules parsed</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle size={20} className={auditStats.conflicts > 0 ? 'text-red-500' : 'text-zinc-500'} />
                    Audit Summary
                </h2>
                <div className="space-y-3 text-sm opacity-100">
                    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <span className="text-zinc-600 dark:text-zinc-400">Duplicates Detected</span>
                        <span className={`font-semibold px-2 py-1 rounded-full border ${auditStats.duplicates > 0 ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-500 dark:border-yellow-800/50' : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'}`}>
                            {auditStats.duplicates}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <span className="text-zinc-600 dark:text-zinc-400">Conflicts Detected</span>
                        <span className={`font-semibold px-2 py-1 rounded-full border ${auditStats.conflicts > 0 ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-800/50' : 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'}`}>
                            {auditStats.conflicts}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Visualization / Editing */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm h-full min-h-[600px]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/50">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <ListFilter size={20} className="text-blue-500" />
                        Rule Explorer
                    </h2>
                    {totalFilters > 0 && (
                        <div className="flex items-center gap-4">
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'complexity')}
                                className="text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 outline-none font-medium text-zinc-700 dark:text-zinc-300"
                            >
                                <option value="alphabetical">Sort Alphabetically</option>
                                <option value="complexity">Sort by Complexity</option>
                            </select>
                            <div className="text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                                {Object.keys(groupedFilters).length} Domain Groups
                            </div>
                        </div>
                    )}
                </div>

                {selectedIds.size > 0 && (
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl animate-in slide-in-from-top-2">
                        <div className="font-semibold text-blue-800 dark:text-blue-300">
                            {selectedIds.size} rule{selectedIds.size > 1 ? 's' : ''} selected
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleBulkAction('setDraft')} className="text-sm px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded shadow-sm transition">Set Draft</button>
                            <button onClick={() => handleBulkAction('setActive')} className="text-sm px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded shadow-sm transition">Set Active</button>
                            <button onClick={() => handleBulkAction('markRead')} className="text-sm px-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded shadow-sm transition">Toggle Mark Read</button>
                            <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded shadow-sm overflow-hidden p-0.5 ml-2">
                                <input 
                                    type="text" 
                                    placeholder="New label..." 
                                    className="text-sm px-2 py-1 outline-none bg-transparent w-28 text-zinc-900 dark:text-zinc-100"
                                    value={bulkLabelInput}
                                    onChange={(e) => setBulkLabelInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleApplyLabel()}
                                />
                                <button onClick={handleApplyLabel} className="text-sm px-2 py-1 bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded transition font-medium">Apply</button>
                            </div>
                            <button onClick={() => handleBulkAction('delete')} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/50 rounded shadow-sm transition ml-2">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                )}

                {totalFilters === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <ListFilter size={28} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Upload a file to see your filters here.</p>
                    </div>
                ) : (
                    <div className="space-y-8 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
                        {Object.entries(groupedFilters).sort(([a], [b]) => a.localeCompare(b)).map(([domain, groupFilters]) => (
                            <div key={domain} className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-3 text-zinc-800 dark:text-zinc-200 sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm py-2 z-10">
                                    <span className="bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-md text-sm font-bold shadow-sm">
                                        {groupFilters.length}
                                    </span>
                                    <span className={domain === '_Other' ? 'text-zinc-500 italic' : ''}>
                                        {domain === '_Other' ? 'Miscellaneous / Uncategorized' : domain}
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pl-2 border-l-2 border-zinc-100 dark:border-zinc-800">
                                    {[...groupFilters].sort((a,b) => {
                                        if (sortBy === 'complexity') return (b.complexityScore || 0) - (a.complexityScore || 0);
                                        return (a.from||a.subject||'').localeCompare(b.from||b.subject||'');
                                    }).map(filter => (
                                        <FilterCard 
                                            key={filter.id} 
                                            filter={filter} 
                                            isSelected={selectedIds.has(filter.id)} 
                                            onSelect={handleSelect} 
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </main>
    </div>
  );
}

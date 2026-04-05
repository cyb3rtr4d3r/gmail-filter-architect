"use client";

import { useState, useMemo } from 'react';
import { UploadDropzone } from '@/components/UploadDropzone';
import { FilterCard } from '@/components/FilterCard';
import { parseFilters } from '@/lib/parser';
import { exportFilters } from '@/lib/exporter';
import { groupFiltersByDomain } from '@/lib/engine';
import { FilterRule } from '@/lib/types';
import { FileText, Save, ListFilter, AlertCircle, CheckCircle2 } from 'lucide-react';

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
                <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider dark:bg-yellow-900 dark:text-yellow-300">
                    Coming Soon
                </div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 opacity-60">
                    <AlertCircle size={20} className="text-zinc-500" />
                    Audit Summary
                </h2>
                <div className="space-y-3 text-sm opacity-60 pointer-events-none">
                    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <span className="text-zinc-600 dark:text-zinc-400">Duplicates Detected</span>
                        <span className="font-semibold px-2 py-1 bg-yellow-100/50 text-yellow-800 rounded-full border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500 dark:border-yellow-800/50">0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                        <span className="text-zinc-600 dark:text-zinc-400">Conflicts Detected</span>
                        <span className="font-semibold px-2 py-1 bg-red-100/50 text-red-800 rounded-full border border-red-200 dark:bg-red-900/30 dark:text-red-500 dark:border-red-800/50">0</span>
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
                        <div className="text-sm font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                            {Object.keys(groupedFilters).length} Domain Groups
                        </div>
                    )}
                </div>

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
                                    {groupFilters.map(filter => (
                                        <FilterCard key={filter.id} filter={filter} />
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

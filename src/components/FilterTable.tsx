import { FilterRule } from "@/lib/types";
import { AlertCircle, FileWarning } from "lucide-react";

interface FilterTableProps {
  filters: FilterRule[];
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
}

export function FilterTable({ filters, selectedIds, onSelect }: FilterTableProps) {
  
  const toggleAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked 
        ? filters.forEach(f => onSelect(f.id, true))
        : filters.forEach(f => onSelect(f.id, false));
  };
  
  const allSelected = filters.length > 0 && selectedIds.size === filters.length;
  const someSelected = filters.length > 0 && selectedIds.size > 0 && selectedIds.size < filters.length;

  return (
    <div className="w-full relative shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
            <th className="py-3 px-4 w-12 font-semibold text-[13px] text-zinc-500 dark:text-zinc-400">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                checked={allSelected}
                ref={input => { if (input) input.indeterminate = someSelected }}
                onChange={toggleAll}
              />
            </th>
            <th className="py-3 px-4 font-semibold text-[13px] text-zinc-500 dark:text-zinc-400 w-24">Status</th>
            <th className="py-3 px-4 font-semibold text-[13px] text-zinc-500 dark:text-zinc-400">From / To</th>
            <th className="py-3 px-4 font-semibold text-[13px] text-zinc-500 dark:text-zinc-400">Subject / Has</th>
            <th className="py-3 px-4 font-semibold text-[13px] text-zinc-500 dark:text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filters.map(filter => {
            const isSelected = selectedIds.has(filter.id);
            const isDuplicate = filter.auditWarning === 'duplicate';
            const isConflict = filter.auditWarning === 'conflict';
            
            return (
              <tr 
                key={filter.id} 
                className={`group transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 ${isSelected ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}
              >
                <td className="py-3 px-4 align-top">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => onSelect(filter.id, e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-1"
                  />
                </td>
                <td className="py-3 px-4 align-top">
                    <div className="flex flex-col gap-1.5 items-start">
                        {filter.status === 'draft' && (
                            <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-600 uppercase tracking-wider dark:bg-zinc-800 dark:text-zinc-400">Draft</span>
                        )}
                        {isDuplicate && (
                            <span className="flex items-center rounded bg-yellow-100 p-1 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-500" title="Duplicate">
                                <FileWarning size={14} />
                            </span>
                        )}
                        {isConflict && (
                            <span className="flex items-center rounded bg-red-100 p-1 text-red-800 dark:bg-red-900/50 dark:text-red-500" title="Conflict">
                                <AlertCircle size={14} />
                            </span>
                        )}
                        {!isDuplicate && !isConflict && filter.status !== 'draft' && (
                            <span className="text-zinc-400 dark:text-zinc-600 text-xs">-</span>
                        )}
                    </div>
                </td>
                <td className="py-3 px-4 align-top text-[13px]">
                  <div className="flex flex-col gap-1 max-w-[250px]">
                    {filter.from && <div className="truncate" title={filter.from}><span className="text-zinc-400 font-medium">From:</span> <span className="font-medium text-zinc-800 dark:text-zinc-200">{filter.from}</span></div>}
                    {filter.to && <div className="truncate" title={filter.to}><span className="text-zinc-400 font-medium">To:</span> <span className="font-medium text-zinc-700 dark:text-zinc-300">{filter.to}</span></div>}
                  </div>
                </td>
                <td className="py-3 px-4 align-top text-[13px]">
                  <div className="flex flex-col gap-1 max-w-[300px]">
                    {filter.subject && <div className="truncate" title={filter.subject}><span className="text-zinc-400 font-medium">Subj:</span> <span className="text-zinc-800 dark:text-zinc-200">{filter.subject}</span></div>}
                    {filter.hasTheWord && <div className="truncate" title={filter.hasTheWord}><span className="text-zinc-400 font-medium">Has:</span> <span className="text-zinc-700 dark:text-zinc-300">{filter.hasTheWord}</span></div>}
                    {filter.doesNotHaveTheWord && <div className="truncate" title={filter.doesNotHaveTheWord}><span className="text-zinc-400 font-medium">-Has:</span> {filter.doesNotHaveTheWord}</div>}
                    {filter.hasAttachment === 'true' && <div className="text-zinc-500 flex items-center gap-1">📎 Has Attachment</div>}
                  </div>
                </td>
                <td className="py-3 px-4 align-top">
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-medium max-w-[250px]">
                    {filter.label && <span className="rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400 flex items-center">🏷️ {filter.label}</span>}
                    {filter.shouldArchive === 'true' && <span className="rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">Archive</span>}
                    {filter.shouldTrash === 'true' && <span className="rounded-md bg-red-50 border border-red-100 px-2 py-0.5 text-red-700 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400">Trash</span>}
                    {filter.shouldMarkAsRead === 'true' && <span className="rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400">Mark Read</span>}
                    {filter.shouldStar === 'true' && <span className="rounded-md bg-yellow-50 border border-yellow-100 px-2 py-0.5 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400">Star</span>}
                    {filter.shouldNeverSpam === 'true' && <span className="rounded-md bg-purple-50 border border-purple-100 px-2 py-0.5 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800/50 dark:text-purple-400">Never Spam</span>}
                    {filter.shouldAlwaysMarkAsImportant === 'true' && <span className="rounded-md bg-orange-50 border border-orange-100 px-2 py-0.5 text-orange-700 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400">Important</span>}
                    {filter.forwardTo && <span className="rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800/50 dark:text-indigo-400 truncate max-w-[150px]" title={filter.forwardTo}>➡️ {filter.forwardTo}</span>}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

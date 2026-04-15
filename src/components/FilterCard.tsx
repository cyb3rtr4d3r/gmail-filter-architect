import { FilterRule } from "@/lib/types";
import { AlertCircle, FileWarning } from "lucide-react";

interface FilterCardProps {
  filter: FilterRule;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export function FilterCard({ filter, isSelected = false, onSelect }: FilterCardProps) {
  const isDuplicate = filter.auditWarning === 'duplicate';
  const isConflict = filter.auditWarning === 'conflict';
  
  // Dynamic styling based on state
  let borderClass = "border-zinc-200 dark:border-zinc-800";
  let bgClass = "bg-white dark:bg-zinc-900";
  
  if (isSelected) {
    borderClass = "border-blue-500 dark:border-blue-400";
    bgClass = "bg-blue-50/50 dark:bg-blue-900/10";
  } else if (isConflict) {
    borderClass = "border-red-300 dark:border-red-800/50";
    bgClass = "bg-red-50/50 dark:bg-red-900/10";
  } else if (isDuplicate) {
    borderClass = "border-yellow-300 dark:border-yellow-800/50";
    bgClass = "bg-yellow-50/50 dark:bg-yellow-900/10";
  }

  return (
    <div 
        className={`rounded-xl border ${borderClass} ${bgClass} p-4 shadow-sm transition-all duration-200 hover:shadow-md relative group`}
    >
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {onSelect && (
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={(e) => onSelect(filter.id, e.target.checked)}
            className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer shadow-sm transition-transform active:scale-95"
          />
        )}
      </div>

      <div className="mb-3 pr-8">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {filter.status === 'draft' && (
                <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-[11px] font-bold text-zinc-600 uppercase tracking-wider dark:bg-zinc-800 dark:text-zinc-400">Sandbox Draft</span>
            )}
            {isDuplicate && (
                <span className="flex items-center gap-1 rounded-md bg-yellow-100 px-2 py-0.5 text-[11px] font-bold text-yellow-800 uppercase tracking-wider dark:bg-yellow-900/50 dark:text-yellow-500">
                    <FileWarning size={12} /> Duplicate
                </span>
            )}
            {isConflict && (
                <span className="flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-800 uppercase tracking-wider dark:bg-red-900/50 dark:text-red-500">
                    <AlertCircle size={12} /> Conflict
                </span>
            )}
        </div>
        <h4 className="text-[15px] leading-tight font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2">
            {filter.from || filter.to || filter.hasTheWord || 'Unnamed Rule'}
        </h4>
      </div>
      
      <div className="text-[13px] text-zinc-600 dark:text-zinc-400 flex flex-col gap-1 mb-4">
        {filter.from && <p className="truncate"><span className="font-medium text-zinc-400">From:</span> {filter.from}</p>}
        {filter.to && <p className="truncate"><span className="font-medium text-zinc-400">To:</span> {filter.to}</p>}
        {filter.subject && <p className="truncate"><span className="font-medium text-zinc-400">Subject:</span> {filter.subject}</p>}
        {filter.hasTheWord && <p className="truncate"><span className="font-medium text-zinc-400">Has:</span> {filter.hasTheWord}</p>}
      </div>

      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
        <div className="flex flex-wrap gap-1.5 text-[11px] font-medium">
          {filter.label && <span className="rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400">Label: {filter.label}</span>}
          {filter.shouldArchive === 'true' && <span className="rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300">Archive</span>}
          {filter.shouldTrash === 'true' && <span className="rounded-full bg-red-50 border border-red-100 px-2 py-0.5 text-red-700 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400">Trash</span>}
          {filter.shouldMarkAsRead === 'true' && <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400">Mark Read</span>}
        </div>
      </div>
    </div>
  );
}

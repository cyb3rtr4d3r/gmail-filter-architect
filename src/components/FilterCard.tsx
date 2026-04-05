import { FilterRule } from "@/lib/types";

export function FilterCard({ filter }: { filter: FilterRule }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
            {filter.status === 'draft' && (
                <span className="rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Draft</span>
            )}
            <span className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                {filter.from || filter.to || filter.hasTheWord || 'Unnamed Rule'}
            </span>
        </div>
        <div className="flex text-xs space-x-1">
          {filter.label && <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800">Label: {filter.label}</span>}
          {filter.shouldArchive === 'true' && <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-800">Archive</span>}
          {filter.shouldTrash === 'true' && <span className="rounded-full bg-red-100 px-2 py-1 text-red-800">Trash</span>}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col gap-1">
        {filter.from && <p><span className="font-medium text-gray-500">From:</span> {filter.from}</p>}
        {filter.to && <p><span className="font-medium text-gray-500">To:</span> {filter.to}</p>}
        {filter.subject && <p><span className="font-medium text-gray-500">Subject:</span> {filter.subject}</p>}
        {filter.hasTheWord && <p><span className="font-medium text-gray-500">Has:</span> {filter.hasTheWord}</p>}
      </div>
    </div>
  );
}

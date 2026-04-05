import { UploadCloud } from "lucide-react";

interface Props {
  onFileLoaded: (xmlString: string) => void;
}

export function UploadDropzone({ onFileLoaded }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const xml = event.target?.result;
      if (typeof xml === 'string') {
        onFileLoaded(xml);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <label className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700 transition">
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <UploadCloud className="mb-4 h-10 w-10 text-gray-500 dark:text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gmail XML export (mailFilters.xml)</p>
        </div>
        <input 
            type="file" 
            className="hidden" 
            accept=".xml"
            onChange={handleFileChange}
        />
      </label>
    </div>
  );
}

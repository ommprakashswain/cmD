import { Download } from 'lucide-react';

export function DownloadButton() {
  const handleDownload = () => {
    // Generate a simple text file acting as the mock installer
    const content = "This is a simulated Windows executable for the AI Studio preview.\nIn a real product, this would be the actual .exe installer.";
    const blob = new Blob([content], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "WindowsAssistant_Setup.exe";
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-200 outline-none"
    >
      <Download size={18} />
      <span>Download for Windows</span>
    </button>
  );
}

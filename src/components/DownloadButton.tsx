import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function DownloadButton() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestUpdate() {
      try {
        const updateDoc = await getDoc(doc(db, 'updates', 'latest'));
        if (updateDoc.exists()) {
          const data = updateDoc.data();
          if (data.url) {
            setDownloadUrl(data.url);
          }
        }
      } catch (err) {
        console.error('Failed to fetch latest update url:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchLatestUpdate();
  }, []);

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    } else {
      alert("No available Windows build at the moment. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors focus:ring-4 focus:ring-slate-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download size={18} />}
        <span>Download for Windows</span>
      </button>
      <p className="text-xs text-slate-500 font-mono">Approx. 65MB</p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DownloadCloud, X } from 'lucide-react';
import pkg from '../../package.json';

export function AutoUpdater() {
  const [updateInfo, setUpdateInfo] = useState<{ version: string; url: string; releaseNotes?: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const updateDoc = await getDoc(doc(db, 'updates', 'latest'));
        if (updateDoc.exists()) {
          const data = updateDoc.data();
          const remoteVersion = data.version;
          const localVersion = pkg.version;
          
          // Basic semver check, naive logic
          const remoteParts = remoteVersion.split('.').map(Number);
          const localParts = localVersion.split('.').map(Number);
          
          let isNewer = false;
          for (let i = 0; i < Math.max(remoteParts.length, localParts.length); i++) {
            const remote = remoteParts[i] || 0;
            const local = localParts[i] || 0;
            if (remote > local) {
              isNewer = true;
              break;
            } else if (remote < local) {
              break;
            }
          }

          if (isNewer) {
            setUpdateInfo({
              version: data.version,
              url: data.url,
              releaseNotes: data.releaseNotes
            });
          }
        }
      } catch (err) {
        console.error('Failed to check for updates', err);
      }
    }
    
    // Check when component mounts
    checkForUpdates();
    // Then every 60 minutes
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!updateInfo || dismissed) return null;

  const handleUpdate = async () => {
    setIsDownloading(true);
    try {
      // If we are in Electron (nodeIntegration is true in main.cjs), we could use node to download and launch the installer
      // But standard approach for simple setup is to open the download url in the browser
      if (typeof window !== 'undefined') {
        if ('require' in window) {
          const { shell } = (window as any).require('electron');
          shell.openExternal(updateInfo.url);
        } else {
          (window as any).open(updateInfo.url, '_blank');
        }
      }
    } catch (err) {
      console.error(err);
      if (typeof window !== 'undefined') (window as any).open(updateInfo.url, '_blank');
    }
    setIsDownloading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 max-w-sm bg-slate-900 shadow-2xl rounded-xl p-4 border border-slate-800 text-white z-50 flex flex-col gap-3">
      <button 
        onClick={() => setDismissed(true)} 
        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
          <DownloadCloud className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Update Available ({updateInfo.version})</h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {updateInfo.releaseNotes || 'A new version of Windows Assistant is ready to install.'}
          </p>
        </div>
      </div>
      <button 
        onClick={handleUpdate}
        disabled={isDownloading}
        className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors ring-1 ring-emerald-500/50"
      >
        {isDownloading ? 'Downloading...' : 'Download Update'}
      </button>
    </div>
  );
}

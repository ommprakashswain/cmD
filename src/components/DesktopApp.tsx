import { useState, useRef, useEffect } from 'react';
import { Send, TerminalSquare, Activity, Settings2, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AutoUpdater } from './AutoUpdater';
import { Logo } from './Logo';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  command?: string;
  status?: 'pending' | 'executing' | 'success' | 'error';
};

export function DesktopApp() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: 'System connected. I can help you manage network settings, diagnose hardware, and configure Windows. What would you like to do?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setIsProcessing(true);

    // Mock AI Processing (Simulation of what happens in the Desktop backend)
    setTimeout(() => {
      let aiText = "I will execute a system diagnostic check for you.";
      let cmd = "Get-ComputerInfo | Select-Object WindowsVersion, CsProcessors, CsTotalPhysicalMemory";

      const lower = userMsg.toLowerCase();
      if (lower.includes('ip') || lower.includes('network')) {
        aiText = "I'll retrieve your current IP and network configuration.";
        cmd = "ipconfig /all";
      } else if (lower.includes('bluetooth') || lower.includes('headphones')) {
        aiText = "I'll restart your Bluetooth services and re-enable discovery.";
        if (lower.includes('turn on') || lower.includes('enable')) {
           cmd = "Start-Service bthserv -ErrorAction SilentlyContinue";
        } else if (lower.includes('turn off') || lower.includes('disable')) {
           cmd = "Stop-Service bthserv -Force -ErrorAction SilentlyContinue";
        } else {
           cmd = "Restart-Service bthserv -Force";
        }
      } else if (lower.includes('wifi') || lower.includes('wi-fi')) {
        aiText = "Managing Wi-Fi adapter.";
        if (lower.includes('turn off') || lower.includes('disable')) {
           cmd = "Disable-NetAdapter -Name 'Wi-Fi' -Confirm:$false -ErrorAction SilentlyContinue";
        } else if (lower.includes('turn on') || lower.includes('enable')) {
           cmd = "Enable-NetAdapter -Name 'Wi-Fi' -ErrorAction SilentlyContinue";
        } else {
           cmd = "Get-NetAdapter -Name 'Wi-Fi'";
        }
      } else if (lower.includes('dns') || lower.includes('flush')) {
        aiText = "I will flush your DNS cache to resolve potential domain routing issues.";
        cmd = "Clear-DnsClientCache; ipconfig /flushdns";
      } else if (lower.includes('chrome')) {
        aiText = "Opening Google Chrome...";
        cmd = "Start-Process chrome";
      } else if (lower.includes('edge')) {
        aiText = "Opening Microsoft Edge...";
        cmd = "Start-Process msedge";
      } else if (lower.includes('explorer') || lower.includes('folder')) {
        aiText = "Opening File Explorer...";
        cmd = "Start-Process explorer";
      } else if (lower.includes('settings')) {
        aiText = "Opening Windows Settings...";
        cmd = "Start-Process ms-settings:";
      } else if (lower.includes('task manager')) {
        aiText = "Opening Task Manager...";
        cmd = "Start-Process taskmgr";
      } else if (lower.includes('volume')) {
        aiText = "Adjusting system volume...";
        if (lower.includes('mute')) {
           cmd = "$obj = new-object -com wscript.shell; $obj.SendKeys([char]173)";
        } else if (lower.includes('up') || lower.includes('increase')) {
           cmd = "$obj = new-object -com wscript.shell; $obj.SendKeys([char]175)";
        } else if (lower.includes('down') || lower.includes('decrease')) {
           cmd = "$obj = new-object -com wscript.shell; $obj.SendKeys([char]174)";
        } else {
           cmd = "sndvol";
        }
      } else if (lower.includes('shutdown') || lower.includes('turn off computer')) {
        aiText = "Shutting down the system...";
        cmd = "Stop-Computer -Force";
      } else if (lower.includes('restart computer')) {
        aiText = "Restarting the system...";
        cmd = "Restart-Computer -Force";
      } else if (lower.includes('system info')) {
        aiText = "Fetching System Information...";
        cmd = "systeminfo";
      }

      const assistantMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        text: aiText,
        command: cmd,
        status: 'executing'
      }]);

      // Execute via Electron IPC / Node Integration
      setTimeout(() => {
         try {
           const { exec } = (window as any).require('child_process');
           // Execute using powershell intentionally to support PS commands
           exec(cmd, { shell: 'powershell.exe' }, (error: any, stdout: any, stderr: any) => {
             console.log(stdout, stderr);
             setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, status: error ? 'error' : 'success' } : m));
             setIsProcessing(false);
           });
         } catch (e) {
           // Not running in Electron, fallback to mock success
           console.warn("Not in Electron environment. Simulating success.");
           setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, status: 'success' } : m));
           setIsProcessing(false);
         }
      }, 500);

    }, 800);
  };

  return (
    <div className="flex h-screen w-[100vw] bg-white overflow-hidden font-sans text-slate-900 border border-slate-200">
       {/* Sidebar */}
       <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col flex-shrink-0">
         <div className="h-14 border-b border-slate-200 flex items-center px-4 gap-2 font-semibold text-sm">
           <img src="/logo.png" alt="Darkshel Logo" className="w-5 h-5 text-slate-700" />
           Darkshel
         </div>
         <div className="flex-1 py-4 overflow-y-auto">
           <div className="px-3 mb-2 flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
             System Status
           </div>
           <div className="px-2 space-y-1">
             <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md bg-white border border-slate-200 shadow-sm">
               <ShieldCheck className="w-4 h-4 text-emerald-600" />
               System Secure
             </div>
             <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
               <Activity className="w-4 h-4 text-blue-600" />
               Diagnostics
             </div>
             <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
               <Settings2 className="w-4 h-4 text-slate-500" />
               Configuration
             </div>
           </div>
         </div>
         <div className="p-4 border-t border-slate-200 text-[10px] text-slate-400 font-mono">
           IPC Bridge: {navigator.userAgent.includes('Electron') ? <span className="text-emerald-500">Connected</span> : <span className="text-amber-500">Simulation View</span>}
         </div>
       </div>

       {/* Main Chat Area */}
       <div className="flex-1 flex flex-col min-w-0 bg-white">
         <div className="flex-1 overflow-y-auto p-6 space-y-8">
           {messages.map((msg) => (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={msg.id} 
               className={`flex gap-3 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
             >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white'}`}>
                  {msg.role === 'user' ? <span className="text-xs font-semibold">U</span> : <TerminalSquare className="w-4 h-4" />}
                </div>
                <div className={`space-y-3 max-w-[85%] ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-slate-50 border border-slate-200 rounded-tr-sm text-slate-700' : 'bg-white border border-slate-200 rounded-tl-sm text-slate-800 shadow-sm'}`}>
                    {msg.text}
                  </div>
                  {msg.command && (
                    <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800 w-full">
                       <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
                         <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">PowerShell Runtime</div>
                         <div className="flex items-center gap-1.5 text-xs">
                           {msg.status === 'executing' ? (
                              <span className="flex items-center gap-1.5 text-amber-400 font-medium"><Loader2 className="w-3.5 h-3.5 animate-spin"/> Executing locally...</span>
                           ) : msg.status === 'success' ? (
                              <span className="flex items-center gap-1.5 text-emerald-400 font-medium"><CheckCircle2 className="w-3.5 h-3.5"/> Success</span>
                           ) : null}
                         </div>
                       </div>
                       <div className="p-3 font-mono text-xs text-slate-300 overflow-x-auto whitespace-nowrap">
                          <span className="text-emerald-500 select-none mr-2">PS&gt;</span>{msg.command}
                       </div>
                    </div>
                  )}
                </div>
             </motion.div>
           ))}
           <div ref={messagesEndRef} />
         </div>

         {/* Input Area */}
         <div className="p-4 border-t border-slate-100 bg-white">
           <div className="max-w-3xl mx-auto relative">
             <input
               type="text"
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               placeholder="Tell Windows what to do (e.g. 'Reset my network adapter')..."
               className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-300 text-slate-800 placeholder-slate-400 shadow-sm"
               disabled={isProcessing}
             />
             <button
               onClick={handleSend}
               disabled={!input.trim() || isProcessing}
               className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
             >
               <Send className="w-4 h-4" />
             </button>
           </div>
           <div className="text-center mt-3 text-[10px] text-slate-400 font-medium tracking-wide pb-1">
             NATURAL LANGUAGE EXECUTION LAYER
           </div>
         </div>
       </div>
       <AutoUpdater />
    </div>
  );
}

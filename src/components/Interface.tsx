import { motion } from 'motion/react';
import { TerminalSquare, Send } from 'lucide-react';

export function Interface() {
  return (
    <section className="pb-24 px-6 max-w-4xl mx-auto" id="demo">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm">
          <div className="flex gap-1.5 w-16">
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
            <div className="w-3 h-3 rounded-full bg-slate-200"></div>
          </div>
          <div className="flex-1 text-center font-mono text-xs text-slate-500">Windows Assistant</div>
          <div className="w-16"></div> {/* Balance spacer */}
        </div>
        <div className="p-6 md:p-8 space-y-8 bg-white">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-slate-600">U</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-sm text-slate-700">My bluetooth isn't connecting to my headphones. Can you fix it?</p>
            </div>
          </div>

          <div className="flex gap-3 items-start flex-row-reverse">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
              <TerminalSquare className="w-4 h-4 text-white" />
            </div>
            <div className="bg-slate-900 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
              <p className="text-sm text-slate-200 mb-3">I'll restart the Bluetooth Support Service and re-enable your radio.</p>
              <div className="bg-slate-800 rounded-md font-mono text-xs p-3 text-slate-300">
                <span className="text-slate-500">&gt;</span> Restart-Service bthserv<br/>
                <span className="text-slate-500">&gt;</span> Set-BluetoothStatus -On<br/>
                <span className="text-emerald-400 mt-1 block">✔ Execution complete.</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative">
            <input
              type="text"
              readOnly
              placeholder="Type a task..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm focus:outline-none text-slate-500"
            />
            <button disabled className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 cursor-default">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

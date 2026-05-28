import { motion } from 'motion/react';
import { DownloadButton } from './DownloadButton';
import { Terminal } from 'lucide-react';
import pkg from '../../package.json';

export function Hero() {
  return (
    <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center" id="hero">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center mb-6"
      >
        <div className="p-3 bg-slate-100 rounded-xl">
          <Terminal className="w-8 h-8 text-slate-700" />
        </div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 mb-6"
      >
        Windows administration, <br className="hidden md:block"/> simplified.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Control settings, fix network issues, and diagnose hardware using natural language. Execute tasks without opening the command prompt.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <DownloadButton />
        <p className="mt-4 text-xs text-slate-500 font-mono">v{pkg.version} — Windows 10/11</p>
      </motion.div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Wifi, Cpu, Settings2, ShieldCheck } from 'lucide-react';

const coreFeatures = [
  {
    icon: <Wifi className="w-5 h-5" />,
    title: "Network Management",
    description: "Automatically reset adapters, flush DNS, or diagnose connectivity issues using simple natural language."
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Hardware Diagnostics",
    description: "Request system health checks to run comprehensive internal diagnostics without navigating complex menus."
  },
  {
    icon: <Settings2 className="w-5 h-5" />,
    title: "System Configuration",
    description: "Toggle critical settings, adjust power plans, and manage startup applications directly."
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Execution Safety",
    description: "Commands are parsed and verified before execution, maintaining the stability of your operating system."
  }
];

export function Features() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100" id="features">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Technical control for everyone</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

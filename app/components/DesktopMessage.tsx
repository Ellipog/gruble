import { motion } from "framer-motion";

interface DesktopMessageProps {
  onContinue: () => void;
}

export function DesktopMessage({ onContinue }: DesktopMessageProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-slate-800">
          📱 Mobile-Optimized Experience
        </h2>
        <p className="text-slate-600">
          Gruble works best on mobile devices for an optimal gaming experience.
          Consider switching to your mobile device for the best results.
        </p>
        <motion.button
          onClick={onContinue}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue Anyway
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

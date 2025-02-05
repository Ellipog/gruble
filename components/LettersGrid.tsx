"use client";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface LettersGridProps {
  letters: string;
  onGenerateLetters: () => void;
  onGenerateSingleLetter: (index: number) => void;
}

export function LettersGrid({
  letters,
  onGenerateLetters,
  onGenerateSingleLetter,
}: LettersGridProps) {
  return (
    <motion.section
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
      whileHover={{ y: -2, shadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Bokstaver</h2>
        <motion.button
          onClick={onGenerateLetters}
          className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Generer nye bokstaver"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {letters.split("").map((letter, index) => (
          <motion.button
            key={`${letter}-${index}`}
            onClick={() => onGenerateSingleLetter(index)}
            className="aspect-square flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 transition-colors group relative"
            initial={false}
            animate={{ opacity: 1 }}
          >
            <motion.span
              key={letter}
              initial={{ opacity: 0, scale: 0.5, rotateX: -180 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 150,
              }}
            >
              {letter}
            </motion.span>
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";

interface SelectedCategoriesProps {
  selectedCategories: string[];
  onShuffleAll: () => void;
  onShuffleSingle: (index: number) => void;
}

export function SelectedCategories({
  selectedCategories,
  onShuffleAll,
  onShuffleSingle,
}: SelectedCategoriesProps) {
  return (
    <motion.section
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8 transition-all duration-300"
      whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Valgte Kategorier
        </h2>
        <motion.button
          onClick={onShuffleAll}
          className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Bland alle kategorier"
        >
          <Shuffle className="w-5 h-5" />
        </motion.button>
      </div>
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 gap-2">
          {selectedCategories.map((category, index) => (
            <motion.div
              key={`${category}-${index}`}
              className="flex items-center p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group cursor-pointer relative overflow-hidden"
              initial={{ opacity: 0, x: -50, scale: 0.8 }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  mass: 1,
                  delay: index * 0.1,
                },
              }}
              exit={{
                opacity: 0,
                x: 50,
                scale: 0.8,
                transition: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              onClick={() => onShuffleSingle(index)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              <motion.span
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-medium relative z-10"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: index * 0.1 + 0.2,
                  },
                }}
              >
                {index + 1}
              </motion.span>
              <motion.span
                key={category}
                className="ml-3 text-slate-700 text-base sm:text-lg flex-grow relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 150,
                    damping: 12,
                    delay: index * 0.1 + 0.1,
                  },
                }}
              >
                {category}
              </motion.span>
              <motion.div
                className="relative z-10"
                initial={false}
                whileHover={{ scale: 1.2, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Shuffle className="w-4 h-4 text-slate-400" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </motion.section>
  );
}

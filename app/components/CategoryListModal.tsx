import { motion, AnimatePresence } from "framer-motion";
import { lists } from "@/data/wordCategories";

interface CategoryListModalProps {
  listId: string | null;
  onClose: () => void;
  onToggleList?: (listId: string) => void;
  enabledLists: string[];
  enabledCategories: Record<string, number[]>;
  onToggleCategory: (listId: string, categoryId: number) => void;
}

export function CategoryListModal({
  listId,
  onClose,
  onToggleList,
  enabledLists,
  enabledCategories,
  onToggleCategory,
}: CategoryListModalProps) {
  if (!listId) return null;

  const list = lists[listId as keyof typeof lists];
  const isEnabled = enabledLists.includes(listId);
  const enabledCategoryIds = enabledCategories[listId] || [];
  const isPartiallyEnabled =
    enabledCategoryIds.length > 0 &&
    enabledCategoryIds.length < list.categories.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-semibold text-slate-800">
                {list.title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                {enabledCategoryIds.length}/{list.categories.length} categories
                selected
              </p>
              {onToggleList && (
                <button
                  onClick={() => onToggleList(listId)}
                  className={`
                    px-4 py-1.5 rounded-lg text-sm font-medium
                    transition-colors duration-200
                    ${
                      isEnabled || isPartiallyEnabled
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                    }
                  `}
                >
                  {isEnabled || isPartiallyEnabled ? "Remove All" : "Add All"}
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {list.categories.map((category, index) => {
                const isSelected = enabledCategoryIds.includes(category.id);
                return (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => onToggleCategory(listId, category.id)}
                    className={`
                      p-4 rounded-xl transition-all duration-200 text-left
                      ${
                        isSelected
                          ? "bg-indigo-50 hover:bg-indigo-100"
                          : "bg-slate-50 hover:bg-slate-100"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <span
                          className={`
                          w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium
                          ${
                            isSelected
                              ? "bg-indigo-200 text-indigo-700"
                              : "bg-slate-200 text-slate-600"
                          }
                        `}
                        >
                          {index + 1}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full"
                          />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-indigo-700" : "text-slate-700"
                        }`}
                      >
                        {category.category}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

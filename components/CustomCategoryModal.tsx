import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Plus, X, Save, Trash2 } from "lucide-react";
import { CustomList } from "@/data/customCategories";
import { toast } from "react-hot-toast";

interface CustomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (list: Omit<CustomList, "id">) => void;
  initialData?: CustomList;
  onDelete?: () => void;
}

export function CustomCategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  onDelete,
}: CustomCategoryModalProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [categories, setCategories] = useState<string[]>(
    initialData?.categories.map((c) => c.category) || [""]
  );

  if (!isOpen || typeof document === "undefined") return null;

  const handleAddCategory = () => {
    setCategories([...categories, ""]);
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleUpdateCategory = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const handleSave = () => {
    // Filter out empty categories
    const filteredCategories = categories.filter((cat) => cat.trim() !== "");

    // Don't save if title is empty or no categories left
    if (!title.trim() || filteredCategories.length === 0) {
      toast.error("Liste må ha en tittel og minst én kategori", {
        duration: 3000,
        position: "bottom-center",
      });
      return;
    }

    onSave({
      title: title.trim(),
      categories: filteredCategories.map((category, index) => ({
        id: index + 1,
        category: category.trim(),
      })),
    });
    onClose();
  };

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 10, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-slate-800">
                {initialData ? "Rediger Liste" : "Ny Egendefinert Liste"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Liste navn"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
            />
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={category}
                    onChange={(e) =>
                      handleUpdateCategory(index, e.target.value)
                    }
                    placeholder="Kategori navn"
                    className="flex-grow px-4 py-2 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors"
                  />
                  <button
                    onClick={() => handleRemoveCategory(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={handleAddCategory}
              className="mt-4 w-full py-2 px-4 rounded-lg border-2 border-dashed border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Plus className="w-5 h-5" />
              Legg til kategori
            </motion.button>
          </div>

          <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Slett liste
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Lagre
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

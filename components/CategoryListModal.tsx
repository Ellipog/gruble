import { motion, AnimatePresence } from "framer-motion";
import { lists } from "@/data/wordCategories";
import { createPortal } from "react-dom";
import { CustomCategories } from "@/data/customCategories";
import { Plus, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CategoryListModalProps {
  listId: string | null;
  onClose: () => void;
  onToggleList?: (listId: string) => void;
  enabledLists: string[];
  enabledCategories: Record<string, number[]>;
  onToggleCategory: (listId: string, categoryId: number) => void;
  customCategories?: CustomCategories;
  onCustomCategoriesChange?: (categories: CustomCategories) => void;
}

export function CategoryListModal({
  listId,
  onClose,
  onToggleList,
  enabledLists,
  enabledCategories,
  onToggleCategory,
  customCategories = {},
  onCustomCategoriesChange,
}: CategoryListModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategories, setEditCategories] = useState<string[]>([]);

  if (!listId) return null;
  if (typeof document === "undefined") return null; // SSR check

  const list = lists[listId as keyof typeof lists] || customCategories[listId];
  if (!list) return null;

  const isEnabled = enabledLists.includes(listId);
  const enabledCategoryIds = enabledCategories[listId] || [];
  const isPartiallyEnabled =
    enabledCategoryIds.length > 0 &&
    enabledCategoryIds.length < list.categories.length;
  const isCustomList = listId in customCategories;

  const handleStartEdit = () => {
    if (!isCustomList) return;
    setEditTitle(list.title);
    setEditCategories(list.categories.map((cat) => cat.category));
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!isCustomList || !onCustomCategoriesChange) return;

    // Filter out empty categories
    const filteredCategories = editCategories.filter(
      (cat) => cat.trim() !== ""
    );

    // Don't save if title is empty or no categories left
    if (!editTitle.trim() || filteredCategories.length === 0) {
      toast.error("Liste må ha en tittel og minst én kategori", {
        duration: 3000,
        position: "bottom-center",
      });
      return;
    }

    const updatedList = {
      ...customCategories[listId],
      title: editTitle.trim(),
      categories: filteredCategories.map((category, index) => ({
        id: index + 1,
        category: category.trim(),
      })),
    };

    onCustomCategoriesChange({
      ...customCategories,
      [listId]: updatedList,
    });

    setIsEditing(false);
  };

  const handleDeleteList = () => {
    if (!isCustomList || !onCustomCategoriesChange) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [listId]: removed, ...rest } = customCategories;
    onCustomCategoriesChange(rest);
    onClose();
  };

  const handleAddCategory = () => {
    setEditCategories([...editCategories, ""]);
  };

  const handleUpdateCategory = (index: number, value: string) => {
    const newCategories = [...editCategories];
    newCategories[index] = value;
    setEditCategories(newCategories);
  };

  const handleRemoveCategory = (index: number) => {
    setEditCategories(editCategories.filter((_, i) => i !== index));
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
            <div className="flex items-center justify-between mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-2xl font-semibold text-slate-800 bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none"
                  placeholder="Liste navn"
                />
              ) : (
                <h2 className="text-2xl font-semibold text-slate-800">
                  {list.title}
                </h2>
              )}
              <div className="flex items-center gap-2">
                {isCustomList && !isEditing && (
                  <>
                    <button
                      onClick={handleStartEdit}
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleDeleteList}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
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
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                {enabledCategoryIds.length}/{list.categories.length} kategorier
                valgt
              </p>
              {onToggleList && !isEditing && (
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
                  {isEnabled || isPartiallyEnabled
                    ? "Fjern alle"
                    : "Legg til alle"}
                </button>
              )}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isEditing ? (
              <div className="space-y-4">
                {editCategories.map((category, index) => (
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
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {list.categories.map((category, index) => {
                  const isSelected = enabledCategoryIds.includes(category.id);
                  return (
                    <motion.div
                      key={category.id}
                      role="button"
                      tabIndex={0}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => onToggleCategory(listId, category.id)}
                      className={`
                        p-4 rounded-xl transition-all duration-200 text-left cursor-pointer
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
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="px-6 py-4 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Lagre
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

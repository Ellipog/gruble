import { lists } from "@/data/wordCategories";
import { motion } from "framer-motion";
import { useState } from "react";
import { CategoryListModal } from "./CategoryListModal";
import { CustomCategoryModal } from "./CustomCategoryModal";
import { Plus } from "lucide-react";
import {
  CustomCategories,
  CustomList,
  createCustomList,
} from "@/data/customCategories";

interface ListSelectionProps {
  enabledLists: string[];
  onToggleList: (listId: string) => void;
  enabledCategories: Record<string, number[]>;
  onToggleCategory: (listId: string, categoryId: number) => void;
  customCategories: CustomCategories;
  onCustomCategoriesChange?: (categories: CustomCategories) => void;
}

export function ListSelection({
  enabledLists,
  onToggleList,
  enabledCategories,
  onToggleCategory,
  customCategories,
  onCustomCategoriesChange,
}: ListSelectionProps) {
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<CustomList | undefined>(
    undefined
  );

  const getEnabledCount = (listId: string) => {
    return enabledCategories[listId]?.length || 0;
  };

  const isPartiallyEnabled = (listId: string) => {
    const list =
      lists[listId as keyof typeof lists] || customCategories[listId];
    if (!list) return false;
    const enabledCount = getEnabledCount(listId);
    return enabledCount > 0 && enabledCount < list.categories.length;
  };

  const handleSaveCustomList = (list: Omit<CustomList, "id">) => {
    const newList = createCustomList(list.title, list.categories);
    const updatedCategories = { ...customCategories, [newList.id]: newList };
    onCustomCategoriesChange?.(updatedCategories);
    setIsCustomModalOpen(false);
    setEditingList(undefined);
  };

  const handleDeleteList = () => {
    if (!editingList) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [editingList.id]: removed, ...rest } = customCategories;
    onCustomCategoriesChange?.(rest);
    setIsCustomModalOpen(false);
    setEditingList(undefined);
  };

  return (
    <>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Default Lists */}
        {Object.entries(lists).map(([listId, list], index) => {
          const isEnabled = enabledLists.includes(listId);
          const enabledCount = getEnabledCount(listId);
          const isPartial = isPartiallyEnabled(listId);

          return (
            <motion.div key={listId} className="relative">
              <motion.div
                onClick={() => setSelectedListId(listId)}
                role="button"
                tabIndex={0}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileHover={{
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                className={`
                  group h-[88px] relative overflow-hidden rounded-xl transition-colors duration-200 w-full cursor-pointer
                  ${
                    isEnabled
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-white text-slate-700 border border-slate-200"
                  }
                `}
              >
                <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                  <div className="flex items-center">
                    <span className="font-semibold text-md line-clamp-1 flex-grow pr-12">
                      {list.title}
                    </span>
                  </div>
                  <span
                    className={`text-sm ${
                      isEnabled ? "text-indigo-100" : "text-slate-500"
                    }`}
                  >
                    {isPartial
                      ? `${enabledCount}/${list.categories.length} kategorier`
                      : `${list.categories.length} kategorier`}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleList(listId);
                  }}
                  className={`
                    absolute top-4 right-4 w-8 h-8 rounded-full 
                    flex items-center justify-center
                    transition-colors duration-200
                    z-20 cursor-pointer
                    ${isEnabled || isPartial ? "bg-white/20" : "bg-slate-100"}
                    hover:${
                      isEnabled || isPartial ? "bg-white/30" : "bg-slate-200"
                    }
                  `}
                >
                  <motion.svg
                    initial={false}
                    animate={{ rotate: isEnabled ? 180 : 0 }}
                    className={`w-4 h-4 ${
                      isEnabled || isPartial ? "text-white" : "text-slate-400"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {isEnabled ? (
                      <path d="M5 12l5 -5l10 10" />
                    ) : (
                      <path d="M12 5v14M5 12h14" />
                    )}
                  </motion.svg>
                </button>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Custom Lists */}
        {Object.entries(customCategories)
          .reverse()
          .map(([listId, list], index) => {
            const isEnabled = enabledLists.includes(listId);
            const enabledCount = getEnabledCount(listId);
            const isPartial = isPartiallyEnabled(listId);

            return (
              <motion.div key={listId} className="relative">
                <motion.div
                  onClick={() => setSelectedListId(listId)}
                  role="button"
                  tabIndex={0}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{
                    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    group h-[88px] relative overflow-hidden rounded-xl transition-colors duration-200 w-full cursor-pointer
                    ${
                      isEnabled
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-slate-700 border border-slate-200"
                    }
                  `}
                >
                  <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                    <div className="flex items-center">
                      <span className="font-semibold text-md line-clamp-1 flex-grow pr-12">
                        {list.title}
                      </span>
                    </div>
                    <span
                      className={`text-sm ${
                        isEnabled ? "text-indigo-100" : "text-slate-500"
                      }`}
                    >
                      {isPartial
                        ? `${enabledCount}/${list.categories.length} kategorier`
                        : `${list.categories.length} kategorier`}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleList(listId);
                    }}
                    className={`
                      absolute top-4 right-4 w-8 h-8 rounded-full 
                      flex items-center justify-center
                      transition-colors duration-200
                      z-20 cursor-pointer
                      ${isEnabled || isPartial ? "bg-white/20" : "bg-slate-100"}
                      hover:${
                        isEnabled || isPartial ? "bg-white/30" : "bg-slate-200"
                      }
                    `}
                  >
                    <motion.svg
                      initial={false}
                      animate={{ rotate: isEnabled ? 180 : 0 }}
                      className={`w-4 h-4 ${
                        isEnabled || isPartial ? "text-white" : "text-slate-400"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {isEnabled ? (
                        <path d="M5 12l5 -5l10 10" />
                      ) : (
                        <path d="M12 5v14M5 12h14" />
                      )}
                    </motion.svg>
                  </button>
                </motion.div>
              </motion.div>
            );
          })}

        {/* Add Custom List Button */}
        <motion.div
          onClick={() => setIsCustomModalOpen(true)}
          role="button"
          tabIndex={0}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
          }}
          whileTap={{ scale: 0.98 }}
          className="group h-[88px] relative overflow-hidden rounded-xl transition-colors duration-200 w-full bg-white border-2 border-dashed border-slate-200 hover:border-indigo-500 cursor-pointer"
        >
          <div className="relative z-10 h-full p-4 flex flex-col items-center justify-center text-slate-600 hover:text-indigo-600">
            <Plus className="w-7 h-7 mb-1" />
          </div>
        </motion.div>
      </motion.div>

      <CategoryListModal
        listId={selectedListId}
        onClose={() => setSelectedListId(null)}
        onToggleList={onToggleList}
        enabledLists={enabledLists}
        enabledCategories={enabledCategories}
        onToggleCategory={onToggleCategory}
        customCategories={customCategories}
        onCustomCategoriesChange={onCustomCategoriesChange}
      />

      <CustomCategoryModal
        isOpen={isCustomModalOpen}
        onClose={() => {
          setIsCustomModalOpen(false);
          setEditingList(undefined);
        }}
        onSave={handleSaveCustomList}
        initialData={editingList}
        onDelete={editingList ? handleDeleteList : undefined}
      />
    </>
  );
}

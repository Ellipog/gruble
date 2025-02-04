"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lists } from "@/data/wordCategories";
import { ListSelection } from "@/app/components/ListSelection";
import { GrubleGrid } from "@/app/components/GrubleGrid";
import { generatePDF } from "@/app/utils/generatePDF";
import { Shuffle, RefreshCw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const CONSONANTS = "BCDFGHJKLMNPQRSTVWXYZ";

export default function Home() {
  const [enabledLists, setEnabledLists] = useState<string[]>([
    "originalGruble",
  ]);
  const [enabledCategories, setEnabledCategories] = useState<
    Record<string, number[]>
  >({
    originalGruble: lists.originalGruble.categories.map((cat) => cat.id),
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [letters, setLetters] = useState<string>("");
  const [isGridVisible, setIsGridVisible] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    shuffleCategories();
    generateLetters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleCategories = () => {
    const availableCategories = Object.entries(enabledCategories).flatMap(
      ([listId, categoryIds]) => {
        const list = lists[listId as keyof typeof lists];
        return list.categories.filter((cat) => categoryIds.includes(cat.id));
      }
    );

    if (availableCategories.length === 0) {
      // If no categories are enabled, use all categories from all lists
      const allCategories = Object.values(lists).flatMap(
        (list) => list.categories
      );
      const shuffled = [...allCategories]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map((cat) => cat.category);
      setSelectedCategories(shuffled);
      return;
    }

    const shuffled = [...availableCategories]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(5, availableCategories.length))
      .map((cat) => cat.category);
    setSelectedCategories(shuffled);
  };

  const generateLetters = () => {
    let result = "";
    while (result.length < 5) {
      const randomChar =
        CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
      if (!result.includes(randomChar)) {
        result += randomChar;
      }
    }
    setLetters(result);
  };

  const toggleList = (listId: string) => {
    const list = lists[listId as keyof typeof lists];

    setEnabledLists((prev) => {
      const isCurrentlyEnabled = prev.includes(listId);
      if (isCurrentlyEnabled) {
        // Remove from enabled lists
        setEnabledCategories((prevCats) => {
          const newCats = { ...prevCats };
          delete newCats[listId];
          return newCats;
        });
        return prev.filter((id) => id !== listId);
      } else {
        // Add all categories from this list
        setEnabledCategories((prevCats) => ({
          ...prevCats,
          [listId]: list.categories.map((cat) => cat.id),
        }));
        return [...prev, listId];
      }
    });
  };

  const toggleCategory = (listId: string, categoryId: number) => {
    setEnabledCategories((prev) => {
      const currentCategories = prev[listId] || [];
      const isEnabled = currentCategories.includes(categoryId);

      if (isEnabled) {
        // Remove category
        const newCategories = currentCategories.filter(
          (id) => id !== categoryId
        );
        if (newCategories.length === 0) {
          // If no categories left, remove the list entirely
          const newState = { ...prev };
          delete newState[listId];
          // Also remove from enabledLists if this was the last category
          setEnabledLists((lists) => lists.filter((id) => id !== listId));
          return newState;
        }
        return { ...prev, [listId]: newCategories };
      } else {
        // Add category
        const newCategories = [...currentCategories, categoryId];
        // If this is the first category, also add to enabledLists
        if (currentCategories.length === 0) {
          setEnabledLists((lists) => [...lists, listId]);
        }
        return { ...prev, [listId]: newCategories };
      }
    });
  };

  const handleGeneratePDF = async () => {
    if (selectedCategories.length < 5) {
      toast.error(
        "Please select at least 5 categories before generating the PDF",
        {
          duration: 3000,
          position: "bottom-center",
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        }
      );
      return;
    }

    setIsGenerating(true);
    try {
      await generatePDF({ setIsGridVisible });
      toast.success("PDF generated successfully!", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
    } catch {
      toast.error("Failed to generate PDF. Please try again.", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Toaster />
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.header
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl font-bold text-slate-800"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Gruble Sheet Generator
          </motion.h1>
          <motion.p
            className="text-slate-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Generate custom word game sheets with your preferred categories and
            letters
          </motion.p>
        </motion.header>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          {/* Left Column - Game Settings */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.section
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              whileHover={{ y: -2, shadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Word Categories
              </h2>
              <ListSelection
                enabledLists={enabledLists}
                onToggleList={toggleList}
                enabledCategories={enabledCategories}
                onToggleCategory={toggleCategory}
              />
            </motion.section>

            <motion.section
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              whileHover={{ y: -2, shadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Selected Categories
                </h2>
                <motion.button
                  onClick={shuffleCategories}
                  className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Shuffle Categories"
                >
                  <Shuffle className="w-5 h-5" />
                </motion.button>
              </div>
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 gap-2">
                  {selectedCategories.map((category, index) => (
                    <motion.div
                      key={category + index}
                      className="flex items-center p-3 bg-slate-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-medium">
                        {index + 1}
                      </span>
                      <span className="ml-3 text-slate-700">{category}</span>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </motion.section>
          </motion.div>

          {/* Right Column - Letters and Actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.section
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              whileHover={{ y: -2, shadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">
                  Letters
                </h2>
                <motion.button
                  onClick={generateLetters}
                  className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Generate New Letters"
                >
                  <RefreshCw className="w-5 h-5" />
                </motion.button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {letters.split("").map((letter, index) => (
                  <motion.div
                    key={letter + index}
                    className="aspect-square flex items-center justify-center bg-slate-50 rounded-lg text-2xl font-bold text-slate-700"
                    initial={{ opacity: 0, scale: 0.5, rotateX: -180 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 150,
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.1 + 0.2,
                      }}
                    >
                      {letter}
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
              whileHover={{ y: -2, shadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Generate PDF
              </h2>
              <motion.button
                onClick={handleGeneratePDF}
                disabled={isGenerating || selectedCategories.length < 5}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isGenerating || selectedCategories.length < 5
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                whileHover={
                  !isGenerating && selectedCategories.length >= 5
                    ? { scale: 1.02 }
                    : {}
                }
                whileTap={
                  !isGenerating && selectedCategories.length >= 5
                    ? { scale: 0.98 }
                    : {}
                }
              >
                {isGenerating
                  ? "Generating..."
                  : selectedCategories.length < 5
                  ? `Select ${5 - selectedCategories.length} more categories`
                  : "Download PDF"}
              </motion.button>
            </motion.section>
          </motion.div>
        </div>
      </div>

      <div className="mb-[99999999rem]" />

      <GrubleGrid
        isVisible={isGridVisible}
        selectedCategories={selectedCategories}
        letters={letters}
      />
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { lists } from "@/data/wordCategories";
import { ListSelection } from "@/components/ListSelection";
import { GrubleGrid } from "@/components/GrubleGrid";
import { LettersGrid } from "@/components/LettersGrid";
import { SelectedCategories } from "@/components/SelectedCategories";
import toast, { Toaster } from "react-hot-toast";
import {
  CustomCategories,
  loadCustomCategories,
  saveCustomCategories,
} from "@/data/customCategories";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ";

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
  const [isGeneratingEmpty, setIsGeneratingEmpty] = useState(false);
  const [customCategories, setCustomCategories] = useState<CustomCategories>(
    {}
  );

  useEffect(() => {
    setCustomCategories(loadCustomCategories());
    shuffleCategories();
    generateLetters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffleCategories = () => {
    const availableCategories = Object.entries(enabledCategories).flatMap(
      ([listId, categoryIds]) => {
        const list =
          lists[listId as keyof typeof lists] || customCategories[listId];
        if (!list) return [];
        return list.categories.filter((cat) => categoryIds.includes(cat.id));
      }
    );

    if (availableCategories.length === 0) {
      // If no categories are enabled, use all categories from all lists
      const allCategories = [
        ...Object.values(lists).flatMap((list) => list.categories),
        ...Object.values(customCategories).flatMap((list) => list.categories),
      ];

      // Shuffle all categories and take first 5 unique ones
      const shuffled = [...allCategories].sort(() => Math.random() - 0.5);
      const uniqueCategories = Array.from(
        new Set(shuffled.map((cat) => cat.category))
      ).slice(0, 5);

      // If we don't have enough unique categories, show an error
      if (uniqueCategories.length < 5) {
        toast.error(
          "Ikke nok unike kategorier tilgjengelig. Vennligst velg flere kategorier.",
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

      setSelectedCategories(uniqueCategories);
      return;
    }

    // For enabled categories, shuffle and ensure uniqueness
    const shuffled = [...availableCategories].sort(() => Math.random() - 0.5);
    const uniqueCategories = Array.from(
      new Set(shuffled.map((cat) => cat.category))
    ).slice(0, 5);

    // If we don't have enough unique categories, show an error
    if (uniqueCategories.length < 5) {
      toast.error(
        "Ikke nok unike kategorier tilgjengelig. Vennligst velg flere kategorier.",
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

    setSelectedCategories(uniqueCategories);
  };

  const shuffleSingleCategory = (index: number) => {
    const availableCategories = Object.entries(enabledCategories).flatMap(
      ([listId, categoryIds]) => {
        const list =
          lists[listId as keyof typeof lists] || customCategories[listId];
        if (!list) return [];
        return list.categories.filter((cat) => categoryIds.includes(cat.id));
      }
    );

    if (availableCategories.length === 0) {
      // If no categories are enabled, use all categories from all lists
      const allCategories = [
        ...Object.values(lists).flatMap((list) => list.categories),
        ...Object.values(customCategories).flatMap((list) => list.categories),
      ];

      // Filter out categories that are already selected (except the one being replaced)
      const currentCategories = new Set(selectedCategories);
      currentCategories.delete(selectedCategories[index]); // Remove the category being replaced
      const availableUnique = allCategories.filter(
        (cat) => !currentCategories.has(cat.category)
      );

      if (availableUnique.length === 0) {
        toast.error("Ingen flere unike kategorier tilgjengelig.", {
          duration: 3000,
          position: "bottom-center",
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
        });
        return;
      }

      const newCategory =
        availableUnique[Math.floor(Math.random() * availableUnique.length)]
          .category;
      setSelectedCategories((prev) => {
        const newCategories = [...prev];
        newCategories[index] = newCategory;
        return newCategories;
      });
      return;
    }

    // Filter out categories that are already selected (except the one being replaced)
    const currentCategories = new Set(selectedCategories);
    currentCategories.delete(selectedCategories[index]); // Remove the category being replaced
    const availableUnique = availableCategories.filter(
      (cat) => !currentCategories.has(cat.category)
    );

    if (availableUnique.length === 0) {
      toast.error("Ingen flere unike kategorier tilgjengelig.", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
      return;
    }

    const newCategory =
      availableUnique[Math.floor(Math.random() * availableUnique.length)]
        .category;
    setSelectedCategories((prev) => {
      const newCategories = [...prev];
      newCategories[index] = newCategory;
      return newCategories;
    });
  };

  const generateLetters = () => {
    let result = "";
    while (result.length < 5) {
      const randomChar = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      if (!result.includes(randomChar)) {
        result += randomChar;
      }
    }
    setLetters(result);
  };

  const generateSingleLetter = (index: number) => {
    setLetters((prev) => {
      let newLetter;
      do {
        newLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      } while (prev.includes(newLetter));

      const newLetters = prev.split("");
      newLetters[index] = newLetter;
      return newLetters.join("");
    });
  };

  const toggleList = (listId: string) => {
    const list =
      lists[listId as keyof typeof lists] || customCategories[listId];
    if (!list) return;

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
    if (typeof window === "undefined") return;

    if (selectedCategories.length < 5) {
      toast.error("Velg minst 5 kategorier før du genererer PDF", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
      return;
    }

    setIsGenerating(true);
    setIsGeneratingEmpty(false);
    try {
      // Dynamically import the generatePDF function
      const { generatePDF } = await import("@/app/utils/generatePDF");
      await generatePDF({ setIsGridVisible });
      toast.success("PDF generert!", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
    } catch (error) {
      console.error("PDF generering feilet:", error);
      toast.error("Kunne ikke generere PDF. Vennligst prøv igjen.", {
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

  const handleGenerateEmptyPDF = async () => {
    if (typeof window === "undefined") return;

    if (selectedCategories.length < 5) {
      toast.error("Velg minst 5 kategorier før du genererer PDF", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
      return;
    }

    setIsGenerating(true);
    setIsGeneratingEmpty(true);
    try {
      // Dynamically import the generatePDF function
      const { generatePDF } = await import("@/app/utils/generatePDF");
      await generatePDF({ setIsGridVisible, emptySheet: true });
      toast.success("Tom PDF generert!", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        },
      });
    } catch (error) {
      console.error("Tom PDF generering feilet:", error);
      toast.error("Kunne ikke generere tom PDF. Vennligst prøv igjen.", {
        duration: 3000,
        position: "bottom-center",
        style: {
          background: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fecaca",
        },
      });
    } finally {
      setIsGeneratingEmpty(false);
      setIsGenerating(false);
    }
  };

  const handleCustomCategoriesChange = (categories: CustomCategories) => {
    setCustomCategories(categories);
    saveCustomCategories(categories);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Toaster />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Header */}
        <motion.header
          className="text-center space-y-4 sm:space-y-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            Gruble-ark Generator
          </motion.h1>
          <motion.p
            className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            Generer egendefinerte gruble-ark med dine foretrukne kategorier og
            bokstaver
          </motion.p>
        </motion.header>

        {/* Main Content */}
        <div className="grid gap-8 lg:gap-12 md:grid-cols-[3fr_2fr]">
          {/* Left Column - Game Settings */}
          <motion.div
            className="space-y-6 lg:space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.section
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8 transition-all duration-300"
              whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Kategori Lister
              </h2>
              <ListSelection
                enabledLists={enabledLists}
                onToggleList={toggleList}
                enabledCategories={enabledCategories}
                onToggleCategory={toggleCategory}
                customCategories={customCategories}
                onCustomCategoriesChange={handleCustomCategoriesChange}
              />
            </motion.section>

            <SelectedCategories
              selectedCategories={selectedCategories}
              onShuffleAll={shuffleCategories}
              onShuffleSingle={shuffleSingleCategory}
            />
          </motion.div>

          {/* Right Column - Letters and Actions */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <LettersGrid
              letters={letters}
              onGenerateLetters={generateLetters}
              onGenerateSingleLetter={generateSingleLetter}
            />

            <motion.section
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8 transition-all duration-300"
              whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4">
                Opprett PDF
              </h2>
              <div className="flex gap-3">
                <motion.button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating || selectedCategories.length < 5}
                  className={`flex-1 py-3 sm:py-4 px-4 rounded-lg font-medium text-lg transition-all duration-300 ${
                    isGenerating || selectedCategories.length < 5
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg active:scale-[0.98] text-white"
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
                    ? "Genererer..."
                    : selectedCategories.length < 5
                    ? `Velg ${5 - selectedCategories.length} flere kategorier`
                    : "Last ned PDF"}
                </motion.button>
                <motion.button
                  onClick={handleGenerateEmptyPDF}
                  disabled={isGenerating || selectedCategories.length < 5}
                  className={`py-3 sm:py-4 px-4 rounded-lg font-medium text-lg transition-all duration-300 ${
                    isGenerating || selectedCategories.length < 5
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-slate-100 hover:bg-slate-200 hover:shadow-lg active:scale-[0.98] text-slate-700"
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
                    ? "Genererer..."
                    : selectedCategories.length < 5
                    ? `Velg ${5 - selectedCategories.length} flere kategorier`
                    : "Tom"}
                </motion.button>
              </div>
            </motion.section>
          </motion.div>
        </div>
      </div>

      <GrubleGrid
        isVisible={isGridVisible}
        selectedCategories={selectedCategories}
        letters={letters}
        emptySheet={isGeneratingEmpty}
      />
    </main>
  );
}

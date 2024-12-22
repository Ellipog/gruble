"use client";

import { Fragment, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Home() {
  const isMobile = useIsMobile();

  const [letters, setLetters] = useState<string[]>(["A", "B", "C", "D", "E"]);
  const [words, setWords] = useState<{ id: number; word: string }[]>([
    { id: 1, word: "A" },
    { id: 2, word: "B" },
    { id: 3, word: "C" },
    { id: 4, word: "D" },
    { id: 5, word: "E" },
  ]);

  const handleWordChange = (id: number, word: string) => {
    setWords(words.map((w) => (w.id === id ? { ...w, word } : w)));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {isMobile ? (
        <div className="flex flex-col h-screen p-4">
          <div className="bg-white rounded-lg shadow-lg p-4 flex-1 flex items-center justify-center flex-col gap-4">
            <div className="h-16 w-3/5 flex items-center justify-center font-bold text-xl">
              Grønnsak
            </div>
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-[10%] gap-3">
                {letters.map((letter) => (
                  <div
                    className="h-16 w-full flex items-center justify-center font-bold text-xl"
                    key={letter}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="flex flex-col w-[90%] gap-3 px-3">
                {words.map((word) => (
                  <div
                    className="h-16 w-full bg-gray-100/75 rounded-xl flex items-center justify-center font-bold text-xl"
                    key={word.id}
                  >
                    <input
                      type="text"
                      className="w-full h-full bg-transparent px-4 focus:outline-none text-start overflow-hidden"
                      value={word.word}
                      onChange={(e) =>
                        handleWordChange(word.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto flex h-screen p-8">
          {/* Left Panel */}
          <div className="w-1/4 bg-white rounded-lg shadow-lg p-6 mr-8">
            <h1 className="text-3xl font-bold mb-6">Gruble</h1>
            <div className="space-y-4">
              <button className="w-full bg-blue-500 text-white p-3 rounded-lg">
                New Game
              </button>
              <button className="w-full bg-gray-200 p-3 rounded-lg">
                Statistics
              </button>
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <div className="h-full flex items-center justify-center">
              {/* Card Display */}
              <div className="aspect-[3/4] h-[80%] bg-gray-50 rounded-xl border-2 border-gray-200">
                {/* Card content goes here */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

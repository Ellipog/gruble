interface GrubleGridProps {
  isVisible: boolean;
  selectedCategories: string[];
  letters: string;
  emptySheet?: boolean;
}

export function GrubleGrid({
  isVisible,
  selectedCategories,
  letters,
  emptySheet = false,
}: GrubleGridProps) {
  return (
    <div className={`${isVisible ? "block" : "hidden"}`}>
      <div className="mb-[99999999rem]" />
      <div
        className={`w-full max-w-2xl mx-auto border-2 border-gray-800 grid-container`}
      >
        {/* Header Row */}
        <div className="grid grid-cols-[40px_repeat(5,1fr)_80px] border-b-2 border-gray-800">
          <div className="border-r-2 border-gray-800 h-16"></div>
          {selectedCategories.map((category, idx) => (
            <div
              key={category + idx}
              className="border-r-2 border-gray-800 p-2 relative"
            >
              <span className="absolute top-3 right-1 text-xs">{idx + 1}</span>
              <div className="text-center text-sm pt-6">
                {!emptySheet && category}
              </div>
            </div>
          ))}
          <div className="text-center pt-6 text-sm">
            <div>POENG</div>
            <div>SUM</div>
          </div>
        </div>

        {/* Letter Rows */}
        {(emptySheet ? Array(5).fill("") : letters.split("")).map(
          (letter, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-[40px_repeat(5,1fr)_80px] border-b-2 border-gray-800"
            >
              <div className="border-r-2 border-gray-800 px-2 pt-8 flex justify-center items-center">
                {!emptySheet && letter}
              </div>
              {[...Array(5)].map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="border-r-2 border-gray-800 p-2 relative h-16"
                >
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 border-2 border-gray-800"></div>
                </div>
              ))}
              <div></div>
            </div>
          )
        )}

        {/* Footer */}
        <div className="flex h-14 items-center justify-end w-full">
          <div className="mr-[19.5rem] mt-12 text-xs">gruble.aaenz.no</div>
          <div className="mr-4 mt-6">POENGSUM TOTALT:</div>
          <div className="w-[5.12rem] h-14 border-l-2 border-gray-800"></div>
        </div>
      </div>
    </div>
  );
}

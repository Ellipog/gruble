// @ts-expect-error - html2pdf is not typed
import html2pdf from "html2pdf.js";

interface GeneratePDFOptions {
  setIsGridVisible: (visible: boolean) => void;
}

export const generatePDF = async ({ setIsGridVisible }: GeneratePDFOptions) => {
  setIsGridVisible(true); // Show the grid

  // Wait for the next render cycle
  await new Promise((resolve) => setTimeout(resolve, 100));

  const template = document.querySelector(".grid-container");
  if (!template) {
    setIsGridVisible(false);
    return;
  }

  const a4Width = 794;
  const a4Height = 1123;

  const pdfWrapper = document.createElement("div");
  pdfWrapper.style.position = "absolute";

  const pageDiv = document.createElement("div");

  // Set page styles
  Object.assign(pageDiv.style, {
    width: `${a4Width}px`,
    height: `${a4Height}px`,
    display: "flex",
    flexDirection: "column",
    margin: "0",
  });

  // Add 2 copies
  for (let i = 0; i < 2; i++) {
    const copyContainer = document.createElement("div");

    // Set copy container styles
    Object.assign(copyContainer.style, {
      overflow: "hidden",
      margin: "0",
      padding: "30px 30px 40px 0",
    });

    const clonedTemplate = template.cloneNode(true);
    copyContainer.appendChild(clonedTemplate);
    pageDiv.appendChild(copyContainer);

    // Add scissor line after first copy
    if (i === 0) {
      const scissorLine = document.createElement("div");
      Object.assign(scissorLine.style, {
        width: "100%",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0px 40px 0px 0px",
      });

      const lineContent = document.createElement("div");
      Object.assign(lineContent.style, {
        width: "80%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        margin: "0 0",
      });

      // Left dotted line
      const leftLine = document.createElement("div");
      Object.assign(leftLine.style, {
        flex: 1,
        borderTop: "2px dashed #000",
        marginRight: "40px", // Space before scissors
      });

      // Right dotted line
      const rightLine = document.createElement("div");
      Object.assign(rightLine.style, {
        flex: 1,
        borderTop: "2px dashed #000",
        marginLeft: "40px", // Space after scissors
      });

      // Scissors icon
      const scissorsIcon = document.createElement("div");
      scissorsIcon.innerHTML = "✄";
      Object.assign(scissorsIcon.style, {
        fontSize: "20px",
        position: "relative",
        top: "0px",
      });

      lineContent.appendChild(leftLine);
      lineContent.appendChild(scissorsIcon);
      lineContent.appendChild(rightLine);

      scissorLine.appendChild(lineContent);
      pageDiv.appendChild(scissorLine);
    }
  }

  pdfWrapper.appendChild(pageDiv);
  document.body.appendChild(pdfWrapper);

  const opt = {
    margin: 0,
    filename: "gruble-sheet.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      width: a4Width * 1.7,
      height: a4Height * 1.5,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "px",
      format: "a4",
      orientation: "portrait",
    },
  };

  try {
    await html2pdf().set(opt).from(pdfWrapper).save();
    document.body.removeChild(pdfWrapper);
    setIsGridVisible(false); // Hide the grid again
  } catch (error) {
    console.error("Error generating PDF:", error);
    setIsGridVisible(false); // Make sure to hide on error too
  }
};

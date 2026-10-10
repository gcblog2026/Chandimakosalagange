import { useEffect } from "react";

const watermarkCount = 12;

export default function SitePrivacyProtection() {
  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        target.closest("input, textarea, select, [contenteditable='true']")
      ) {
        return;
      }

      event.preventDefault();
    };

    const handleDragStart = (event: DragEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("img, picture, video, canvas, svg")
      ) {
        event.preventDefault();
      }
    };

    const handlePrintShortcut = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "p"
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("contextmenu", handleContextMenu, true);
    window.addEventListener("dragstart", handleDragStart, true);
    window.addEventListener("keydown", handlePrintShortcut, true);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, true);
      window.removeEventListener("dragstart", handleDragStart, true);
      window.removeEventListener("keydown", handlePrintShortcut, true);
    };
  }, []);

  return (
    <div className="site-privacy-watermark" aria-hidden="true">
      {Array.from({ length: watermarkCount }, (_, index) => (
        <span key={index}>© CHANDIMA KOSALA · ORIGINAL WORK</span>
      ))}
    </div>
  );
}

import { useFloating, offset, flip, shift, size } from "@floating-ui/react";
import { useEffect, useRef } from "react";

interface GuidePopoverProps {
  titulo: string;
  descricao: string;
  onClose: () => void;
  referenceElement: HTMLElement;
}

export default function GuidePopover({
  titulo,
  descricao,
  onClose,
  referenceElement,
}: GuidePopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const { x, y, refs, strategy, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 10 }),
      size({
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.min(350, availableWidth - 20)}px`,
            maxHeight: `${Math.min(300, availableHeight - 20)}px`,
          });
        },
      }),
    ],
  });

  // vincular o botão como referência
  useEffect(() => {
    if (referenceElement) refs.setReference(referenceElement);
  }, [referenceElement, refs]);


  // FECHAR AO CLICAR FORA
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);


  // FECHAR COM ESC
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);


  return (
    <div
      ref={(el) => {
        popoverRef.current = el;
        refs.setFloating(el);
      }}
      style={{
        position: strategy,
        top: y ?? 0,
        left: x ?? 0,
        ...floatingStyles,
        zIndex: 9999,
      }}
      className="
    backdrop-blur-lg 
    bg-white/70 
    border border-white/40 
    shadow-[0_4px_20px_rgba(0,0,0,0.15)]
    rounded-2xl 
    w-[320px]
    p-4 
    text-sm 
    transition-all 
    animate-fadeIn
"

    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800 text-base">{titulo}</h4>
        <button
  onClick={onClose}
  className="text-gray-500 hover:text-gray-800 transition-colors text-lg font-light"
>
  ✕
</button>

      </div>

      <div className="max-h-[220px] overflow-y-auto">
        <p className="text-gray-700 whitespace-pre-wrap">{descricao}</p>
      </div>
    </div>
  );
}

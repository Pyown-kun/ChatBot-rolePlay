import { useState } from "react";
import { Send } from "lucide-react";

function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className="border-t-4 border-[#c9a875] p-3 sm:p-4 shadow-lg relative z-10"
      style={{
        background: "linear-gradient(to right, #ecdfc0, #e8dfd0)",
      }}
    >
      {/* Washi tape — desktop only */}
      <div
        className="hidden sm:block absolute bottom-full left-8 w-16 h-6 bg-[#6bcf7f]/60 -mb-2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)",
          transform: "rotate(-2deg)",
        }}
      />

      <div className="flex gap-2 sm:gap-3 items-center">
        <input
          type="text"
          value={text}
          placeholder="Tulis pesan..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-3 sm:px-5 sm:py-3.5 bg-white border-2 border-[#c9a875] outline-none focus:border-[#ffa94d] text-[#2d1f10] placeholder:text-[#8b6f47] font-medium
            rounded-full sm:rounded-xl"
          style={{
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.1)",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="flex-shrink-0 bg-gradient-to-br from-[#ffa94d] to-[#ff6b6b] text-white font-bold
            hover:from-[#ff9a3d] hover:to-[#ff5b5b]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all shadow-lg border-2 border-white hover:scale-105
            p-3 rounded-full sm:px-7 sm:py-3.5 sm:rounded-xl"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
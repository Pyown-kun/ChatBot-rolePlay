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
      className="border-t-4 border-[#c9a875] p-4 shadow-lg relative z-10"
      style={{
        background: "linear-gradient(to right, #fff5e6, #f5ead2)",
      }}
    >
      {/* Washi tape decorative element */}
      <div
        className="absolute bottom-full left-8 w-16 h-6 bg-[#6bcf7f]/60 -mb-2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)",
          transform: "rotate(-2deg)",
        }}
      />

      <div className="flex gap-3">
        <input
          type="text"
          value={text}
          placeholder="Tulis pesan..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-5 py-3.5 rounded-xl bg-white border-2 border-[#c9a875] outline-none focus:border-[#ffa94d] text-[#2d1f10] placeholder:text-[#8b6f47] font-medium"
          style={{
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.1)",
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="px-7 py-3.5 rounded-xl bg-gradient-to-br from-[#ffa94d] to-[#ff6b6b] text-white font-bold hover:from-[#ff9a3d] hover:to-[#ff5b5b] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg border-2 border-white hover:scale-105"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
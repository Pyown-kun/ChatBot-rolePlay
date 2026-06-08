import { useState } from "react";

function ChatInput({
  onSend,
}) {
  const [text, setText] =
    useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  const handleKeyDown = (
    e
  ) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900 p-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={text}
          placeholder="Tulis pesan..."
          onChange={(e) =>
            setText(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          className="flex-1 rounded-full bg-slate-800 px-5 py-3 outline-none"
        />

        <button
          onClick={
            handleSubmit
          }
          className="rounded-full bg-indigo-600 px-5 py-3 font-medium"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
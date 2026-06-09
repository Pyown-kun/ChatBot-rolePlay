function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-3xl px-4 py-3 ${
          isUser ? "bg-emerald-600" : "bg-slate-800"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default ChatBubble;

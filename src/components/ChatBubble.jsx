function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 group`}>
      <div
        className={`
          max-w-[85%] sm:max-w-[75%]
          relative transform transition-transform hover:scale-[1.02]
          ${isUser ? "rotate-1" : "-rotate-1"}
        `}
      >
        {/* Washi tape decoration — hidden on mobile for cleaner look */}
        <div
          className={`hidden sm:block absolute -top-2 ${isUser ? "right-8" : "left-8"} w-16 h-5 opacity-70 z-10`}
          style={{
            backgroundColor: isUser ? "#ffa94d" : "#6bcf7f",
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 16px)",
            transform: isUser ? "rotate(-3deg)" : "rotate(3deg)",
          }}
        />

        {/* Sticky note style paper */}
        <div
          className={`${
            isUser
              ? "bg-gradient-to-br from-[#fff5e6] via-[#ffeaa7] to-[#ffd93d]"
              : "bg-gradient-to-br from-[#ffffff] via-[#f5ead2] to-[#ecdfc0]"
          } rounded-lg px-4 py-3 sm:px-5 sm:py-4 shadow-lg relative border-2`}
          style={{
            borderColor: isUser ? "#ffa94d" : "#c9a875",
            boxShadow:
              "0 4px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.5)",
          }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 rounded-lg opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.9" numOctaves="4"/%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.1"/%3E%3C/svg%3E")',
            }}
          />

          {/* Lined paper effect */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="h-full flex flex-col justify-evenly">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px bg-[#8b6f47]" />
              ))}
            </div>
          </div>

          <p
            className={`${
              isUser ? "text-[#2d1f10]" : "text-[#3a2f1f]"
            } leading-relaxed relative z-10 font-medium text-sm sm:text-base`}
          >
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
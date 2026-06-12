import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import SettingsModal from "./components/SettingsModal";
import CharacterProfile from "./components/CharacterProfile";

import { sendRoleplayMessage } from "./services/api";
import CharacterModal from "./components/CharacterModal";
import {
  loadProfessionKnowledge,
  getRelevantKnowledge,
} from "./services/knowledgeService";
import { Info } from "lucide-react";
import { cleanAiResponse } from "./utils/cleanAiResponse";

import { characterService } from "./services/characterService";

import { chatService } from "./services/chatService";

import systemCharacter from "./data/systemCharacter";

import { getSystemReply } from "./services/systemAssistant";

import { autoBackup } from "./services/backupService";

const getChatStorageKey = (charId) => `chat_history_${charId}`;

function sortCharacters(characters = []) {
  return [...characters].sort((a, b) => {
    // SuChan / system character selalu paling atas
    if (a.system) return -1;
    if (b.system) return 1;

    // locked/permanent di atas karakter biasa
    if (a.locked && !b.locked) return -1;
    if (!a.locked && b.locked) return 1;

    return 0;
  });
}

function App() {
  // ─── Responsive ───────────────────────────────────────
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
  const [showChat, setShowChat] = useState(false); // mobile: false = sidebar, true = chat

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ─── Character State ───────────────────────────────────
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!characters.length) return;

    const save = async () => {
      for (const char of characters) {
        await characterService.save(char);
      }

      autoBackup(characters);
    };

    save();
  }, [characters]);

  useEffect(() => {
    const loadCharacters = async () => {
      const saved = await characterService.getAll();

      const filtered = saved.filter((char) => !char.system);

      const finalChars = [systemCharacter, ...filtered];

      setCharacters(finalChars);

      setActiveChar(finalChars[0]);
    };

    loadCharacters();
  }, []);

  const [activeChar, setActiveChar] = useState(null);

  const [editingChar, setEditingChar] = useState(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);

  // ─── Chat State ────────────────────────────────────────
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ─── Modal State ───────────────────────────────────────
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // ─── API Config ────────────────────────────────────────
  const [settings, setSettings] = useState({
    provider: "gemini",

    apiKey: "",

    baseUrl: "https://generativelanguage.googleapis.com/v1beta",

    model: "gemini-2.5-flash",
  });

  // ─── Effects ───────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const savedConfig = localStorage.getItem("api_config");
    if (savedConfig) setSettings(JSON.parse(savedConfig));
  }, []);

  useEffect(() => {
    const loadCharacters = async () => {
      const saved = await characterService.getAll();

      const filtered = saved.filter((char) => !char.system);

      const finalChars = sortCharacters([systemCharacter, ...filtered]);

      setCharacters(finalChars);

      setActiveChar(finalChars[0]);
    };

    loadCharacters();
  }, []);

  useEffect(() => {
    if (!activeChar) return;
    localStorage.setItem("active_character", activeChar.id);
  }, [activeChar]);

  useEffect(() => {
    const loadChat = async () => {
      if (!activeChar) return;

      const saved = await chatService.get(activeChar.id);

      if (saved.length) {
        setMessages(saved);

        return;
      }

      const first = [
        {
          id: Date.now(),
          role: "character",
          text: activeChar.first_mes,
        },
      ];

      setMessages(first);

      await chatService.save(activeChar.id, first);
    };

    loadChat();
  }, [activeChar]);

  useEffect(() => {
    if (!activeChar) return;

    chatService.save(activeChar.id, messages);
  }, [messages, activeChar]);

  const handleImportCharacters = async (imported) => {
  const filtered = imported.filter(
    (char) => !char.system && !char.locked
  );

  const finalChars = [systemCharacter, ...filtered];

  // Bersihkan SEMUA karakter lama dari DB dulu
  await characterService.clearAll();

  setCharacters(finalChars);

  // Simpan yang baru (tanpa systemCharacter karena dia tidak perlu di-persist)
  await characterService.bulkSave(filtered);

  setActiveChar(systemCharacter);
};
  // ─── Handlers ──────────────────────────────────────────
  const handleSelectCharacter = async (char) => {
    setActiveChar(char);
    if (isMobile) setShowChat(true); // mobile: langsung ke chat setelah pilih karakter
    const knowledge = await loadProfessionKnowledge(char.profession);
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: messageText,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    /**
     * SYSTEM ASSISTANT
     */
    if (activeChar?.locked) {
      const reply = getSystemReply(messageText, settings);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "character",
          text: reply,
        },
      ]);

      return;
    }

    /**
     * NORMAL AI CHARACTER
     */
    const relevantKnowledge = getRelevantKnowledge(
      activeChar?.profession,
      messageText,
    );

    try {
      setIsLoading(true);

      const aiReply = await sendRoleplayMessage({
        config: settings,

        character: activeChar,

        messages: updatedMessages,

        relevantKnowledge,
      });

      const cleanedReply = cleanAiResponse(aiReply);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: "character",
          text: cleanedReply,
        },
      ]);
    } catch (error) {
  console.error(error);

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now() + 2,
      role: "character",
      text:
        error.message ||
        "Terjadi kesalahan saat menghubungi AI.",
    },
  ]);
} finally {
      setIsLoading(false);
    }
  };

  const handleSaveCharacter = (formData) => {
    if (editingChar) {
      const updatedCharacters = characters.map((char) =>
        char.id === editingChar.id
          ? {
              ...char,
              name: formData.name,
              avatar: formData.avatar,
              description: formData.description,
              profession: formData.profession,
              traits: formData.traits,
              personality: formData.traits.join(", "),
              first_mes: formData.first_mes,
            }
          : char,
      );
      setCharacters(updatedCharacters);
      if (activeChar?.id === editingChar.id) {
        setActiveChar(updatedCharacters.find((c) => c.id === editingChar.id));
      }
    } else {
      const newChar = {
        id: `char_${Date.now()}`,
        name: formData.name,
        avatar: formData.avatar,
        description: formData.description,
        profession: formData.profession,
        traits: formData.traits,
        personality: formData.traits.join(", "),
        first_mes: formData.first_mes,
      };
      setCharacters((prev) => [...prev, newChar]);
      setActiveChar(newChar);
    }
    setEditingChar(null);
    setIsCharacterModalOpen(false);
  };

  const handleDeleteCharacter = async (charId) => {
  const target = characters.find((c) => c.id === charId);

  // Cegah hapus system/locked character
  if (target?.locked) return;

  // Hapus dari IndexedDB juga, bukan hanya state
  await characterService.delete(charId);

  const filtered = characters.filter((char) => char.id !== charId);
  setCharacters(filtered);

  if (activeChar?.id === charId) {
    setActiveChar(filtered[0] || null);
    if (isMobile) setShowChat(false);
  }
};

  const handleResetChats = () => {
    characters.forEach((char) => {
      localStorage.removeItem(getChatStorageKey(char.id));
    });
    if (activeChar) {
      const initialMessage = [
        { id: Date.now(), role: "character", text: activeChar.first_mes },
      ];
      setMessages(initialMessage);
      localStorage.setItem(
        getChatStorageKey(activeChar.id),
        JSON.stringify(initialMessage),
      );
    }
    alert("Semua riwayat chat berhasil dihapus.");
  };

  // ─── Shared chat panel ─────────────────────────────────
  const ChatPanel = (
    <main
      className="flex flex-1 flex-col relative"
      style={{
        background:
          "linear-gradient(135deg, #f5ead2 0%, #ecdfc0 50%, #e8dfd0 100%)",
      }}
    >
      {/* Page texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width="200" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence baseFrequency="0.65" numOctaves="3"/%3E%3C/filter%3E%3Crect width="200" height="200" filter="url(%23noise)" opacity="0.4"/%3E%3C/svg%3E")',
        }}
      />

      {/* Header */}
      {activeChar && (
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-4 border-[#c9a875] shadow-lg relative z-10"
          style={{
            background: isMobile
              ? "linear-gradient(135deg, #a67c52 0%, #8b6f47 100%)"
              : "linear-gradient(to right, #fff5e6, #f5ead2)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at top right, #8b6f47 0%, transparent 70%)",
            }}
          />

          <div className="flex items-center gap-3 relative z-10">
            {/* Back button — mobile only */}
            {isMobile && (
              <button
                onClick={() => setShowChat(false)}
                className="p-2 rounded-full bg-[#fff5e6]/20 hover:bg-[#fff5e6]/40 text-[#fff5e6] transition-colors mr-1"
              >
                ←
              </button>
            )}

            {/* Avatar */}
            {isMobile ? (
              <div
                className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ffd93d] to-[#ffa94d] flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-white"
                style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
              >
                {activeChar.avatar ? (
                  <img
                    src={activeChar.avatar}
                    alt={activeChar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg text-white font-bold">
                    {activeChar.name[0]}
                  </span>
                )}
              </div>
            ) : (
              <div className="bg-white p-1.5 pb-3 rounded-sm shadow-lg transform -rotate-3">
                <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#ffd93d] to-[#ffa94d] flex items-center justify-center overflow-hidden">
                  {activeChar.avatar ? (
                    <img
                      src={activeChar.avatar}
                      alt={activeChar.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-white font-bold">
                      {activeChar.name[0]}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div>
              <h1
                className={`font-bold text-base sm:text-lg ${isMobile ? "text-[#fff5e6]" : "text-[#2d1f10]"}`}
              >
                {activeChar.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#6bcf7f] animate-pulse shadow-lg" />
                <span
                  className={`text-sm font-medium ${isMobile ? "text-[#f5ead2]/80" : "text-[#5a4a3a]"}`}
                >
                  {isMobile ? "Active now" : activeChar.personality}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(true)}
            className={`p-2.5 rounded-full transition-all shadow-md border-2 hover:scale-110 relative z-10 ${
              isMobile
                ? "bg-[#fff5e6]/20 border-[#fff5e6]/40 text-[#fff5e6] hover:bg-[#fff5e6]/40"
                : "hover:bg-[#ffa94d] bg-[#fff5e6] text-[#2d1f10] border-[#c9a875]"
            }`}
          >
            <Info className="w-5 h-5" />
          </button>
        </header>
      )}

      {/* Chat Area */}
      <section className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md relative">
              <div className="bg-white p-4 pb-8 rounded-sm shadow-2xl mx-auto mb-6 inline-block transform hover:rotate-0 transition-transform rotate-2">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-sm bg-gradient-to-br from-[#ffd93d] to-[#ffa94d] mx-auto flex items-center justify-center overflow-hidden">
                  {activeChar?.avatar ? (
                    <img
                      src={activeChar.avatar}
                      alt={activeChar?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl text-white font-bold">
                      {activeChar?.name?.[0]}
                    </span>
                  )}
                </div>
                <div className="text-center mt-2 text-[#3a2f1f] text-sm">
                  Ready to chat!
                </div>
              </div>
              <div
                className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#ff6b6b]/50 -rotate-6 -z-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)",
                }}
              />
              <h3 className="text-xl sm:text-2xl font-bold text-[#2d1f10] mb-3">
                Start chatting with {activeChar?.name}
              </h3>
              <p className="text-[#5a4a3a] bg-white/60 px-6 py-3 rounded-lg border-2 border-[#c9a875] shadow-md text-sm sm:text-base">
                Begin your roleplay adventure by sending a message below.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <ChatBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <ChatBubble message={{ role: "character", text: "Typing..." }} />
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </section>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />

      {/* Character Modal */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        editingChar={editingChar}
        onSave={handleSaveCharacter}
        settings={settings}
        characters={characters}
        onImport={handleImportCharacters}
      />
    </main>
  );

  // ─── Render ────────────────────────────────────────────
  return (
    <>
      <div
        className="flex h-screen overflow-hidden"
        style={{ background: "#6b4f35" }}
      >
        {isMobile ? (
          // Mobile: sidebar atau chat (tidak keduanya sekaligus)
          showChat && activeChar ? (
            ChatPanel
          ) : (
            <div className="flex-1">
              <Sidebar
                characters={characters}
                activeChar={activeChar}
                onSelectCharacter={handleSelectCharacter}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onAddCharacter={() => {
                  setEditingChar(null);
                  setIsCharacterModalOpen(true);
                }}
                onEditCharacter={(char) => {
                  setEditingChar(char);
                  setIsCharacterModalOpen(true);
                }}
                isMobile={true}
              />
            </div>
          )
        ) : (
          // Desktop: sidebar + chat side by side
          <>
            <Sidebar
              characters={characters}
              activeChar={activeChar}
              onSelectCharacter={handleSelectCharacter}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onAddCharacter={() => {
                setEditingChar(null);
                setIsCharacterModalOpen(true);
              }}
              onEditCharacter={(char) => {
                setEditingChar(char);
                setIsCharacterModalOpen(true);
              }}
              isMobile={false}
            />

            {ChatPanel}
          </>
        )}
      </div>

      {/* Character Profile Modal */}
      {isProfileOpen && (
        <CharacterProfile
          character={activeChar}
          onClose={() => setIsProfileOpen(false)}
          onDelete={handleDeleteCharacter}
          characters={characters}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
        onResetChats={handleResetChats}
      />

      {/* Character Modal — rendered outside main for mobile */}
      {isMobile && (
        <CharacterModal
          isOpen={isCharacterModalOpen}
          onClose={() => setIsCharacterModalOpen(false)}
          editingChar={editingChar}
          onSave={handleSaveCharacter}
          settings={settings}
          characters={characters}
          onImport={(imported) => {
            setCharacters((prev) => [...prev, ...imported]);
          }}
        />
      )}
    </>
  );
}

export default App;

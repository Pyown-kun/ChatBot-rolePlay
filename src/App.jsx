import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import SettingsModal from "./components/SettingsModal";
import CharacterProfile from "./components/CharacterProfile";
import initialCharacters from "./data/initialCharacters";
import { sendRoleplayMessage } from "./services/api";
import CharacterModal from "./components/CharacterModal";
import { Info } from "lucide-react";

const getChatStorageKey = (charId) => `chat_history_${charId}`;

const getSavedCharacters = () => {
  try {
    const savedCharacters = localStorage.getItem("roleplay_characters");
    if (savedCharacters) {
      return JSON.parse(savedCharacters);
    }
    return initialCharacters;
  } catch (error) {
    console.error("Gagal membaca karakter:", error);
    return initialCharacters;
  }
};

function App() {
  const [characters, setCharacters] = useState(getSavedCharacters);

  useEffect(() => {
    localStorage.setItem("roleplay_characters", JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    try {
      localStorage.setItem("roleplay_characters", JSON.stringify(characters));
    } catch (error) {
      console.error("Gagal menyimpan karakter:", error);
    }
  }, [characters]);

  const [activeChar, setActiveChar] = useState(initialCharacters[0]);
  const [editingChar, setEditingChar] = useState(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // NEW: Character Profile modal state
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [settings, setSettings] = useState({
    provider: "openai",
    apiKey: "",
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o",
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const savedConfig = localStorage.getItem("api_config");
    if (savedConfig) {
      setSettings(JSON.parse(savedConfig));
    }
  }, []);

  useEffect(() => {
    const savedCharId = localStorage.getItem("active_character");
    if (savedCharId) {
      const foundChar = initialCharacters.find((char) => char.id === savedCharId);
      if (foundChar) {
        setActiveChar(foundChar);
        return;
      }
    }
    setActiveChar(initialCharacters[0]);
  }, []);

  useEffect(() => {
    if (!activeChar) return;
    localStorage.setItem("active_character", activeChar.id);
  }, [activeChar]);

  useEffect(() => {
    if (!activeChar) return;
    const savedChat = localStorage.getItem(getChatStorageKey(activeChar.id));
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
      return;
    }
    const initialMessages = [
      { id: Date.now(), role: "character", text: activeChar.first_mes },
    ];
    setMessages(initialMessages);
    localStorage.setItem(getChatStorageKey(activeChar.id), JSON.stringify(initialMessages));
  }, [activeChar]);

  useEffect(() => {
    if (!activeChar || !messages.length) return;
    localStorage.setItem(getChatStorageKey(activeChar.id), JSON.stringify(messages));
  }, [messages, activeChar]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      setIsLoading(true);
      const aiReply = await sendRoleplayMessage({
        config: settings,
        character: activeChar,
        messages: updatedMessages,
      });
      const aiMessage = { id: Date.now() + 1, role: "character", text: aiReply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, role: "character", text: "Terjadi kesalahan saat menghubungi AI." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCharacter = (formData) => {
    if (!editingChar) {
      const newChar = {
        id: `char_${Date.now()}`,
        name: formData.name,
        avatar: formData.avatar,
        description: formData.description,
        personality: formData.personality,
        first_mes: formData.first_mes,
        scenario: formData.scenario,
      };
      setCharacters([...characters, newChar]);
      setActiveChar(newChar);
    }
    setIsCharacterModalOpen(false);
  };

  const handleDeleteCharacter = (charId) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus karakter ini?");
    if (!isConfirmed) return;
    const filteredCharacters = characters.filter((char) => char.id !== charId);
    setCharacters(filteredCharacters);
    if (activeChar?.id === charId) {
      setActiveChar(filteredCharacters[0] || null);
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
      localStorage.setItem(getChatStorageKey(activeChar.id), JSON.stringify(initialMessage));
    }
    alert("Semua riwayat chat berhasil dihapus.");
  };

  return (
    <>
      <div className="flex h-screen overflow-hidden" style={{ background: "#6b4f35" }}>
        {/* Sidebar */}
        <Sidebar
          characters={characters}
          activeChar={activeChar}
          onSelectCharacter={setActiveChar}
          handleDeleteCharacter={handleDeleteCharacter}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onAddCharacter={() => {
            setEditingChar(null);
            setIsCharacterModalOpen(true);
          }}
          onEditCharacter={(char) => {
            setEditingChar(char);
            setIsCharacterModalOpen(true);
          }}
        />

        {/* Main Chat */}
        <main
          className="flex flex-1 flex-col relative"
          style={{
            background: "linear-gradient(135deg, #f5ead2 0%, #ecdfc0 50%, #e8dfd0 100%)",
          }}
        >
          {/* Page texture overlay */}
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
              className="flex items-center justify-between px-6 py-4 border-b-4 border-[#c9a875] shadow-lg relative z-10"
              style={{ background: "linear-gradient(to right, #fff5e6, #f5ead2)" }}
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle at top right, #8b6f47 0%, transparent 70%)" }}
              />

              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white p-1.5 pb-3 rounded-sm shadow-lg transform -rotate-3">
                  <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-[#ffd93d] to-[#ffa94d] flex items-center justify-center overflow-hidden">
                    {activeChar.avatar ? (
                      <img src={activeChar.avatar} alt={activeChar.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl text-white font-bold">{activeChar.name[0]}</span>
                    )}
                  </div>
                </div>

                <div>
                  <h1 className="font-bold text-[#2d1f10] text-lg">{activeChar.name}</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6bcf7f] animate-pulse shadow-lg" />
                    <span className="text-sm text-[#5a4a3a] font-medium">{activeChar.personality}</span>
                  </div>
                </div>
              </div>

              {/* Info button → opens CharacterProfile */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="p-2.5 rounded-full hover:bg-[#ffa94d] bg-[#fff5e6] transition-all text-[#2d1f10] shadow-md border-2 border-[#c9a875] hover:scale-110 relative z-10"
              >
                <Info className="w-5 h-5" />
              </button>
            </header>
          )}

          {/* Chat Area */}
          <section className="flex-1 overflow-y-auto px-6 py-6 relative z-10">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md relative">
                  <div className="bg-white p-4 pb-8 rounded-sm shadow-2xl mx-auto mb-6 inline-block transform hover:rotate-0 transition-transform rotate-2">
                    <div className="w-32 h-32 rounded-sm bg-gradient-to-br from-[#ffd93d] to-[#ffa94d] mx-auto flex items-center justify-center overflow-hidden">
                      {activeChar?.avatar ? (
                        <img src={activeChar.avatar} alt={activeChar?.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-5xl text-white font-bold">{activeChar?.name?.[0]}</span>
                      )}
                    </div>
                    <div className="text-center mt-2 text-[#3a2f1f] text-sm">Ready to chat!</div>
                  </div>

                  <div
                    className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#ff6b6b]/50 -rotate-6 -z-10"
                    style={{
                      backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)",
                    }}
                  />

                  <h3 className="text-2xl font-bold text-[#2d1f10] mb-3">
                    Start chatting with {activeChar?.name}
                  </h3>
                  <p className="text-[#5a4a3a] bg-white/60 px-6 py-3 rounded-lg border-2 border-[#c9a875] shadow-md">
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
          />
        </main>
      </div>

      {/* Character Profile Modal */}
      {isProfileOpen && (
        <CharacterProfile
          character={activeChar}
          onClose={() => setIsProfileOpen(false)}
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
    </>
  );
}

export default App;
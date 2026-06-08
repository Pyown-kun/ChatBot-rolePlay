import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatBubble from "./components/ChatBubble";
import ChatInput from "./components/ChatInput";
import SettingsModal from "./components/SettingsModal";
import initialCharacters from "./data/initialCharacters";
import { sendRoleplayMessage } from "./services/api";

const getChatStorageKey =
  (charId) =>
    `chat_history_${charId}`;

const getSavedCharacters =
  () => {
    try {
      const savedCharacters =
        localStorage.getItem(
          "roleplay_characters"
        );

      /**
       * Jika ada data
       */
      if (
        savedCharacters
      ) {
        return JSON.parse(
          savedCharacters
        );
      }

      /**
       * Fallback
       */
      return initialCharacters;
    } catch (
      error
    ) {
      console.error(
        "Gagal membaca karakter:",
        error
      );

      return initialCharacters;
    }
  };

function App() {
  /**
   * Character State
   */
 const [
  characters,
  setCharacters,
] = useState(
  getSavedCharacters
);


/**
 * Save characters
 */
useEffect(() => {
  localStorage.setItem(
    "roleplay_characters",
    JSON.stringify(
      characters
    )
  );
}, [characters]);

/**
 * Sinkronisasi karakter
 * ke localStorage
 */
useEffect(() => {
  try {
    localStorage.setItem(
      "roleplay_characters",
      JSON.stringify(
        characters
      )
    );
  } catch (error) {
    console.error(
      "Gagal menyimpan karakter:",
      error
    );
  }
}, [characters]);
    
  
  const [activeChar,
  setActiveChar] =
    useState(initialCharacters[0]);
  /**
   * Chat State
   */
  const [messages,
  setMessages] =
    useState([]);

  const [isLoading,
  setIsLoading] =
    useState(false);

  /**
   * Settings Modal
   */
  const [isSettingsOpen,
  setIsSettingsOpen] =
    useState(false);

  /**
   * API Config State
   */
  const [settings,
  setSettings] =
    useState({
      provider: "openai",
      apiKey: "",
      baseUrl:
        "https://api.openai.com/v1",
      model: "gpt-4o",
    });

  /**
   * Load API Config
   * dari localStorage
   */
  useEffect(() => {
    const savedConfig =
      localStorage.getItem(
        "api_config"
      );

    if (savedConfig) {
      setSettings(
        JSON.parse(savedConfig)
      );
    }
  }, []);

  /**
 * Load active character
 */
useEffect(() => {
  const savedCharId =
    localStorage.getItem(
      "active_character"
    );

  if (savedCharId) {
    const foundChar =
      initialCharacters.find(
        (char) =>
          char.id ===
          savedCharId
      );

    if (foundChar) {
      setActiveChar(
        foundChar
      );
      return;
    }
  }

  /**
   * fallback character pertama
   */
  setActiveChar(
    initialCharacters[0]
  );
}, []);

/**
 * Save active character
 */
useEffect(() => {
  if (!activeChar)
    return;

  localStorage.setItem(
    "active_character",
    activeChar.id
  );
}, [activeChar]);

  /**
   * Saat karakter berubah:
   * reset chat + tampilkan first_mes
   */
  /**
 * Load chat history
 * berdasarkan karakter
 */
useEffect(() => {
  if (!activeChar)
    return;

  const savedChat =
    localStorage.getItem(
      getChatStorageKey(
        activeChar.id
      )
    );

  /**
   * Jika ada history
   */
  if (savedChat) {
    setMessages(
      JSON.parse(
        savedChat
      )
    );

    return;
  }

  /**
   * Jika belum ada
   * pakai first_mes
   */
  const initialMessages =
    [
      {
        id: Date.now(),
        role:
          "character",
        text:
          activeChar.first_mes,
      },
    ];

  setMessages(
    initialMessages
  );

  localStorage.setItem(
    getChatStorageKey(
      activeChar.id
    ),
    JSON.stringify(
      initialMessages
    )
  );
}, [activeChar]);

/**
 * Save messages
 */
useEffect(() => {
  if (
    !activeChar ||
    !messages.length
  )
    return;

  localStorage.setItem(
    getChatStorageKey(
      activeChar.id
    ),
    JSON.stringify(
      messages
    )
  );
}, [
  messages,
  activeChar,
]);

  /**
   * Handle Send Message
   */
 const handleSendMessage =
  async (
    messageText
  ) => {
    if (
      !messageText.trim()
    )
      return;

    /**
     * Pesan user
     */
    const userMessage =
      {
        id: Date.now(),
        role: "user",
        text:
          messageText,
      };

    /**
     * Update history
     */
    const updatedMessages =
      [
        ...messages,
        userMessage,
      ];

    setMessages(
      updatedMessages
    );

    try {
      setIsLoading(
        true
      );

      /**
       * Panggil API
       */
      const aiReply =
        await sendRoleplayMessage(
          {
            // config hari 3
            config:
              settings,

            // karakter aktif
            character:
              activeChar,

            // seluruh history
            messages:
              updatedMessages,
          }
        );

      /**
       * Tambahkan
       * balasan AI
       */
      const aiMessage =
        {
          id:
            Date.now() +
            1,

          role:
            "character",

          text:
            aiReply,
        };

      setMessages(
        (
          prev
        ) => [
          ...prev,
          aiMessage,
        ]
      );
    } catch (
      error
    ) {
      console.error(
        error
      );

      setMessages(
        (
          prev
        ) => [
          ...prev,
          {
            id:
              Date.now() +
              2,

            role:
              "character",

            text:
              "Terjadi kesalahan saat menghubungi AI.",
          },
        ]
      );
    } finally {
      setIsLoading(
        false
      );
    }
  };

const handleResetChats =
  () => {
    /**
     * Hapus semua chat history
     */
    characters.forEach(
      (char) => {
        localStorage.removeItem(
          getChatStorageKey(
            char.id
          )
        );
      }
    );

    /**
     * Reset active char
     */
    if (activeChar) {
      const initialMessage =
        [
          {
            id:
              Date.now(),

            role:
              "character",

            text:
              activeChar.first_mes,
          },
        ];

      setMessages(
        initialMessage
      );

      localStorage.setItem(
        getChatStorageKey(
          activeChar.id
        ),
        JSON.stringify(
          initialMessage
        )
      );
    }

    alert(
      "Semua riwayat chat berhasil dihapus."
    );
  };

  return (
    <>
      <div className="flex h-screen bg-slate-950 text-white">
        {/* Sidebar */}
        <Sidebar
          characters={
            characters
          }
          activeChar={
            activeChar
          }
          onSelectCharacter={
            setActiveChar
          }
          onOpenSettings={() =>
            setIsSettingsOpen(
              true
            )
          }
        />

        {/* Main Chat */}
        <main className="flex flex-1 flex-col">
          {/* Header */}
          <header className="flex items-center gap-3 border-b border-slate-800 bg-slate-900 px-6 py-4">
            <img
              src={
                activeChar.avatar
              }
              alt={
                activeChar.name
              }
              className="h-12 w-12 rounded-full object-cover"
            />

            <div>
              <h1 className="text-lg font-semibold">
                {
                  activeChar.name
                }
              </h1>

              <p className="text-sm text-slate-400">
                {
                  activeChar.personality
                }
              </p>
            </div>
          </header>

          {/* Chat Area */}
          <section className="flex-1 overflow-y-auto p-5">
            <div className="flex flex-col gap-4">
              {messages.map(
                (
                  message
                ) => (
                  <ChatBubble
                    key={
                      message.id
                    }
                    message={
                      message
                    }
                  />
                )
              )}

              {/* Typing */}
              {isLoading && (
                <ChatBubble
                  message={{
                    role:
                      "character",
                    text:
                      "Typing...",
                  }}
                />
              )}
            </div>
          </section>

          {/* Input */}
          <ChatInput
            onSend={
              handleSendMessage
            }
            disabled={
              isLoading
            }
          />
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
  isOpen={
    isSettingsOpen
  }
  onClose={() =>
    setIsSettingsOpen(
      false
    )
  }
  settings={
    settings
  }
  setSettings={
    setSettings
  }
  onResetChats={
    handleResetChats
  }
/>
    </>
  );
}

export default App;
import { FiSettings } from "react-icons/fi";

function Sidebar({
  characters,
  activeChar,
  onSelectCharacter,
  onOpenSettings,
}) {
  return (
    <aside className="flex w-80 flex-col border-r border-slate-800 bg-slate-900">
      {/* Character List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-5 text-xl font-bold">
          Characters
        </h2>

        <div className="space-y-3">
          {characters.map(
            (char) => {
              const isActive =
                activeChar.id ===
                char.id;

              return (
                <button
                  key={char.id}
                  onClick={() =>
                    onSelectCharacter(
                      char
                    )
                  }
                  className={`flex w-full items-center gap-3 rounded-2xl p-3 transition ${
                    isActive
                      ? "bg-indigo-600"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  <img
                    src={
                      char.avatar
                    }
                    alt={
                      char.name
                    }
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div className="text-left">
                    <h3 className="font-medium">
                      {char.name}
                    </h3>

                    <p className="line-clamp-1 text-sm text-slate-300">
                      {
                        char.description
                      }
                    </p>
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Bottom Settings */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={
            onOpenSettings
          }
          className="flex w-full items-center gap-3 rounded-2xl bg-slate-800 p-4 transition hover:bg-slate-700"
        >
          <FiSettings
            size={22}
          />

          <span>
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
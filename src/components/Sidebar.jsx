import { FiSettings } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

function Sidebar({
  characters,
  activeChar,
  onSelectCharacter,
  onOpenSettings,
  handleDeleteCharacter,
  onAddCharacter,
  onEditCharacter,
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
                activeChar?.id ===
                char.id;

              return (
                <div
                  key={char.id}
                  onClick={() =>
                    onSelectCharacter(
                      char
                    )
                  }
                  className={`flex cursor-pointer items-center justify-between rounded-2xl p-3 transition ${
                    isActive
                      ? "bg-indigo-600"
                      : "bg-slate-800 hover:bg-slate-700"
                  }`}
                >
                  {/* Left Content */}
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        char.avatar
                      }
                      alt={
                        char.name
                      }
                      className="h-14 w-14 rounded-full object-cover"
                    />

                  </div>

                  <div className="min-w-0 flex-1">
  {/* Header */}
  <div className="flex items-start justify-between gap-2">
    <h3 className="truncate font-medium">
      {char.name}
    </h3>

    {/* Action Buttons */}
    {isActive && (
      <div className="flex items-center gap-1">
        {/* Edit */}
        <button
          onClick={(e) => {
            e.stopPropagation();

            onEditCharacter(
              char
            );
          }}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          ✏️
        </button>

        {/* Delete */}
        <button
          onClick={(e) => {
            e.stopPropagation();

            handleDeleteCharacter(
              char.id
            );
          }}
          className="rounded-lg p-2 text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
        >
          🗑
        </button>
      </div>
    )}
  </div>

  {/* Description */}
  <p className="line-clamp-1 text-sm text-slate-300">
    {char.description}
  </p>
</div>
                </div>
              );
            }
          )}
        </div>
      </div>

<button
  onClick={
    onAddCharacter
  }
  className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 font-medium text-white transition hover:bg-violet-700"
>
  <span className="text-lg">
    +
  </span>

  Tambah Karakter
</button>

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
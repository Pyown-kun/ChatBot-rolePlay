function MultiSelectChips({ label, options, selected, setSelected, max = 3 }) {
  const handleToggle = (personality) => {
    const exists = selected.includes(personality);

    // Remove
    if (exists) {
      setSelected(selected.filter((item) => item !== personality));
      return;
    }

    // Max limit
    if (selected.length >= max) return;

    // Add
    setSelected([...selected, personality]);
  };

  const traitColors = [
    "#ff6b6b", "#ffa94d", "#ffd93d", "#6bcf7f",
    "#4d9de0", "#c77dff", "#ff6b9d", "#45d4a8",
  ];

  return (
    <div>
      {label && (
        <label className="mb-3 block text-sm font-bold text-[#2d1f10] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#6bcf7f] rounded-full inline-block" />
          {label}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((personality, idx) => {
          const isSelected = selected.includes(personality);
          const color = traitColors[idx % traitColors.length];

          return (
            <button
              key={personality}
              type="button"
              onClick={() => handleToggle(personality)}
              className="rounded-full px-3 py-1.5 text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 border-2"
              style={
                isSelected
                  ? {
                      backgroundColor: color,
                      borderColor: color,
                      color: "#fff",
                      boxShadow: `0 2px 8px ${color}66`,
                    }
                  : {
                      backgroundColor: "rgba(255,255,255,0.7)",
                      borderColor: "#c9a875",
                      color: "#5a4a3a",
                    }
              }
            >
              {personality}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-[#8b6f47] font-medium">
        {selected.length}/{max} dipilih
      </p>
    </div>
  );
}

export default MultiSelectChips;
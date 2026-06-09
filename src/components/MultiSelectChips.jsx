function MultiSelectChips({
  label,
  options,
  selected,
  setSelected,
  max = 3,
}) {
  const handleToggle =
    (
      personality
    ) => {
      const exists =
        selected.includes(
          personality
        );

      /**
       * Remove
       */
      if (exists) {
        setSelected(
          selected.filter(
            (item) =>
              item !==
              personality
          )
        );

        return;
      }

      /**
       * Max limit
       */
      if (
        selected.length >=
        max
      ) {
        return;
      }

      /**
       * Add
       */
      setSelected([
        ...selected,
        personality,
      ]);
    };

  return (
    <div>
      <label className="mb-3 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map(
          (
            personality
          ) => {
            const isSelected =
              selected.includes(
                personality
              );

            return (
              <button
                key={
                  personality
                }
                type="button"
                onClick={() =>
                  handleToggle(
                    personality
                  )
                }
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isSelected
                    ? "bg-violet-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {
                  personality
                }
              </button>
            );
          }
        )}
      </div>

      <p className="mt-2 text-xs text-slate-400">
        Maksimal{" "}
        {max} sifat
      </p>
    </div>
  );
}

export default
  MultiSelectChips;
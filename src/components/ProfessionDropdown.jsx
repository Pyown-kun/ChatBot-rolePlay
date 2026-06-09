function ProfessionDropdown({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(
          e
        ) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-violet-500"
      >
        <option value="">
          Pilih Profesi
        </option>

        {options.map(
          (
            profession
          ) => (
            <option
              key={
                profession
              }
              value={
                profession
              }
            >
              {
                profession
              }
            </option>
          )
        )}
      </select>
    </div>
  );
}

export default
  ProfessionDropdown;
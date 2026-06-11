function ProfessionDropdown({ label, value, options, onChange }) {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-bold text-[#2d1f10] flex items-center gap-2">
          <span className="w-2 h-2 bg-[#ffd93d] rounded-full inline-block" />
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-[#2d1f10] bg-white border-2 border-[#c9a875] outline-none transition focus:border-[#ffa94d] font-medium shadow-inner appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238b6f47' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: "40px",
        }}
      >
        <option value="">Pilih Profesi</option>
        {options.map((profession) => (
          <option key={profession} value={profession}>
            {profession}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProfessionDropdown;
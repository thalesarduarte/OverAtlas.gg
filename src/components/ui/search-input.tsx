export function SearchInput({
  name,
  placeholder,
  defaultValue
}: {
  name: string;
  placeholder: string;
  defaultValue?: string;
}) {
  return (
    <input
      type="search"
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-slate-950"
    />
  );
}

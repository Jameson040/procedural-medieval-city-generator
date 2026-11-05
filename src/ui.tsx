import { ReactNode, useState } from 'react';

export function Section({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  const [o, setO] = useState(open);
  return (
    <div className="border-b border-[#d9c9a3]">
      <button onClick={() => setO(!o)} className="flex w-full items-center justify-between px-4 py-2.5 text-left font-['Cinzel',Georgia,serif] text-[13px] font-bold tracking-wider text-[#5b3a22] hover:bg-[#ede2c6]">
        {title}
        <span className="text-xs">{o ? '−' : '+'}</span>
      </button>
      {o && <div className="space-y-2.5 px-4 pb-3.5">{children}</div>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-0.5 block text-[11px] font-semibold uppercase tracking-wide text-[#7a6347]">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-[11px] italic leading-tight text-[#8a7556]">{hint}</span>}
    </label>
  );
}

const inputCls = 'w-full rounded border border-[#cdb98c] bg-[#fbf6e6] px-2 py-1.5 text-sm text-[#3b2a1a] outline-none focus:border-[#8a3b2a]';

export function Text({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

export function Select<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

export function Slider({ label, value, min, max, step = 1, onChange, fmt }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; fmt?: (v: number) => string }) {
  return (
    <label className="block">
      <span className="mb-0.5 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-[#7a6347]">
        {label}
        <span className="font-normal normal-case text-[#5b3a22]">{fmt ? fmt(value) : value}</span>
      </span>
      <input type="range" className="h-1.5 w-full cursor-pointer accent-[#8a3b2a]" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

export function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#3b2a1a]">
      <input type="checkbox" className="h-3.5 w-3.5 accent-[#8a3b2a]" checked={value} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Btn({ children, onClick, primary, small, disabled, title }: { children: ReactNode; onClick?: () => void; primary?: boolean; small?: boolean; disabled?: boolean; title?: string }) {
  return (
    <button
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded border font-semibold transition disabled:opacity-50 ${small ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} ${primary ? 'border-[#6b2a1d] bg-[#8a3b2a] text-[#fbf1dc] hover:bg-[#9d4631]' : 'border-[#cdb98c] bg-[#f6eed7] text-[#5b3a22] hover:bg-[#ede2c6]'}`}
    >
      {children}
    </button>
  );
}

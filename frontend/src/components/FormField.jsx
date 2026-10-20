import { useState } from 'react';
import { Info } from 'lucide-react';

export default function FormField({ label, tooltip, error, children }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {tooltip && (
          <span className="relative inline-block">
            <button
              type="button"
              onMouseEnter={() => setShowTip(true)}
              onFocus={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onBlur={() => setShowTip(false)}
              className="text-slate-400 hover:text-slate-600"
              aria-label={`Info: ${tooltip}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            {showTip && (
              <div className="absolute z-50 bottom-full left-0 mb-2 w-56 bg-slate-800 text-white text-xs rounded-lg p-2.5 shadow-xl leading-relaxed">
                {tooltip}
              </div>
            )}
          </span>
        )}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

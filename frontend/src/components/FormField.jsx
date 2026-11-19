import { useState, useRef } from 'react';
import { Info } from 'lucide-react';

export default function FormField({ label, tooltip, error, required = false, children }) {
  const [showTip, setShowTip] = useState(false);
  const tipRef = useRef(null);

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <span>
          {label}
          {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        </span>

        {tooltip && (
          <span className="relative">
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
              aria-label={`Information about ${label}`}
              onMouseEnter={() => setShowTip(true)}
              onFocus={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onBlur={() => setShowTip(false)}
            >
              <Info style={{ width: 13, height: 13 }} />
            </button>
            {showTip && (
              <div
                ref={tipRef}
                role="tooltip"
                className="absolute z-50 bottom-full left-0 mb-2 w-60 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl leading-relaxed pointer-events-none"
              >
                {tooltip}
                <div className="absolute top-full left-3 w-2 h-2 bg-slate-800 rotate-45 -translate-y-1" />
              </div>
            )}
          </span>
        )}
      </label>

      {children}

      {error && (
        <p role="alert" className="text-red-600 text-xs mt-0.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

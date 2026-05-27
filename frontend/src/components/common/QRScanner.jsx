import React, { useState } from "react";

export default function QRScanner({ onResult }) {
  const [value, setValue] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onResult && onResult(value);
  };

  return (
    <div className="w-full max-w-md">
      <div className="border rounded p-4 bg-white">
        <p className="text-sm text-slate-600 mb-2">
          QR scanner not configured — use manual input:
        </p>
        <form onSubmit={submit} className="flex gap-2">
          <input
            className="flex-1 rounded border px-3 py-2"
            placeholder="Paste scanned code or enter ID"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button
            className="px-3 py-2 rounded bg-slate-800 text-white"
            type="submit"
          >
            OK
          </button>
        </form>
      </div>
    </div>
  );
}

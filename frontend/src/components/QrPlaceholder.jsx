import React from "react";

export default function QrPlaceholder({ value = "TRINETRA", size = 120 }) {
  const rows = Array.from({ length: 7 });

  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <div
        className="grid gap-1"
        style={{
          width: size,
          gridTemplateColumns: `repeat(7, minmax(0, 1fr))`,
        }}
      >
        {rows.map((_, rowIndex) =>
          rows.map((_, colIndex) => {
            const active =
              (rowIndex +
                colIndex +
                value.charCodeAt(rowIndex % value.length)) %
                3 ===
              0;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`h-4 ${active ? "bg-gray-900" : "bg-gray-100"}`}
              />
            );
          }),
        )}
      </div>
      <p className="text-sm text-gray-500">QR placeholder</p>
    </div>
  );
}

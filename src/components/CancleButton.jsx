import React from "react";

export default function CancleButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border text-black/50 py-2 px-4 rounded-sm hover:bg-slate-300 hover:text-whtite"
    >
      {text}
    </button>
  );
}

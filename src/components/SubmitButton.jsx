import React from "react";

export default function SubmitButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-brand text-white py-2 px-4 rounded-sm hover:brightness-110 dark:bg-gray-800"
    >
      {text}
    </button>
  );
}

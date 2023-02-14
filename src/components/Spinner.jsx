import React from "react";

export default function Spinner() {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 z-20 flex items-center justify-center bg-stone-50/50 z-50">
      <div className="text-gray flex flex-col items-center">
        <img
          src={`${process.env.PUBLIC_URL}/loadingicon.gif`}
          alt="loading..."
        />
        <p className="mt-4">불러오는 중...</p>
      </div>
    </div>
  );
}

import React from "react";

export default function UserProfile({ user }) {
  const { displayName, photoURL } = user;
  return (
    <div className="flex items-center shrink-0 sm:mr-5">
      <img
        src={photoURL}
        alt={displayName}
        className="w-10 h-10 rounded-full mr-2"
      />
      <span className="hidden sm:block">{displayName}</span>
    </div>
  );
}

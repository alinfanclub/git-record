import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <Link to="/map">map</Link>
        <Link to="/post">post</Link>
      </nav>
    </header>
  );
}

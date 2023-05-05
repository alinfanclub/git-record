import React from "react";
import { Link } from "react-router-dom";
import SubmitButton from "../components/SubmitButton";

export default function NotFound() {
  return (
    <section
      className="flex items-center justify-center h-screen flex-col gap-[2rem] sm:gap-[4rem] px-4
    "
    >
      <p className="sm:text-[10vw] text-6xl font-bold">Oops!</p>
      <p className="text-2xl flex flex-col gap-4 items-center">
        404 - Not Found Page
        <smal className="text-sm text-neutral-500 align-middle">
          The page you are looking for might have been removed had its name
          changed or is temporarily unavailable.
        </smal>
      </p>
      <p>
        <Link to="/">
          <SubmitButton text={"Go Booseureogi !!"} />
        </Link>
      </p>
    </section>
  );
}

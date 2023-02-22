import React from "react";
import { useNavigate } from "react-router-dom";

export default function AlertList({ item }) {
  const navigate = useNavigate();

  const move = () => {
    navigate(`/post/${item.id}`);
  };
  return (
    <>
      <li onClick={move} className="cursor-pointer">
        <div className="flex items-center justify-between">
          <p>{item.title}</p>
          <small>
            {item.type
              ? item.type === "creation"
                ? "창작시"
                : item.type === "recomend"
                ? "추천시"
                : item.type === "etc"
                ? "부스러기"
                : "미분류"
              : null}
          </small>
        </div>
      </li>
    </>
  );
}

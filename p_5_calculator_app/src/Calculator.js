import React, { useState } from "react";
import "./Calculator.css";

function Calculator() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const handleClear = () => {
    setInput("");
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      const expression = input.replace(/%/g, "/100");
      setInput(eval(expression).toString());
    } catch {
      setInput("Error");
    }
  };

  const buttons = [
    { label: "AC", onClick: handleClear, className: "clear" },
    { label: "DEL", onClick: handleDelete, className: "delete" },
    { label: "%", onClick: () => handleClick("%"), className: "operator" },
    { label: "/", onClick: () => handleClick("/"), className: "operator" },
    { label: "7", onClick: () => handleClick("7") },
    { label: "8", onClick: () => handleClick("8") },
    { label: "9", onClick: () => handleClick("9") },
    { label: "*", onClick: () => handleClick("*"), className: "operator" },
    { label: "4", onClick: () => handleClick("4") },
    { label: "5", onClick: () => handleClick("5") },
    { label: "6", onClick: () => handleClick("6") },
    { label: "-", onClick: () => handleClick("-"), className: "operator" },
    { label: "1", onClick: () => handleClick("1") },
    { label: "2", onClick: () => handleClick("2") },
    { label: "3", onClick: () => handleClick("3") },
    { label: "+", onClick: () => handleClick("+"), className: "operator" },
    { label: "0", onClick: () => handleClick("0") },
    { label: ".", onClick: () => handleClick(".") },
    { label: "=", onClick: calculate, className: "equals" },
  ];

  return (
    <div className="calculator">
      <div className="display">{input || "0"}</div>
      <div className="buttons">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`btn ${btn.className || ""}`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Calculator;

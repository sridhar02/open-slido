import React from "react";

const Button = ({ children, onClick }: any) => {
  return (
    <button
      className="flex gap-2 rounded-md bg-green-400 p-2"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

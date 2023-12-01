import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex justify-center items-center bg-red-500">
      {children}
    </div>
  );
};

export default layout;

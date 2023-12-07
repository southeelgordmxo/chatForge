import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex justify-center items-center flex-col gap-4">
      <div>
        <h1 className="text-xl md:text-3xl text-center mb-2">
          Welcome to <span className="text-indigo-500">ChatForge</span>: <br />
          <span className="text-rose-500">Powering</span>{" "}
          <span className="text-emerald-500">Real-Time</span>{" "}
          <span className="text-yellow-500">Conversations</span>
        </h1>
        <h2 className="hidden md:block max-w-[900px] text-lg md:text-2xl text-center text-zinc-300">
          Join a revolution in communication with{" "}
          <span className="text-indigo-500">ChatForge</span>. Seamlessly connect
          with friends, colleagues, and communities in{" "}
          <span className="text-emerald-500">Real-Time</span>, fostering instant
          connections worldwide.
        </h2>
      </div>
      {children}
    </div>
  );
};

export default layout;

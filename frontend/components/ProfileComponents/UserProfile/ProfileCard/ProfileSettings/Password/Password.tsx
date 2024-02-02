import React from "react";

function Password() {
  return (
    <div className="flex flex-col justify-strat  ">
      <form className="flex flex-col gap-[0.5rem] ">
        <label className="text-xl font-light">Pssword: </label>
        <input
          type="password"
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
          placeholder="current password"
        />
        <input
          type="password"
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
          placeholder="new password"
        />
      </form>
    </div>
  );
}

export default Password;

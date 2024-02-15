import React from "react";

type props = {
  oldPass: string;
  newPass: string;
  setOldPass: any;
  setNewPass: any;
}

function Password({oldPass, newPass, setOldPass, setNewPass}) {
  return (
    <div className="flex flex-col justify-strat  ">
      <form className="flex flex-col gap-[0.5rem] ">
        <label className="text-xl font-light">Pssword: </label>
        <input
          type="password"
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
          placeholder="current password"
          value={oldPass}
          onChange={(e) => setOldPass(e.target.value)}
        />
        <input
          type="password"
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
          placeholder="new password"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Password;

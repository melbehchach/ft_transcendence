import React from "react";

function Auth() {
  return (
    <div className="w-full flex flex-col gap-[1rem]">
      <h1 className="text-base">Two-Factor authentication</h1>
      <p className="text-xs text-gray-500">
        Scan this with Google Authenticator app and enter the code below in
        order to activate 2FA
      </p>
      <div className="w-[6rem] h-[6rem] border border-black border-2">
        <p>QR code</p>
      </div>
      <form className="w-full h-[2rem] flex flex-col gap-[0.5rem] ">
        <input
          type="number"
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-base font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="6-digit code"
        />
      </form>
      <p className="text-xs font-light text-gray-500">
        Press Enter to continue
      </p>
    </div>
  );
}

export default Auth;

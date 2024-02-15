import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

type props = {
  secret: string;
  codeChecker: boolean;
  setCodeChecker: any;
  tfaChecker: boolean;
  setTfaCheck: any;
};

function GoogleAuth({
  secret,
  codeChecker,
  setCodeChecker,
  tfaChecker,
  setTfaCheck,
}) {
  const [code, setCode] = useState("");

  async function sendCode() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.post(
          "http://localhost:3000/auth/tfa/enable",
          {
            token: `${code}`,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        setCodeChecker(response.data.enabled);
      } else throw new Error("bad req");
    } catch (error) {
      console.log(error);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendCode();
      setCode("");
      if (!codeChecker) {
        console.log("hamiiiiiid");
        setTfaCheck(true);
      }
    }
  }

  return (
    <div className="w-full flex flex-col gap-[1rem]">
      <h1 className="text-lg">Two-Factor authentication</h1>
      <p className="text-xs text-gray-500">
        Scan this with Google Authenticator app and enter the code below in
        order to activate 2FA
      </p>
      <div className="w-fit h-fit border border-black border-2">
        {secret != "" ? (
          <QRCodeSVG
            value={`otpauth://totp/Example:?secret=${secret}&issuer=Example`}
          />
        ) : (
          <></>
        )}
      </div>
      <form className="w-full h-[2rem] flex flex-col gap-[0.5rem] ">
        <input
          type="number"
          className={
            !codeChecker
              ? "w-full h-[2rem] pl-[1rem] bg-background border border-red-700 border-solid border-b-1 rounded-[10px] text-base text-red-700 font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              : "" +
                "w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-base font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          }
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </form>
      <p className="text-xs font-light text-gray-500">
        Press Enter to continue
      </p>
    </div>
  );
}

export default GoogleAuth;

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

type props = {
  secret: string;
  tfaCheck: boolean;
  setTfaCheck: any;
};

function GoogleAuth({ secret, tfaCheck, setTfaCheck }: props) {
  const [code, setCode] = useState("");
  const [codeChecker, setCodeChecker] = useState(true);

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
        if (response.data.enabled === false) {
          setCodeChecker(false);
        }
      } else throw new Error("bad req");
    } catch (error) {
      console.log("hello");
    }
  }

  async function remove2FA() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/auth/tfa/disable",
          {},
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        setTfaCheck(false);
      } else throw new Error("bad req");
    } catch (error) {}
  }

  function handleClick() {
    remove2FA();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendCode();
      setTimeout(() => {}, 300);
      setCode("");
    }
  }

  return (
    <div className="w-full flex flex-col gap-[1rem]">
      <h1 className="text-lg">Two-Factor authentication</h1>
      {!tfaCheck ? (
        <div className="w-full flex flex-col gap-[1rem]">
          <p className="text-xs text-gray-500">
            Scan this with Google Authenticator app and enter the code below in
            order to activate 2FA
          </p>
          <div className="w-fit h-fit border border-black border-2">
            {secret != "" && (
              <QRCodeSVG
                value={`otpauth://totp/Example:?secret=${secret}&issuer=Example`}
              />
            )}
          </div>
          <form className="w-full h-[2rem] flex flex-col gap-[0.5rem] ">
            <input
              type="number"
              className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-base font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </form>
          <p className="text-xs font-light text-gray-500">
            Press Enter to continue
          </p>
          {!codeChecker ? (
            <div className="w-full h-fit border border-red-700 rounded-[10px] text-sm text-red-700 font-light bg-background flex flex-col justify-center items-center">
              <p>Youre code is incorrect</p>
              <p>Please try agin</p>
            </div>
          ) : (
            <div className="flex flex-col gap-[0.5 rem]"></div>
          )}
        </div>
      ) : (
        <div className="w-full h-full">
          <p className="text-xs text-gray-500">
            You have enabled 2FA with the Google Authenticator app
          </p>
          <button
            className="w-[10rem] h-[2.5rem] rounded-[10px] border border-red-700 text-red-700 items-center"
            onClick={handleClick}
          >
            Remove 2FA
          </button>
        </div>
      )}
    </div>
  );
}

export default GoogleAuth;
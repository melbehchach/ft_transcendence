import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";

type props = {
  code: string;
  setCode: any;
}

function GoogleAuth({code, setCode}) {
  const [secret, steSecret] = useState("");
  // const [code, setCode] = useState("");

  async function goolgleTFA() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.get(
          "http://localhost:3000/auth/tfa/secret",
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        steSecret(response.data.secret);
      } else throw new Error("bad req");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    goolgleTFA();
  }, []);

  return (
    <div className="w-full flex flex-col gap-[1rem]">
      <h1 className="text-lg">Two-Factor authentication</h1>
      <p className="text-xs text-gray-500">
        Scan this with Google Authenticator app and enter the code below in
        order to activate 2FA
      </p>
      <div className="w-fit h-fit border border-black border-2">
        {secret != "" ? < QRCodeSVG value={`otpauth://totp/Example:?secret=${secret}&issuer=Example`} /> : <></>}
      </div>
      <form className="w-full h-[2rem] flex flex-col gap-[0.5rem] ">
        <input
          type="number"
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-base font-light outline-none [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}   
        />
      </form>
      <p className="text-xs font-light text-gray-500">
        Press Enter to continue
      </p>
    </div>
  );
}

export default GoogleAuth;

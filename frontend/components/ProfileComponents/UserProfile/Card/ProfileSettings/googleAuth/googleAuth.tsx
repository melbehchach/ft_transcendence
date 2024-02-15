import React, { useEffect, useState } from "react";

import Cookies from "js-cookie";
import axios from "axios";
import QRCode from "qrcode.react";
import Image from "next/image";

type props = {};

function GoogleAuth() {
  const base32 = require("base32-encode");
  const qrcode = require("qrcode");
  const [googleScret, setGoogleSecret] = useState("");
  let src = "";

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
        // setGoogleSecret(response.data.secret);
        const decodedSecret = base32.decode(response.data.secret, "utf8");
        qrcode.toDataURL(decodedSecret, (err, src) => {
          if (err) {
            console.error("Error generating QR code:", err);
            return;
          }
          console.log("QR code generated successfully:", src);
        });
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
        <QRCode value={src} />
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

export default GoogleAuth;

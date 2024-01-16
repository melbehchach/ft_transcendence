"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

async function verifyToken(
  token: string,
  setValidToken: React.Dispatch<React.SetStateAction<boolean | null>>,
  router: AppRouterInstance
) {
  try {
    const response = await fetch("http://localhost:3000/auth/tfa/verify", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      if (res.valid) {
        router.push("/profile");
      } else {
        setValidToken(false);
      }
    } else {
      const res = await response.json();
      alert(`Request Failed: ${res.error}`);
    }
  } catch (error) {
    alert(`Fetch Failed: ${error.message}`);
  }
}

export default function TFAform() {
  const [validToken, setValidToken] = useState<boolean | null>(null);
  const router = useRouter();
  let token: string;

  function handleClick(e: any) {
    e.preventDefault();
    verifyToken(token, setValidToken, router);
  }

  return (
    <>
      <div className="h-screen w-screen bg-login bg-center bg-cover bg-no-repeat flex justify-center items-center font-sans">
        <div className="backdrop-blur-md bg-white/10 w-full md:w-auto py-8 px-6 md:py-12 md:px-14 rounded-2xl flex flex-col gap-5 md:gap-10">
          <div className="flex flex-col gap-2.5 items-center">
            <h1 className=" text-2xl font-bold md:text-title md:font-semibold text-text text-center">
              TFA Required
            </h1>
            <span className="text-text text-opacity-20 text-small text-center">
              Open Google Authenticator app to get the TFA code
            </span>
          </div>
          <div>
            <form onSubmit={handleClick} className="flex flex-col gap-2.5">
              <input
                required
                className={
                  "placeholder:text-text placeholder:text-opacity-20 text-small text-text w-full block px-4 py-[1.0625rem] rounded-lg bg-transparent border " +
                  (validToken == false ? "  border-red-500" : "  border-accent")
                }
                type="text"
                placeholder="Enter the code"
                onChange={(e) => {
                  setValidToken(true);
                  token = e.target.value;
                }}
              ></input>
              <span
                className={
                  validToken == false
                    ? "block text-xs text-red-500"
                    : "block text-xs text-transparent"
                }
              >
                {"Invalid code. Please try again"}
              </span>
              <button
                type="submit"
                className="block bg-primary text-text px-6 py-3 mb-2 rounded-lg w-full"
              >
                Continue
              </button>
            </form>
            <a href="http://localhost:3001/auth/login">
              <button className="block bg-transparent border border-primary text-text px-6 py-3 rounded-lg w-full">
                Cancel
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

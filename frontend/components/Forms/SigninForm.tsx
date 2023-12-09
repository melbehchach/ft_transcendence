"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import Link from "next/link";

async function login(
  username: string,
  password: string,
  router: AppRouterInstance
) {
  const response = await fetch("http://localhost:3000/auth/signin", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (response.ok) {
    const res = await response.json();
    router.push("/profile");
  } else {
    alert("Failed To Signin");
  }
}

export default function SigninForm() {
  let username: string, passwd: string;
  const router = useRouter();
  function handleClick(e: any) {
    e.preventDefault();
    login(username, passwd, router);
  }

  return (
    <>
      <div className="h-screen w-screen bg-login bg-center bg-cover bg-no-repeat flex justify-center items-center font-sans">
        <div className="backdrop-blur-md bg-white/10 w-full md:w-auto py-8 px-6 md:py-12 md:px-14 rounded-2xl flex flex-col gap-5 md:gap-10">
          <div className="flex flex-col gap-2.5 items-center">
            <h1 className=" text-2xl font-bold md:text-title md:font-semibold text-text text-center">
              Welcome to PongClub
            </h1>
            <span className="text-text text-opacity-20 text-small text-center">
              Enter your username and password or use intra to sign in to the
              app
            </span>
          </div>
          <div>
            <form onSubmit={handleClick} className="flex flex-col gap-2.5">
              <input
                required
                className="placeholder:text-text placeholder:text-opacity-20 text-small text-text w-full block border border-accent px-4 py-[1.0625rem] rounded-lg bg-transparent"
                type="text"
                placeholder="username"
                onChange={(e) => {
                  username = e.target.value;
                }}
              ></input>
              <input
                required
                className="placeholder:text-text placeholder:text-opacity-20 text-small text-text w-full block border border-accent px-4 py-[1.0625rem] rounded-lg bg-transparent"
                type="password"
                placeholder="password"
                onChange={(e) => {
                  passwd = e.target.value;
                }}
              ></input>
              <button
                type="submit"
                className="block bg-primary text-text px-6 py-3 mb-4 rounded-lg w-full"
              >
                Sign in
              </button>
            </form>
            <div className="flex items-center mb-[1rem] gap-3">
              <div className="border-t w-full border-text border-opacity-20"></div>
              <span className="text-text text-opacity-20">OR</span>
              <div className="border-t w-full  border-text border-opacity-20"></div>
            </div>
            <a href="http://localhost:3000/auth/42">
              <button className="block bg-accent text-text px-6 py-3 rounded-lg w-full">
                Continue With Intra
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

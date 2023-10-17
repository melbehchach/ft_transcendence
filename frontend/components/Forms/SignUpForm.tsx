"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "../../types";

async function finishSignup(
  email: string,
  username: string,
  passwd: string,
  passwordConf: string,
  avatar: File,
  router: AppRouterInstance
) {
  if (avatar) {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await fetch("http://localhost:3000/auth/uploadAvatar", {
      credentials: "include",
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      alert("File upload failed.");
    }
  }
  const response = await fetch("http://localhost:3000/auth/finish_signup", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: email,
      username: username,
      password: passwd,
      passwordConf: passwordConf,
    }),
  });
  if (response.ok) {
    router.push("/profile");
  } else alert("Failed to Finish Signup");
}

const SignUpForm: React.FC<User> = ({ email, username, avatar }) => {
  const router: AppRouterInstance = useRouter();
  const [avatarFile, setAvatar] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(avatar);
  const [newUsername, setUsername] = useState<string>(username);
  const [passwd, setPasswd] = useState<string>("");
  const [confPasswd, setConfPasswd] = useState<string>("");
  const [passwdCheck, setPasswdCheck] = useState<{
    isValid: boolean;
    errorMessage: string;
  }>({ isValid: false, errorMessage: "" });

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!passwdCheck.isValid) {
      alert("Please enter a valid password");
      return;
    }
    finishSignup(email, newUsername, passwd, confPasswd, avatarFile, router);
  }

  const checkUpperCaseChar = new RegExp("(?=.*[A-Z])");
  const checkLowerCaseChar = new RegExp("(?=.*[a-z])");
  const checkSpecialChar = new RegExp("(?=.*[^A-Za-z0-9])");
  const checkLength = new RegExp("(?=.{8,})");
  const checkDigit = new RegExp("(?=.*[0-9])");
  function validatePassowrd(password: string) {
    if (checkLength.test(password)) {
      setPasswdCheck({ isValid: true, errorMessage: "No errros" });
    } else {
      setPasswdCheck({
        isValid: false,
        errorMessage: "Password must be at least 8 characters long",
      });
      return;
    }
    if (checkLowerCaseChar.test(password)) {
      setPasswdCheck({ isValid: true, errorMessage: "No errros" });
    } else {
      setPasswdCheck({
        isValid: false,
        errorMessage: "At least one lowercase letter needed",
      });
      return;
    }
    if (checkUpperCaseChar.test(password)) {
      setPasswdCheck({ isValid: true, errorMessage: "No errros" });
    } else {
      setPasswdCheck({
        isValid: false,
        errorMessage: "At least one uppercase letter needed",
      });
      return;
    }
    if (checkDigit.test(password)) {
      setPasswdCheck({ isValid: true, errorMessage: "No errros" });
    } else {
      setPasswdCheck({
        isValid: false,
        errorMessage: "At least one digit needed",
      });
      return;
    }
    if (checkSpecialChar.test(password)) {
      setPasswdCheck({ isValid: true, errorMessage: "No errros" });
    } else {
      setPasswdCheck({
        isValid: false,
        errorMessage: "At least one special character needed",
      });
      return;
    }
  }

  return (
    <>
      <div className="h-screen w-screen bg-login bg-center bg-cover bg-no-repeat flex justify-center items-center font-sans">
        <div className="backdrop-blur-md bg-white/10 w-full md:w-auto py-8 px-6 md:py-12 md:px-14 rounded-2xl flex flex-col items-center gap-5 md:gap-10">
          <h1 className="text-2xl font-bold md:text-title md:font-semibold text-text text-center">
            Create a New Account
          </h1>
          <div className="flex flex-col justify-end items-end relative">
            <div className="rounded-full w-28 md:w-40 h-28 md:h-40">
              <picture>
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={previewUrl}
                  alt="Profile Picture"
                />
              </picture>
            </div>
            <div className="w-9 h-9 bg-black p-2.5 rounded-full flex justify-center items-center cursor-pointer absolute">
              <label htmlFor="upload" className="cursor-pointer w-full h-full">
                <span className="w-full h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path
                      fill="white"
                      d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                    />
                  </svg>
                </span>
              </label>
            </div>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <input
                name="avatar"
                type="file"
                id="upload"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  const maxFileSize = 1024 * 1024 * 5;
                  if (file) {
                    console.log(file);
                    const maxFileSize = 1024 * 1024 * 5;
                    if (file.size > maxFileSize) {
                      alert(
                        "File is too large. Please upload a file smaller than 5 MB."
                      );
                      return;
                    }
                    setPreviewUrl(URL.createObjectURL(file));
                    setAvatar(file);
                  }
                }}
              />
              <input
                required
                className="placeholder:text-text placeholder:text-opacity-20 text-small text-text w-full block border border-accent px-4 py-[1.0625rem] rounded-lg bg-transparent"
                type="text"
                placeholder="Username"
                defaultValue={newUsername}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              ></input>
              <input
                required
                className="placeholder:text-text placeholder:text-opacity-20 text-small text-text w-full block border border-accent px-4 py-[1.0625rem] rounded-lg bg-transparent"
                type="password"
                placeholder="Password"
                onChange={(e) => {
                  validatePassowrd(e.target.value);
                  setPasswd(e.target.value);
                }}
              ></input>
              <span
                className={
                  passwd.length > 0
                    ? passwdCheck.isValid
                      ? "hidden"
                      : "block" + " text-xs text-red-500"
                    : "hidden"
                }
              >
                {passwdCheck.errorMessage}
              </span>
              <input
                required
                className="placeholder:text-text placeholder:text-opacity-20 text-small text-text w-full block border border-accent px-4 py-[1.0625rem] rounded-lg bg-transparent"
                type="password"
                placeholder="Confirm password"
                onChange={(e) => {
                  setConfPasswd(e.target.value);
                }}
              ></input>
              <span
                className={
                  confPasswd.length > 0
                    ? passwd === confPasswd
                      ? "hidden"
                      : "block" + " text-xs text-red-500"
                    : "hidden"
                }
              >
                {"Passwords don't match"}
              </span>
              <button
                className="block bg-primary text-text px-6 py-3 rounded-lg w-full"
                type="submit"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpForm;

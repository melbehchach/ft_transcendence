"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "../../types";
import UploadImage from "../uploadImage/UploadImage";
import React from "react";

async function finishSignup(
  email: string,
  username: string,
  passwd: string,
  passwordConf: string,
  avatar: File,
  router: AppRouterInstance,
  setSignupFail: any
) {
  try {
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
    } else {
      const res = await response.json();
      // console.log(`Failed to Finish Signup: ${res.error}`);
      setSignupFail({ fail: true, errorMessage: res.error });
      return;
    }
  } catch (error) {
    console.log(error);
    alert(`finish_signup failed: ${error.message}`);
    return;
  }
  try {
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
  } catch (error) {
    console.log(error);
    alert(`uploadAvatar failed: ${error.message}`);
    return;
  }
}

const SignUpForm: React.FC<User> = ({ email, username, avatar }) => {
  const router: AppRouterInstance = useRouter();
  const [avatarFile, setAvatar] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(avatar);
  const [newUsername, setUsername] = useState<string>(username);
  // const [usernameTaken, setUsernameTaken] = useState<boolean>(false);
  const [passwd, setPasswd] = useState<string>("");
  const [confPasswd, setConfPasswd] = useState<string>("");
  const [passwdCheck, setPasswdCheck] = useState<{
    isValid: boolean;
    errorMessage: string;
  }>({ isValid: false, errorMessage: "" });
  const [signupFail, setSignupFail] = useState<{
    fail: boolean;
    errorMessage: string;
  }>({ fail: false, errorMessage: "" });

  function handleSubmit(e: any) {
    e.preventDefault();
    if (!passwdCheck.isValid) {
      alert("Please enter a valid password");
      return;
    }
    finishSignup(
      email,
      newUsername,
      passwd,
      confPasswd,
      avatarFile,
      router,
      setSignupFail
    );
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
          <UploadImage source={previewUrl} />
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
              <span
                className={
                  signupFail.fail ? "block" + " text-xs text-red-500" : "hidden"
                }
              >
                {signupFail.errorMessage}
              </span>
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

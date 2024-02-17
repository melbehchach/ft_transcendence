import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useAuth } from "../../../../../../app/context/AuthContext";

type props = {
  oldPass: string;
  newPass: string;
  setOldPass: any;
  setNewPass: any;
  oldPassCheck: boolean;
};

function Password() {
  const { fetchData } = useAuth();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [odlPassCheck, setOldPassCheck] = useState(true);

  async function updatePassword() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/settings/password",
          {
            old_password: `${oldPass}`,
            new_password: `${newPass}`,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        fetchData();
      } else throw new Error("bad req");
    } catch (error) {
      setOldPassCheck(false);
    }
  }

  const [passwdCheck, setPasswdCheck] = useState<{
    isValid: boolean;
    errorMessage: string;
  }>({ isValid: false, errorMessage: "" });

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

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      if (oldPass != "" && newPass != "") {
        updatePassword();
        setOldPass("");
        setNewPass("");
      }
    }
  }
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
          onChange={(e) => {
            validatePassowrd(e.target.value);
            setNewPass(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <span
          className={
            newPass.length > 0
              ? passwdCheck.isValid
                ? "hidden"
                : "block" + " text-xs text-red-500"
              : "hidden"
          }
        >
          {passwdCheck.errorMessage}
        </span>
        <p className="text-xs font-light text-gray-500">
          Press Enter to modifiy
        </p>
        {!odlPassCheck ? (
          <div className="w-full h-[2rem] border border-red-700 rounded-[10px] text-sm text-red-700 font-light bg-background flex flex-col justify-center items-center">
            Old Password incorrect
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
}

export default Password;

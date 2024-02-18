import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "../../../../../app/context/AuthContext";
import GameTheme from "./GameTheme/GameTheme";
import Password from "./Password/Password";
import ProfileAvatar from "./ProfileAvatar/ProfileAvatar";
import Username from "./Username/Username";
import { QRCodeSVG } from "qrcode.react";

type settingsProps = {
  openSettings: () => void;
};

function ProfileSettings({ openSettings }: settingsProps) {
  const { fetchData } = useAuth();
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [secret, steSecret] = useState("");
  const [tfaCheck, setTfaCheck] = useState(false);
  const [code, setCode] = useState("");
  const [codeChecker, setCodeChecker] = useState(true);

  async function tfaChecker() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.get(
          "http://localhost:3000/auth/tfa/check",
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        if (response.data.FTAenabled === false) {
          setTfaCheck(false);
          goolgleTFA();
        } else setTfaCheck(true);
      } else throw new Error();
    } catch (error) {}
  }

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
        console.log("got new seceret");
      } else throw new Error("bad req");
    } catch (error) {
      console.log(error);
    }
  }

  async function updateUsername() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/settings/username",
          {
            username: `${name}`,
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
      console.log("error kbiiiir");
    }
  }

  async function updateTheme() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/settings/theme",
          {
            theme: `${theme}`,
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
      console.log("error kbiiiir");
    }
  }

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
          setTfaCheck(false);
        } else setTfaCheck(true);
      } else throw new Error("bad req");
    } catch (error) {}
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
        setCodeChecker(true);
        goolgleTFA();
      } else throw new Error("bad req");
    } catch (error) {}
  }

  function handleClick() {
    if (name != "") {
      updateUsername();
    }
    if (theme != "") {
      updateTheme();
    }
    openSettings();
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendCode();
      setTimeout(() => {}, 300);
      setCode("");
    }
  }

  function handleClickRemove() {
    remove2FA();
  }

  useEffect(() => {
    tfaChecker();
    setTimeout(() => {}, 300);
  }, []);

  return (
    <div className="w-[21rem] h-full flex flex-col ">
      <h1 className="w-full font-semibold text-3xl">Settings</h1>
      <div className="w-full h-full flex justify-center flex-col gap-[1.5rem] ">
        <ProfileAvatar />
        <Username name={name} setName={setName} />
        <Password />
        <GameTheme them={theme} setTheme={setTheme} />
        <div className="w-full flex flex-col gap-[1rem]">
          <h1 className="text-lg">Two-Factor authentication</h1>
          {!tfaCheck ? (
            <div className="w-full flex flex-col gap-[1rem]">
              <p className="text-xs text-gray-500">
                Scan this with Google Authenticator app and enter the code below
                in order to activate 2FA
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
              {!codeChecker && (
                <div className="w-full h-fit border border-red-700 rounded-[10px] text-sm text-red-700 font-light bg-background flex flex-col justify-center items-center">
                  <p>Youre code is incorrect</p>
                  <p>Please try agin</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col gap-[0.5rem]">
              <p className="text-xs text-gray-500">
                You have enabled 2FA with the Google Authenticator app
              </p>
              <button
                className="w-[10rem] h-[2.5rem] rounded-[10px] border border-red-700 text-red-700 items-center"
                onClick={handleClickRemove}
              >
                Remove 2FA
              </button>
            </div>
          )}
        </div>
        <div className="w-full relative flex flex-row">
          <button
            type="button"
            className="w-[8rem] h-[2.5rem]  bg-[#D9923B] flex justify-center items-center rounded-[20px] text-sm "
            onClick={handleClick}
          >
            Save
          </button>
          <button
            type="button"
            className="w-[8rem] h-[2.5rem] absolute right-0 flex justify-center items-center border border-gray-500 border-solid rounded-[20px] text-sm "
            onClick={handleClick}
          >
            Discrad
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings;

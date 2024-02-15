import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "../../../../../app/context/AuthContext";
import GameTheme from "./GameTheme/GameTheme";
import Password from "./Password/Password";
import ProfileAvatar from "./ProfileAvatar/ProfileAvatar";
import Username from "./Username/Username";
import GoogleAuth from "./googleAuth/googleAuth";
import RemoveGoogleAuth from "./RemoveGoogleAuth/RemoveGoogleAuth";

type settingsProps = {
  openSettings: () => void;
};

function ProfileSettings({ openSettings }: settingsProps) {
  const { fetchData } = useAuth();
  const [name, setName] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [theme, setTheme] = useState("");
  const [tfaCheck, setTfaCheck] = useState(false);
  const [codeChecker, setCodeChecker] = useState(true);
  const [secret, steSecret] = useState("");

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
        setTfaCheck(response.data.FTAenabled);
      } else throw new Error("bad req");
    } catch (error) {
      console.log("error kbiiiir");
    }
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

  function handleClick() {
    if (name != "") {
      updateUsername();
    }
    if (oldPass != "" && newPass != "") {
      updatePassword();
    }
    if (theme != "") {
      updateTheme();
    }
    openSettings();
  }

  useEffect(() => {
    goolgleTFA();
    tfaChecker();
  }, []);

  return (
    <div className="w-[21rem] h-full flex flex-col ">
      <h1 className="w-full font-semibold text-3xl">Settings</h1>
      <div className="w-full h-full flex justify-center flex-col gap-[1.5rem] ">
        <ProfileAvatar />
        <Username name={name} setName={setName} />
        <Password
          oldPass={oldPass}
          newPass={newPass}
          setOldPass={setOldPass}
          setNewPass={setNewPass}
        />
        <GameTheme them={theme} setTheme={setTheme} />
        {!tfaCheck ? (
          <GoogleAuth
            secret={secret}
            codeChecker={codeChecker}
            setCodeChecker={setCodeChecker}
            tfaChecker={tfaCheck}
            setTfaCheck={setTfaCheck}
            
          />
        ) : (
          <RemoveGoogleAuth setTfaCheck={setTfaCheck} />
        )}
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

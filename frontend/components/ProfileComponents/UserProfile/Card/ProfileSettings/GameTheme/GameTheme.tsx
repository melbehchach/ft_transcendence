import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import DarkTheme from "./DarkTheme";
import LightTheme from "./LightTheme";
import GrayTheme from "./GrayTheme";
import { useAuth } from "../../../../../../app/context/AuthContext";

function GameTheme() {
  const [theme, setTheme] = useState("");
  const { fetchData } = useAuth();

  async function updateTheme(newTheme: string) {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.patch(
          "http://localhost:3000/user/settings/theme",
          {
            theme: `${newTheme}`,
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
    } catch (error) {}
  }

  function handleClick(newTheme: string) {
    updateTheme(newTheme);
  }

  return (
    <div className="flex flex-col justify-center gap-[0.5rem] text-xl font-light">
      <h1>Game theme: </h1>
      <div className="flex flex-row gap-[1.2rem]">
        <button
          className={theme === "Retro" ? "border-4 border-orange-300" : ""}
          onClick={() => {
            setTheme("Retro");
            handleClick("Retro");
          }}
        >
          <DarkTheme />
        </button>
        <button
          className={theme === "Blue" ? "border-4 border-orange-300" : ""}
          onClick={() => {
            setTheme("Blue");
            handleClick("Blue");
          }}
        >
          <LightTheme />
        </button>
        <button
          className={theme === "Gray" ? "border-4 border-orange-300" : ""}
          onClick={() => {
            setTheme("Gray");
            handleClick("Gray");
          }}
        >
          <GrayTheme />
        </button>
      </div>
    </div>
  );
}

export default GameTheme;

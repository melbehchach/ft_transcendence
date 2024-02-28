import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "../../../../../../app/context/AuthContext";

function Username() {
  const { fetchData } = useAuth();
  const [name, setName] = useState("");
  const [badReq, setBadReq] = useState(true);
  const [goodReq, setGoodReq] = useState(false);

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
        setGoodReq(true);
        setTimeout(() => {
          setGoodReq(false);
        }, 2000);
      } else throw new Error("bad req");
    } catch (error) {
      setTimeout(() => {
        setBadReq(true);
      }, 2000);
      setBadReq(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      updateUsername();
      setName("");
    }
  }

  return (
    <div className="flex flex-col justify-strat">
      <form className="flex flex-col gap-[0.5rem] ">
        <label className="text-xl font-light">Username: </label>
        <input
          className="w-full h-[2rem] pl-[1rem] bg-background border border-gray-500 border-solid border-b-1 rounded-[10px] text-lg font-light outline-none"
          type="text"
          placeholder="new username"
          value={name}
          onChange={(e) => {
            if (e.target.value.length < 10) {
              setName(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
        />
        <p className="text-xs font-light text-gray-500">
          Press Enter to save changes
        </p>
        {!badReq && (
          <div className="w-full h-[2rem] border border-red-700 rounded-[10px] text-sm text-red-700 font-light bg-background flex flex-col justify-center items-center">
            Name already used !!
          </div>
        )}
        {goodReq && (
          <div className="w-full h-[2rem] border border-orange-300 rounded-[10px] text-sm text-grey-500 font-light bg-background  items-center">
            Name Saved well
          </div>
        )}
      </form>
    </div>
  );
}

export default Username;

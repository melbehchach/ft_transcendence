"use client";
import { useState, useEffect } from "react";
import SearchBar from "../../../components/ProfileComponents/Search/SearchBar";
import NotificationBar from "../../../components/ProfileComponents/NotificationBar/NotificationBar";
import UserProfile from "../../../components/ProfileComponents/UserProfile/UserProfile";
import OtherProfile from "../../../components/ProfileComponents/OtherProfile/OtherProfile";
import axios from "axios";
import Cookies from "js-cookie";
import { DataFetch } from "../../../components/ProfileComponents/types/Avatar.type";

export default function Page() {
  const [data, setData] = useState<DataFetch>({
    username: "",
    id: "",
    avatar: "",
  });

  const jwt_token = Cookies.get("JWT_TOKEN");

  async function fetchData() {
    try {
      if (jwt_token) {
        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        setData(response.data);
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden overflow-y-hidden">
      <div className="h-[5rem] flex garp-8 items-center border-b border-black border-solid p-[2rem]">
        <SearchBar />
        <NotificationBar />
      </div>
      <div className="w-full h-full flex justify-start p-[2rem] ">
        <UserProfile data={data} />
      </div>
    </main>
  );
}

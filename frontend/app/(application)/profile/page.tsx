"use client";
import SearchBar from "../../../components/SearchBar/SearchBar";
import NotificationBar from "../../../components/NotificationBar/NotificationBar";
import UserProfile from "../../../components/UserProfile/UserProfile";
import { useState } from "react";
import OtherProfile from "../../../components/OtherProfile/OtherProfile";

export default function Page() {
  const [normalUser, setNormalUser] = useState<boolean>(false);
  console.log("hamoood");
  return (
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden">
      <div className="w-full h-[6rem] flex justify-center items-center gap-[1rem] border border-black border-solid border-1">
        <SearchBar setNormalUser={setNormalUser} />
        <NotificationBar />
      </div>
      <div className="w-full h-full flex flex-row gap-3">
        {!normalUser ? <UserProfile /> : <OtherProfile />}
      </div>
    </main>
  );
}

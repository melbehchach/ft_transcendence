"use client";
import NotificationBar from "../../../components/ProfileComponents/NotificationBar/NotificationBar";
import NotificationBarIcon from "../../../components/ProfileComponents/NotificationBar/NotificationBarIcon";
import SearchBar from "../../../components/ProfileComponents/Search/SearchBar";
import UserProfile from "../../../components/ProfileComponents/UserProfile/UserProfile";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Page() {
  const {
    fetchNotifications,
    state: { notifications },
  } = useAuth();

  const [open, setOpen] = useState(false);

  function handleClick() {
    fetchNotifications();
    if (!open) setOpen(true);
    else setOpen(false);
  }

  return (
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden overflow-y-auto">
      <div className="h-[5rem] flex fexl-row gap-[0.5rem] items-center border-b border-black border-solid p-[0.5rem]">
        <SearchBar />
        <div
          className={
            open
              ? "w-[3rem] h-[3rem] rounded-[10px] flex items-center justify-center bg-[#D9923B]"
              : "w-[3rem] h-[3rem] rounded-[10px] flex items-center justify-center "
          }
        >
          <button onClick={handleClick}>
            <NotificationBarIcon open={open} />
          </button>
        </div>
      </div>
      {open && (
        <div className="relative">
          <NotificationBar notifications={notifications} />
        </div>
      )}
      <UserProfile isProfile={true} />
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import SearchBar from "../../../../components/ProfileComponents/Search/SearchBar";
import NotificationBar from "../../../../components/ProfileComponents/NotificationBar/NotificationBar";
import UserProfile from "../../../../components/ProfileComponents/UserProfile/UserProfile";
import { useParams } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import NotificationBarIcon from "../../../../components/ProfileComponents/NotificationBar/NotificationBarIcon";

export default function Page() {
  const params = useParams();
  const {
    fetchData,
    fetchNotifications,
    fetchAchievements,
    state: { notifications },
  } = useAuth();

  useEffect(() => {
    fetchData(params.id);
    fetchAchievements(params.id);
  }, []);

  const [open, setOpen] = useState(false);

  function handleClick() {
    fetchNotifications();
    if (!open) setOpen(true);
    else setOpen(false);
  }

  return (
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden lg:overflow-y-hidden">
      <div className="h-[5rem] flex fexl-row gap-[0.5rem] items-center border-b border-black border-solid p-[0.5rem]">
        <SearchBar />
        <div
          className={
            open
              ? "w-[3rem] h-[3rem] rounded-[10px] flex items-center justify-center bg-[#D9923B]"
              : "w-[3rem] h-[3rem] rounded-[10px] flex items-center justify-center hover:bg-primary/5"
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
      <UserProfile isProfile={false} />
    </main>
  );
}

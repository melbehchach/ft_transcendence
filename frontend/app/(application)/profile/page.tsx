"use client";
import { useParams } from "next/navigation";
import NotificationBar from "../../../components/ProfileComponents/NotificationBar/NotificationBar";
import SearchBar from "../../../components/ProfileComponents/Search/SearchBar";
import UserProfile from "../../../components/ProfileComponents/UserProfile/UserProfile";

export default function Page() {
  
  return (
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden overflow-y ">
      <div className="h-[5rem] flex garp-8 items-center border-b border-black border-solid p-[1.5rem]">
        <SearchBar />
        <NotificationBar />
      </div>
      <UserProfile isProfile={true} />
    </main>
  );
}

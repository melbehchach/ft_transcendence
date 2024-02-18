"use client";
import { useEffect } from "react";
import SearchBar from "../../../../components/ProfileComponents/Search/SearchBar";
import NotificationBar from "../../../../components/ProfileComponents/NotificationBar/NotificationBar";
import UserProfile from "../../../../components/ProfileComponents/UserProfile/UserProfile";
import { useParams, usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function Page() {
  const params = useParams();
  const { fetchData } = useAuth();

  useEffect(() => {
    fetchData(params.id);
  }, []);

  return (
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden lg:overflow-y-hidden">
      <div className="w-full h-fit hidden sm:block border-b border-black border-solid p-[0.5rem] ">
        <div className="flex justify-center gap-[1rem] mt-[0.5rem] ">
          <SearchBar />
          <NotificationBar />
        </div>
      </div>
      <UserProfile isProfile={false}/>
    </main>
  );
}

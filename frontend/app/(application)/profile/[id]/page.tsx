"use client";
import { useState, useEffect } from "react";
import SearchBar from "../../../../components/ProfileComponents/Search/SearchBar";
import NotificationBar from "../../../../components/ProfileComponents/NotificationBar/NotificationBar";
import UserProfile from "../../../../components/ProfileComponents/UserProfile/UserProfile";
import OtherProfile from "../../../../components/ProfileComponents/OtherProfile/OtherProfile";
import { useRouter } from "next/router";
import { useParams, usePathname } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { DataFetch } from "../../../../components/ProfileComponents/types/Avatar.type";

export default function Page() {
  const params = useParams();
  const [data, setData] = useState<DataFetch>({
    username: "",
    id: "",
    avatar: "",
  });

  const jwt_token = Cookies.get("JWT_TOKEN");

  async function fetchData() {
    try {
      if (jwt_token) {
        const response = await axios.get(
          `http://localhost:3000/user/${params.id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
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
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden lg:overflow-y-hidden">
      <div className="w-full h-fit hidden sm:block border-b border-black border-solid p-[0.5rem] ">
        <div className="flex justify-center gap-[1rem] mt-[0.5rem] ">
          <SearchBar />
          <NotificationBar />
        </div>
      </div>
      <div className="w-full h-full flex sm:justify-start justify-center ">
        <UserProfile data={data} />
      </div>
    </main>
  );
}

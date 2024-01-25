"use client";
import LogoutButton from "./LogoutButton/LogoutButton";
import SideBarButton from "./SideBarButtons/SideBarButton";
import ProfileIcon from "./SideBarButtons/icons/ProfileIcon";
import ChatIcon from "./SideBarButtons/icons/ChatIcon";
import GameIcon from "./SideBarButtons/icons/GameIcon";
import { buttounObject } from "./buttonObject.types";
import Link from "next/link";
import { useRouter } from "next/router";

function SideBar({ active, setSideBar }) {
  const pagesArray: buttounObject[] = [
    {
      id: 1,
      pageName: "profile",
      link: "/profile",
      TextColor: active !== "profile" ? "text-white" : "text-orange-300",
      icon: <ProfileIcon fill={active !== "profile" ? "white" : "orange"} />,
    },
    {
      id: 2,
      pageName: "chat",
      link: "/chat",
      TextColor: active !== "chat" ? "text-white" : "text-orange-300",
      icon: <ChatIcon fill={active !== "chat" ? "white" : "orange"} />,
    },
    {
      id: 3,
      pageName: "game",
      link: "/game",
      TextColor: active !== "game" ? "text-white" : "text-orange-300",
      icon: <GameIcon fill={active !== "game" ? "white" : "orange"} />,
    },
  ];

  return (
    <div className="h-11/12 flex flex-col items-center gap-[1rem] ">
      <div className="h-1/7 mt-[2rem] text-4xl text-white">
        <Link href={"/profile"}>Pong</Link>
      </div>
      <div className=" w-[11rem] h-[15] mt-[2rem] gap-[3rem] gap-[1rem] flex flex-col items-center justify-center">
        {pagesArray.map((page) => (
          <div
            key={page.id}
            className={
              "w-[9rem] h-[3rem] flex items-center " +
              (page.id === 1 ? "mt-[2rem]" : "")
            }
          >
            <SideBarButton page={page} />
          </div>
        ))}
      </div>
      {/* <div className="absolute bottom-0 flex items-center mb-[2rem] mt-[2rem] ">
        <LogoutButton />
      </div> */}
    </div>
  );
}

export default SideBar;

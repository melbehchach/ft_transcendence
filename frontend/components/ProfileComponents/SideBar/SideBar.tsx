"use client";

import ChatIcon from "./SideBarButtons/icons/ChatIcon";
import Cookies from "js-cookie";
import GameIcon from "./SideBarButtons/icons/GameIcon";
import Link from "next/link";
import LogoutIcon from "./LogoutButton/LogoutIcon";
import ProfileIcon from "./SideBarButtons/icons/ProfileIcon";
import SideBarButton from "./SideBarButtons/SideBarButton";
import { buttounObject } from "./buttonObject.types";

function SideBar({ active, setSideBar }) {
  const pagesArray: buttounObject[] = [
    {
      id: 1,
      pageName: "Profile",
      link: "/profile",
      icon: <ProfileIcon fill={active !== "profile" ? "white" : "orange"} />,
    },
    {
      id: 2,
      pageName: "Chat",
      link: "/chat",
      icon: <ChatIcon fill={active !== "chat" ? "white" : "orange"} />,
    },
    {
      id: 3,
      pageName: "Game",
      link: "/game",
      icon: <GameIcon fill={active !== "game" ? "white" : "orange"} />,
    },
  ];

  function handleClick() {
    Cookies.remove("JWT_TOKEN");
    Cookies.remove("USER_ID");
    window.location.replace("/");
  }

  return (
    <div className="h-screen flex flex-col items-center bg-background py-[2rem] w-[14rem] max-w-[12rem]">
      <Link href={"/profile"} className="flex justify-center mb-[2rem]">
        <span className="text-5xl text-white">Pong</span>
      </Link>
      <div className="flex flex-col gap-[1.5rem] w-full flex-auto">
        {pagesArray.map((page) => (
          <SideBarButton
            page={page}
            key={page.id}
            active={active === page.pageName.toLowerCase()}
          />
        ))}
        <div
          className="mt-auto flex justify-center gap-x-3 text-2xl text-white w-full py-3"
          onClick={handleClick}
        >
          <LogoutIcon />
          <span className="text-xl">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;

"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import "swiper/css";
import SideBar from "../../components/ProfileComponents/SideBar/SideBar";
import SocketContextProvider, { useSocket } from "../context/SocketContext";
import ChallengePopUp from "../../components/Game/ChallengePopUp";
import ProtectedRoute from "../../components/ProtectedRoute";
import ChatSocketContextProvider from "../context/ChatContext";
import {io} from 'socket.io-client'


const ChallengNotif = () => {
  const { notifications, sender } = useSocket();
  return <>  {notifications && <ChallengePopUp sender={sender} />}</>

}

const socket = io('http://localhost:3000/game')

export default function Layout({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string>("");
  const [open, steOpen] = useState<boolean>(true);

  const location = usePathname();
  const locations = ["profile", "chat", "game"];
  const {
    fetchData,
    fetchFriendsReqData,
    fetchFriendsData,
    fetchRecentGames,
    fetchNotifications,
    state: { profile, user },
  } = useAuth();


  useEffect(() => {
    if (locations.includes(location.split("/")[1])) {
      setActive(location.split("/")[1]);
    } else {
      setActive("404"); // to change
    }
  }, [location]);

  useEffect(() => {
    
    return (() => {
      console.log('[[[[000000000]]]]the emit of the refresh in the layout');
      socket.emit('leaveBeforeStart')
    })  
  })

  useEffect(() => {
    fetchData();
    fetchFriendsReqData();
    fetchFriendsData();
  }, []);

  return (
    <ProtectedRoute>
      <ChatSocketContextProvider>
        <SocketContextProvider>
          <div className="flex">
            <div className="flex flex-col h-screen bg-background border-r border-black w-[14rem]">
              <SideBar active={active} setSideBar={steOpen} />
            </div>
            <ChallengNotif />
            {profile && children}
          </div></SocketContextProvider>
      </ChatSocketContextProvider>

    </ProtectedRoute>
  );
}



"use client";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import cookie from "js-cookie";
import { useRouter } from "next/navigation";
import AcceptOrRefuse from "@/../../components/Game/AcceptOrRefuse";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sender, setSender] = useState<string>("");
  const [notifications, setNotifications] = useState<boolean>(false);
  const router = useRouter();
  useEffect(() => {
    const noticeSocket = io("http://localhost:3000/notifications", {
      auth: {
        token: cookie.get("USER_ID"),
      },
    });
      setSocket(noticeSocket);
      return () => {
        noticeSocket.disconnect();
      };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {});
      socket.on("disconnect", () => {});
      socket.on("notification", (data: any) => {
        if (data.receiver === cookie.get("USER_ID")) {
          setNotifications(true);
          setSender(data.sender);
        }
      });
      socket.on("redirect", (data: any) => {
        router.push(data.url);
      });
    }
  }, [socket]);

 return (
   <>
     <div className="flex flex-row justify-start">
       <Navbar />
       {notifications ? <AcceptOrRefuse sender={sender} /> : null}
       {children}
     </div>
   </>
 );
}

"use client";

import "swiper/css";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import SideBar from "../../components/ProfileComponents/SideBar/SideBar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string>("");
  const [open, steOpen] = useState<boolean>(true);
  const location = usePathname();
  const locations = ["profile", "chat", "game"];
  const { fetchData, state: {profile} } = useAuth();

  useEffect(() => {
    if (locations.includes(location.split("/")[1])) {
      setActive(location.split("/")[1]);
    } else {
      setActive("404"); // to change
    }
  }, [location]);

  function handleClick() {
    if (!open) steOpen(true);
    else steOpen(false);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex">
        {/* <div className="sm:w-[5rem] h-fit sm:hidden flex bg-background">
        <button className=" m-[1rem] " onClick={handleClick}>
        <SideBarButton />
        </button>
        </div>
        {open && (
          <div className="w-screen sm:hidden h-screen relative flex justify-center bg-background">
          <SideBar active={active} setSideBar={steOpen} />
          </div>
        )} */}
        <div className="flex flex-col h-screen bg-background border-r border-black w-[14rem]">
          <SideBar active={active} setSideBar={steOpen} />
        </div>
        {profile && children}
      </div>
    </ProtectedRoute>
  );
}

// export default function Layout({ children }: React.PropsWithChildren<{}>) {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [sender, setSender] = useState<string>("");
//   const [notifications, setNotifications] = useState<boolean>(false);
//   const router = useRouter();
//   useEffect(() => {
//     const noticeSocket = io("http://localhost:3000/notifications", {
//       auth: {
//         token: cookie.get("USER_ID"),
//       },
//     });
//     setSocket(noticeSocket);
//     return () => {
//       noticeSocket.disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     if (socket) {
//       socket.on("connect", () => {});
//       socket.on("disconnect", () => {});
//       socket.on("notification", (data: any) => {
//         if (data.receiver === cookie.get("USER_ID")) {
//           setNotifications(true);
//           setSender(data.sender);
//         }
//       });
//       socket.on("redirect", (data: any) => {
//         router.push(data.url);
//       });
//     }
//   }, [socket]);

//   return (
//     <div ">
//       {/* <Navbar /> */}
//       {/* {notifications ? <AcceptOrRefuse sender={sender} /> : null} */}
//       <SideBar />
//       {children}
//     </div>
//   );
// }

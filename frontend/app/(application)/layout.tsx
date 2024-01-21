"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SideBar from "../../components/SideBar/SideBar";
import "swiper/css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<string>("");
  const location = usePathname();
  const locations = ["profile", "chat", "game"];
  useEffect(() => {
    if(locations.includes(location.split('/')[1])) {
      setActive(location.split('/')[1]);
    } else {
      setActive("404"); // to change
    }
  }, [location]);

  return (
    <div className="flex relative">
      <div className={"w-[14rem] hidden sm:block h-screen border border-black border-solid border-r-1 bg-background"}>
        <SideBar active={active} />
      </div>
      {children}
    </div>
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

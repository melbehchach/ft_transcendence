import Cookies from "js-cookie";
import NotificationBarIcon from "./NotificationBarIcon";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../app/context/AuthContext";

type props = {
  notifications: any;
};

export default function NotificationBar({ notifications }: props) {
  const { fetchNotifications } = useAuth();

  async function checkRead(id: string) {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        let url: string = "http://localhost:3000/notifications/" + id + "/read";
        const response = await axios.patch(
          url,
          {},
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        fetchNotifications();
      } else throw new Error("bad req");
    } catch (error) {}
  }

  const calculateTime = (time: any) => {
    let playMatch: any = new Date(time);
    let currentTime: any = new Date();
    let timeDifference = currentTime - playMatch;
    let secondsPassed = Math.floor(timeDifference / 1000);
    var minutesPassed = Math.floor(secondsPassed / 60);
    let hoursPassed = Math.floor(minutesPassed / 60);
    if (minutesPassed > 60) {
      return hoursPassed + " hour ago";
    }
    return minutesPassed + " minute ago";
  };

  return (
    <div className="absolute z-10 right-4 top-0 w-[25rem] h-[20rem] rounded-[10px] overflow-y-auto bg-background border border-black ">
      <div className="text-xl text-white font-bolds border-black border-b p-[1rem]">
        <h1>Notifications</h1>
      </div>
      <ul className="flex flex-col gap-[0.5rem] p-[0.8rem]">
        {notifications?.notifications
          .slice()
          .reverse()
          .map((notification) =>
            notification.message.length ? (
              <li
                className="flex flex-col gap-[0.2rem] border-b border-black p-[0.5rem]"
                key={notification.id}
                onClick={() => {
                  checkRead(notification.id);
                }}
              >
                <div className="flex flex-row items-center gap-[0.3rem]">
                  {!notification.read && (
                    <div className="w-[0.5rem] h-[0.5rem] rounded-full bg-[#D9923B]"></div>
                  )}
                  <h3 className="text-base text-white">
                    {notification.message}
                  </h3>
                </div>
                <p className="text-sm text-grey-500">
                  {calculateTime(notification.createdAt)}
                </p>
              </li>
            ) : null
          )}
      </ul>
    </div>
  );
}

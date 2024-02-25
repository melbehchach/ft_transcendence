"use client";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useChat } from "./ChatContext";

const SocketContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState(null);
  const [notifications, setNotifications] = useState<boolean>(false);
  const [sender, setSender] = useState({});
  const { fetchFriendsReqData, fetchFriendsData, fetchData } = useAuth();
  const param = useParams();
  const router = useRouter();
  const { getAllChats } = useChat();
  useEffect(() => {
    const newSocket: Socket = io("http://localhost:3000/notifications", {
      auth: {
        jwt_token: Cookies.get("JWT_TOKEN"),
        token: Cookies.get("USER_ID"),
      },
    });

    const statusSocket: Socket = io("http://localhost:3000/status", {
      auth: {
        jwt_token: Cookies.get("JWT_TOKEN"),
        token: Cookies.get("USER_ID"),
      },
    });

    setSocket(newSocket);
    setStatus(statusSocket);
    return () => {
      newSocket.disconnect();
      statusSocket.disconnect();
    };
  }, []);

  // const sendMessage = (message) => {
  //   if (socket) {
  //     socket.emit("chat message", message);
  //   }
  // };

  // const joinRoom = (roomName) => {
  //   if (socket) {
  //     socket.emit("join room", roomName);
  //   }
  // };

  // const leaveRoom = (roomName) => {
  //   if (socket) {
  //     socket.emit("leave room", roomName);
  //   }
  // };

  useEffect(() => {
    if (socket) {
      socket.on("FriendRequest", (data) => {
        fetchFriendsReqData();
      });
      socket.on("Block", (data) => {
        fetchFriendsData();
        fetchData();
      });
      socket.on("unBlock", (data) => {
        fetchData();
      });
      socket.on("GameRequest", (data) => {
        if (data.data.receiverId === Cookies.get("USER_ID")) {
          setNotifications(true);
          setSender({senderId : data.data.senderId, sender : data.data.sender});
        }
      });
      socket.on("AcceptGame", (data) => {
        router.push(data.url);
      });
      socket.on("Channel", (data) => {
        getAllChats();
      });
    }
    if (status) {
      status.on("statusUpdate", (data) => {
        fetchData();
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        sender,
        setNotifications,
        status,
      }}
    >
      
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("");
  }

  return context;
};

export default SocketContextProvider;

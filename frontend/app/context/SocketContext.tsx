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
  const [notifications, setNotifications] = useState<boolean>(false);
  const [sender, setSender] = useState<string>("");
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
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("chat message", message);
    }
  };

  const joinRoom = (roomName) => {
    if (socket) {
      socket.emit("join room", roomName);
    }
  };

  const leaveRoom = (roomName) => {
    if (socket) {
      socket.emit("leave room", roomName);
    }
  };

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
        setNotifications(true);
        setSender(data.sender);
      });
      socket.on("redirect", (data) => {
        router.push(data.url);
      });
      socket.on("Channel", (data) => {
        getAllChats();
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        sendMessage,
        joinRoom,
        leaveRoom,
        notifications,
        sender,
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

"use client";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useParams } from "next/navigation";

const SocketContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { fetchFriendsReqData, fetchFriendsData, fetchData } = useAuth();
  const param = useParams();
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
      socket.on("Message", (data) => {
        fetchData();
      });
    }
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, sendMessage, joinRoom, leaveRoom }}
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

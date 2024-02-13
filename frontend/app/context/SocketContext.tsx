"use client";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { fetchFriendsReqData } = useAuth();
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
    // console.log(socket);
    if (socket) {
      socket.on("FriendRequest", (data) => {
        console.log({ data });
        fetchFriendsReqData();
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

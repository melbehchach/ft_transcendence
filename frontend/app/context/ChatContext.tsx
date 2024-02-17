"use client";
import axios from "axios";
import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

const initialeState = {
  allChats: [],
};

const actionTypes = {
  LOAD_ALL_CHATS: "LOAD_ALL_CHATS",
};
const chatReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOAD_ALL_CHATS:
      return { ...state, allChats: action.payload };
  }
};

const ChatSocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [state, dispatch] = useReducer(chatReducer, initialeState);
  const {
    state: { user, friends },
  } = useAuth();
  const jwt_token = Cookies.get("JWT_TOKEN");

  async function getAllChats() {
    try {
      if (jwt_token) {
        const response = await axios.get("http://localhost:3000/direct/all", {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
        dispatch({ type: actionTypes.LOAD_ALL_CHATS, payload: response.data });
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function newChat(receiverId: string, body: string) {
    try {
      if (jwt_token) {
        const response = await axios.post(
          "http://localhost:3000/message/direct/new",
          {
            receiverId,
            body,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        getAllChats();
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  useEffect(() => {
    const newSocket: Socket = io("http://localhost:3000/direct-messages", {
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

  // const getMessageSender = (id) => {
  //   if (friends) {
  //     let friend = friends?.friends.find((friend) => friend.id === id);
  //     return friend;
  //   }
  //   return user;
  // };
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
      socket.on("directMessage", (data) => {
        getAllChats();
      });
    }
  }, [socket]);

  return (
    <ChatContext.Provider
      value={{
        socket,
        state,
        getAllChats,
        newChat,
        sendMessage,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("");
  }

  return context;
};

export default ChatSocketContextProvider;

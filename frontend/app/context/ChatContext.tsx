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
  members: [],
};

const actionTypes = {
  LOAD_ALL_CHATS: "LOAD_ALL_CHATS",
  UPDATE_MEMBERS: "UPDATE_MEMBERS",
};
const chatReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOAD_ALL_CHATS:
      return { ...state, allChats: action.payload };
    case actionTypes.UPDATE_MEMBERS:
      return { ...state, members: action.payload };
    default:
      return state;
  }
};

const ChatSocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [socketChannels, setSocketChannels] = useState(null);
  const [state, dispatch] = useReducer(chatReducer, initialeState);
  const {
    fetchData,
    state: { user, friends },
  } = useAuth();
  const jwt_token = Cookies.get("JWT_TOKEN");

  async function getAllChats() {
    try {
      const result = await Promise.all([getAllChannels(), getAllDMs()]);
      let r = [...result[0], ...result[1]];
      dispatch({
        type: actionTypes.LOAD_ALL_CHATS,
        payload: r,
      });

      let members = [...friends.friends.map((f) => f.id), user.id];
      r.forEach((channel) => {
        if (channel.Members) {
          channel.Members.forEach((element) => {
            members.push(element.id);
          });
        }
      });
      members = [...new Set(members)];
      let membersData = [...state.members];
      members.forEach(async (element) => {
        let friend;
        if (state.members.find((m) => m.id === element)) {
        } else if (user?.id === element) {
          membersData.push(user);
        } else if ((friend = friends?.friends?.find((f) => f.id === element))) {
          membersData.push(friend);
        } else {
          let data = fetchData(element, true);
          membersData.push(data);
        }
      });
      membersData = await Promise.all(membersData);
      dispatch({ type: actionTypes.UPDATE_MEMBERS, payload: membersData });
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function getAllDMs() {
    try {
      if (jwt_token) {
        const dms = (
          await axios.get("http://localhost:3000/direct/all", {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          })
        ).data;
        return dms;
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function getAllChannels() {
    try {
      if (jwt_token) {
        const channels = (
          await axios.get("http://localhost:3000/channels/all", {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          })
        ).data;
        return channels;
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function exploreChannels() {
    try {
      if (jwt_token) {
        const channels = (
          await axios.get("http://localhost:3000/channels/explore", {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          })
        ).data;
        return channels;
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function newChannel(
    params: {
      name: string;
      type: string;
      password: string;
      Memberes: string[];
    },
    avatar
  ) {
    try {
      if (jwt_token) {
        const response = await axios.post(
          "http://localhost:3000/channels/new",
          params,
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        await getAllChats();
        return response.data.id;
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }
  async function updateChannelAvatar(id, avatar) {
    try {
      if (jwt_token) {
        // let formDatat = new FormData();
        // formDatat.append("avatar", avatar);
        console.log(avatar);
        const response = await axios.patch(
          `http://localhost:3000/channels/${id}/editAvatar`,
          avatar,
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response);
        // getAllChats();
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }
  async function joinChannel(id, pwd) {
    try {
      if (jwt_token) {
        const response = await axios.post(
          `http://localhost:3000/channels/${id}/join`,
          { password: pwd },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        await getAllChats();
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  async function newChat(friendId: string) {
    try {
      if (jwt_token) {
        const response = await axios.post(
          "http://localhost:3000/direct/new",
          {
            friendId,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response);
        await getAllChats();
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }
  async function sendMessage(
    receiverId: string,
    body: string,
    channelName: boolean
  ) {
    try {
      if (jwt_token) {
        let url = !channelName
          ? "http://localhost:3000/message/direct/new"
          : "http://localhost:3000/message/channel/new";
        let params = channelName
          ? {
              channelName,
              channelId: receiverId,
              body,
            }
          : {
              receiverId,
              body,
            };
        const response = await axios.post(url, params, {
          headers: {
            Authorization: `Bearer ${jwt_token}`,
          },
          withCredentials: true,
        });
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
    const newSocketChannels: Socket = io("http://localhost:3000/channels", {
      auth: {
        jwt_token: Cookies.get("JWT_TOKEN"),
        token: Cookies.get("USER_ID"),
      },
    });
    setSocket(newSocket);
    setSocketChannels(newSocketChannels);

    return () => {
      newSocket.disconnect();
      newSocketChannels.disconnect();
    };
  }, []);

  // const getMessageSender = (id) => {
  //   if (friends) {
  //     let friend = friends?.friends.find((friend) => friend.id === id);
  //     return friend;
  //   }
  //   return user;
  // };

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
        console.log(data);
        getAllChats();
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socketChannels) {
      // console.log("loggggeeeeeeeeed");
      socketChannels.on("channelMessage", (data) => {
        console.log({ evenet: "channelMessage", data });
        getAllChats();
      });
      socketChannels.on("directMessage", (data) => {
        console.log({ evenet: "directMessage", data });
        // console.log(data);
        getAllChats();
      });
      socketChannels.on("leaveRoom", (data) => {
        // console.log(data);
        console.log({ evenet: "leaveRoom", data });
        getAllChats();
      });
      socketChannels.on("joinRoom", (data) => {
        // console.log(data);
        console.log({ evenet: "joinRoom", data });
        getAllChats();
      });
    }
  }, [socketChannels]);

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
        newChannel,
        exploreChannels,
        joinChannel,
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

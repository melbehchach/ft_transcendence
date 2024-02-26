"use client";
import { useEffect, useMemo, useState } from "react";
import Typography from "../../../components/Typography";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import ChatBody from "./components/ChatBody";
import ChatHeader from "./components/ChatHeader";
import ChatSideBar from "./components/ChatSideBar";
import ManageChatBar from "./components/ManageChatBar";
import UserCard from "../../../components/ProfileComponents/UserProfile/Card/UserCard";

const NoneSelected = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col">
      <Typography
        type="header"
        variant="primaryTitle"
        colorVariant="secondary"
        content="Select a message"
      />
      <Typography
        type="header"
        variant="secondaryTitle"
        colorVariant="secondary"
        content="Choose from your existing conversations, or start a new one."
      />
    </div>
  );
};

const Chat = () => {
  // const param = useParams();
  const [selectedChat, setSelectedChat] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [blocker, setBlocker] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const {
    sendMessage,
    getChannelByID,
    state: { allChats },
  } = useChat();
  const {
    fetchData,
    state: {
      friends: { friends },
      user,
      profile,
    },
  } = useAuth();
  const chat = useMemo(() => {
    return allChats.find((chat) => chat.id === selectedChat);
  }, [friends, selectedChat]);
  const headerInfo = useMemo(() => {
    if (selectedChat) {
      if (chat?.name) {
        return { name: chat.name, avatar: chat.image };
      } else {
        let friend = friends.find(
          (friend) =>
            friend.id ===
            (user.id !== chat.user2Id ? chat.user2Id : chat.user1Id)
        );
        if (!friend) {
          setSelectedChat("")
          return {}
        }
        return { name: friend.username, avatar: friend.avatar, id: friend.id };
      }
    }
    return null;
  }, [friends, selectedChat]);

  const [message, setMessage] = useState("");

  async function fetchChannelData() {
    getChannelByID(chat.id).then((res) => {
      let m;
      if ((m = res.mutedMembers.find((elem) => elem.userId === user.id))) {
        let currentTime = new Date();
        let givenTime = new Date(m.time);
        let timeDifference = currentTime - givenTime;
        let minutesPassed = timeDifference / (1000 * 60);
        setIsDisabled(minutesPassed < 5 ? true : false);
      }
    });
  }
  function submitMessage(e) {
    setMessage("");
    e.preventDefault();
    sendMessage(chat.name ? chat.id : headerInfo.id, message, chat.name);
  }

  useEffect(() => {
    // fetchData(user.id !== chat?.user2Id ? chat?.user2Id : chat.user1Id);
    if (user.blockedByUsers.find((elem) => elem.id === (user.id !== chat?.user2Id ? chat?.user2Id : chat.user1Id))) {
      setBlocked(true);
    }
    if (user.blockedUsers.find((elem) => elem.id === (user.id !== chat?.user2Id ? chat?.user2Id : chat.user1Id))) {
      setBlocker(true);
    }
    if (allChats.find((chat) => chat.id === selectedChat)?.name)
      fetchChannelData();
  }, [selectedChat, allChats]);
  const content = !selectedChat ? (
    <NoneSelected />
  ) : (
    <div className="w-3/4 grow">
      <ChatHeader headerInfo={headerInfo} chat={chat} />
      {/* <div className="flex"> */}
      <div className="flex">
        <div className="flex w-full flex-col">
          <ChatBody selectedChat={selectedChat} />
          <form
            onSubmit={submitMessage}
            className="w-full flex relative border-t border-black"
          >
            <input
              disabled={isDisabled}
              value={message}
              className="w-[80%] h-[60px] bg-transparent p-5"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="send message"
            ></input>
            <button type="submit" className="absolute inset-y-1/4 right-10">
              send
            </button>
          </form>
          {/* </div> */}
        </div>
        {chat.name ? (
          <div className=" h-full border-l border-black manage_bar-height min-w-[250px] ">
            <ManageChatBar chat={chat} />
          </div>
        ): (<div className="mt-[81px]"><UserCard setBlocker={setBlocker} setBlocked={setBlocked} id={(user.id !== chat?.user2Id ? chat?.user2Id : chat.user1Id)}/></div>)}
      </div>
    </div>
  );
  return (
    <>
      <div className="grow min-w-[300px] border-r border-black">
        <ChatSideBar
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </div>
      {content}
    </>
  );
};

export default Chat;

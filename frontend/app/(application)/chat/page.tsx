"use client";
import { useMemo, useState } from "react";
import Typography from "../../../components/Typography";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import ChatBody from "./components/ChatBody";
import ChatHeader from "./components/ChatHeader";
import ChatSideBar from "./components/ChatSideBar";

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
  const [selectedChat, setSelectedChat] = useState("");
  const {
    sendMessage,
    state: { allChats },
  } = useChat();
  const {
    state: {
      friends: { friends },
      user,
    },
  } = useAuth();
  const chat = useMemo(() => {
    return allChats.find((chat) => chat.id === selectedChat);
  }, [friends, selectedChat]);
  const friend = useMemo(() => {
    if (selectedChat)
      return friends.find(
        (friend) =>
          friend.id === (user.id !== chat.user2Id ? chat.user2Id : chat.user1Id)
      );
    return null;
  }, [friends, selectedChat]);

  const [message, setMessage] = useState("");

  function submitMessage(e) {
    setMessage("");
    e.preventDefault();
    sendMessage(friend.id, message);
  }

  const content = !selectedChat ? (
    <NoneSelected />
  ) : (
    <div className="w-3/4 grow">
      <ChatHeader friend={friend} />
      {/* <div className="flex"> */}
      <div className="flex w-full flex-col">
        <ChatBody selectedChat={selectedChat} />
        <form
          onSubmit={submitMessage}
          className="w-full flex relative border-t border-black"
        >
          <input
            value={message}
            className="w-full h-[60px] bg-transparent p-5"
            onChange={(e) => setMessage(e.target.value)}
            placeholder="send message"
          ></input>
          <button type="submit" className="absolute inset-y-1/4 right-10">
            send
          </button>
        </form>
        {/* </div> */}
        {/* <div className=" h-full border-l border-black main-height">
            <ManageChatBar />
          </div> */}
      </div>
    </div>
  );
  return (
    <>
      <div className="grow max-w-[320px] min-w-[250px] border-r-2 border-black">
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
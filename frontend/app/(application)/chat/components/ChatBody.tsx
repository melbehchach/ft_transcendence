"use client";
import { useEffect, useMemo, useRef } from "react";
import { useChat } from "../../../context/ChatContext";
import Message from "./Message";
import { useAuth } from "../../../context/AuthContext";

const ChatBody = ({ selectedChat }) => {
  const {
    state: { allChats },
  } = useChat();
  const { state : {user} } = useAuth()
  const containerRef = useRef(null);
  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  const messages = useMemo(() => {
    if (allChats) {
      let chat = allChats.find((chat) => chat.id === selectedChat);
      if (chat?.name) {
        let filtredMessages = chat.Messages
        if (user?.blockedByUsers && user.blockedByUsers.length !== 0)
        filtredMessages = filtredMessages.filter(message => !user?.blockedByUsers?.find((elem) => elem.id === message.senderId))
        if (user?.blockedUsers && user.blockedUsers.length !== 0)
        filtredMessages = filtredMessages.filter(message => !user?.blockedUsers?.find((elem) => elem.id === message.senderId))
        return filtredMessages
      }
      else return chat?.messages;
    }
    return [];
  }, [allChats, selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="grow p-8 flex flex-col gap-4 main-height"
    >
      {messages &&
        messages.map((message, key) => (
          <Message key={key} message={message} />
        ))}
    </div>
  );
};

export default ChatBody;

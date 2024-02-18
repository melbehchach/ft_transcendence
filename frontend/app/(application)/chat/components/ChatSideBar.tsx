"use client";
import clsx from "clsx";
import { memo, useEffect } from "react";
import UserAvatar from "../../../../components/UserAvatar";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import CreateNewChat from "./CreateNewChat";
import Search from "./Search";

const ChatSideBar = ({ selectedChat, setSelectedChat }) => {
  const {
    getAllChats,
    state: { allChats },
  } = useChat();
  const {
    state: {
      user,
      friends: { friends },
    },
  } = useAuth();
  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <div className="flex flex-col">
      <Search />
      <div className="flex flex-col gap-4 p-4 gap-4">
        {/* <ChatButton icon={faCompass} onClick={() => {}}>
        <Typography
        content="Explore Channels"
        type="header"
        variant="secondaryTitle"
        />
      </ChatButton> */}
        <CreateNewChat />
        {allChats.map((chat, index) => {
          let friend = friends.find(
            (friend) =>
              friend.id ===
              (user.id !== chat.user2Id ? chat.user2Id : chat.user1Id)
          );
          if (friend) {
            return (
              <button
                className={clsx({
                  "bg-textSecondary rounded-[10px] py-2":
                    selectedChat === chat.id,
                })}
                key={index}
                onClick={() => setSelectedChat(chat.id)}
              >
                <UserAvatar
                  key={index}
                  src={friend.avatar}
                  name={friend.username}
                />
              </button>
            );
          }
        })}
      </div>
    </div>
  );
};

export default memo(ChatSideBar);

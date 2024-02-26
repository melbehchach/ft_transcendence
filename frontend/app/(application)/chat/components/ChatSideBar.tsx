"use client";
import clsx from "clsx";
import { Dispatch, SetStateAction, memo, useEffect } from "react";
import UserAvatar from "../../../../components/UserAvatar";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import CreateNewChat from "./CreateNewChat";
import ExplorChannels from "./ExplorChannels";
import Search from "./Search";
import SearchBar from "../../../../components/ProfileComponents/Search/SearchBar";

const ChatSideBar = ({
  selectedChat,
  setSelectedChat,
}: {
  selectedChat: string;
  setSelectedChat: Dispatch<SetStateAction<string>>;
}) => {
  const {
    getAllChats,
    state: { allChats },
  } = useChat();
  const {
    state: {
      user,
      friends,
    },
  } = useAuth();

  useEffect(() => {
    getAllChats();
  }, []);

  return (
    <div className="flex flex-col side__bar--height w-[300px] max-w-[300px]">
      {/* <Search /> */}
      <SearchBar />
      <div className="flex flex-col gap-4 p-4">
        <ExplorChannels setSelectedChat={setSelectedChat} />
        {/* <ChatButton icon={faCompass} onClick={() => {}}>
        <Typography
        content="Explore Channels"
        type="header"
        variant="secondaryTitle"
        />
      </ChatButton> */}
        <CreateNewChat setSelectedChat={setSelectedChat} />
        {allChats.map((chat, index) => {
          if (chat.name) {
            return (
              <button
                className={clsx("py-2", {
                  "bg-textSecondary rounded-[10px]": selectedChat === chat.id,
                })}
                key={index}
                onClick={() => setSelectedChat(chat.id)}
              >
                <UserAvatar key={index} src={chat.image} name={chat.name} />
              </button>
            );
          } else if (friends?.friends && chat.user1Id) {
            let friend = friends?.friends.find(
              (friend) =>
                friend.id ===
                (user.id !== chat.user2Id ? chat.user2Id : chat.user1Id)
            );
            if (friend) {
              return (
                <button
                  className={clsx("py-2", {
                    "bg-textSecondary rounded-[10px]": selectedChat === chat.id,
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
          }
        })}
      </div>
    </div>
  );
};

export default memo(ChatSideBar);

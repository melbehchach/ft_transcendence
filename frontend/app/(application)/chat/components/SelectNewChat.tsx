import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import Typography from "../../../../components/Typography";
import UserAvatar from "../../../../components/UserAvatar";
import { useAuth } from "../../../context/AuthContext";
import { useChat } from "../../../context/ChatContext";
import Button from "./Button";

export const RowWrapper = ({ children }) => {
  return <div className="flex justify-between">{children}</div>;
};
const SelectNewChat = ({
  setStep,
  closeModal,
  setSelectedChat,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  closeModal: () => void;
  setSelectedChat: Dispatch<SetStateAction<string>>;
}) => {
  const {
    state: {
      user,
      friends: { friends },
    },
  } = useAuth();
  const {
    state: { allChats },
  } = useChat();

  const { newChat } = useChat();
  const selectChat = async (friend) => {
    try {
      await newChat(friend.id);
    } catch (e) {
    } finally {
      let chatID = allChats.find(
        (chat) =>
          (chat.user1Id === user.id && chat.user2Id === friend.id) ||
          (chat.user2Id === user.id && chat.user1Id === friend.id)
      ).id;
      setSelectedChat(chatID);
      closeModal();
    }
  };
  return (
    <>
      <RowWrapper>
        <div className="flex gap-4 items-center ml-[16px]">
          <div className="w-12 h-12 rounded-full border border-white flex justify-center items-center ">
            <FontAwesomeIcon className="w-8 h-8 text-white" icon={faPlus} />
          </div>
          <Typography
            type="paragraphe"
            variant="body"
            content="Add a channel"
          />
        </div>
        <Button
          content="Create"
          type="primary"
          onClick={() => {
            setStep(1);
          }}
        />
      </RowWrapper>
      {friends.map((friend, index) => {
        return (
          <RowWrapper key={index}>
            <UserAvatar src={friend.avatar} name={friend.username} />
            <Button content="Message" onClick={() => selectChat(friend)} />
          </RowWrapper>
        );
      })}
    </>
  );
};

export default SelectNewChat;

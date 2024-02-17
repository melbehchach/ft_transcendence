import UserAvatar from "../../../../components/UserAvatar";

const ChatHeader = ({ friend }) => {
  return (
    <div className="border-b border-black py-4 fixed w-full">
      <UserAvatar src={friend.avatar} name={friend.username} />
    </div>
  );
};

export default ChatHeader;

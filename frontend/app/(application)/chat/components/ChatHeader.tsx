import UserAvatar from "../../../../components/UserAvatar";

const ChatHeader = ({ headerInfo: { avatar, name } }) => {
  return (
    <div className="border-b border-black py-4 fixed w-full">
      <UserAvatar src={avatar} name={name} />
    </div>
  );
};

export default ChatHeader;

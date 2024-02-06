import Avatar from "../../Avatar/Avatar";
import Challenge from "./Challenge/Challenge";
import Message from "./Message/Message";
import { AvatarProps } from "../../types/Avatar.type";
import { useAuth } from "../../../../app/context/AuthContext";

const Friends = () => {
  const {
    state: { user },
  } = useAuth();

  const avatarObj: AvatarProps = {
    src: user.avatar,
    width: 100,
    height: 100,
    userName: user.username,
    imageStyle: "rounded-t-[15px] w-[15.9rem] h-[11rem] object-cover",
    fontSize: "text-base text-white",
    positiosn: true,
  };
  return (
    <div className="w-[16rem] h-full flex flex-col gap-3 border border-black border-solid border-b-1 rounded-[15px]">
      <div className="w-full flex justify-center items-center">
        <Avatar {...avatarObj} />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-3 mb-[0.5rem]">
        <div className="w-full h-full">
          <Challenge />
        </div>
        <div className="w-full h-full">
          <Message />
        </div>
      </div>
    </div>
  );
};

export default Friends;

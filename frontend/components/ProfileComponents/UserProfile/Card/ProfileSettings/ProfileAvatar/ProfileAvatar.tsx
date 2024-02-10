import { useAuth } from "../../../../../../app/context/AuthContext";
import Avatar from "../../../../Avatar/Avatar";
import { AvatarProps } from "../../../../types/Avatar.type";
import AddAvatarButton from "./AddAvatarButton";

function ProfileAvatar() {
  const {
    state: {
      user: { avatar },
    },
  } = useAuth();
  const avatarObj: AvatarProps = {
    src: avatar,
    width: 100,
    height: 100,
    userName: "",
    imageStyle: "w-[8rem] h-[8rem] rounded-full object-cover",
    fontSize: "text-2xl",
    positiosn: true,
  };
  return (
    <div className="relative w-fit flex flex-row">
      <Avatar avatarObj={avatarObj} />
      <button className="absolute bottom-0 right-0 mb-[1rem]">
        <AddAvatarButton />
      </button>
    </div>
  );
}

export default ProfileAvatar;

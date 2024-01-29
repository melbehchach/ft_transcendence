import React from "react";
import Avatar from "../../../../Avatar/Avatar";
import { AvatarProps, DataFetch } from "../../../../types/Avatar.type";
import AddAvatarButton from "./AddAvatarButton";

type profileAvatarProps = {
  data: DataFetch;
};

function ProfileAvatar({ data }: profileAvatarProps) {
  const avatarObj: AvatarProps = {
    src: data.avatar,
    width: 100,
    height: 100,
    userName: "",
    imageStyle: "w-[8rem] h-[8rem] rounded-full object-cover",
    fontSize: "text-2xl",
    positiosn: true,
  };
  return (
    <div className="relative w-fit flex flex-row">
      <Avatar {...avatarObj} />
      <button className="absolute bottom-0 right-0 mb-[1rem]">
        <AddAvatarButton />
      </button>
    </div>
  );
}

export default ProfileAvatar;

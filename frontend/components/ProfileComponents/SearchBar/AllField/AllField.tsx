import { use, useState } from "react";
import Avatar from "../../Avatar/Avatar";
import { AvatarProps } from "../../types/Avatar.type";
import { ProfileData } from "../../types/Avatar.type";
import NoImage from "../NoImage.svg";
import { useRouter } from "next/navigation";

type ModalSearch = {
  modalState: () => void;
  usersData: () => ProfileData[];
};

function AllField({ usersData, modalState }: ModalSearch) {
  const router = useRouter();
  const users: ProfileData[] = usersData();
  let avatarObj: AvatarProps = {
    src: "",
    userName: "",
    imageStyle: "w-full h-full rounded-full",
    fontSize: "left text-base",
    positiosn: false,
  };

  function handleClick(id: string) {
    // changeProfile();
    router.push(`/profile/${id}`);
    modalState();
  }

  // To prevenet errors of testing acounts in DB (bob...)
  function checkForAvatr(avatar: string): string {
    if (avatar.indexOf("/") === -1) return NoImage;
    return avatar;
  }

  return (
    <div className="w-full h-full text-white flex flex-col gap-[1rem]">
      {users.length > 0 ? (
        users.map((user) => (
          <div className="relative flex " key={user.id}>
            <div className="w-[4rem] ml-[1rem] ">
              <Avatar
                {...avatarObj}
                src={checkForAvatr(user.avatar)}
                userName={user.username}
              />
            </div>
            <button
              type="button"
              className="absolute right-0 w-[12rem] h-[2.5rem] rounded-[25px] flex justify-center items-center bg-[#D9923B] text-sm ml-[2rem] mt-[1rem]"
              onClick={() => handleClick(user.id)}
            >
              See profile
            </button>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

export default AllField;

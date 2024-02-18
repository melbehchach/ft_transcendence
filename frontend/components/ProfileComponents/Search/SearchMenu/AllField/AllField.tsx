import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../app/context/AuthContext";
import Avatar from "../../../Avatar/Avatar";
import NoImage from "../../NoImage.svg";
// import NoImage from "../NoImage.svg";
import { AvatarProps, ProfileData } from "../../../types/Avatar.type";
// import NoImage from "../NoImage.svg"

type ModalSearch = {
  usersData: () => ProfileData[];
};

function AllField({ usersData }: ModalSearch) {
  const router = useRouter();
  const users: ProfileData[] = usersData();

  const {
    state: { user },
  } = useAuth();

  let avatarObj: AvatarProps = {
    src: "",
    userName: "",
    imageStyle: "rounded-full",
    fontSize: "text-base",
    positiosn: false,
  };

  function handleClick(id: string) {
    if (user.id != id) router.push(`/profile/${id}`);
  }

  // To prevenet errors of testing acounts in DB (bob...)
  function checkForAvatr(avatar: string): string {
    if (avatar.indexOf("/") === -1) {
      return NoImage;
    }
    return avatar;
  }

  return (
    <div className="w-full text-white flex flex-col gap-[1.5rem]">
      {users.length > 0 ? (
        users.map((user) => (
          <div className="relative flex " key={user.id}>
            <div className="w-[4rem]">
              <Avatar
                avatarObj={{
                  ...avatarObj,
                  src: checkForAvatr(user.avatar),
                  userName: user.username,
                }}
              />
            </div>
            <button
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

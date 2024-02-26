import { useRouter } from "next/navigation";
import { useAuth } from "../../../../../app/context/AuthContext";
import Avatar from "../../../Avatar/Avatar";
import NoImage from "../../NoImage.svg";
// import NoImage from "../NoImage.svg";
import { AvatarProps, ProfileData } from "../../../types/Avatar.type";
import { useChat } from "../../../../../app/context/ChatContext";
// import NoImage from "../NoImage.svg"

type ModalSearch = {
  usersData: any;
};

function AllField({ usersData }: ModalSearch) {
  const router = useRouter();
  const all: any = usersData();

  // const {
  //   state: { user },
  // } = useAuth();

  let avatarObj: AvatarProps = {
    src: "",
    userName: "",
    imageStyle: "w-[4rem] h-[4rem] rounded-full",
    fontSize: "text-base",
    positiosn: false,
    statos: false,
  };

  const {
    setSelectedChat,
    getChannelByID,
    state: { allChats },
  } = useChat();
  function handleClickCahnnels(id: string) {
    console.log("id", id);
    console.log("allChats", allChats);
    getChannelByID(id).then((res) => {
      console.log("res", res);
      // setChannel(res);
    });;
    if (allChats.find((chat) => chat.id === id)) {
      router.push(`/chat`);
      setSelectedChat(id);
    }
  }

  function handleClick(id: string) {
    if (all.id != id) router.push(`/profile/${id}`);
  }


  // To prevenet errors of testing acounts in DB (bob...)
  function checkForAvatr(avatar: string): string {
    if (avatar.indexOf("/") === -1) {
      return NoImage;
    }
    return avatar;
  }

  return (
    <div className="w-full text-white relative flex flex-col gap-[1.5rem]">
      {all.users?.length > 0 &&
        all.users.map((user) => (
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
        ))}
      {all.channels?.length > 0 &&
        all.channels.map((channel) => (
          <div
            className="w-fit h-fit flex flex-row items-center"
            key={channel.id}
          >
            <Avatar
              avatarObj={{
                ...avatarObj,
                src: checkForAvatr(channel.image),
                userName: channel.name,
              }}
            />
            <div className="absolute right-0">
              <button
                type="button"
                className=" w-[12rem] h-[2.5rem] rounded-[25px] flex justify-center items-center bg-[#D9923B] text-sm"
                onClick={() => handleClickCahnnels(channel.id)}
              >
                Go to Channel
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default AllField;

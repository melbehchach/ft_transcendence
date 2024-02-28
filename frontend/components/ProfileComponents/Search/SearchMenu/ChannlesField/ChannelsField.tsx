import { useRouter } from "next/navigation";
import { AvatarProps, ProfileData } from "../../../types/Avatar.type";
import Avatar from "../../../Avatar/Avatar";

type props = {
  usersData: any;
};

function ChannelsField({ usersData }: props) {
  const router = useRouter();
  const channels: any = usersData();
  // @ts-ignore
  let avatarObj: AvatarProps = {
    src: "",
    userName: "",
    imageStyle: "w-[4rem] h-[4rem] rounded-full",
    fontSize: "text-base",
    positiosn: false,
  };

  function handleClick(id: string) {
    router.push(`/chat`);
  }

  // To prevenet errors of testing acounts in DB (bob...)
  function checkForAvatr(avatar: string): string {
    if (avatar?.indexOf("/") === -1) {
      return "";
    }
    return avatar;
  }

  return (
    <div className="w-full text-white relative flex flex-col gap-[1.5rem]">
      {channels.length > 0 ? (
        channels.map((channel) => (
          <div
            className="w-fit h-fit  flex flex-row items-center"
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
                onClick={() => handleClick(channel.id)}
              >
                Go to Channel
              </button>
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
}

export default ChannelsField;

import { useEffect, useState, memo, useMemo } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import Avatar from "../../Avatar/Avatar";
import { AvatarProps } from "../../types/Avatar.type";
import Achievements from "./Infos/Achievements/UserAchievements";
import Scores from "./Infos/Scores/Scores";
import FriendshipState from "./Infos/UserInfos/FriendshipSatate/FriendshipState";
import { useParams } from "next/navigation";
import { useChat } from "../../../../app/context/ChatContext";

type props = {
  setBlocker: any;
  setBlocked: any;
  id?: string;
};

function UserCard({ setBlocker, setBlocked, id }: props) {
  const {
    fetchData,
    state: { profile, user },
  } = useAuth();
  const [p, setP] = useState(null)
  const param = useParams();

  function idShot() {
    if (!id) return param.id;
    return id;
  }
  const { state: { allChats }, selectedChat } = useChat()

  const idd = useMemo(() => {

    // console.log({ chat: allChats.find(elem => elem.id === selectedChat), selectedChat })
    const chat = allChats.find((elem) => elem.id === selectedChat)
    return user.id !== chat?.user2Id ? chat?.user2Id : chat.user1Id
  }, [allChats, selectedChat])
  async function t() {
    fetchData(param.id ? param.id : idd, true).then((res) => setP(res))
  }
  useEffect(() => {
    t()
    // console.log({ idd })
  }, [idd])
  if (!p) return;
  return (
    <div className="w-[25rem] h-full p-[0.5rem]  gap-[1rem] text-white flex flex-col border border-black border-solid rounded-[15px]">
      <div className="w-full flex justify-center items-center">

        <Avatar
          avatarObj={{
            src: p.avatar,
            width: 100,
            height: 100,
            userName: p.username,
            imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
            fontSize: "text-2xl font-bold",
            positiosn: true,
            existStatos: true,
            statos: p.status,
          }}
        />
      </div>

      <FriendshipState
        setBlocker={setBlocker}
        setBlocked={setBlocked}
        id={param.id ? param.id : idd}
      />
      <Scores />
      <Achievements />
    </div>
  );
}

export default memo(UserCard);

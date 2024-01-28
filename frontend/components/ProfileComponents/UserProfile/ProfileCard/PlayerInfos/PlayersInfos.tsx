import Achievements from "./Achievements/Achievements";
import Scores from "./Scores/Scores";
import Avatar from "../../../Avatar/Avatar";
import achievementsData from "./Achievements/AchievementsData";
import fakeData from "./Scores/RecordsData";
import { AvatarProps } from "../../../types/Avatar.type";
import { DataFetch } from "../../../types/Avatar.type";

function PlayersInfos(data: DataFetch) {
  const avatarObj: AvatarProps = {
    src: data.avatar,
    width: 100,
    height: 100,
    userName: data.username,
    imageStyle: "w-[14rem] h-[14rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
  }
  
  return (
    <div className="flex flex-col justify-center items-center gap-[1rem] mt-[2rem]">
      <div className="w-full flex justify-center items-center">
        <Avatar {...avatarObj}/>
      </div>

      <div className="w-11/12 h-[4rem] rounded-[5px] border border-black border-solid border-1 flex justify-center ">
        <Scores myScoresArray={fakeData} />
      </div>
      <div className="w-11/12 h-[25rem]  mb-[1rem] flex justify-start rounded-[5px] overflow-auto border border-black border-solid border-1">
        <Achievements achievementsArray={achievementsData} />
      </div>
    </div>
  );
}

export default PlayersInfos;

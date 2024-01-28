import Achievements from "./Achievements/Achievements";
import Scores from "./Scores/Scores";
import Avatar from "../../../Avatar/Avatar";
import achievementsData from "./Achievements/AchievementsData";
import fakeData from "./Scores/RecordsData";
import { AvatarProps, SearchDataFetch } from "../../../types/Avatar.type";
import { DataFetch } from "../../../types/Avatar.type";

type profileCardProps = {
  data: DataFetch,
}

function PlayersInfos({data}: profileCardProps) {
  const avatarObj: AvatarProps = {
    src: data.avatar,
    width: 100,
    height: 100,
    userName: data.username,
    imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-[1rem]">
      <div className="w-full flex justify-center items-center">
        <Avatar {...avatarObj} />
      </div>
      <Scores myScoresArray={fakeData} />
      <Achievements achievementsArray={achievementsData} />
    </div>
  );
}

export default PlayersInfos;

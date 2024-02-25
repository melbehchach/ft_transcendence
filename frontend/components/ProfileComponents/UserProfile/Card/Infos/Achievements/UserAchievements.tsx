import Image from "next/image";
import { AchievementsProps, achievementsObj } from "./Achievements.types";

const UserAchievements = ({ achievementsArray }: AchievementsProps) => {
  const array: achievementsObj[] = achievementsArray.filter(
    (achievements) => achievements.state
  );

  const getIcon = (Icon: any) => {
    return <Icon className="w-10 h-10" />;
  };

  return (
    <div className="w-full h-full flex justify-start flex-col gap-3 rounded-[5px] overflow-auto border border-black border-solid">
      <h3 className="text-xl font-inter font-bold ml-3 mt-3">Achievements</h3>
      <ul className="flex flex-col ml-4 gap-4">
        {array.map((array) => (
          <li className="flex gap-2" key={array.id}>
            {getIcon(array.Icon)}
            <div className="flex flex-col">
              <p className="text-lg">{array.type}</p>
              <p className="text-sm text-gray-500">{array.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserAchievements;

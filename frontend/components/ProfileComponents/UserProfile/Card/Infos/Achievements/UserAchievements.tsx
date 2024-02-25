import { useAuth } from "../../../../../../app/context/AuthContext";
import Freshman from "./svgs/Freshman";
import Snowden from "./svgs/Snowden";
import newHero from "./svgs/newHero";
import Rak3ajbni from "./svgs/Rak3ajbni";
import Lion from "./svgs/Lion";
import Lkherraz from "./svgs/Lkherraz";
import getALife from "./svgs/getALife";

const UserAchievements = () => {
  const {
    state: { achievements },
  } = useAuth();

  const achievementsData = [
    {
      id: 1,
      state: achievements?.freshman,
      type: "Freshman",
      description: "Created Account",
      Icon: Freshman,
    },
    {
      id: 2,
      state: achievements?.snowdedn,
      type: "Snowden",
      description: "Enable 2FA",
      Icon: Snowden,
    },
    {
      id: 3,
      state: achievements?.NewHero,
      type: "New hero in town",
      description: "Won a game",
      Icon: newHero,
    },
    {
      id: 4,
      state: achievements?.Rak3ajbni,
      type: "Rak 3ajbni",
      description: "Won 3 games on a row",
      Icon: Rak3ajbni,
    },
    {
      id: 5,
      state: achievements?.Sbe3,
      type: "sbe3",
      description: "Won 10 games",
      Icon: Lion,
    },
    {
      id: 6,
      state: achievements?.a9wedPonger,
      type: "L'kherraz",
      description: "Won 50 games",
      Icon: Lkherraz,
    },
    {
      id: 7,
      state: achievements?.GetAlifeBro,
      type: "Get a life bro",
      description: "Won 100 games",
      Icon: getALife,
    },
  ];

  const getIcon = (Icon: any) => {
    return <Icon className="w-10 h-10" />;
  };

  return (
    <div className="w-full h-full flex justify-start flex-col gap-3 rounded-[5px] overflow-auto border border-black border-solid">
      <h3 className="text-xl font-inter font-bold ml-3 mt-3">Achievements</h3>
      <ul className="flex flex-col ml-4 gap-4">
        {achievementsData.map((array) => (
          <li
            className={!array.state ? "flex gap-2 opacity-25" : "flex gap-2"}
            key={array.id}
          >
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

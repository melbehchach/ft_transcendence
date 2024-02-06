import { useParams } from "next/navigation";
import { useAuth } from "../../../../../app/context/AuthContext";
import Avatar from "../../../Avatar/Avatar";
import { AvatarProps, DataFetch } from "../../../types/Avatar.type";
import Achievements from "./Achievements/Achievements";
import achievementsData from "./Achievements/AchievementsData";
import fakeData from "./Scores/RecordsData";
import Scores from "./Scores/Scores";
import axios from "axios";
import Cookies from "js-cookie";

function PlayersInfos({ avatar, username }) {
  const params = useParams();
  const avatarObj: AvatarProps = {
    src: avatar,
    width: 100,
    height: 100,
    userName: username,
    imageStyle: "w-[13rem] h-[13rem] rounded-full object-cover",
    fontSize: "text-2xl font-bold",
    positiosn: true,
  };
  async function postData() {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.post(
          "http://localhost:3000/user/sendRequest",
          { receiverId: params.id },
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  function addFriend() {
    postData();
    console.log(params.id);
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-[1rem]">
      <div className="w-full flex justify-center items-center">
        <Avatar avatarObj={avatarObj} />
      </div>
      <div className="w-fit h-fit flex justify-center ">
        <button
          className="border border-black rounded-[15px] text-white"
          onClick={addFriend}
        >
          Add friend
        </button>
      </div>
      <Scores myScoresArray={fakeData} />
      <Achievements achievementsArray={achievementsData} />
    </div>
  );
}

export default PlayersInfos;

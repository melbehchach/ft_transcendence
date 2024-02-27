import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../app/context/AuthContext";
import { AvatarProps } from "../../types/Avatar.type";
import Avatar from "../../Avatar/Avatar";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams, usePathname } from "next/navigation";

type Props = {
  player: any;
};

function ProfileRecentGames({ player }: Props) {
  const param = useParams();
  const [loading, setLoading] = useState(true);
  const [avatarObj2, setAvatarObj2] = useState<AvatarProps | null>(null);

  const calculateTime = () => {
    let playMatch = new Date(player.createdAt);
    let currentTime = new Date();
    let timeDifference = currentTime.getTime() - playMatch.getTime();
    let secondsPassed = Math.floor(timeDifference / 1000);
    var minutesPassed = Math.floor(secondsPassed / 60);
    let hoursPassed = Math.floor(minutesPassed / 60);
    if (minutesPassed > 60) return hoursPassed + " hour ago";
    return minutesPassed + " minute ago";
  };

  const {
    state: { user, profile },
  } = useAuth();

  const fetchOpponentData = async (id: string) => {
    const jwt_token = Cookies.get("JWT_TOKEN");
    try {
      if (jwt_token) {
        const response = await axios.get(
          `http://localhost:3000/user/${id}/profile`,
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        // @ts-ignore
        setAvatarObj2({
          src: response.data.avatar,
          width: 100,
          height: 100,
          userName: response.data.username,
          imageStyle: "w-[4rem] h-[4rem] rounded-full object-cover",
          fontSize: "text-sm",
          positiosn: true,
        });
        setLoading(false);
      } else {
        throw new Error("JWT_TOKEN not found");
      }
    } catch (error) {
      console.error("Error fetching opponent data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (param.id === player.opponentId) {
      fetchOpponentData(player.playerId);
    } else {
      fetchOpponentData(player.opponentId);
    }
  }, [player.opponentId, player.playerId]);

  const avatarObj: AvatarProps = {
    src: profile.avatar,
    width: 100,
    height: 100,
    userName: profile.username,
    imageStyle: "w-[4rem] h-[4rem] rounded-full object-cover",
    fontSize: "text-sm",
    positiosn: true,
    existStatos: false,
  };

  return (
    <>
      {!loading && (
        <div
          className={
            (profile.id === player.playerId &&
              player.playerScore > player.opponentScore) ||
            (profile.id === player.opponentId &&
              player.opponentScore > player.playerScore)
              ? "w-[16rem] h-[9rem] rounded-[15px] flex items-center flex-col gap-[0.5rem] border border-green-500"
              : "w-[16rem] h-[9rem] rounded-[15px] flex items-center flex-col gap-[0.5rem] border border-red-500"
          }
        >
          <div className="flex justify-start items-center text-white mt-[0.5rem]">
            <h2>{calculateTime()}</h2>
          </div>
          <div className="flex justify-center items-center w-full gap-[2rem]">
            <div className="flex justify-center items-center mb-[1.5rem] gap-[0.5rem] text-white">
              <Avatar avatarObj={avatarObj} />
              <p className="mt-[-1.2rem]">
                {param.id === player.playerId
                  ? player.playerScore
                  : player.opponentScore}
              </p>
            </div>
            <div className="flex flex-row-reverse items-center mb-[1.5rem] gap-[0.5rem] text-white">
              {avatarObj2 && <Avatar avatarObj={avatarObj2} />}
              <p className="mt-[-1.2rem]">
                {param.id === player.playerId
                  ? player.opponentScore
                  : player.playerScore}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProfileRecentGames;

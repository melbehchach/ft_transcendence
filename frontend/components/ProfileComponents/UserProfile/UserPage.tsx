import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "../../../app/context/AuthContext";
import UserCard from "./Card/UserCard";
import RecentGames from "./RecentGames/RecentGames";
import Friends from "./Friends/ProfileFriends";
import ProfileFriends from "./Friends/ProfileFriends";
import { useParams } from "next/navigation";

type props = {
  blocker: any;
  blocked: any;
  setBlocker: any;
  setBlocked: any;
};

function UserPage() {
  const param = useParams();
  const [blocker, setBlocker] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const {
    fetchData,
    state: { profile, user },
  } = useAuth();

  useEffect(() => {
    fetchData(param.id);
    if (user.blockedByUsers.find((elem) => elem.id === profile.id)) {
      setBlocked(true);
    }
    if (user.blockedUsers.find((elem) => elem.id === profile.id)) {
      setBlocker(true);
    }
  }, []);

  return (
    <div className="w-screen h-full flex gap-[1.5rem] p-[1rem]">
      <UserCard setBlocker={setBlocker} setBlocked={setBlocked} />
      {blocked ? (
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-3xl text-gray-600">
            {profile.username} blocked you
          </h1>
          <h3 className="text-lg text-gray-600">
            You can’t challenge them, see their game history or chat with them
          </h3>
        </div>
      ) : blocker ? (
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-3xl text-gray-600">
            You have blocked {profile.username}
          </h1>
          <h3 className="text-lg text-gray-600">
            Unblock them in order to challenge them, see their game history and
            chat with them
          </h3>
        </div>
      ) : (
        <div className="w-screen h-full">
          <div className="w-full h-[14rem] flex flex-col gap-[1rem]">
            <h1 className="w-screen h-fit border-b border-gray-500 text-white font-semibold text-3xl">
              Recent Games
            </h1>
            <div className="w-full">
              {/* <Swiper spaceBetween={10} slidesPerView={3}>
              {db.map((item, index) => (
                <SwiperSlide className="!w-fit" key={index}>
                  <RecentGames />
                </SwiperSlide>
              ))}
            </Swiper> */}
            </div>
          </div>
          <div className="w-full h-[25rem] flex flex-col gap-[1rem]">
            <div className="w-screen h-fit flex gap-[2rem] text-white font-semibold text-3xl border-b border-gray-500">
              <p>Friends</p>
            </div>
            {profile?.friends && (
              <div className="h-full gap-[1rem] z-0">
                <Swiper spaceBetween={10} slidesPerView={3} >
                  {profile?.friends.map((item, index) => (
                    <SwiperSlide className="!w-fit !h-full" key={index}>
                      {item.id != user.id && <ProfileFriends item={item} />}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;

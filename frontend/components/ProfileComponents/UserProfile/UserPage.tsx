import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "../../../app/context/AuthContext";
import UserCard from "./Card/UserCard";
import RecentGames from "./RecentGames/RecentGames";
import Friends from "./Friends/Friends";

function UserPage() {
  const {
    state: { profile },
  } = useAuth();

  return (
    <div className="w-screen h-screen flex gap-[1.5rem] p-[1rem]">
      <UserCard />
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
              <Swiper spaceBetween={10} slidesPerView={3}>
                {profile?.friends.map((item, index) => (
                  <SwiperSlide className="!w-fit" key={index}>
                    <Friends item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;

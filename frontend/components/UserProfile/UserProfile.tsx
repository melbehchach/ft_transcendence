import React from "react";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import RecentGames from "./RecentGames/RecentGames";
import ProfileCard from "./ProfileCard/ProfileCard";
import Friends from "./Friends/Friends";
import FriendsRequest from "./FriendsRequest/FriendsRequest";
import db from "../../Dummydata/db.json";

function UserProfile({}) {
  const [friends, setFriends] = useState<boolean>(true);
  const [friendsRq, setFriendsRq] = useState<boolean>(false);

  function handleFriendsClick() {
    setFriends(true);
    setFriendsRq(false);
  }

  function handleFriendsrR() {
    setFriendsRq(true);
    setFriends(false);
  }

  return (
    <div className="flex gap-[1rem] ml-[-1rem] ">
      <div>
        <ProfileCard />
      </div>
      <div className="w-full h-full gap-[3rem]">
        <div className="w-full h-[14rem] mt-[2rem] flex flex-col gap-[1rem] ">
          <div className="w-full h-fit border-b border-gray-500 border-solid border-1 mt-[0.5rem] text-white font-semibold text-3xl">
            <h1>Recent Games</h1>
          </div>
          <div className="w-full ">
            <Swiper spaceBetween={10} slidesPerView={4}>
              {db.map((item, index) => (
                <SwiperSlide className="!w-fit" key={index}>
                  <RecentGames />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="w-full h-[25rem] flex flex-col gap-[1rem]">
          <div className="flex gap-[2rem] mt-[1rem] text-white font-semibold text-3xl border-b border-gray-500 border-solid border-1">
            <div className="w-fit h-fit">
              <button type="button" onClick={handleFriendsClick}>
                Friends
              </button>
            </div>
            <div className="w-fit h-fit">
              <button type="button" onClick={handleFriendsrR}>
                Friends Requets
              </button>
            </div>
          </div>
          <div className="w-full h-full">
            {friends && (
              <div className="h-full gap-[1rem]">
                <Swiper spaceBetween={10} slidesPerView={4}>
                  {db.map((item, index) => (
                    <SwiperSlide className="!w-fit" key={index}>
                      <Friends />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
            {friendsRq && (
              <div className="h-full ">
                <Swiper spaceBetween={10} slidesPerView={4}>
                  {db.map((item, index) => (
                    <SwiperSlide className="!w-fit">
                      <FriendsRequest />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import OtherProfileCard from "./OtherProfileCard/OtherProfileCard";
import OtherFriends from "./OtherFriends/OtherFriends";
import RecentGames from "./RecentGames/RecentGames";
import db from "../../Dummydata/db.json";

function OtherProfile() {
  return (
    <div className="flex gap-[1rem] ml-[-1rem] ">
      <div>
        <OtherProfileCard />
      </div>
      <div className="w-full h-full gap-[3rem]">
        <div className="w-full h-[14rem] mt-[1rem] flex flex-col gap-[1rem] ">
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
              <button type="button">Friends</button>
            </div>
          </div>
          <div className="w-full h-full">
            <div className="h-full gap-[1rem]">
              <Swiper spaceBetween={10} slidesPerView={4}>
                {db.map((item, index) => (
                  <SwiperSlide className="!w-fit" key={index}>
                    <OtherFriends />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;

"use client";
import ProfileCard from "../../../components/ProfileCard/ProfileCard";
import RecentGames from "../../../components/RecentGames/RecentGames";
import { Swiper, SwiperSlide } from "swiper/react";
import db from "../../../Dummydata/db.json";
import "swiper/css";
import SearchBar from "../../../components/SearchBar/SearchBar";
import NotificationBar from "../../../components/NotificationBar/NotificationBar";
import Friends from "../../../components/Friends/Friends";
import { useState } from "react";
import FriendsRequest from "../../../components/FriendsRequest/FriendsRequest";

export default function ProfilePage() {
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
    <main className="w-screen h-screen bg-background flex flex-col overflow-x-hidden">
      <div className="w-full h-[6rem] flex justify-center items-center gap-[1rem] border border-black border-solid border-1">
        <SearchBar />
        <NotificationBar />
      </div>
      <div className="w-full h-full flex flex-row gap-3">
        <div>
          <ProfileCard />
        </div>
        <div className="w-full h-full gap-[3rem]">
          <div className="w-full h-[14rem] mt-[2rem] flex flex-col gap-[1rem] ">
            <div className="w-11/12 h-fit border-b border-gray-500 border-solid border-1 mt-[0.5rem] text-white font-semibold text-3xl">
              <h1>Recent Games</h1>
            </div>
            <div className="w-11/12 ">
              <Swiper spaceBetween={10} slidesPerView={4}>
                {db.map((item, index) => (
                  <SwiperSlide className="!w-fit">
                    <RecentGames />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="w-full h-[25rem] flex flex-col gap-[1rem] border-2 border-black">
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
                      <SwiperSlide className="!w-fit">
                        <Friends />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
              {friendsRq && (
                <div className="h-full gap-[1rem]">
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
    </main>
  );
}

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProfileCard from "./ProfileCard/ProfileCard";
import axios from "axios";
import Cookies from "js-cookie";
import { DataFetch } from "../types/Avatar.type";

type userProps = {
  data: DataFetch;
}

function UserProfile({data}: userProps) {

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
    <div className="flex sm:flex-row flex-col gap-[1rem]">
      <div className="sm:w-[20rem] sm:h-[53rem] h-fit ">
        <ProfileCard {...data} />
      </div>
      <div className="w-[20rem] sm:w-full sm:w-screen h-fit ">
        <div className="w-full h-[14rem] mt-[2rem] flex flex-col gap-[1rem]  ">
          <div className="w-full h-fit sm:border-b border-gray-500 mt-[0.5rem] text-white font-semibold text-3xl">
            <h1>Recent Games</h1>
          </div>
          <div className="w-full ">
            <Swiper spaceBetween={10} slidesPerView={3}>
              {/* {db.map((item, index) => (
                <SwiperSlide className="!w-fit" key={index}>
                  <RecentGames />
                </SwiperSlide>
              ))} */}
            </Swiper>
          </div>
        </div>
        <div className="w-full h-[25rem] flex flex-col gap-[1rem]">
          <div className="flex gap-[2rem] mt-[1rem] text-white font-semibold text-3xl sm:border-b border-gray-500  ">
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
                <Swiper spaceBetween={10} slidesPerView={3}>
                  {/* {db.map((item, index) => (
                    <SwiperSlide className="!w-fit" key={index}>
                      <Friends />
                    </SwiperSlide>
                  ))} */}
                </Swiper>
              </div>
            )}
            {friendsRq && (
              <div className="h-full">
                <Swiper spaceBetween={10} slidesPerView={4}>
                  {/* {db.map((item, index) => (
                    <SwiperSlide className="!w-fit" key={index}>
                      <FriendsRequest />
                    </SwiperSlide>
                  ))} */}
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

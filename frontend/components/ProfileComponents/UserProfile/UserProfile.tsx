import axios from "axios";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ProfileCard from "./ProfileCard/ProfileCard";
import { DataFetch } from "../types/Avatar.type";

type userProps = {
  data: DataFetch;
};

function UserProfile({ data }: userProps) {
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
  let color: string = "border-gray-500";
  return (
    <div className="w-screen h-screen flex gap-[1.5rem] p-[1rem]">
      <ProfileCard {...data} />
      <div className="w-screen h-full">
        <div className="w-full h-[14rem] flex flex-col gap-[1rem]">
          <h1 className="w-screen h-fit border-b border-gray-500 text-white font-semibold text-3xl">
            Recent Games
          </h1>
          <div className="w-full">
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
          <div
            className={
              "w-screen h-fit flex gap-[2rem] text-white font-semibold text-3xl border-b border-gray-500"
            }
          >
            <button onClick={handleFriendsClick}>Friends</button>
            <button onClick={handleFriendsrR}>Friends Requets</button>
          </div>
          {/* <div className="w-full h-full"> */}
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
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

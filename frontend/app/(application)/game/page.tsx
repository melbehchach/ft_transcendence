"use client"
import HeaderTitle from "@/../../components/Game/Dashboad/headerTitle";
import FriendMode from "../../../components/Game/Dashboad/friendMode";
import RandomMode from "../../../components/Game/Dashboad/randomMode";
import DashboadImage from "../../../components/Game/Dashboad/Images/dashboardImage";

export default function GamePage() {
  
  return (
    <>
      <div className="bg-background 2xl:flex 2xl:justify-center 2xl:items-center h-fit w-full 2xl:h-full 2xl:flex-1 2xl:gap-20">
        <div className="2xl:flex 2xl:flex-col 2xl:justify-between">
          <HeaderTitle />
          <div className="2xl:flex flex justify-center items-center 2xl:justify-around 2xl:items-center 2xl:mt-16">
            <FriendMode />
            <RandomMode />
          </div>
        </div>
        <DashboadImage />
      </div>
    </>
  );
}
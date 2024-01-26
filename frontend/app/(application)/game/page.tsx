"use client";
import HeaderTitle from "@/../../components/Game/Dashboad/headerTitle";
import FriendMode from "../../../components/Game/Dashboad/friendMode";
import RandomMode from "../../../components/Game/Dashboad/randomMode";
import DashboadImage from "../../../components/Game/Dashboad/Images/dashboardImage";

export default function GamePage() {
  return (
    <>
      <section className="bg-background h-full w-full sm:p-2 lg:flex lg:w-screen lg:h-screen lg:justify-center lg:items-center lg:space-y-5 lg:gap-10">
        <div className="flex flex-col justify-center items-center py-5 space-y-5">
          <HeaderTitle />
          <div className="space-y-5 sm:space-y-0 sm:flex sm:justify-around sm:items-center h-full w-full ">
            <FriendMode />
            <RandomMode />
          </div>
        </div>
          <DashboadImage />
      </section>
    </>
  ); 
}

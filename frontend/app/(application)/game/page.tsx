"use client";
import HeaderTitle from "@/../../components/Game/Dashboad/headerTitle";
import FriendMode from "../../../components/Game/Dashboad/friendMode";
import RandomMode from "../../../components/Game/Dashboad/randomMode";
import DashboadImage from "../../../components/Game/Dashboad/Images/dashboardImage";

export default function GamePage() {
  return (
    <>
      <section className=" bg-background flex flex-col items-center justify-center h-screeen w-screen">
        <div className="lg:flex lg:items-center lg:justify-around border-2 border-red-500 lg:w-full">
          <div className="xl:flex xl:justify-center xl:flex-col ">
            <HeaderTitle />
            <div className="xl:flex md:flex xl:justify-around xl:items-center xl:p-16">
              <FriendMode />
              <RandomMode />
            </div>
          </div>
          <DashboadImage />
        </div>
      </section>
    </>
  );
}

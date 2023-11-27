import RandomMatch from "../../../../components/Game/RandomGame";
import ScoreBoard from "../../../../components/Game/scoreBoard";

export default function RandomMatchPage() {
  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen justify-center ">
        <ScoreBoard />
        <RandomMatch />
      </div>
    </>
  );
}

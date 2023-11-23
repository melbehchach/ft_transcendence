import LeaderBoard from "../../../components/Game/leaderBoard";

const GamePage: React.FC = () => {
  return (
    <>
      <div className="pl-[10%] bg-background h-screen w-screen flex flex-col	items-center justify-center">
        <LeaderBoard />
      </div>
    </>
  )
}

export default GamePage;

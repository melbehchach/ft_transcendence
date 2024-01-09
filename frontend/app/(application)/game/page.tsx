import LeaderBoard from "../../../components/Game/leaderBoard";

const GamePage: React.FC = () => {
  return (
    <>
      <div className="w-screen h-screen  bg-background flex flex-col items-center justify-center">
        <LeaderBoard />
      </div>
    </>
  )
}

export default GamePage;

import Avatar from "../Avatar/Avatar";
import BorderCards from "../BorderCards/BorderCards";

const RecentGames = () => {
  return (
    <div className="w-[16rem] h-[9rem] border border-green-500 rounded-[15px] flex items-center flex-col gap-[0.5rem]">
      <div className="flex justify-start items-center text-white mt-[0.5rem]">
        <h2>1 hour ago</h2>
      </div>
      <div className="flex justify-center items-center w-full gap-[2rem]">
        <div className="flex justify-center items-center mb-[1.5rem] gap-[0.5rem] text-white">
          <Avatar
            src="https://images.unsplash.com/photo-1559624989-7b9303bd9792?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width={100}
            height={100}
            userName="mel-behc"
            imageStyle="rounded-full w-[3rem] h-[3rem]"
            fontSize="text-base"
          />
          <p className="mt-[-1.2rem]">9</p>
        </div>
        <div className="flex flex-row-reverse items-center mb-[1.5rem] gap-[0.5rem] text-white">
          <Avatar
            src="https://images.unsplash.com/photo-1559624989-7b9303bd9792?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width={100}
            height={100}
            userName="mel-behc"
            imageStyle="rounded-full w-[3rem] h-[3rem]"
            fontSize="text-base"
          />
          <p className="mt-[-1.2rem]">9</p>
        </div>
      </div>
    </div>
  );
};

export default RecentGames;

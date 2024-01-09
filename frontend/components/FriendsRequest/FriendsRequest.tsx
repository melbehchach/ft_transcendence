import Avatar from "../Avatar/Avatar";
import Accept from "./Accept/Accept";
import Delete from "./Delete/Delete";

const FriendsRequest = () => {
  return (
    <div className="w-[16rem] h-full flex flex-col gap-3 border border-black border-solid border-b-1 rounded-[15px]">
      <div className="w-full flex justify-center items-center">
        <Avatar
          src="https://images.unsplash.com/photo-1579176647030-bd86f6fd4e1e?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          width={100}
          height={100}
          userName="mel-behc"
          imageStyle="rounded-t-[15px] w-[15.9rem] h-[11rem] object-cover"
          fontSize="text-base text-white"
        />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-3 mb-[0.5rem]">
        <div className="w-full h-full">
          <Accept />
        </div>
        <div className="w-full h-full">
          <Delete />
        </div>
      </div>
    </div>
  );
};

export default FriendsRequest;

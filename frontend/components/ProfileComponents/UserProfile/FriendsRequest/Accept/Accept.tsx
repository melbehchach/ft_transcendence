import Image from "next/image";
import AcceptIcon from "./AcceptIcon";

const Accept = () => {
  function acceptClick() {
    
  }

  return (
    <button
      className="w-[14.5rem] h-[2.5rem] flex items-center gap-[0.5rem] ml-3 text-white border border-gray-500 border-solid border-b-1 rounded-[8px]"
      onClick={acceptClick}
    >
      <div className="ml-[1rem]">
        <AcceptIcon clasName="w-5 h-5" />
      </div>
      Accept
    </button>
  );
};

export default Accept;

import { useState } from "react";
import Avatar from "../../Avatar/Avatar";
import Page from "../../../app/(application)/profile/page";

interface fieldProps {

}

function AllField({ setModal, setNormalUser }) {
  const [click, setClick] = useState<boolean>(false);
  function handleClick() {
    setClick(true);
    setModal(false);
    setNormalUser(true);
  }

  return (
    <div className="w-full h-full text-white flex justify-center ">
      <div className="w-full h-fit flex items-center p-[1rem] gap-[22rem] ">
        <div className="flex items-center ml-[1rem] gap-4 ">
          <div className="w-[5rem] h-[5rem] " >
            <Avatar
              src="https://images.unsplash.com/photo-1559624989-7b9303bd9792?q=80&w=3688&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={100}
              height={100}
              userName=""
              imageStyle="rounded-full w-fit h-[5rem] "
              fontSize="text-base"
            />
          </div>
          <h2>mel-behc</h2>
        </div>
        <button
          type="button"
          className="w-[15rem] h-[3rem] rounded-[25px] flex justify-center items-center bg-[#D9923B] text-sm ml-[2rem] "
          onClick={handleClick}
        >
          See profile
        </button>
      </div>
    </div>
  );
}

export default AllField;

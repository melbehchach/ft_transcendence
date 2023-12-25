import Image from "next/image";
import DeleteMark from "./DeleteMark.svg";


const Delete = () => {
  return (
    <button
      type="button"
      className="w-[233px] h-[39px] border border-[#000000] rounded-[10px] flex inline-flex items-center gap-3"
    >
        <Image src={DeleteMark} alt="delete icon" width="19" height="15" className="ml-[10px]"/>
        Delete
    </button>
  );
}

export default Delete;

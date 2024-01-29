import { useState, useEffect } from "react";
import SearchMenu from "./SearchMenu/SearchMenu";
import SearchIcon from "./SearchIcon";

export default function SearchBar({}) {
  const [modal, setModal] = useState<boolean>(false);

  function closeModal() {
    setModal(false); 
  }
  return (
    <div className="w-full h-[3rem] p-[1rem] border border-black border-b-1 rounded-[10px]">
      <button
        className="w-full h-full items-center flex flex-row gap-[1rem] text-gray-500"
        onClick={() => setModal(true)}
      >
        <SearchIcon />
        <p>Find users or channels</p>
      </button>
      <SearchMenu modal={modal} closeModal={closeModal} />
    </div>
  );
}

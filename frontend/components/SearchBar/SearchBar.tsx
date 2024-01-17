import Image from "next/image";
import SearchIcon from "./SearchIcon.svg";

export default function SearchBar() {
  return (
      <form className="w-11/12 h-[3rem] flex gap-[1rem] border border-black border-solid border-b-1 rounded-[10px]">
        <button type="submit">
          <Image
            src={SearchIcon}
            width={15}
            height={15}
            alt="SearchIcon"
            className="ml-[1rem]"
          />
        </button>
        <input
          className="w-full bg-background text-white rounded-[10px] outline-none"
          type="search"
          name="search bar"
          id="sreachBar"
          placeholder="Find users or channels"
        />
      </form>
  );
}

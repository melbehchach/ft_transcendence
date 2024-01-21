import { useState } from "react";
import SearchIcon from "./SearchIcon";
import AllField from "./AllField/AllField";
import UsersField from "./UsersField/UsersField";
import ChannelsField from "./ChannlesField/ChannelsField";

export default function SearchBar({ setNormalUser }) {
  const [modal, setModal] = useState<boolean>(false);
  const [all, setAll] = useState<boolean>(true);
  const [users, setUsers] = useState<boolean>(false);
  const [channels, setChannels] = useState<boolean>(false);

  function allClick() {
    setAll(true);
    setUsers(false);
    setChannels(false);
  }

  function usersClick() {
    setAll(false);
    setUsers(true);
    setChannels(true);
  }

  function channelsClick() {
    setAll(false);
    setUsers(false);
    setChannels(true);
  }

  return (
    <div className="w-11/12 h-[3rem] items-center border border-black border-solid border-b-1 rounded-[10px] m-[0.5rem] ">
      <div className="w-full h-full items-center flex gap-[1rem] ml-[1rem] text-gray-500">
        <SearchIcon />
        <button
          className="w-full h-full flex items-center "
          onClick={() => {
            setModal(true);
          }}
        >
          <p>Find users or channels</p>
        </button>
        {modal && (
          <div className="absolute z-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[55rem] h-[50rem] flex flex-col gap-[1rem] z-100 m-[15rem] bg-background p-4 rounded-md">
              <span
                className="absolute top-2 right-2 cursor-pointer "
                onClick={() => {
                  setModal(false);
                }}
              >
                &times;
              </span>
              <div className="w-full h-[3rem] ">
                <form className="w-full h-[1rem] flex items-center gap-[1rem] m-[1rem] p-[1rem] ">
                  <SearchIcon />
                  <input
                    className="w-11/12 bg-background focus:outline-none text-white text-basic font-bold "
                    placeholder="Users or Channels"
                  />
                </form>
              </div>
              <div className="w-full h-[3rem] flex items-center flex gap-[1rem] ">
                <div className="w-fit h-fit flex items-center text-white text-basic ml-[1rem] ">
                  <button
                    type="button"
                    onClick={allClick}
                    className={all ? "border-gray-500 border-b-2" : ""}
                  >
                    All
                  </button>
                </div>
                <div className="w-fit h-fit flex items-center text-white text-basic ml-[1rem] ">
                  <button
                    type="button"
                    onClick={usersClick}
                    className={users ? "border-gray-500 border-b-2" : ""}
                  >
                    Users
                  </button>
                </div>
                <div className="w-fit h-fit flex items-center text-white text-basic ml-[1rem] ">
                  <button
                    type="button"
                    onClick={channelsClick}
                    className={channels ? "border-gray-500 border-b-2" : ""}
                  >
                    Channels
                  </button>
                </div>
              </div>
              <div className="w-full h-full">
                {all && <AllField setModal={setModal} setNormalUser={setNormalUser} />}
                {users && <UsersField />}
                {channels && <ChannelsField />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

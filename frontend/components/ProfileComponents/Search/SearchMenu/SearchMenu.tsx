import React, { use } from "react";
import { useState, useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import AllField from "./AllField/AllField";
import UsersField from "./UsersField/UsersField";
import ChannelsField from "./ChannlesField/ChannelsField";
import SearchIcon from "../SearchIcon";
import { SearchDataFetch } from "../../types/Avatar.type";
import { ProfileData } from "../../types/Avatar.type";

type searchMenuProps = {
  modal: boolean;
  closeModal: () => void;
};

function reducer(state, action) {
  switch (action) 
}

function SearchMenu({ modal, closeModal }: searchMenuProps) {
  const [state, dispatch] = useReducer<any>(reducer, {searchFieldd: true});
  const [all, setAll] = useState<boolean>(true);
  const [users, setUsers] = useState<boolean>(false);
  const [channels, setChannels] = useState<boolean>(false);
  const [requestType, setRequestType] = useState<string>("ALL");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchALLData, setSearchALLData] = useState<SearchDataFetch>({
    users: [],
    channels: [],
  });
  const [searchUsersData, setSearchUsersData] = useState<ProfileData[]>([]);
  const jwt_token = Cookies.get("JWT_TOKEN");

  async function fetchData() {
    try {
      if (jwt_token && searchValue) {
        const response = await axios.get(
          `http://localhost:3000/user/search?type=${requestType}&query=${searchValue}`,
          {
            headers: {
              Authorization: `Bearer ${jwt_token}`,
            },
            withCredentials: true,
          }
        );
        if (response.status <= 299) {
          if (requestType === "ALL") {
            setSearchALLData(response.data);
          } else if (requestType === "USERS") {
            setSearchUsersData(response.data);
          }
        }
      } else throw new Error("bad req");
    } catch (error) {
      console.log("an error occured");
    }
  }

  useEffect(() => {
    fetchData();
    if (searchValue.length === 0) {
      if (requestType === "ALL") {
        setSearchALLData({
          users: [],
          channels: [],
        });
      } else if (requestType === "USERS") {
        setSearchUsersData([]);
      }
    }
  }, [searchValue]);

  function allClick() {
    setAll(true);
    setUsers(false);
    setChannels(false);
    setRequestType("ALL");
  }

  function usersClick() {
    setAll(false);
    setUsers(true);
    setChannels(false);
    setRequestType("USERS");
  }

  function channelsClick() {
    setAll(false);
    setUsers(false);
    setChannels(true);
    setRequestType("CHANNELS");
  }

  const fields = [
    {
      field: "All",
      action: allClick,
      state: all,
      id: 1,
    },
    {
      field: "Users",
      action: usersClick,
      state: users,
      id: 2,
    },
    {
      field: "Channels",
      action: channelsClick,
      state: channels,
      id: 3,
    },
  ];

  function usesrData(): ProfileData[] {
    let usersArray: ProfileData[];
    if (requestType === "ALL") {
      usersArray = searchALLData.users;
    } else if (requestType === "USERS") {
      usersArray = searchUsersData;
    }

    return usersArray;
  }

  function handleModalClose(e: any) {
    if (e.target.id === "modalClose") {
      closeModal();
    }
  }

  if (!modal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      id="modalClose"
      onClick={handleModalClose}
    >
      <div className="w-[55rem] h-[50rem] rounded-[10px] flex flex-col bg-background ">
        <div className="w-full h-[5rem] flex items-center gap-[1rem] p-[1rem]">
          <SearchIcon />
          <form className="w-full h-[1rem]">
            <input
              className="w-11/12 bg-background focus:outline-none text-white text-basic font-bold "
              placeholder="Users or Channels"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>
        </div>
        <div className="w-full flex items-center gap-[1rem] pl-[1rem] pt-[0.5rem] border-b border-black">
          {fields.map((field) => (
            <button
              key={field.id}
              onClick={field.action}
              className={
                (field.state ? "border-b border-white" : "") +
                "w-fit h-full flex items-center text-white text-basic"
              }
            >
              {field.field}
            </button>
          ))}
        </div>
        <div className="w-full h-full p-[1rem]">
          {all && <AllField usersData={usesrData} />}
          {users && <UsersField usersData={usesrData} />}
          {channels && <ChannelsField />}
        </div>
      </div>
    </div>
  );
}

export default SearchMenu;

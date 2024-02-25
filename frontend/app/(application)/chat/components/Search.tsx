"use client";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import Modal from "../../../../components/Modal";
import UserAvatar from "../../../../components/UserAvatar";
import Button from "./Button";

const Search = () => {
  const modalRef = useRef();
  function openModel() {
    modalRef?.current?.showModal();
  }
  return (
    <>
      <div onClick={openModel} className="relative">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="w-4 h-4 absolute inset-y-1/3 left-4 top-[40%] bg-transparent"
        />
        <input
          className="w-full h-[81px] px-6 py-6 pl-10 bg-transparent text-textSecondary border-b border-black"
          placeholder="search"
        />
        {/* <input
          type="text"
          placeholder="Type here"
          className="input w-full max-w-xs pl-10"
        /> */}
      </div>
      <Modal title="Search" forwardedRef={modalRef} bordered={false}>
        <div className="flex flex-col gap-4">
          <input
            className="w-full border px-6 py-2 bg-transparent mt-4 text-white rounded-md"
            placeholder="Search..."
          />
          <div role="tablist" className="tabs tabs-bordered">
            <a role="tab" className="tab tab-active">
              All
            </a>
            <a role="tab" className="tab">
              Users
            </a>
            <a role="tab" className="tab">
              Channels
            </a>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-max-content">
            <UserAvatar />
          </div>
          <Button content="See Profile" type="primary" />
        </div>
        <div className="flex justify-between">
          <div className="w-max-content">
            <UserAvatar />
          </div>
          <Button content="Go To Channel" type="primary" />
        </div>
        <div className="flex justify-between">
          <div className="w-max-content">
            <UserAvatar />
          </div>
          <Button icon={faPlus} content="Add Friend" type="secondary" />
        </div>
        <div className="flex justify-between">
          <div className="w-max-content">
            <UserAvatar />
          </div>
          <Button icon={faPlus} content="Join Channel" type="secondary" />
        </div>
      </Modal>
      {/* <div></div> */}
    </>
  );
};

export default Search;

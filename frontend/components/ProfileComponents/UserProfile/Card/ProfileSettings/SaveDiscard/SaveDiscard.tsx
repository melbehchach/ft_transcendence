import React from "react";

type buttonsProps = {
    handleSave: () => void,
}

function SaveDiscard({handleSave}: buttonsProps) {
  return (
    <div className="w-full relative flex flex-row">
      <button
        type="button"
        className="w-[8rem] h-[2.5rem]  bg-[#D9923B] flex justify-center items-center rounded-[20px] text-sm "
        onClick={handleSave}
      >
        Save
      </button>
      <button
        type="button"
        className="w-[8rem] h-[2.5rem] absolute right-0 flex justify-center items-center border border-gray-500 border-solid rounded-[20px] text-sm "
        onClick={handleSave}
      >
        Discrad
      </button>
    </div>
  );
}

export default SaveDiscard;

import DeleteIcon from "./DeleteIcon";

function Delete () {
  return (
    <button
      type="button"
      className="w-[14.5rem] h-[2.5rem] flex items-center gap-[0.5rem] ml-3 text-white border border-gray-500 border-solid border-b-1 rounded-[8px]"
    >
      <div className="ml-[1rem]">
        <DeleteIcon className="w-5 h-5" />
      </div>
      Delete
    </button>
  );
};

export default Delete;

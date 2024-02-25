import DeleteIcon from "./DeleteIcon";

function Delete({ manageFriends }) {
  return (
    <button
      className="w-full h-[2.5rem] p-[1rem] flex items-center gap-[0.5rem] text-white border border-gray-500 border-solid rounded-[8px] hover:bg-primary/5"
      onClick={manageFriends}
    >
      <DeleteIcon className="w-5 h-5" />
      Delete
    </button>
  );
}

export default Delete;

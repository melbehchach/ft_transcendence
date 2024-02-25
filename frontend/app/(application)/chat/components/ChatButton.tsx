import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ChatButton = ({ children, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center rounded-[35px] border border-textSecondary p-[7px] gap-4"
    >
      <div className="rounded-full w-12 h-12 bg-primary flex items-center justify-center">
        <FontAwesomeIcon icon={icon} size="6x" className="text-black w-8 h-8" />
      </div>
      {children}
    </button>
  );
};

export default ChatButton;

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from "./Typography";

const Button = ({ children }) => {
  return (
    <button className="w-full flex items-center rounded-[35px] border border-textSecondary p-[7px] gap-4">
      <div className="rounded-full w-12 h-12 bg-primary flex items-center justify-center">
        <FontAwesomeIcon
          icon={faPlus}
          size="6x"
          className="text-black w-8 h-8"
        />
      </div>
      <Typography content="New Chat" type="header" variant="secondaryTitle" />
    </button>
  );
};

export default Button;

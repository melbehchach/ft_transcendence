import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import Typography from "../../../../components/Typography";

const Button = ({
  content,
  type,
  icon,
  onClick,
}: {
  content: string;
  type?: string;
  icon?: IconDefinition;
  onClick?: () => void;
}) => {
  return (
    <button
      className={clsx(
        "border px-8 py-3 rounded-full text-nowrap min-w-[135px] flex items-center justify-center gap-2",
        {
          "bg-primary": type === "primary",
        }
      )}
      onClick={onClick}
    >
      {icon && <FontAwesomeIcon className="text-white" icon={faPlus} />}
      <Typography type="paragraphe" variant="body2" content={content} />
    </button>
  );
};

export default Button;

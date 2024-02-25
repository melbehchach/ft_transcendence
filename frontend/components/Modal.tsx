import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { MutableRefObject } from "react";
import Typography from "./Typography";

const Modal = ({
  children,
  forwardedRef,
  bordered,
  title,
  onCancel,
  actions,
}: {
  children: JSX.Element;
  forwardedRef: MutableRefObject<any>;
  bordered: boolean;
  title?: string;
  onCancel?: () => void;
  actions?: any;
}) => {
  //   const ref = useRef();
  //   function openModel() {
  //     ref.current.showModal();
  //   }
  return (
    <>
      <dialog ref={forwardedRef} id="my_modal_1" className="modal">
        <div className="modal-box w-max max-w-none p-16 pb-0 bg-background relative">
          {title && (
            <Typography content={title} type="header" variant="modalTitle" />
          )}
          <div
            className={clsx(
              "rounded-xl  p-4  border-black flex flex-col gap-8 my-8 min-w-[800px]",
              { border: bordered }
            )}
          >
            {children}
          </div>
          <form className="absolute top-2 right-2" method="dialog">
            <button onClick={onCancel}>
              <FontAwesomeIcon className="w-8 h-8 p-4" icon={faXmark} />
            </button>
          </form>

          {actions && <div className="modal-action pb-4">{actions}</div>}
        </div>
      </dialog>
    </>
  );
};

export default Modal;

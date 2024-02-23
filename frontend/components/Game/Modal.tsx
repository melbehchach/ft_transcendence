import { FC, ReactNode } from "react";

interface GameModalComponentProps {
  title: string;
  subtitle: string;
  content: ReactNode;
  cancelCallback: () => void;
  btn1: string;
  btn1Callback: () => void;
  btn2: string | null;
  btn2Callback: () => void | null;
}

const GameModalComponent: FC<GameModalComponentProps> = ({
  title,
  subtitle,
  content,
  cancelCallback,
  btn1,
  btn1Callback,
  btn2,
  btn2Callback,
}) => {
  return (
    <>
      <div className="h-screen fixed inset-0 backdrop-blur-sm bg-black/60 flex justify-center items-center z-30">
        <div className="w-full md:w-3/5 xl:w-1/2 h-1/2 rounded-lg bg-background z-60 p-2">
          <svg
            onClick={cancelCallback}
            className="cursor-pointer float-right mr-4 mt-4"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 3L21 21M3 21L21 3"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex-col justify-center items-center text-center mt-10 h-5/6">
            <h1 className="text-text font-bold text-xl md:text-title not-italic font-sans my-2">
              {title}
            </h1>
            <p className="text-textSecondary text-small md:text-body">
              {subtitle}
            </p>
            {content}
            <div className="w-full flex items-cente justify-center gap-5 mb-5">
              <button
                className="block bg-primary text-text text-small px-6 py-3 rounded-full xl:w-4/12"
                // onClick={() => router.push("/game/friend")}
                onClick={btn1Callback}
              >
                {btn1}
              </button>
              <button
                className={
                  btn2 === null
                    ? "hidden"
                    : "block bg-background border-2 border-primary text-text text-small px-6 py-3 rounded-full xl:w-4/12"
                }
                onClick={btn2Callback}
              >
                {btn2}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default GameModalComponent;

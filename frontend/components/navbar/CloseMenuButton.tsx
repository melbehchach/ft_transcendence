import CloseIcon from "./icons/CloseIcon";

export default function CloseMenuButton({ navbarOpen, setNavbarOpen }: any) {
  return (
    <>
      <div className="w-full flex justify-end">
        <button
          className={
            (navbarOpen ? "block" : "hidden") +
            " absolute block sm:hidden text-text py-5 mr-5"
          }
          onClick={() => {
            setNavbarOpen(!navbarOpen);
          }}
        >
          <div>
            <CloseIcon />
          </div>
        </button>
      </div>
    </>
  );
}

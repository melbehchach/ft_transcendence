import MenuIcon from "./icons/MenuIcon";

export default function MenuButton({ navbarOpen, setNavbarOpen }: any) {
  return (
    <>
      <button
        className={
          (navbarOpen ? "hidden" : "block") +
          "absolute block sm:hidden text-text py-5 ml-5"
        }
        onClick={() => {
          setNavbarOpen(!navbarOpen);
        }}
      >
        <div>
          <MenuIcon />
        </div>
      </button>
    </>
  );
}

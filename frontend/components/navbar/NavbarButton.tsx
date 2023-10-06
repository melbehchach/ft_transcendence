"use client";
export default function NavbarButton({ label, icon, clicked }: any) {
  const handleClick = () => {
    console.log(label);
  };
  return (
    <>
      <div
        className={
          (clicked
            ? "border-primary text-primary "
            : "border-background text-text ") +
          "w-full flex justify-center text-small xl:text-body border-l-4 py-3"
        }
      >
        <div className="flex w-20 xl:w-28 gap-2.5 xl:gap-4 items-center">
          <div> {icon} </div>
          <div> {label} </div>
        </div>
      </div>
    </>
  );
}

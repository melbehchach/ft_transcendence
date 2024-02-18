import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#36132d] w-full h-screen">
      {/* <div className=" w-full h-screen bg-black/50 flex flex-col items-center justify-center"> */}
      <h1 className="text-5xl pb-3 text-white font-bold text-center">404</h1>
      <div className="w-9/12 h-3/5 bg-[url('../public/img/404.gif')] bg-no-repeat bg-center bg-cover rounded-lg	mb-3" />
      <p className="text-xl md:text-2xl pb-3 text-text opacity-50 font-medium text-center">
        FIN GHADI, FINAWA GHADI
      </p>
      <Link href={"/"}>
        <button className="block bg-accent text-text px-6 py-3 rounded-lg font-bold">
          {"GO BACK HOME"}
        </button>
      </Link>
      {/* </div> */}
    </div>
  );
}

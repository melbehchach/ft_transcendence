import Navbar from "../../components/navbar/Navbar";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <div className="flex">
        <Navbar />
        {children}
      </div>
    </>
  );
}

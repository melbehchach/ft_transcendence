import Navbar from "../../components/navbar/Navbar";
import AlertGame from "../../components/notifications/AlertGame";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
  return (
    <>
      <div className="flex">
        <Navbar />
        <AlertGame />
        {children}
      </div>
    </>
  );
}

import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "../../../../../../../app/context/AuthContext";


type props = {
  setBlocked: any;
}

function BlockedBy({setBlocked}: props) {
  const param = useParams();
  const { fetchData } = useAuth();

  useEffect(() => {
    fetchData().then(() => {
      fetchData(param.id);
    });
    setBlocked(true);
  }, []);

  return (
    <div className="w-full h-[3rem] bg-red-500 flex justify-center items-center  rounded-[25px] text-sm ">
      You're Bloked
    </div>
  );
}

export default BlockedBy;

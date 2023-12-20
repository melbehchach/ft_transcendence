import axios from "axios";
import cookie from "js-cookie";

type Props = {
    sender: string | null;
};

export default function AcceptOrRefuse({sender} : Props) {
    const handleAccept = () => {
        try {
            axios.post("http://localhost:3000/game/accept", {
              receiver: cookie.get("USER_ID"),
              sender: sender,
            });
            
        } catch (error) {}
    };

    const handleRefuse = () => {
       try {
         axios.post("http://localhost:3000/game/refuse", {
           receiver: cookie.get("USER_ID"),
            sender: sender,
         });
       } catch (error) {}
     };

    return (
      <>
        <div className="absolute top-0 right-0 bg-red-400 z-10">
          <h1>Accept or Refuse</h1>
          <div>
            <button onClick={() => {handleAccept();}}>Accept</button>
            <button onClick={ ()=> {handleRefuse();}}>Refuse</button>
          </div>
        </div>
      </>
    );
}
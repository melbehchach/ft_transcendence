import Avatar from "./Avatar";
import { style } from "./RecentGames.styles";

const RecentGames = () => {
  return (
    <div className={style.wrapper}>
      <h2>1 houre</h2>
      <div className={style.users}>
        <Avatar
          src="https://images.unsplash.com/photo-1702103208377-f91a3832b6ec?q=80&w=2200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          userName="User 1"
        />
        <div className={style.result}>
            <span>3</span>
            <span>-</span>
            <span>2</span>
        </div>
        <Avatar
          src="https://images.unsplash.com/photo-1702103208377-f91a3832b6ec?q=80&w=2200&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          userName="User 1"
        />
      </div>
    </div>
  );
};

export default RecentGames;

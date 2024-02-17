import Avatar from "./Avatar";
import Typography from "./Typography";

const UserAvatar = ({ src, name }: { src?: string; name?: string }) => {
  return (
    <div className=" w-full flex items-center gap-4 pl-[16px]">
      <Avatar
        src={src ? src : "https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
      />
      <Typography
        type="paragraphe"
        variant="body"
        content={name ? name : "Jangoli"}
      />
    </div>
  );
};

export default UserAvatar;

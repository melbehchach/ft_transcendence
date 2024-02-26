import Avatar from "./Avatar";
import Typography from "./Typography";

const UserAvatar = ({ src, name }: { src?: string; name?: string }) => {
  return (
    <div className="w-fit flex items-center gap-4 pl-[16px]">
      <Avatar
        src={src ? src : "https://tecdn.b-cdn.net/img/new/avatars/2.webp"}
      />
      <Typography
        type="paragraphe"
        variant="body"
        content={name ? name : "Jangoli"}
        style="text-left whitespace-nowrap text-ellipsis overflow-hidden w-[200px] max-w-full"
      />
    </div>
  );
};

export default UserAvatar;

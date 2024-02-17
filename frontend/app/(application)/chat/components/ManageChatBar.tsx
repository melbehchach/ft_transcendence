import Typography from "../../../../components/Typography";
import UserAvatar from "../../../../components/UserAvatar";

const ManageChatBar = () => {
  return (
    <div className="flex flex-col gap-4  p-4">
      <div className="flex flex-col justify-center gap-2 py-2">
        <div className="pl-4">
          <Typography
            content="Owner"
            type="paragraphe"
            variant="body2"
            colorVariant="secondary"
          />
        </div>
        <UserAvatar />
      </div>
      <div className="flex flex-col justify-center gap-2 py-2">
        <div className="pl-4">
          <Typography
            content="Admins"
            type="paragraphe"
            variant="body2"
            colorVariant="secondary"
          />
        </div>
        <UserAvatar />
        <UserAvatar />
      </div>
      <div className="flex flex-col justify-center gap-2 py-2">
        <div className="pl-4">
          <Typography
            content={`Members (${3})`}
            type="paragraphe"
            variant="body2"
            colorVariant="secondary"
          />
        </div>
        <UserAvatar />
        <UserAvatar />
        <UserAvatar />
      </div>
    </div>
  );
};

export default ManageChatBar;

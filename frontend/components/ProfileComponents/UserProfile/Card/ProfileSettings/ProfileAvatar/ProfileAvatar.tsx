import UploadImage from "../../../../../uploadImage/UploadImage";

type props = {
  avatarFile: any;
  setAvatar: any;
  previewUrl: any;
  setPreviewUrl: any;
  handleSubmit: any;
};

function ProfileAvatar({
  avatarFile,
  setAvatar,
  previewUrl,
  setPreviewUrl,
  handleSubmit,
}: props) {
  return (
    <div className="relative w-fit flex flex-row">
      <UploadImage source={previewUrl} />
      <div className="w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <input
            name="avatar"
            type="file"
            id="upload"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              const maxFileSize = 1024 * 1024 * 5;
              if (file) {
                const maxFileSize = 1024 * 1024 * 5;
                if (file.size > maxFileSize) {
                  alert(
                    "File is too large. Please upload a file smaller than 5 MB."
                  );
                  return;
                }
                setPreviewUrl(URL.createObjectURL(file));
                setAvatar(file);
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default ProfileAvatar;

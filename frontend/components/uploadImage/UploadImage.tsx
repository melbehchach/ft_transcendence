const UploadImage: React.FC<{ source: string }> = ({ source }) => {
  return (
    <>
      <div className="flex flex-col justify-end items-end relative">
        <div className="rounded-full w-28 md:w-40 h-28 md:h-40">
          <picture>
            <img
              className="rounded-full w-full h-full object-cover"
              src={source}
              alt="Profile"
            />
          </picture>
        </div>
        <div className="w-9 h-9 bg-black p-2.5 rounded-full flex justify-center items-center cursor-pointer absolute">
          <label htmlFor="upload" className="cursor-pointer w-full h-full">
            <span className="w-full h-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                  fill="white"
                  d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                />
              </svg>
            </span>
          </label>
        </div>
      </div>
    </>
  );
};

export default UploadImage;

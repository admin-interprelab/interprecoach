import React from 'react';

const VideoWindow = ({ src, name }: { src: string; name: string }) => (
  <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-700">
    <video src={src} autoPlay loop muted playsInline className="w-full h-full object-cover" />
    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2.5 py-1 rounded-md text-sm font-medium">
      {name}
    </div>
  </div>
);

const TelehealthBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-2 z-0">
      <div className="col-span-2 row-span-1">
        <VideoWindow src="https://cdn.pixabay.com/video/2021/11/16/94254-637910534_large.mp4" name="Doctor" />
      </div>
      <div className="col-span-1 row-span-1">
        <VideoWindow src="https://cdn.pixabay.com/video/2020/02/28/32219-393231269_large.mp4" name="Patient" />
      </div>
      <div className="col-span-1 row-span-1">
        <VideoWindow src="https://cdn.pixabay.com/video/2023/09/25/181456-868616185_large.mp4" name="Interpreter" />
      </div>
    </div>
  );
};

export default TelehealthBackground;

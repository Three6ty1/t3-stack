import React from "react";
import { Blob } from "@prisma/client";

type Props = {
  blob: Blob;
  handleModalOpen: (blob: Blob) => void;
  id: number;
  isFilter: boolean;
};

export default function BlobItem({ blob, id, handleModalOpen, isFilter } : Props) {
  const style = {
    // opacity: isFilter ? 50 : 100,
  };

  return (
    <div
      style={style}
      className="flex relative justify-center align-middle bg-white text-sm w-[10%] aspect-square group
         hover:scale-105 duration-200 transition ease-out"
    >
      {blob.images.length > 0 && <img className="w-full object-contain min-h-0" src={blob.images[0]} />}
      <div
        className="absolute flex h-full w-full border-[1px] border-solid border-black p-2 items-end"
        onClick={() => handleModalOpen(blob)}
      >
        <div className="opacity-0 h-1/3 border-2 border-solid border-red-600 relative group-hover:-translate-y-2 group-hover:opacity-100 transition-all ease-out duration-500">
          {blob?.title}
        </div>
      </div>
    </div>
  );
}

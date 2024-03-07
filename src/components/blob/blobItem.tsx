import React from "react";
import { Blob } from "@prisma/client";

type Props = {
  blob: Blob;
  handleModalOpen: (blob: Blob) => void;
  id: number;
  isFilter: boolean;
};

export default function BlobItem({
  blob,
  id,
  handleModalOpen,
  isFilter,
}: Props) {
  const style = {
    // opacity: isFilter ? 50 : 100,
  };

  return (
    <div
      style={style}
      className="group relative flex aspect-square w-[10%] justify-center bg-transparent align-middle text-sm
        transition duration-200 ease-out z-0 hover:z-20 hover:scale-105"
    >
      {blob.images.length > 0 && (
        <img className="min-h-0 w-full object-contain" src={blob.images[0]} />
      )}
      <div
        className="absolute flex h-full w-full items-end border-solid border-black"
        onClick={() => handleModalOpen(blob)}
      >
        <div className="relative px-2 -bottom-1 h-1/3 w-full bg-black bg-opacity-0 text-white text-opacity-0 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:bg-opacity-50 group-hover:text-opacity-100 overflow-hidden overflow-ellipsis">
          {blob?.title}
        </div>
      </div>
    </div>
  );
}

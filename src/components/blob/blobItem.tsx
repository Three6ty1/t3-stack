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
    background: isFilter ? "yellow" : undefined,
  };

  return (
    <div
      style={style}
      className="flex flex-col bg-white p-2 text-sm w-[10%] aspect-square group
         hover:scale-105 duration-200 transition ease-out"
    >
      <div
        className="flex h-full w-full border-2 border-solid border-black p-2 items-end"
        onClick={() => handleModalOpen(blob)}
      >
        <div className="opacity-0 h-1/3 border-2 border-solid border-red-600 relative group-hover:-translate-y-2 group-hover:opacity-100 transition-all ease-out duration-500">
          {blob?.title}
        </div>
      </div>
    </div>
  );
}

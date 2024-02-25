import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Blob } from "@prisma/client";

const defSize = 100
const defMargin = 4

type Props = {
  blob: Blob;
  handleModalOpen: (blob: Blob) => void;
  id: number;
}

export default function BlobItem({ blob, id, handleModalOpen } : Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id + 1});

  const style = {
    transform: CSS.Transform.toString(transform),
    transformOrigin: "0 0",
    transition,
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1,
    width: blob?.id != 1 ? defSize : defSize * 2 + defMargin * 2,
    height: blob?.id != 1 ? defSize : defSize * 2 + defMargin * 2,
    margin: defMargin,
    gridRowStart: blob?.id === 1 ? "span 2" : undefined,
    gridColumnStart: blob?.id === 1 ? "span 2" : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className="border-2 border-solid border-red-500 bg-gray-500 rounded-md p-1 text-sm">
      <div {...listeners} {...attributes} aria-describedby="">
        Drag handle
      </div>
      <div
        style={{
          border: "1px solid black",
          borderColor: "black"
        }}
        onClick={() => handleModalOpen(blob)}
      >
        {blob?.title}
      </div>
  </div>
  );
}

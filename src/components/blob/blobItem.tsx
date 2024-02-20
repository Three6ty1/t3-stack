import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const defSize = 100
const defMargin = 4

export default function BlobItem(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transformOrigin: "0 0",
    transition,
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1,
    width: props.name != 3 ? defSize : defSize * 2 + defMargin * 2,
    height: props.name != 3 ? defSize : defSize * 2 + defMargin * 2,
    margin: defMargin,
    gridRowStart: props.name === 3 ? "span 2" : undefined,
    gridColumnStart: props.name === 3 ? "span 2" : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className="border-2 border-solid border-red-500 bg-gray-500 rounded-md p-1 text-sm">
      <button {...listeners} {...attributes}>
        Drag handle
      </button>
      <div
        style={{
          border: "1px solid black",
          borderColor: "black"
        }}
      >
        {props.value}
      </div>
  </div>
  );
}

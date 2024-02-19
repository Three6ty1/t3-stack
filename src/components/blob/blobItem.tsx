import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
    width: props.id != "8" ? "100px" : "208px",
    height: props.id != "8" ? "100px" : "208px",
    gridRowStart: props.id === "8" ? "span 2" : undefined,
    gridColumnStart: props.id === "8" ? "span 2" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="m-1 border-2 border-solid border-red-500 bg-gray-500"
      {...listeners}
      {...attributes}
    >
      {props.value}
    </div>
  );
}

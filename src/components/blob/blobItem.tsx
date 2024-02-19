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
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: "100px",
    height: "100px",
    border: "2px solid red",
    backgroundColor: "#cccccc",
    margin: "10px",
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div>
        <div
          style={{
            minWidth: "30px",
            minHeight: "20px",
            border: "1px solid balck",
            borderColor: "black"
          }}
        >
          {props.value}
        </div>
      </div>
    </div>
  );
};

import Head from "next/head";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  rectSwappingStrategy
} from "@dnd-kit/sortable";
import { SetStateAction, useState } from "react";

import BlobItem from "./../components/blob/blobItem";

export default function Home() {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState([
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  let gridCols;

  if (items.length == 1) {
      gridCols = "grid-cols-1"
  } else if (items.length <= 13) {
      gridCols = "grid-cols-4"
  }// else if (items.length <= )
  //   case :
  //     gridCols = "grid-cols-3"
  //     break;
  //   case 4:
  //     gridCols = "grid-cols-4"
  //     break;
  //   case 5:
  //     gridCols = "grid-cols-5"
  //     break;
  //   case 6:
  //     gridCols = "grid-cols-6"
  //     break;
  //   case 7:
  //     gridCols = "grid-cols-7"
  //     break;
  //   case 8:
  //     gridCols = "grid-cols-8"
  //     break;
  //   case 9:
  //     gridCols = "grid-cols-9"
  //     break;

  //   default:
  //     gridCols = "grid-cols-10"
  //     break;
  // }
  
  return (
    <>
      <Head>
        <title>Three6ty1's Blob</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="font-[Helvetica] w-screen h-screen flex p-5 justify-center align-middle items-start">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <div className="flex h-full w-full bg-black justify-center items-center align-middle">
            <div className={`grid ${gridCols}`}>
              <SortableContext items={items} strategy={rectSortingStrategy}>
                {items.map((id, index) => (
                  <BlobItem key={id} id={id} value={id} name={index}/>
                ))}
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </main>
    </>
  );
}

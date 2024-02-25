import Head from "next/head";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  rectSwappingStrategy,
} from "@dnd-kit/sortable";
import { DialogHTMLAttributes, SetStateAction, useState } from "react";

import BlobItem from "./../components/blob/blobItem";
import { GetServerSideProps } from "next";
import { getAllBlobs } from "~/server/api/routers/blob";
import { Blob, type BlobTags } from "@prisma/client";
import CreateBlob from "~/components/blob/createBlob";
import BlobModal from "~/components/blob/blobModal";
import { api } from "~/utils/api";
import BlobFilter from "~/components/blob/blobFilter";

type Props = {
  ssrBlobs: Blob[];
};

export default function Home({ ssrBlobs }: Props) {
  const initBlob: Blob = {
    id: -1,
    date: "",
    edit: null,
    title: "",
    description: null,
    tags: [],
    images: [],
    videos: [],
    likes: -1,
  };
  const [selectedBlob, setSelectedBlob] = useState<Blob>(initBlob);
  const [isShowModal, setIsShowModal] = useState(false);
  const [blobs, setBlobs] = useState(ssrBlobs ? ssrBlobs : []);
  const [filter, setFilter] = useState({tags: new Set<BlobTags>([])});
  const getAllQuery = api.useUtils().blob.getAll;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // TODO: Remove any
  function handleDragEnd(event: any) {
    const {active, over} = event;

    if (active.id !== over.id) {
      setBlobs((blobs) => {
        return arrayMove(blobs, blobs.findIndex((blob) => blob.id === active.id), blobs.findIndex((blob) => blob.id === over.id));
      });
    }
  }

  const handleBlobCreate = () => {
    setTimeout(() => getAllQuery.fetch().then((data) => {
      setBlobs(data);
      // Reassign the selected blob to the newly changed one
    }), 300);
  }

  const handleModalOpen = (blob: Blob) => {
    setSelectedBlob(blob);
    setTimeout(
      () =>
        (
          document.getElementById("blob_modal")! as HTMLDialogElement
        ).showModal(),
      200,
    );
    setIsShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedBlob(initBlob);
    setIsShowModal(false);
  };

  const handleBlobDelete = () => {
    setTimeout(
      () =>
        getAllQuery.fetch().then((data) => {
          setBlobs(data);
          // Reassign the selected blob to the newly changed one
        }),
      300,
    );
  }

  const handleBlobEdit = () => {
    setTimeout(
      () =>
        getAllQuery.fetch().then((data) => {
          setBlobs(data);
          // Reassign the selected blob to the newly changed one
          setSelectedBlob(data.find((blob) => blob.id == selectedBlob.id)!);
        }),
      200,
    );
  };

  const handleFilter = (filter: Set<BlobTags>) => {
    setFilter({tags: filter});
  }

  let gridCols;

  if (blobs.length == 1) {
    gridCols = "grid-cols-1";
  } else if (blobs.length <= 13) {
    gridCols = "grid-cols-5";
  } // else if (items.length <= )
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
      <main className="flex h-screen w-screen items-start justify-center p-5 align-middle font-[Helvetica]">
        
        {isShowModal && (
          <BlobModal
            blob={selectedBlob}
            handleBlobEdit={handleBlobEdit}
            handleModalClose={handleModalClose}
            handleBlobDelete={handleBlobDelete}
          />
        )}
        <div className="absolute right-6 top-6">
          <CreateBlob handleBlobCreate={handleBlobCreate}/>
          <BlobFilter filter={filter} handleFilter={(filter: Set<BlobTags>) => handleFilter(filter)} />
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full w-full items-center justify-center bg-black align-middle">
            <div className={`grid ${gridCols}`}>
              <SortableContext items={blobs} strategy={rectSortingStrategy}>
                {blobs?.map((blob) => (
                  <BlobItem
                    key={blob.id}
                    id={blob.id}
                    blob={blob}
                    isFilter={(new Set([...filter.tags].filter(x => blob.tags.includes(x)))).size > 0}
                    handleModalOpen={(blob: Blob) => handleModalOpen(blob)}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        </DndContext>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const blobs = await getAllBlobs();

  return {
    props: {
      ssrBlobs: blobs,
    },
  };
};

import { Blob } from "@prisma/client";
import { useState } from "react";

type Props = {
  blob: Blob;
  handleBlobEdit: () => void;
};

export default function BlobModal({ blob, handleBlobEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBlob, setNewBlob] = useState(blob);

  const handleClose = () => {
    setIsEditing(false);
    setNewBlob(blob);
  };
  return (
    <dialog id={`blob_modal`} className="modal" onClose={handleClose}>
      <div className="modal-box">
        {isEditing ? (
          <button
            className="btn btn-sm absolute right-2 top-2 btn-error"
            onClick={() => {
              setNewBlob(blob);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        ) : (
          <>
            <button
              className="btn btn-sm absolute right-2 top-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <h3 className="text-lg font-bold">{blob.title}</h3>
            <p className="py-4">{blob.description}</p>
            {blob.tags?.map((tag) => <p className="py-1">{tag}</p>)}
            {blob.images?.map((image) => <p className="py-1">{image}</p>)}
            <p className="py-2">{blob.likes}</p>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

import { Blob, BlobTags } from "@prisma/client";
import { useState } from "react";
import { capitalise } from "~/helper/blobHelper";
import { api } from "~/utils/api";
import BlobDelete from "./blobDelete";

type Props = {
  blob: Blob;
  handleBlobEdit: () => void;
  handleModalClose: () => void;
  handleBlobDelete: () => void;
};

export default function BlobModal({
  blob,
  handleBlobEdit,
  handleModalClose,
  handleBlobDelete,
}: Props) {
  const defaultBlob = {
    title: blob.title,
    description: blob.description ? blob.description : "",
    tags: new Set<BlobTags>(blob.tags),
    images: blob.images ? blob.images : [],
    videos: blob.videos ? blob.videos : [],
  };

  const [isEditing, setIsEditing] = useState(false);
  const [newBlob, setNewBlob] = useState(defaultBlob);
  const editMutation = api.blob.edit.useMutation();
  const deleteMutation = api.blob.delete.useMutation();

  const handleClose = () => {
    setIsEditing(false);
    setNewBlob(defaultBlob);
    handleModalClose();
  };

  const handleCheck = (tag: string, checked: boolean) => {
    if (checked) {
      setNewBlob({
        ...newBlob,
        tags: newBlob.tags.add(BlobTags[tag as keyof typeof BlobTags]),
      });
    } else {
      newBlob.tags.delete(BlobTags[tag as keyof typeof BlobTags]);
      setNewBlob({ ...newBlob, tags: newBlob.tags });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: blob.id });
    handleClose();
    handleBlobDelete();
  };

  const handleSubmit = () => {
    editMutation.mutate({
      id: blob.id,
      ...newBlob,
      tags: Array.from(newBlob.tags),
    });

    if (editMutation.error) {
      return;
    }

    setIsEditing(false);
    // SSR and modal refreshing
    handleBlobEdit();
  };

  return (
    <dialog id={`blob_modal`} className="modal" onClose={handleClose}>
      <div className="modal-box h-fit overflow-visible">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div className="absolute right-2 top-2 flex w-fit flex-col gap-y-2">
              <button
                className="btn btn-warning btn-sm"
                onClick={() => {
                  setNewBlob(defaultBlob);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
              <BlobDelete handleDelete={handleDelete} date={blob.date}/>
            </div>
            <input
              type="text"
              className="input input-bordered max-w-xs font-bold"
              value={newBlob?.title}
              onChange={(e) =>
                setNewBlob({ ...newBlob, title: e.target.value })
              }
            ></input>
            <input
              type="text"
              className="input input-bordered max-w-xs"
              value={newBlob?.description ? newBlob.description : ""}
              onChange={(e) =>
                setNewBlob({ ...newBlob, description: e.target.value })
              }
            />
            <div className="flex flex-row flex-wrap">
              {Object.values(BlobTags).map((tag) => (
                <label
                  key={`${tag} select option`}
                  className="label flex w-1/3 cursor-pointer justify-center"
                >
                  <div className="w-1/2">
                    <div className="form-control flex w-full flex-row justify-end gap-x-4">
                      <span className="label-text">{capitalise(tag)}</span>
                      <input
                        id={tag}
                        type="checkbox"
                        className="checkbox"
                        checked={newBlob.tags.has(tag)}
                        onChange={(e) =>
                          handleCheck(
                            e.target.id.toUpperCase(),
                            e.target.checked,
                          )
                        }
                      />
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <button className="btn" onClick={handleSubmit}>
              Submit changes
            </button>
          </div>
        ) : (
          <>
            <button
              className="btn btn-sm absolute right-2 top-2"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <h3 className="text-lg font-bold">{blob.title}</h3>
            {blob.edit && <p className="py-1">Last edited {blob.edit}</p>}
            <p className="py-4">{blob.description}</p>
            {blob.tags?.map((tag) => (
              <p key={tag} className="py-1">
                {tag}
              </p>
            ))}
            {blob.images?.map((image) => (
              <p key={image} className="py-1">
                {image}
              </p>
            ))}
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

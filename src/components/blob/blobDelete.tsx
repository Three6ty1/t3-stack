import { useState } from "react";

type Props = {
  handleDelete: () => void;
  date: string;
}

export default function BlobDelete({ handleDelete, date } : Props) {
  const [deleteText, setDeleteText] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const handleDeletePress = () => {
    deleteText === date
      ? handleDelete()
      : setDeleteError("Dates not matching");
  };

  return (
    <>
      <button
        className="btn btn-error btn-sm"
        onClick={() =>
          (
            document.getElementById(
              "blob_delete_modal",
            )! as HTMLDialogElement
          ).showModal()
        }
      >
        Delete
      </button>
      <dialog
        id="blob_delete_modal"
        className="modal"
        onClose={() => setDeleteText("")}
      >
        <div className="modal-box">
          <h3 className="text-lg font-bold">
            Are you sure you want to delete me? pleading face emoji
          </h3>
          <p className="py-4">
            Retype this date{" "}
            <span className="font-bold">{date}</span> to confirm
            deletion
          </p>
          {deleteError.length > 0 && (
            <p className="text-red-600">{deleteError}</p>
          )}
          <input
            type="text"
            className="input"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDeletePress()}
          ></input>
          <button
            type="submit"
            className="btn"
            onClick={handleDeletePress}
          >
            Confirm
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
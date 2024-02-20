import { BlobTags } from "@prisma/client";
import { useState } from "react";

const defaultBlob = {
  title: "",
  description: "",
  tags: [] as BlobTags[],
  images: [] as string[],
  videos: [] as string[],
}

export default function CreateBlob() {
  const [blob, setBlob] = useState(defaultBlob);
  console.log(blob)
  return (
    <>
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("create_blob_modal")! as HTMLDialogElement
          ).showModal()
        }
      >
        open modal
      </button>
      <dialog id="create_blob_modal" className="modal">
        <div className="modal-box space-y-4 flex flex-col overflow-visible">
          <h3 className="text-lg font-bold">Hello!</h3>
          <input
            type="text"
            placeholder="Enter a title"
            className="input input-bordered w-full max-w-xs"
            value={blob.title}
            onChange={(value) => setBlob({...blob, title: value.target.value})}
          />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={blob.description}
            onChange={(value) => setBlob({...blob, description: value.target.value})}
          />
          <details className="dropdown">
            <summary className="m-1 btn">open or close</summary>
            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
              {Object.values(BlobTags).map((tag) => (
                <li>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">{tag}</span> 
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </details>
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-xs"
          />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
          />
          {/* 
            title: input.title,
            description: input.description,
            tags: input.tags,
            images: input.images,
            videos: input.videos,
        } */}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

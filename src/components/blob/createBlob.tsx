import { BlobTags } from "@prisma/client";
import { useState } from "react";
import { capitalise } from "~/helper/blobHelper";
import { api } from "~/utils/api";
import { createClient } from "~/utils/supabase/client";

const defaultBlob = {
  title: "",
  description: "",
  tags: new Set<BlobTags>([]),
  videos: "",
};

const MAX_IMAGE_SIZE = 1000000; // 1mb

type Props = {
  handleBlobCreate: () => void;
}
export default function CreateBlob({ handleBlobCreate } : Props) {
  const supabase = createClient();
  
  const [blob, setBlob] = useState(defaultBlob);
  const [uploadError, setUploadError] = useState("");
  const submitMutation = api.blob.create.useMutation();

  const handleSubmit = async () => {
    for (const file of (document.getElementById("blob-file-input")! as HTMLInputElement).files as FileList) {
      console.log(file);
      const {data, error} = await supabase.storage.from("images").upload(file.name.slice(0, -4), file);
      console.log(data);
      console.log(error);
    }
    // await submitMutation.mutateAsync({
    //   ...blob,
    //   tags: Array.from(blob.tags),
    //   videos: blob.videos.length > 0 ? blob.videos.split('\n').map(video => video.trim()) : [],
    // }).then(() => {
    //   (document.getElementById("create_blob_modal")! as HTMLDialogElement).close();
    //   handleClose();
    //   handleBlobCreate();
    // }).catch((error) => {
    //   // do nothing
    // })
  };

  const handleCheck = (tag: string, checked: boolean) => {
    if (checked) {
      setBlob({...blob, tags: blob.tags.add(BlobTags[tag as keyof typeof BlobTags])});
    } else {
      blob.tags.delete(BlobTags[tag as keyof typeof BlobTags])
      setBlob({...blob, tags: blob.tags});
    }
  };

  const handleUpload = (files: FileList | null) => {
    setUploadError("");
    if (!files) {
      return;
    }

    for (const file of files) {
      if (file.size >= MAX_IMAGE_SIZE) {
        setUploadError("File size is too large! Maximum 1mb");
        // @ts-ignore
        (document.getElementById("blob-file-input")! as HTMLInputElement).value =
        null;
        return;
      }
    }
  };

  const handleClose = () => {
    setBlob({...defaultBlob, tags: new Set<BlobTags>([])});
    (document.getElementById("create_blob_tags_dropdown") as HTMLDetailsElement).removeAttribute("open");
    // @ts-ignore
    (document.getElementById("blob-file-input")! as HTMLInputElement).value =
      null;
  };

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
      <dialog id="create_blob_modal" className="modal" onClose={handleClose}>
        <div className="modal-box flex flex-col space-y-4 overflow-visible">
          <h3 className="text-lg font-bold">Hello!</h3>
          {submitMutation.error && <p>Error! {JSON.parse(submitMutation.error.message)[0].message}</p>}
          <input
            type="text"
            placeholder="Enter a title"
            className="input input-bordered w-full max-w-xs"
            value={blob.title}
            onChange={(e) => setBlob({ ...blob, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={blob.description}
            onChange={(e) => setBlob({ ...blob, description: e.target.value })}
          />
          <details id="create_blob_tags_dropdown" className="dropdown">
            <summary className="m-1 btn">Select Tags</summary>
            <ul className="menu dropdown-content z-[1] w-fit rounded-box bg-base-100 p-2 shadow">
              <div className="flex flex-row flex-wrap">
                {Object.values(BlobTags).map((tag) => (
                  <label key={`${tag} select option`} className="label cursor-pointer w-1/3">
                    <li className="w-full">
                      <div className="flex flex-row justify-end form-control">
                        <span className="label-text">{capitalise(tag)}</span>
                        <input
                          id={tag}
                          type="checkbox"
                          className="checkbox"
                          checked={blob?.tags.has(tag)}
                          onChange={(e) =>
                            handleCheck(
                              e.target.id.toUpperCase(),
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </li>
                  </label>
                ))}
              </div>
            </ul>
          </details>
          {uploadError.length > 0 && <p>Error! {uploadError}</p>} 
          <input
            id="blob-file-input"
            type="file"
            multiple
            className="file-input file-input-bordered w-full max-w-xs"
            accept="image/png, image/jpeg"
            maxLength={3}
            onChange={(e) => handleUpload(e.target.files)}
          />
          <textarea
            className="textarea textarea-bordered"
            placeholder="Enter video links here, one per line"
            value={blob.videos}
            onChange={(e) => setBlob({ ...blob, videos: e.target.value })}
          ></textarea>

          <button className="btn" onClick={handleSubmit}>
            Create new Blob
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

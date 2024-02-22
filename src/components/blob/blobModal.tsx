import { Blob } from "@prisma/client"

type Props = {
  blob: Blob,
}

export default function BlobModal({ blob } : Props) {
  return (
    <dialog id={`blob_modal`} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{blob.title}</h3>
        <p className="py-4">{blob.description}</p>
        {blob.tags?.map((tag) => <p className="py-1">{tag}</p>)}
        {blob.images?.map((image) => <p className="py-1">{image}</p>)}
        <p className="py-2">{blob.likes}</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
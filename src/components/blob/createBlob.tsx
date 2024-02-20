export default function CreateBlob() {
  return (
    <>
      <button className="btn" onClick={()=>(document.getElementById('create_blob_modal')! as HTMLDialogElement).showModal()}>open modal</button>
      <dialog id="create_blob_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          
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
  )
}
type Props = {
  images: string[];
  videos: string[];
}

export default function BlobCarousel({ images, videos } : Props) {
  return (
    <div className="carousel w-full">
      {images?.map((image, index) => (
        <div key={"carousel_image_" + index} className="carousel-item relative w-full">
          <img id={`slide${index}`} src={image} className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            {(images.length > 1 || videos.length > 1) &&
              <>
                <a href={`#slide${index === 0 ? images.length - 1 : index - 1}`} className="btn btn-circle">❮</a> 
                <a href={`#slide${index === images.length - 1 ? 0 : index + 1}`} className="btn btn-circle">❯</a>
              </>
            }
          </div>
        </div> 
      ))}
      {videos?.map((video, index) => {
        const newIndex = index + images.length;
        // TODO: assign videos properly
        return (
          <div key={"carousel_video_" + newIndex} className="carousel-item relative w-full">
            <img id={`slide${newIndex}`} className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={`#slide${newIndex === 0 ? videos.length - 1 : newIndex - 1}`} className="btn btn-circle">❮</a> 
              <a href={`#slide${newIndex === videos.length - 1 ? 0 : newIndex + 1}`} className="btn btn-circle">❯</a>
            </div>
        </div> 
        )
      })}
    </div>
  )
}
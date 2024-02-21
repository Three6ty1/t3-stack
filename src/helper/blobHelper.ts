export const isValidYoutubeLink = (link: string) => {
  return new RegExp(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))((\w|-){11})(?:\S+)?$/).test(link);
}

export const capitalise = (str: string) => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';
}

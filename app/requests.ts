export const getManga = async (uuid: string) => {
  return fetch(`/api/mangas/${uuid}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed to fetch manga');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getMangasByPage = async (pageIndex: number, pageSize: number) => {
  return fetch('/api/mangas?' + new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString()
  }).toString())
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed to fetch mangas');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getImages = async (mangaUuid: string) => {
  return fetch(`/api/mangas/${mangaUuid}/images`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('failed to fetch images of manga');
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    })
};

export const updateMangas = async () => {
  return fetch('/api/mangas/update', { method: 'POST' })
    .then((response) => response.json())
    .catch((error) => {
      throw new Error(error);
    });
};

export const getMangaUpdateStatus = async () => {
  return fetch('/api/mangas/update')
    .then((response) => response.json())
    .catch((error) => console.error(error));
};

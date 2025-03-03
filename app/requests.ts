export const updateMangas = async () =>
  fetch('/api/mangas/update', { method: 'POST' })
    .then(response => response.json())
    .catch(error => console.error(error));

export const updateManga = async (
  uuid: string,
  manga: {
    title?: string,
    originalTitle?: string,
    fullTitle?: string,
  },
) =>
  fetch(`/api/mangas/${uuid}`, { method: 'PATCH', body: JSON.stringify(manga) })
    .then(response => response.json())
    .catch(error => console.error(error));

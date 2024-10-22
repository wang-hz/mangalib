import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((response) => response.json());

export const useManga = (uuid: string) => {
  const { data } = useSWR(`/api/mangas/${uuid}`, fetcher);
  return { manga: data };
};

export const usePagedMangas = (pageIndex: number, pageSize: number) => {
  const { data } = useSWR(`/api/mangas?` + new URLSearchParams({
    pageIndex: pageIndex.toString(),
    pageSize: pageSize.toString()
  }), fetcher);
  return { total: data?.total, mangas: data?.items };
};

export const useImages = (mangaUuid: string) => {
  const { data } = useSWR(`/api/mangas/${mangaUuid}/images`, fetcher);
  return { images: data?.images };
};

export const useMangasUpdateStatus = () => {
  const { data } = useSWR('/api/mangas/update', fetcher, { refreshInterval: 1000 });
  return { mangasUpdateStatus: data?.status };
};

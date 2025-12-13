import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useFetch from "../fech/use-fetch";

interface ZipAddressResult {
  address1: string;
  address2: string;
  address3: string;
}

interface ZipAddressResponse {
  results: ZipAddressResult[] | null;
}

export const useGetZipAddress = (zipcode: string) => {
  const uFetch = useFetch();

  const { isLoading, isError, isSuccess, data } = useQuery<ZipAddressResponse>({
    queryKey: ["getZipAddress", zipcode],
    queryFn: async () => {
      const query_params = new URLSearchParams({
        zipcode: zipcode,
      });
      return await uFetch(
        `https://zipcloud.ibsnet.co.jp/api/search?${query_params}`,
        "GET",
      );
    },
    placeholderData: keepPreviousData,
    enabled: !!zipcode,
  });

  if (isLoading && isError) {
    return null;
  }
  if (isSuccess) {
    return data;
  }
  return null;
};

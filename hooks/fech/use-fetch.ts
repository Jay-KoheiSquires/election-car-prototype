import axios, { AxiosError, Method } from "axios";
import { useRouter } from "next/router";
import React from "react";

export default function useFetch() {
  return async (
    url: string,
    methodType: Method | undefined,
    body: {} = {},
    headers: {} = {},
  ) => {
    try {
      return await axios({
        method: methodType,
        url: url,
        // headers: {
        //   ...headers,
        //   "Content-Type": "application/json",
        // },
        // withCredentials: true,
        // data: body,
      }).then((res: any) => {
        return res;
      });
    } catch (e: unknown) {
      const res = (e as AxiosError).response;
      switch (res?.status) {
        case 401:
        case 403:
        case 404:
        case 500:
          break;
        default:
          break;
      }
      return res;
    }
  };
}

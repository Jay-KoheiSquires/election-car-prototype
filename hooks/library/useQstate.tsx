import { Dispatch, SetStateAction, useEffect } from "react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";

// useQueryをラップしグローバルステートとして扱える様に定義
// useStateと同じように使える様なインタフェース
// ローカルストレージと統合してリロード時のデータ永続化に対応

export function useQState<T>(
  key: QueryKey,
  initial?: T,
): [T, Dispatch<SetStateAction<T>>] {
  // ローカルストレージのキーを生成
  const storageKey = Array.isArray(key) ? key.join('.') : String(key);

  // 初期値の取得ロジック
  const getInitialValue = (): T | undefined => {
    if (typeof window === 'undefined') {
      return initial;
    }

    // ローカルストレージから値を取得
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue !== null) {
      try {
        return JSON.parse(storedValue);
      } catch {
        return initial;
      }
    }
    return initial;
  };

  // React Query v5対応: オブジェクト形式でオプションを渡す
  const { data: stateValue } = useQuery<T>({
    queryKey: key,
    queryFn: () => getInitialValue() as T,
    enabled: false,
    initialData: initial,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  // クライアントサイドでの初期化
  useEffect(() => {
    const storedValue = getInitialValue();
    if (storedValue !== undefined && storedValue !== initial) {
      queryClient.setQueryData<T>(key, storedValue);
    }
  }, []);

  // 状態更新関数
  const stateSetter = (arg: ((arg: T) => T) | T): void => {
    let newValue: T;
    if (typeof arg === "function") {
      const prevValue = queryClient.getQueryData<T>(key);
      newValue = (arg as (prev: T) => T)(prevValue as T);
    } else {
      newValue = arg;
    }

    // react-queryの更新
    queryClient.setQueryData<T>(key, newValue);

    // クライアントサイドでのみローカルストレージを更新
    if (typeof window !== 'undefined') {
      try {
        if (newValue === undefined || newValue === null) {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(newValue));
        }
      } catch (error) {
        console.warn('Failed to save state to localStorage:', error);
      }
    }
  };

  return [stateValue as T, stateSetter];
}

// ローカルストレージのクリア用ユーティリティ関数
export const clearQStateStorage = (keys: QueryKey[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  keys.forEach(key => {
    const storageKey = Array.isArray(key) ? key.join('.') : String(key);
    localStorage.removeItem(storageKey);
  });
};

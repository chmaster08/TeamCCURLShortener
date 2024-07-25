import { AccessDataType } from "@/features/analyze/types/TimeSeriesType";
import { useCallback, useEffect, useState } from "react";
import { URLItem } from "../types/urlItem";

export function useAccessData(selectedURL: URLItem | undefined) {
  const [accessData, setAccessData] = useState<AccessDataType[]>([]);

  const fetchAccessData = useCallback(async (url: URLItem) => {
    // TODO :仮データ
    const dummyData = Array.from({ length: 100 }, (_, i) => ({
      timestamp: Date.now() - (100 - i) * 3600000,
      value: Math.floor(Math.random() * 100),
    }));
    setAccessData(dummyData);
  }, []);

  useEffect(() => {
    if (selectedURL) {
      fetchAccessData(selectedURL);
    }
  }, [selectedURL, fetchAccessData]);

  return { accessData };
}

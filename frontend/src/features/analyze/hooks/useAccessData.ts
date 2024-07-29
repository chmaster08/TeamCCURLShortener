import { AccessDataType } from "@/features/analyze/types/TimeSeriesType";
import { useCallback, useEffect, useState } from "react";
import { URLItem } from "../types/urlItem";
import Url from "@/libs/model/url";

export function useAccessData(selectedURL: Url | null) {
  const [accessData, setAccessData] = useState<AccessDataType[]>([]);

  const fetchAccessData = useCallback(async (url: Url | null) => {
    // TODO :仮データ
    if (url === null) {
      setAccessData([]);
      return;
    }
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

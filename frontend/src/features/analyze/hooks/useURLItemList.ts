import { useCallback, useEffect, useState } from "react";
import { URLItem } from "../types/urlItem";

export function useURLItemList() {
  const [urlItemList, setURLItemList] = useState<URLItem[]>([]);
  const [filteredURLs, setFilteredURLs] = useState<URLItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<URLItem | undefined>(
    undefined,
  );
  const fetchURLList = useCallback(async () => {
    // TODO: 仮データ
    const dummyFetch = () =>
      Promise.resolve([
        {
          OriginalURL: "https://www.google.com",
          ShortenedURL: "https://bit.ly/3t1Yw8A",
        },
        {
          OriginalURL: "https://www.facebook.com",
          ShortenedURL: "https://bit.ly/3t1Yw8B",
        },
        {
          OriginalURL: "https://www.twitter.com",
          ShortenedURL: "https://bit.ly/3t1Yw8C",
        },
        {
          OriginalURL: "https://www.yahoo.co.jp",
          ShortenedURL: "https://bit.ly/3t1Yw8D",
        },
        {
          OriginalURL: "https://www.amazon.co.jp",
          ShortenedURL: "https://bit.ly/3t1Yw8E",
        },
      ]);

    const data = await dummyFetch();
    setURLItemList(data);
    setFilteredURLs(data);
  }, []);

  useEffect(() => {
    fetchURLList();
  }, [fetchURLList]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredURLs(urlItemList);
    } else {
      const filtered = urlItemList.filter((item) =>
        item.OriginalURL.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredURLs(filtered);
    }
  }, [searchTerm, urlItemList]);

  const handleSearchChanged = (searchText: string) => {
    setSearchTerm(searchText);
  };

  const handleSelectionChange = (url: URLItem | undefined) => {
    if (url) {
      console.log(url.OriginalURL);
      setSelectedItem(url);
    }
  };

  return {
    filteredURLs,
    handleSearchChanged,
    selectedItem,
    handleSelectionChange,
  };
}

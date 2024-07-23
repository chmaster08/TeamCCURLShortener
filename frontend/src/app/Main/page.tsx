"use client";

import { createShortenedUrl, ShortenedUrl, urls } from "@/app/Main/mock";
import React, { useState } from "react";

export default function Main() {
  const [urls, setUrls] = useState<ShortenedUrl>({
    original: "",
    shortened: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateUrl = async () => {
    console.log("handleCreateUrl", urls);
    try {
      await createShortenedUrl(urls);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setUrls({ original: "", shortened: "" });
    setIsSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold">URL短縮</h2>
      <div className="max-w-md">
        <div className="mt-8 w-full">
          <div>短縮元URL</div>
          <input
            className="mt-1 w-full p-2 rounded border border-gray-300"
            placeholder="https://example.com"
            value={urls.original}
            onChange={(e) => {
              setUrls({ ...urls, original: e.target.value });
            }}
          />
        </div>
        <div className="mt-2 w-full">
          <div>短縮URL</div>
          <div className="flex items-center">
            <span>teamcc.com/</span>
            <input
              type="text"
              className="mt-1 ml-1 w-full p-2 rounded border border-gray-300"
              value={urls.shortened}
              onChange={(e) => {
                setUrls({ ...urls, shortened: e.target.value });
              }}
            />
          </div>
        </div>
      </div>

      {!isSuccess ? (
        <button
          type="button"
          className="text-white bg-blue-500 py-2 px-4 mt-4 rounded-lg"
          onClick={handleCreateUrl}
        >
          生成する
        </button>
      ) : (
        <button
          type="button"
          className="text-blue-500 bg-white py-2 px-4 mt-4 rounded-lg"
          onClick={handleReset}
        >
          もう一度生成する
        </button>
      )}
    </div>
  );
}

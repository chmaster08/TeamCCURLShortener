"use client";

import { useState } from "react";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { createUrl } from "@/libs/urls";
import { createClient } from "@/utils/supabase/client";
import { suggestUrl } from "@/libs/chatGpt";

// TODO: unify field name
export type ShortenedUrl = {
  name: string;
  original: string;
  shortened: string;
};

export default function Main() {
  const supabase = createClient();
  const [urls, setUrls] = useState<ShortenedUrl>({
    name: "",
    original: "",
    shortened: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUrl = async () => {
    console.log("handleCreateUrl", urls);
    try {
      setIsLoading(true);
      // TODO: 被った場合の処理
      const shortenedUrl = await suggestUrl(urls.original);
      await createUrl(supabase, urls.name, urls.original, shortenedUrl);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrls({ name: "", original: "", shortened: "" });
    setIsSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-3xl font-bold">URL短縮</h2>
      <form
        className="max-w-md"
        onSubmit={async (e) => {
          e.preventDefault();
          await handleCreateUrl();
        }}
      >
        {/* TODO: Handle empty string */}
        <div className="mt-8 w-full">
          <div>名前</div>
          <input
            className="mt-1 w-full p-2 rounded border border-gray-300"
            placeholder="Team CCの議事録"
            value={urls.name}
            onChange={(e) => {
              setUrls({ ...urls, name: e.target.value });
            }}
          />
        </div>
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
        {/* inputが複数のときにEnterキーで送信する用 */}
        <input type="submit" className="hidden" />
      </form>

      {!isSuccess ? (
        <button
          type="button"
          className="text-white bg-blue-500 w-32 py-2 px-4 mt-4 rounded-lg"
          onClick={handleCreateUrl}
        >
          {isLoading ? <HourglassEmptyIcon /> : "生成する"}
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

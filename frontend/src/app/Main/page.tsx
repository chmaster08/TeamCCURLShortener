"use client";

import { useState } from "react";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { createUrl } from "@/libs/urls";
import { createClient } from "@/utils/supabase/client";
import { suggestOtherUrl, suggestUrl } from "@/libs/chatGpt";
import { IconButton } from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopy";

// TODO: unify field name
export type ShortenedUrl = {
  original: string;
  shortened: string;
};

export default function Main() {
  const supabase = createClient();
  const [urls, setUrls] = useState<ShortenedUrl>({
    original: "",
    shortened: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [created, setCreated] = useState(false);

  const [validationError, setValidationError] = useState("");

  const [useCustomUrl, setUseCustomUrl] = useState(false);

  const [existingUrls, setExistingUrls] = useState<string[]>([]);

  const validateUrl = (url: string) => {
    const validUrl = new RegExp("https?://[\\w!?/+-_~;.,*&@#$%()\\[\\]]+", "i");
    return validUrl.test(url);
  };

  const handleCreateUrl = async () => {
    if (!validateUrl(urls.original)) {
      setValidationError("URLが有効ではありません");
      return;
    }
    try {
      setIsLoading(true);
      // TODO: 被った場合の処理
      const shortenedUrl = await suggestUrl(urls.original);
      setExistingUrls([...existingUrls, shortenedUrl]);
      setUrls({ ...urls, shortened: shortenedUrl });
      await createUrl(supabase, urls.original, shortenedUrl);
      setIsLoading(false);
      setCreated(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleReCreateUrl = async () => {
    if (!validateUrl(urls.original)) {
      setValidationError("URLが有効ではありません");
      return;
    }
    try {
      setIsLoading(true);
      // TODO: 被った場合の処理
      const shortenedUrl = await suggestOtherUrl(urls.original, existingUrls);
      setExistingUrls([...existingUrls, shortenedUrl]);
      setUrls({ ...urls, shortened: shortenedUrl });
      await createUrl(supabase, urls.original, shortenedUrl);
      setIsLoading(false);
      setCreated(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleCustomMode = async () => {
    console.log("handleCreateUrl", urls);
    setUrls({ original: urls.original, shortened: "" });
    setUseCustomUrl(true);
  };

  const handleCreateUrlCustom = async () => {
    console.log("handleCreateUrl", urls);
    try {
      setIsLoading(true);
      await createUrl(supabase, urls.original, urls.shortened);
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrls({ original: "", shortened: "" });
    setIsSuccess(false);
  };

  const handleBack = () => {
    setUseCustomUrl(false);
    setCreated(false);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  if (useCustomUrl) {
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
          <div className="mt-8 w-full">
            <div>
              <strong>短縮元URL</strong>
            </div>
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
            <div>
              <strong>短縮URL</strong>
            </div>
            <div className="flex items-center">
              <span>tcc.0t0.jp/</span>
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
        <div className="flex space-x-4 mt-4 ">
          <button
            type="button"
            className="text-blue-500 bg-white py-2 px-4 mt-4 rounded-lg"
            onClick={handleBack}
          >
            戻る
          </button>
          {!isSuccess ? (
            <button
              type="button"
              className="text-white bg-blue-500 w-32 py-2 px-4 mt-4 rounded-lg"
              onClick={handleCreateUrlCustom}
            >
              {isLoading ? <HourglassEmptyIcon /> : "登録する"}
            </button>
          ) : (
            <button
              type="button"
              className="text-blue-500 bg-white py-2 px-4 mt-4 rounded-lg"
              onClick={handleReset}
            >
              はじめからやり直す
            </button>
          )}
        </div>
      </div>
    );
  }
  if (!created) {
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
          {validationError !== "" && (
            <div className="text-red-500 mt-2">{validationError}</div>
          )}
          {/* inputが複数のときにEnterキーで送信する用 */}
          <input type="submit" className="hidden" />
        </form>
        <button
          type="button"
          className="text-white bg-blue-500 w-32 py-2 px-4 mt-4 rounded-lg"
          onClick={handleCreateUrl}
        >
          {isLoading ? <HourglassEmptyIcon /> : "生成する"}
        </button>
      </div>
    );
  } else {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-3xl font-bold">URL短縮</h2>
        <div className="max-w-md">
          <div className="mt-4">
            <p>
              <strong>短縮元URL</strong>
              <br />
              {urls.original}
            </p>
          </div>
          <div className="mt-4">
            <p>
              <strong>短縮URL</strong>
              <br />
              {urls.shortened}
            </p>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              type="button"
              className="text-blue-500 bg-white py-2 px-4 mt-4 rounded-lg"
              onClick={handleBack}
            >
              戻る
            </button>
            <button
              type="button"
              className="text-white bg-blue-500 py-2 px-4 mt-4 rounded-lg"
              onClick={handleReCreateUrl}
            >
              {isLoading ? <HourglassEmptyIcon /> : "もう一度生成する"}
            </button>
            <IconButton
              aria-label="copy"
              onClick={() => handleCopyLink(urls.shortened)}
            >
              <CopyIcon />
            </IconButton>
            <button
              type="button"
              className="text-blue-500 mt-4"
              onClick={handleCustomMode}
            >
              変更する
            </button>
          </div>
        </div>
      </div>
    );
  }
}

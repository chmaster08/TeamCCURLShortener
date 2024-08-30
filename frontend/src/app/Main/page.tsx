"use client";

import { useState } from "react";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import {
  createUrl,
  searchUrl,
  searchUrlByShortened,
  updateUrl,
} from "@/libs/urls";
import { createClient } from "@/utils/supabase/client";
import { suggestOtherUrl, suggestUrl } from "@/libs/chatGpt";
import { Checkbox, FormControlLabel, IconButton } from "@mui/material";
import CopyIcon from "@mui/icons-material/ContentCopy";
import { v4 as uuidv4 } from "uuid";
import { env } from "process";
import Url from "@/libs/model/url";
import { useAuth } from "@/hooks/AuthContext";

export default function Main() {
  const supabase = createClient();
  const [urls, setUrls] = useState<Url>({
    id: uuidv4(),
    name: "",
    original: "",
    shortCode: "",
    createdAt: new Date().toLocaleString(),
    createdby: "",
  });

  const {user} = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [created, setCreated] = useState(false);

  const [validationError, setValidationError] = useState("");

  const [useCustomUrl, setUseCustomUrl] = useState(false);

  const [id, setId] = useState<number | null>(null);

  const [existingUrls, setExistingUrls] = useState<string[]>([]);

  const [isAutoCopy, setIsAutoCopy] = useState(true);

  const validateUrl = (url: string) => {
    const validUrl = new RegExp("https?://[\\w!?/+-_~;.,*&@#$%()\\[\\]]+", "i");
    return validUrl.test(url);
  };

  const domain = process.env.NEXT_PUBLIC_REDIRECT_DOMAIN;

  const handleCreateUrl = async () => {
    if (!validateUrl(urls.original)) {
      setValidationError("URLが有効ではありません");
      return;
    }
    try {
      setIsLoading(true);

      const gptRes = await suggestUrl(urls.original);

      const shortenedPattern = /shortCode:\s*([^,\s]+)/;
      const namePattern = /name:\s*(.+)/;

      const shortenedMatch = gptRes.match(shortenedPattern);
      const nameMatch = gptRes.match(namePattern);

      if (shortenedMatch && nameMatch) {
        let shortenedUrl = shortenedMatch[1].trim();
        let name = nameMatch[1].trim();

        const existing: string[] = [];

        while (true) {
          const shortCodeListInDB = await searchUrlByShortened(
            supabase,
            shortenedUrl,
          );
          if (shortCodeListInDB.length === 0) {
            break;
          }
          existing.push(shortenedUrl);
          const otherGptRes = await suggestOtherUrl(urls.original, existing);
          const otherShortenedMatch = otherGptRes.match(shortenedPattern);
          const otherNameMatch = otherGptRes.match(namePattern);
          if (otherShortenedMatch && otherNameMatch) {
            shortenedUrl = otherShortenedMatch[1].trim();
            name = otherNameMatch[1].trim();
          }
        }

        setExistingUrls([...existingUrls, ...existing]);
        setUrls({ ...urls, name: name, shortCode: shortenedUrl });
        await createUrl(supabase, urls.id, name, urls.original, shortenedUrl, user?.email || "");
        if (isAutoCopy) {
          navigator.clipboard.writeText(`${domain}/${shortenedUrl}`);
        }
        setIsLoading(false);
        setCreated(true);
      }
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
      const gptRes = await suggestOtherUrl(urls.original, existingUrls);

      const shortenedPattern = /shortCode:\s*([^,]+)/;
      const namePattern = /name:\s*(.+)/;

      const shortenedMatch = gptRes.match(shortenedPattern);
      const nameMatch = gptRes.match(namePattern);

      if (shortenedMatch && nameMatch) {
        let shortenedUrl = shortenedMatch[1].trim();
        let name = nameMatch[1].trim();

        const existing: string[] = [];

        while (true) {
          const shortCodeListInDB = await searchUrlByShortened(
            supabase,
            shortenedUrl,
          );
          if (shortCodeListInDB.length === 0) {
            break;
          }
          existing.push(shortenedUrl);
          const otherGptRes = await suggestOtherUrl(urls.original, existing);
          const otherShortenedMatch = otherGptRes.match(shortenedPattern);
          const otherNameMatch = otherGptRes.match(namePattern);
          if (otherShortenedMatch && otherNameMatch) {
            shortenedUrl = otherShortenedMatch[1].trim();
            name = otherNameMatch[1].trim();
          }
        }

        setExistingUrls([...existingUrls, ...existing]);
        setUrls({ ...urls, name, shortCode: shortenedUrl });
        await updateUrl(supabase, urls.id, name, shortenedUrl);
        setIsLoading(false);
        setCreated(true);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleCustomMode = async () => {
    console.log("handleCreateUrl", urls);
    setUrls({ ...urls, name: "", original: urls.original, shortCode: "" });
    setUseCustomUrl(true);
  };

  const handleCreateUrlCustom = async () => {
    console.log("handleCreateUrl", urls);
    try {
      setIsLoading(true);
      const response = await searchUrl(supabase, urls.original);
      const id = response[0].id;
      setId(id);
      const shortURL = domain + urls.shortCode;
      await updateUrl(supabase, id, urls.name, shortURL);
      setIsLoading(false);
      setIsSuccess(true);
      setCreated(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUrls({ ...urls, name: "", original: "", shortCode: "" });
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
          className="max-w-lg"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleCreateUrl();
          }}
        >
          <div className="mt-8 w-full">
            <div>
              <strong>名前</strong>
            </div>
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
            <div className="flex items-center flex-wrap">
              <span>{domain}/</span>
              <input
                className="mt-1 w-full p-2 rounded border border-gray-300"
                placeholder="example"
                value={urls.shortCode}
                onChange={(e) => {
                  setUrls({ ...urls, shortCode: e.target.value });
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
          <button
            type="button"
            className="text-white bg-blue-500 w-32 py-2 px-4 mt-4 rounded-lg"
            onClick={handleCreateUrlCustom}
          >
            {isLoading ? <HourglassEmptyIcon /> : "変更する"}
          </button>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={isAutoCopy}
                onChange={(e) => setIsAutoCopy(e.target.checked)}
              />
            }
            label="生成した短縮URLを自動でコピーする"
            className="mt-4"
          />
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
              <strong>名前</strong>
              <br />
              {urls.name}
            </p>
          </div>
          <div className="mt-4">
            <p>
              <strong>短縮URL</strong>
              <br />
              {`${domain}/${urls.shortCode}`}
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
              {isLoading ? <HourglassEmptyIcon /> : "生成し直す"}
            </button>
            <IconButton
              aria-label="copy"
              onClick={() => handleCopyLink(`${domain}/${urls.shortCode}`)}
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

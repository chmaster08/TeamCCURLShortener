export const domain = "teamcc.com";

export type ShortenedUrl = {
  original: string;
  shortened: string;
};

export const urls: ShortenedUrl[] = [
  {
    original: "https://example.com",
    shortened: "a",
  },
];

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const createShortenedUrl = async (
  req: ShortenedUrl,
): Promise<ShortenedUrl> => {
  if (req.shortened === "" || req.original === "") {
    throw new Error("Invalid URL");
  }

  if (urls.some((url) => url.shortened === req.shortened)) {
    throw new Error("URL conflicts");
  }

  await sleep(2000);

  console.log("createShortenedUrl", req);
  return req;
};

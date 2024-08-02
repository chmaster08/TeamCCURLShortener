type Response = {
  id: string;
  object: string;
  created: number;
  model: string;
  system_fingerprint: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export async function suggestUrl(url: string): Promise<string> {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const content = `${url}
このurlの内容から、短縮urlを考えて下さい
- urlのサイトに書かれている内容も必ず踏まえて下さい
- tcc.0t0.jpから初めて下さい
例:tcc.0t0.jp/example
- 分かりやすいurlと名前にしてください
- 必ず,考えたurlと名前だけを返してください
- 必ず,shortened: tcc.0t0.jp/example, name: teamCの議事録の形式で返してください`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content,
        },
      ],
    }),
  });
  const jsonRes = (await res.json()) as Response;
  return jsonRes.choices[0].message.content;
}

export async function suggestOtherUrl(
  url: string,
  existingUrls: string[],
): Promise<string> {
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const content = `${url}
このurlの内容から、短縮urlを考えて下さい
- urlのサイトに書かれている内容も必ず踏まえて下さい
- tcc.0t0.jpから初めて下さい
例:tcc.0t0.jp/example
- 分かりやすいurlにしてください
- 必ず,考えたurlと名前だけを返してください
- 必ず,shortened: tcc.0t0.jp/example, name: teamCの議事録の形式で返してください
- これらのurl以外にしてください[${existingUrls.join(", ")}]`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content,
        },
      ],
    }),
  });
  const jsonRes = (await res.json()) as Response;
  return jsonRes.choices[0].message.content;
}
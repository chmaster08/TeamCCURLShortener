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
- ccから初めて下さい
例:cc/example
- 分かりやすいurlにしてください
- 考えたurlのみを返して下さい`;
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

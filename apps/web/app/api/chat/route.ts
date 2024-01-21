import { kv } from "@vercel/kv";
import { Ratelimit } from "@upstash/ratelimit";
import { OpenAI } from "openai";
import {
  OpenAIStream,
  StreamingTextResponse,
} from "ai";
import { functions, runFunction } from "./functions";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

const SYSTEM_PROMPT: string = `
The following is a conversation with an Waterloti AI Open Source Project finder assistant. 
The assistant is helpful, creative, clever, and very friendly, when building tables you build them like this.
| Repository | Primary Language | Stars | Description |
|------------|------------------|-------|-------------|
| [Repo Name](URL) | Language | Stars | Description |
`

export async function POST(req: Request) {
  if (
    process.env.NODE_ENV !== "development" &&
    process.env.KV_REST_API_URL &&
    process.env.KV_REST_API_TOKEN
  ) {
    const ip = req.headers.get("x-forwarded-for");
    const ratelimit = new Ratelimit({
      redis: kv,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
    });

    const { success, limit, reset, remaining } = await ratelimit.limit(
      `Waterloti_ratelimit_${ip}`,
    );

    if (!success) {
      return new Response("You have reached your request limit for the day.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  let { messages } = await req.json();

  if (!(messages.length > 0 && messages[0].role === 'system')) {
    // Prepend the system prompt if it's not there
    const systemMessage = {
        content: SYSTEM_PROMPT,
        role: 'system',
        name: 'Waterloti',
    };
    messages = [systemMessage, ...messages];
}


  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages,
    stream: true,
    functions,
    function_call: "auto",
  });

  // @ts-ignore
  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args);
      const newMessages = createFunctionCallMessages(result);
      return openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        stream: true,
        messages: [...messages, ...newMessages],
      });
    },
  });

  return new StreamingTextResponse(stream);
}

"use client";
import Image from 'next/image';
import React , { useRef, useCallback, useEffect, useState } from "react";
import { useChat } from "ai/react";
import va from "@vercel/analytics";
import { shallow } from 'zustand/shallow';
import clsx from "clsx";
import { GithubIcon, LoadingCircle, SendIcon, AttachmentIcon } from "./icons";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Textarea from "react-textarea-autosize";
import { toast } from "sonner";
import { fileOpen, FileWithHandle } from 'browser-fs-access';
import { useAttachmentsStore } from './store-attachments';

const examples = [
  "Please provide me with the top 5 trending repositories on Github in markdown table format. The table should include columns such as repository name, primary language, stars, and description.",
  "Please provide me with the top 10 trending repositories on Github in the past week, where the primary language is Typescript. The information should be presented in a markdown table format, including columns such as repository name, primary language, stars, and description.",
  "Please provide me with some ChatGPT alternatives for me to start contributing code to.",
];

export type AttachmentSourceOriginDTO = 'drop' | 'paste';
export type AttachmentSourceOriginFile = 'camera' | 'file-open' | 'clipboard-read' | AttachmentSourceOriginDTO;


export default function Chat() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFileProcessing, setIsFileProcessing] = useState(false);
  const { attachments, clearAttachments, createAttachment } = useAttachmentsStore(state => ({
    attachments: state.attachments,
    clearAttachments: state.clearAttachments,
    createAttachment: state.createAttachment,
    removeAttachment: state.removeAttachment,
  }), shallow);


  const attachAppendFile = useCallback((origin: AttachmentSourceOriginFile, fileWithHandle: FileWithHandle, overrideFileName?: string) => {
    setIsFileProcessing(true);
    clearAttachments();
    createAttachment({
      media: 'file', origin, fileWithHandle, refPath: overrideFileName || fileWithHandle.name,
    }).then(() => {

      setIsFileProcessing(false);
    }).catch((error) => {
      setIsFileProcessing(false);
      va.track("Resume errored", {
        error: error.message,
      });
    })
  }, [clearAttachments, createAttachment]);

  const handleAttachFilePicker = useCallback(async () => {
    try {
      const selectedFiles: FileWithHandle[] = await fileOpen({ multiple: true });
      selectedFiles.forEach(file =>
        void attachAppendFile('file-open', file),
      );
    } catch (error) {
      // ignore...
    }
  }, [attachAppendFile]);


  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        va.track("Rate limited");
        return;
      } else {
        va.track("Chat initiated");
      }
    },
    onError: (error) => {
      va.track("Chat errored", {
        input,
        error: error.message,
      });
    },
  });


  useEffect(() => {
    if (!isFileProcessing && attachments?.length > 0 && attachments[0].outputs?.length > 0) {
      if (attachments[0].outputs[0].type === 'text-block') {
        const cleanMessage = `[W]Give me some good repositories for me to contribute to with my current skills ${attachments[0].outputs[0].text}`;
        setInput(cleanMessage);
        toast.success("Resume loaded in the session");
        va.track("Resume loaded in the session");
      } else {
        toast.error("Failed to parse");
      }
    }
  }, [attachments, isFileProcessing, setInput]);

  useEffect(() => {
    if (input.startsWith("[W]Give me some good repositories for me")) {
      formRef.current?.requestSubmit();
    }
  }, [input]);
  

  const disabled = isLoading || input.length === 0;

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
        <a
          href="/"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <Image
            src="/waterloti.png"
            alt="Waterloti Logo"
            width={45}
            height={45}
            priority
          />
        </a>
        <a
          href="https://github.com/maron-ai/waterloti"
          target="_blank"
          className="rounded-lg p-2 transition-colors duration-200 hover:bg-stone-100 sm:bottom-auto"
        >
          <GithubIcon width={35} height={35} />
        </a>
      </div>
      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  "p-1.5 text-white",
                  message.role === "assistant" ? "bg-green-500" : "bg-black",
                )}
              >
                {message.role === "user" ? (
                  <User width={20} />
                ) : (
                  <Bot width={20} />
                )}
              </div>
              <ReactMarkdown
                className="prose mt-1 w-full break-words prose-p:leading-relaxed"
                remarkPlugins={[remarkGfm]}
                components={{
                  // open links in new tab
                  a: (props) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))
      ) : (
        <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
          <div className="flex flex-col space-y-4 p-7 sm:p-10">
            <h1 className="text-lg font-semibold text-black">
              Welcome to Waterloti!
            </h1>
            <p className="text-gray-500">
                Odd name, right? Just upload your resume and let&apos;s find you some cool open source projects that fit your style. No resume? No sweat. Check out hot GitHub projects directly. Make coding fun again!
            </p>
          </div>
          <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
            {examples.map((example, i) => (
              <button
                key={i}
                className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
                onClick={() => {
                  setInput(example);
                  inputRef.current?.focus();
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        {/* Upload attachment button */}

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <button
              className="absolute inset-y-0 left-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all bg-white"
              type="button"
              onClick={handleAttachFilePicker}
            >
              {isFileProcessing ? (
                <LoadingCircle />
              ) : (
                <AttachmentIcon className="h-5 w-5 text-gray-300" />
              )}
          </button>

          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 pl-10 focus:outline-none "
          />

          {/* Submit button */}
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400">
          Built with {"<3"} by{" "}
          <a
            href="https://maron.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Maron AI
          </a>{" "}
          and{" "}
          <a
            href="https://sdk.vercel.ai/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Vercel AI SDK
          </a>
          .{" "}
          <a
            href="https://github.com/maron-ai/waterloti"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            View the repo
          </a>
        </p>
      </div>
    </main>
  );
}

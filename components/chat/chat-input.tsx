"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import qs from "query-string";
import { useModal } from "@/hook/use-modal-store";
import EmojiPicker from "../emoji-picker";

interface ChatInputProps {
  apiUrl?: string;
  query: Record<string, any>;
  name: string;
  type: "channel" | "member";
}

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ name, query, type, apiUrl }: ChatInputProps) => {
  const { onOpen } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // form submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = qs.stringifyUrl({
      url: apiUrl || "",
      query,
    });

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-cache",
    });

    const resData = await res.json();

    if (res.ok && resData.success) {
      form.reset();
    } else {
      toast({
        title: resData.error,
      });
    }
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 w-full px-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl className="my-2">
                <div className="relative w-full h-12">
                  <ActionTooltip description="media attachment">
                    <Plus
                      onClick={() => {
                        onOpen("messageFile", { apiUrl, query });
                      }}
                      className="cursor-pointer w-7 h-7 p-1 rounded-full  dark:bg-zinc-800 bg-zinc-300 absolute top-2.5 left-3 transition-colors dark:hover:bg-zinc-800/80 hover:bg-zinc-300/80"
                    />
                  </ActionTooltip>
                  <Input
                    autoCorrect="false"
                    autoSave="false"
                    autoComplete="off"
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "channel" ? "#" + name : name
                    }`}
                    {...field}
                    className="px-14 h-12 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none text-base"
                  />
                  <ActionTooltip description="emoji picker">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value}${emoji}`)
                      }
                    />
                  </ActionTooltip>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;

"use client";

import { Member, MemberType, Profile } from "@prisma/client";
import { useEffect, useState } from "react";
import UserAvatar from "../user-avatar";
import { checkFullName } from "@/lib/helper";
import { memberIcons } from "../servers/server-sidebar";
import ActionTooltip from "../action-tooltip";
import { checkImageType } from "../file-upload";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Edit, File, Trash } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { useModal } from "@/hook/use-modal-store";
import qs from "query-string";
import { toast } from "../ui/use-toast";
import { useParams, usePathname, useRouter } from "next/navigation";

interface ChatItemProps {
  messageId: string;
  content: string;
  fileUrl?: string | null;
  deleted?: boolean | null;
  isUpdated: boolean;
  timestamp: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  currentMember?: Member;
  currentProfile?: Profile;
  member: Member & {
    profile: Profile;
  };
}

const formSchema = z.object({
  content: z.string().min(1, {
    message: "Content cannot be empty!",
  }),
});

const ChatItem = ({
  content,
  currentMember,
  currentProfile,
  deleted,
  fileUrl,
  isUpdated,
  member,
  messageId,
  socketQuery,
  socketUrl,
  timestamp,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const params = useParams();
  const path = usePathname();
  const isGlobal = path?.includes("/direct/me");
  const fileExt = fileUrl?.split(".").pop();
  const isImage = fileUrl && checkImageType(fileExt);
  const isPDF = !isImage && fileUrl;
  const isOwner = currentMember?.id === member.id;
  const isOwnerForFriendCon = currentProfile?.id === member.id;
  const isForFriendCon = !!currentProfile;
  const isAdmin = isForFriendCon
    ? isOwnerForFriendCon
    : currentMember?.role === MemberType.ADMIN;
  const isModerator = isForFriendCon
    ? isOwnerForFriendCon
    : currentMember?.role === MemberType.MODERATOR;
  const deletable = !deleted && (isAdmin || isModerator || isOwner);
  const editable = !deleted && isOwner && !fileUrl;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = qs.stringifyUrl({
      url: `${socketUrl}/${messageId}`,
      query: socketQuery,
    });

    const res = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify({ content: values.content }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-cache",
    });

    const resData = await res.json();

    if (res.ok && resData.success) {
      form.reset();
      toast({
        title: "Successfully edited the message",
      });
      setIsEditing(false);
    } else {
      toast({
        title: resData.error,
      });
    }
  }

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    function pressEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsEditing(false);
      }
    }

    document.addEventListener("keydown", pressEscapeKey);

    return () => {
      document.removeEventListener("keydown", pressEscapeKey);
    };
  });

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  function handleUserClick() {
    if (isGlobal) {
      return;
    }

    if (currentMember?.id === member.id) {
      return;
    }

    if (!params) {
      return;
    }

    return router.push(
      `/servers/${params?.serverId}/conversations/${member.id}`
    );
  }

  return (
    <div className="transition-all cursor-pointer relative group my-2 py-4 dark:bg-zinc-900/50 bg-zinc-200/30  w-full px-4 dark:hover:bg-zinc-900/75 hover:bg-zinc-200/50">
      <div className="flex items-center gap-2">
        <UserAvatar
          onClick={handleUserClick}
          imageUrl={member?.profile?.imageUrl}
          name={member?.profile?.name}
        />
        <div className="flex items-center gap-x-1">
          <h3
            onClick={handleUserClick}
            className="transition-all hover:underline font-semibold dark:text-zinc-300 text-zinc-600"
          >
            {checkFullName(member.profile.name)}
          </h3>
          {!isGlobal && (
            <ActionTooltip description={member.role}>
              {memberIcons[member.role]}
            </ActionTooltip>
          )}
          <span className="text-sm dark:text-zinc-400 text-zinc-700">
            {timestamp}
          </span>
        </div>
      </div>
      {!fileUrl && !isEditing && (
        <p
          className={cn(
            "mt-1 dark:text-zinc-200 text-zinc-800 text-[17px]",
            deleted && "italic dark:text-zinc-400 text-zinc-700 mt-2 text-sm"
          )}
        >
          {content}
          {isUpdated && !deleted && (
            <span className="text-[13px] mx-2 dark:text-zinc-400 text-zinc-700">
              (edited)
            </span>
          )}
        </p>
      )}
      {!fileUrl && isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-3"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="w-full flex items-center">
                      <Input
                        autoFocus
                        disabled={isLoading}
                        placeholder="Edit your content"
                        {...field}
                        className="text-base w-full  focus-visible:ring-0 focus-visible:outline-none rounded-none focus-visible:border-none border-none"
                      />
                      <Button type="submit" size={"sm"}>
                        Save
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Press escape to cancel, enter to save
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
      {isImage && (
        <Link href={fileUrl} target="_blank" className=" h-[150px] mt-3">
          <Image
            src={fileUrl}
            alt={fileExt || "file"}
            width={220}
            height={170}
            className="mt-3"
          />
        </Link>
      )}
      {isPDF && (
        <div className="relative h-16 w-full mt-3">
          <div className="px-4 dark:bg-zinc-800 bg-zinc-200 flex items-center justify-start w-full h-full rounded-md">
            <File className="w-14 h-14 text-indigo-500" />
            <Link
              href={fileUrl}
              target="_blank"
              className="line-clamp-3 ml-2 underline text-blue-600 transition-all hover:text-blue-600/75 hover:no-underline"
            >
              {fileUrl}
            </Link>
          </div>
        </div>
      )}

      {deletable && (
        <div className="absolute top-1 right-3 hidden group-hover:flex items-center gap-x-2 transition-all">
          {editable && (
            <ActionTooltip description="Edit" align="center" side="top">
              <Edit
                className="hidden group-hover:block w-5 h-5 transition-all dark:text-zinc-300 text-zinc-800   dark:hover:text-zinc-100 hover:text-zinc-700"
                onClick={() => setIsEditing(true)}
              />
            </ActionTooltip>
          )}
          <ActionTooltip description="Delete" align="center" side="top">
            <Trash
              className="hidden group-hover:block w-5 h-5 transition-all text-red-500/80 hover:text-red-500"
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${messageId}`,
                  query: socketQuery,
                })
              }
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;

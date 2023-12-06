"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Wrench } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/hook/use-modal-store";
import { ChannelType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Channel name is required!",
    })
    .min(2, {
      message: "Channel name must be at least 2 characters.",
    })
    .refine((data) => data !== "general", {
      message: "Channel name could not be 'general'!",
    }),
  type: z.nativeEnum(ChannelType),
});

const EditChannelModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const { server, channel } = data;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  });

  // form submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(`/api/channels/${channel?.id}/${server?.id}`, {
      method: "PATCH",
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

      onClose();
      router.push(`/servers/${server?.id}`);
      toast({
        title: "Successfully edited the Channel",
      });
      router.refresh();
    } else {
      toast({
        title: resData.error,
      });
    }
  }

  const isLoading = form.formState.isSubmitting;

  const isModalOpen = isOpen && type === "editChannel";

  function handleModalClose() {
    form.reset();
    onClose();
  }

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [channel, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center">
            Editing Server&apos;s{" "}
            <span className="text-indigo-500/90">{channel?.name}</span>{" "}
            <Wrench className="w-5 h-5 md:w-9 md:h-9 text-yellow-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Edit your server! Change name or type.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g Learning next js"
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ChannelType).map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="capitalize"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                variant={"primary"}
                className="flex items-center gap-1 text-lg"
              >
                {isLoading ? (
                  <>
                    Saving... <Loader2 className="animate-spin w-5 h-5" />
                  </>
                ) : (
                  <>
                    Save <Save className="w-5 h-5" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelModal;

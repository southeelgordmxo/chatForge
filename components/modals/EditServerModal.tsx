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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Wrench } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/hook/use-modal-store";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  imageUrl: z.string(),
});

const EditServerModal = () => {
  const router = useRouter();
  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server?.name);
      form.setValue("imageUrl", server?.imageUrl);
    }
  }, [server]);

  // form submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch(`/api/servers/${server?.id}/edit`, {
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
      router.refresh();
      onClose();
    } else {
      //! change with toast for notification
      console.log(resData.error);
    }
  }

  const isLoading = form.formState.isSubmitting;

  const isModalOpen = isOpen && type === "editServer";

  function handleModalClose() {
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center line-clamp-1">
            Editing Server&apos;s{" "}
            <span className="text-indigo-500/90">{server?.name}</span>{" "}
            <Wrench className="w-6 h-6 md:w-9 md:h-9 text-yellow-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Edit your server! Change name or image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="w-full">
              <div className="w-full flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverUpload"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New server name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g Hello World"
                      {...field}
                      className="text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isLoading}
                type="submit"
                variant={"primary"}
                className="flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    Saving... <Loader2 className="animate-spin w-5 h-5" />{" "}
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

export default EditServerModal;

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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import FileUpload from "@/components/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useModal } from "@/hook/use-modal-store";
import qs from "query-string";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  fileUrl: z.string({
    required_error: "File url is required!",
  }),
});

const MessageFileModal = () => {
  const { onClose, isOpen, type, data } = useModal();
  const router = useRouter();
  const { apiUrl, query } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
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
      body: JSON.stringify({
        ...values,
        content: values.fileUrl,
      }),
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
      toast({
        title: resData.error,
      });
    }
  }

  const isLoading = form.formState.isSubmitting;
  const isModalOpen = isOpen && type === "messageFile";

  function handleClose() {
    onClose();
    form.reset();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center">
            Add Attachment{" "}
            <Link className="w-5 h-5 md:w-9 md:h-9 text-indigo-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Send image and file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="w-full">
              <div className="w-full flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageUpload"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={form.getValues("fileUrl") === "" || isLoading}
                type="submit"
                variant={"primary"}
                className="flex items-center gap-1 text-lg"
              >
                {isLoading ? (
                  <>
                    Sending... <Loader2 className="animate-spin w-5 h-5" />
                  </>
                ) : (
                  <>
                    Send <Send className="w-5 h-5" />
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

export default MessageFileModal;

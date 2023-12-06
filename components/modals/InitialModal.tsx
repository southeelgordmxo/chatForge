"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import FileUpload from "@/components/file-upload";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePlus, Boxes, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Server name must be at least 2 characters.",
  }),
  imageUrl: z.string(),
});

const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  // form submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch("/api/servers", {
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
      router.push(`/servers/${resData.data.id}`);
      toast({
        title: "Successfully created new Server",
      });
    } else {
      toast({
        title: resData.error,
      });
    }
  }

  const isLoading = form.formState.isSubmitting;

  // prevent hydration error
  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl flex items-center gap-2 justify-center">
            Create Awesome Server{" "}
            <Boxes className="w-5 h-5 md:w-9 md:h-9 text-indigo-500" />
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Customize your awesome server with a standing name and an remarkable
            image
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
                  <FormLabel>Server name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
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
                className="flex items-center gap-1 text-lg"
              >
                {isLoading ? (
                  <>
                    Creating... <Loader2 className="animate-spin w-5 h-5" />
                  </>
                ) : (
                  <>
                    Create <BadgePlus className="w-5 h-5" />
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

export default InitialModal;

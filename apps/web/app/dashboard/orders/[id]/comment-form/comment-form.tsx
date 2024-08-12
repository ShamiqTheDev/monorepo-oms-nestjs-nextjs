"use client";

import { Grid, css, styled } from "@atdb/design-system";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Popover,
  Textarea,
} from "@atdb/ui";
import { SubmitHandler, useForm, ControllerRenderProps } from "react-hook-form";
import { CommentSchema, commentSchema } from "./content-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@atdb/client-providers";
import { createComment } from "./comment-form.action";
import { SessionUser } from "@atdb/types/auth";
import { Send } from "@atdb/icons";
import { Check } from "lucide-react";

interface OrderCommentFormProps {
  order: Selectable<DB.Order>;
  author: SessionUser;
  users: Selectable<DB.User>[];
}

export default function OrderCommentForm({ order, author, users }: OrderCommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const form = useForm<CommentSchema>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      orderId: order.id,
      authorId: author.id,
      attachments: [],
    },
  });
  const [open, setOpen] = useState(false);
  const [attachments, setAttachments] = useState<Blob[]>([]);
  const ua = window.navigator.userAgent;
  const accept = (".cam,.stl,.rar,.zip," + (/CriOS/i.test(ua) || (/Chrome/i.test(ua) && /Mobile/i.test(ua)) ? "image,camera/*" : "image/*"));
  const fileInputRef = useRef<any>(null);

  const handleChange = (field: ControllerRenderProps<CommentSchema, "content">, e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e);
    const value = e.target.value;

    if (value.at(-1) === "@") setOpen(true);
    else {
      setOpen(false);
      inputRef.current?.focus();
    }
  };
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      setAttachments(Array.from(files || []));
      form.setValue("attachments", Array.from(files || []) as unknown as Blob[])
    }
  }
  const handleSuggestionSelect = (field: ControllerRenderProps<CommentSchema, "content">, user: Selectable<DB.User>) => {
    const parts = field.value.split("@");
    parts.pop();
    parts.push(`<@${user.id}>`);
    form.setValue("content", `${parts.join("")}` + " ");
    setOpen(false);
  };

  const handleItemClick = (field: ControllerRenderProps<CommentSchema, "content">, user: Selectable<DB.User>) => {
    handleSuggestionSelect(field, user);
  };
  
  function openFileExplorer() {
    fileInputRef!.current!.value = "";
    fileInputRef?.current?.click();
  }

  const onSubmit: SubmitHandler<CommentSchema> = (data) => {
    if (isPending) return; 
    toast({
      title: "Submitting comment...",
      description: "Submitting comment and uploading attachments, please wait",
      variant: "instructive",
    });
    // return form.handleSubmit(onSubmit)(e);
    startTransition(async () => {
      const body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "attachments") (value as Blob[])?.forEach((photo) => {
          body.append("attachments", photo)
        }) 
        // @ts-ignore
        else body.append(key, value);
      });
      const isSuccess = await createComment(body);
      if (isSuccess) {
        form.reset();
        setAttachments([]);
        router.refresh();
      }

      toast({
        title: isSuccess ? "Comment Created" : "Comment Creation Failed",
        description: isSuccess ? "Comment has been created successfully " : "Comment creation failed due to a system error",
        variant: isSuccess ? "constructive" : "destructive",
      });
    });
  };

  return (
    <Form {...form}>
      <input
        placeholder="fileInput"
        className={css({ display: "none" })}
        hidden
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        multiple
        accept={accept}
      />
      <styled.form onSubmit={form.handleSubmit(onSubmit)} w="full">
        <Grid w="full" gap="2">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className={css({ md: { gridColumn: "span 2" } })}>
                <Popover.Root open={open} onOpenChange={setOpen}>
                  <Popover.Anchor>
                    <FormControl>
                      <Textarea
                        w="full"
                        type="textfield"
                        placeholder="Enter your comment here."
                        {...field}
                        ref={inputRef}
                        onChange={(e) => handleChange(field, e)}
                      />
                    </FormControl>
                  </Popover.Anchor>
                  <Popover.Content className={css({ p: 0, w: "20rem" })} onOpenAutoFocus={null}>
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={`${user.firstName} ${user.lastName}`}
                            key={user.id}
                            onSelect={() => handleItemClick(field, user)}
                          >
                            <Check className={css({ w: "xl", h: "auto" })} opacity={user.id === field.value ? "1" : "0"} />
                            {user.firstName} {user.lastName}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </Popover.Content>
                </Popover.Root>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
          name="attachments"
          control={form.control}
          render={(_) => (
            <FormItem className={css({ md: { gridColumn: "span 2" } })}>
              <FormControl>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button type="submit" w={"8xl"}>
                    Send message
                    <Send size={"1rem"} />
                  </Button>
                  <div onClick={openFileExplorer} style={{ position: 'relative', display: 'inline-block' }}>
                    <Button
                      type="button"
                      variant="ghost"
                      p={0}
                      fontWeight={600}
                      color={"primary.500"}
                      style={{ height: '40px', width: '40px', fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      🔗
                    </Button>
                    {attachments.length > 0 && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          left: '-10px',
                          fontSize: '12px',
                          color: 'white',
                          background: 'red',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                        {attachments.length}
                      </span>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </Grid>
      </styled.form>
    </Form>
  );
}

import { css } from "@atdb/design-system";
import { Sms, User } from "@atdb/icons";
import {
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@atdb/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { DB } from "@atdb/types";
import { useTransition } from "react";
import { inviteUser } from "./invite.action";
import { InviteSchema, inviteSchema } from "./invite.schema";
import { useToast } from "@atdb/client-providers";
import { useSession } from "next-auth/react";

interface InviteFormProps {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function InviteForm({ setDialogOpen }: InviteFormProps) {
  const [_, startTransition] = useTransition();
  const { toast } = useToast();
  const { data } = useSession();
  const form = useForm<InviteSchema>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });

  if (!data) return null;

  const onSubmit: SubmitHandler<InviteSchema> = (data) => {
    startTransition(async () => {
      const isSuccess = await inviteUser(data);
      if (isSuccess) {
        form.reset();
        setDialogOpen(false);
      }

      toast({
        variant: isSuccess ? "constructive" : "destructive",
        title: isSuccess ? "User invited" : "Failed to invite user",
        description: isSuccess ? "User has been invited" : "Failed to invite user",
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={css({ spaceY: "8", fontSize: "sm" })}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input.Root className={css({ bg: "none !important", borderColor: "input", rounded: "md" })} w="full">
                  <Input.Icon>
                    <Sms size={"20px"} />
                  </Input.Icon>
                  <Input.Control bg={"none"} id="email" placeholder="Enter user email" type={"email"} {...field} />
                </Input.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <User size={"20px"} />
                    <SelectValue placeholder="Choose user role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DB.Role).map(([name, value], i) => {
                      return (
                        Object.values(DB.Role).indexOf(data.user.role) < Object.values(DB.Role).indexOf(value) && (
                          <SelectItem key={i} value={value}>
                            {name}
                          </SelectItem>
                        )
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          bg={"primary.500"}
          _hover={{ bg: "primary.600" }}
          border={"solid 1px token(colors.primary.600)"}
          boxShadow={"0px 0px 2px -1px #0E1B2F, 0px 1px 1px 0px rgba(23, 68, 110, 0.15);"}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}

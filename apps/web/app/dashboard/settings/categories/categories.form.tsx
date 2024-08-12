import { css } from "@atdb/design-system";
import { Input, Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@atdb/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTransition } from "react";
import { createCategory } from "./categories.action";
import { categoriesSchema, CategoriesSchema } from "./categories.schema";
import { useToast } from "@atdb/client-providers";
import { Indent } from "lucide-react";
import { useRouter } from "next/navigation";

interface CategoriesFormProps {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CategoriesForm({ setDialogOpen }: CategoriesFormProps) {
  const [_, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<CategoriesSchema>({
    resolver: zodResolver(categoriesSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<CategoriesSchema> = (data) => {
    startTransition(async () => {
      const isSuccess = await createCategory(data);

      if (isSuccess) {
        form.reset();
        router.refresh();
        setDialogOpen(false);
      }

      toast({
        title: isSuccess ? "Category Created" : "Category Creation Failed",
        description: isSuccess ? "Category has been created successfully " : "Category creation failed due to a system error",
        variant: isSuccess ? "constructive" : "destructive",
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={css({ spaceY: "8", fontSize: "sm" })}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input.Root className={css({ bg: "none !important", borderColor: "input", rounded: "md" })} w="full">
                  <Input.Icon>
                    <Indent size={"20px"} />
                  </Input.Icon>
                  <Input.Control bg={"none"} placeholder="Enter category name" type={"text"} {...field} />
                </Input.Root>
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
          Create
        </Button>
      </form>
    </Form>
  );
}

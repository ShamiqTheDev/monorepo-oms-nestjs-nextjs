import { css, cx, icon, styled, Box } from "@atdb/design-system";
import {
  Input,
  Button,
  Command,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Popover,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  InputTags,
  FullComboBox,
} from "@atdb/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, SubmitHandler, useFieldArray, useForm, useWatch } from "react-hook-form";
import { DB } from "@atdb/types";
import { useMemo, useTransition } from "react";
import { createSubCategory } from "./sub-categories.action";
import { subCategoriesSchema, SubCategoriesSchema } from "./sub-categories.schema";
import { useToast } from "@atdb/client-providers";
import { ChevronsUpDown, Indent, Type } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { isSubCategory } from "../categories.utils";
import { Selectable } from "kysely";
import { useRouter } from "next/navigation";
import { FieldType } from "@atdb/types/db";

interface SubCategoriesFormProps {
  table: Table<Selectable<DB.Category>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DynamicInputProps {
  index: number;
  control: Control<SubCategoriesSchema>;
}

function DynamicInput({ index, control }: DynamicInputProps) {
  const fields = useWatch({
    control,
    name: "fields",
  });

  switch (fields?.[index]?.type) {
    case FieldType.Select:
      return (
        <FormField
          control={control}
          name={`fields.${index}.options` as const}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Options</FormLabel>
              <FormControl>
                <InputTags placeholder={"Add options"} onChange={field.onChange} value={field.value ?? []} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
}

export function SubCategoriesForm({ table, setDialogOpen }: SubCategoriesFormProps) {
  const [_, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SubCategoriesSchema>({
    resolver: zodResolver(subCategoriesSchema),
    defaultValues: {
      name: "",
      fields: [],
    },
  });

  const { fields, append } = useFieldArray({ name: "fields", control: form.control });

  const onSubmit: SubmitHandler<SubCategoriesSchema> = (data) => {
    startTransition(async () => {
      const isSuccess = await createSubCategory(data);
      if (isSuccess) {
        form.reset();
        router.refresh();
        setDialogOpen(false);
      }

      toast({
        title: isSuccess ? "Sub Category Created" : "Sub Category Creation Failed",
        description: isSuccess ? "Sub Category has been created successfully " : "Sub Category creation failed due to a system error",
        variant: isSuccess ? "constructive" : "destructive",
      });
    });
  };

  const categories = useMemo(
    () =>
      table
        .getPreSelectedRowModel()
        .flatRows.filter((row) => !isSubCategory(row.original))
        .map((category) => category.original),
    [table]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={css({ spaceY: "8", fontSize: "sm", overflow: "auto", scrollbarWidth: "0.25px", maxHeight: "12xl" })}
      >
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
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem display="flex" flexDir="column">
              <FormLabel>Category</FormLabel>
              <FullComboBox
                portal={false}
                placeholder="Search categories..."
                options={categories}
                selectedOption={(category) => category.id === field.value}
                _key={(category) => category.id}
                value={(category) => category.name}
                onSelect={(category) => {
                  form.setValue("categoryId", category.id);
                }}
                Trigger={({ open, setOpen }) => (
                  <Popover.Trigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        type="button"
                        onClick={() => setOpen(!open)}
                        justifyContent="space-between"
                        color={!field.value ? "muted.foreground" : undefined}
                      >
                        {field.value ? categories.find((category) => category.id === field.value)?.name : "Select category"}
                        <ChevronsUpDown className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
                      </Button>
                    </FormControl>
                  </Popover.Trigger>
                )}
              />
              <FormDescription>The parent category.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Box display={"flex"} gap="lg" flexDirection={"column"}>
          <styled.span fontWeight={600}>Fields</styled.span>
          <styled.div display="flex" flexDir={"column"} gap="3xl">
            {fields.map((field, index) => (
              <styled.div key={field.id} display="flex" flexDir={"column"} gap="xl">
                <FormField
                  control={form.control}
                  name={`fields.${index}.name` as const}
                  render={({ field: nestedField }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input.Root className={css({ bg: "none !important", borderColor: "input", rounded: "md" })} w="full">
                          <Input.Control {...nestedField} placeholder={"Name"} />
                        </Input.Root>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fields.${index}.defaultValue` as const}
                  render={({ field: nestedField }) => (
                    <FormItem>
                      <FormLabel>Default Value</FormLabel>
                      <FormControl>
                        {form.watch(`fields.${index}.type`) === DB.FieldType.Boolean ? (
                          <Switch checked={nestedField.value} onCheckedChange={nestedField.onChange} />
                        ) : (
                          <Input.Root className={css({ bg: "none !important", borderColor: "input", rounded: "md" })} w="full">
                            <Input.Control {...nestedField} placeholder={"Default Value"} />
                          </Input.Root>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fields.${index}.type` as const}
                  render={({ field: nestedField }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={nestedField.onChange} defaultValue={nestedField.value}>
                          <SelectTrigger>
                            <Type className={css({ w: "xl", h: "auto" })} />
                            <SelectValue placeholder="Choose field type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(DB.FieldType).map(([name, value]) => (
                              <SelectItem key={value} value={value}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fields.${index}.required` as const}
                  render={({ field: nestedField }) => (
                    <FormItem>
                      <FormLabel>Required</FormLabel>
                      <FormControl>
                        <Switch checked={nestedField.value} onCheckedChange={nestedField.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DynamicInput control={form.control} index={index} />
              </styled.div>
            ))}
          </styled.div>
          <Button
            type="button"
            variant={"outline"}
            onClick={() =>
              append({
                name: "",
                // @ts-ignore
                type: undefined,
                defaultValue: "",
                required: true,
                value: "",
              })
            }
          >
            Add
          </Button>
        </Box>
        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}

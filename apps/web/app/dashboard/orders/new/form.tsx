"use client";
import { css, icon, styled, cx, HStack, Box } from "@atdb/design-system";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  Calendar,
  FormDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dropzone,
  PlateEditor,
  FullComboBox,
  Switch,
} from "@atdb/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, ChevronsUpDown } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { type ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { OrderSchema, orderSchema } from "./schema";
import { useRouter } from "next/navigation";
import { useToast } from "@atdb/client-providers";
import { createOrder } from "./action";
import { useSession } from "next-auth/react";
import { fetchPatientByRef } from "../../patients/utils";
import { DynamicField } from "../dynamic-field";
import { getAllMonths } from "../client-utils";

interface CreateOrderFormProps {
  appSettings: Selectable<DB.AppSettings>;
  categories: Selectable<DB.Category>[];
  subCategories: Selectable<DB.SubCategory>[];
  users: Selectable<DB.User>[];
}

export function CreateOrderForm({ appSettings, categories, subCategories, users }: CreateOrderFormProps) {
  // Needs refactoring along with `EditOrderForm` @GhaithAlHallak8
  const [_, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { data, status } = useSession();
  const [isPatientNameDisabled, setIsPatientNameDisabled] = useState(true);
  const [isPatientBirthdateDisabled, setIsPatientBirthdateDisabled] = useState(true);
  const form = useForm<OrderSchema>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      patientName: "",
      locationId: data?.user.defaultLocationId,
      illuminatedPhotos: [],
      // @ts-ignore
      specificDetails: "[]",
      metadata: {
        fields: [],
      },
    },
  });

  useEffect(() => {
    const main = () => {
      if (status !== "authenticated") return null;
      form.setValue("specialistId", data.user.id);
    };

    main();
  }, [status]);

  const selectedSubCategoryId = form.watch("subcategoryId");

  const handlePatientRefChange = async (field: ControllerRenderProps<OrderSchema, "patientRef">) => {
    const enablePatientDetails = () => {
      form.setValue("patientId", undefined);
      form.setValue("patientName", "");
      // @ts-ignore
      form.setValue("patientBirthdate", undefined);

      setIsPatientNameDisabled(false);
      setIsPatientBirthdateDisabled(false);
      field.onBlur();
    };

    if (!field.value) return enablePatientDetails();
    // No need to pass ownerId here because the server detects it auto
    const patient = await fetchPatientByRef(field.value);
    if (!patient) return enablePatientDetails();

    form.setValue("patientId", patient.id);
    form.setValue("patientName", patient.name);
    form.setValue("patientBirthdate", patient.birthdate);

    setIsPatientNameDisabled(true);
    setIsPatientBirthdateDisabled(true);

    field.onBlur();
  };

  const onSubmit: SubmitHandler<OrderSchema> = (data) => {
    startTransition(async () => {
      const body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "illuminatedPhotos") (value as Blob[])?.forEach((photo) => {
          body.append("illuminatedPhotos", photo)
        })
        else {
          if (key === "metadata") value = JSON.stringify(value);
          // @ts-expect-error
          body.append(key, value);
        }
      });

      const isSuccess = await createOrder(body);
      if (isSuccess) {
        form.reset();
        router.push("/");
        router.refresh();
      }

      toast({
        title: isSuccess ? "Order Created" : "Order Creation Failed",
        description: isSuccess ? "Order has been created successfully " : "Order creation failed due to a system error",
        variant: isSuccess ? "constructive" : "destructive",
      });
    });
  };

  const onError = (x) => {
    console.log({ x });
  };
  return (
    <Form {...form}>
      <styled.form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        display={"flex"}
        alignItems={"center"}
        md={{ alignItems: "initial" }}
        flexDir={"column"}
        gap={"2xl"}
        pos={"relative"}
      >
        <styled.div>
          <styled.h3 textStyle={"textStyles.headings.h3"} fontWeight={600} mb={"xl"}>
            Patient
          </styled.h3>
          <styled.div display="grid" gridTemplateColumns={"1"} gap={"lg"} w={"11xl"}>
            <FormField
              name="patientRef"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{data?.user.role === DB.Role.Customer? "Patient Reference ID": "Simplex Code"}</FormLabel>
                  <FormControl>
                    <Input.Root className={css({ bg: "none !important", fontSize: "sm", borderColor: "input", rounded: "md", w: "full" })}>
                      <Input.Control type={data?.user.role === DB.Role.Customer? "text" : "number"} placeholder="Code" {...field} onBlur={() => handlePatientRefChange(field)} />
                    </Input.Root>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="patientName"
              control={form.control}
              disabled={isPatientNameDisabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input.Root className={css({ bg: "none !important", fontSize: "sm", borderColor: "input", rounded: "md", w: "full" })}>
                      {/* <Input.Icon>
                          <Sms size={"20px"} />
                        </Input.Icon> */}
                      <Input.Control type={"text"} placeholder="Full Name" {...field} />
                    </Input.Root>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="patientBirthdate"
              control={form.control}
              disabled={isPatientBirthdateDisabled}
              render={({ field }) => (
                <FormItem display="flex" flexDir="column">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          pl="3"
                          disabled={field.disabled}
                          w={"full"}
                          textAlign="left"
                          fontWeight="normal"
                          type="button"
                          color={!field.value ? "muted.foreground" : undefined}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className={css({ w: "xl", h: "auto" })} />
                        </Button>
                      </FormControl>
                    </Popover.Trigger>
                    <Popover.Content w="auto" p="0" align="start">
                      <Box rounded="md" border="base">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value!)}
                          onSelect={(date: Date) => field.onChange(date.toISOString())}
                          disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")}
                          fromYear={1900}
                          toYear={(new Date().getFullYear())}
                          initialFocus
                        />
                      </Box>
                    </Popover.Content>
                  </Popover.Root>
                  <FormMessage />
                </FormItem>
              )}
            />
          </styled.div>
        </styled.div>
        <styled.div>
          <styled.h3 textStyle={"textStyles.headings.h3"} fontWeight={600} mb={"xl"}>
            Work Details
          </styled.h3>
          <styled.div
            display="grid"
            gridTemplateColumns={"1"}
            w={"20rem"}
            md={{ w: "40rem", gridTemplateColumns: "2", gridTemplateRows: "3" }}
            gap={"lg"}
          >
            <FormField
              name="specialistId"
              control={form.control}
              render={({ field }) => (
                <FormItem display="flex" flexDir="column">
                  <FormLabel>Specialist</FormLabel>
                  <FullComboBox
                    placeholder="Search users..."
                    options={users.filter((user) => user.role !== DB.Role.Customer)}
                    selectedOption={(user) => user.id === field.value}
                    _key={(user) => user.id}
                    value={(user) => `${user.firstName} ${user.lastName}`}
                    onSelect={(user) => form.setValue("specialistId", user.id)}
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
                            {field.value ? users.find((user) => user.id === field.value)?.firstName : "Select specialist"}
                            <ChevronsUpDown className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
                          </Button>
                        </FormControl>
                      </Popover.Trigger>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="locationId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FullComboBox
                    placeholder="Search locations..."
                    options={appSettings.locations}
                    selectedOption={(location) => location.id === field.value}
                    _key={(location) => location.id}
                    value={(location) => location.name}
                    onSelect={(location) => form.setValue("locationId", location.id)}
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
                            {field.value ? appSettings.locations.find((location) => location.id === field.value)?.name : "Select location"}
                            <ChevronsUpDown className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
                          </Button>
                        </FormControl>
                      </Popover.Trigger>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem display="flex" flexDir="column">
                  <FormLabel>Category</FormLabel>
                  <FullComboBox
                    placeholder="Search categories..."
                    options={categories}
                    selectedOption={(category) => category.id === field.value}
                    _key={(category) => category.id}
                    value={(category) => category.name}
                    onSelect={(category) => {
                      form.setValue("categoryId", category.id);
                      // @ts-ignore
                      form.setValue("subcategoryId", undefined);
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
            <FormField
              name="deliveryDate"
              control={form.control}
              render={({ field }) => (
                <FormItem display="flex" flexDir="column">
                  <FormLabel>Delivery Date</FormLabel>
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          pl="3"
                          w={"full"}
                          textAlign="left"
                          fontWeight="normal"
                          type="button"
                          color={!field.value ? "muted.foreground" : undefined}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className={css({ w: "xl", h: "auto" })} />
                        </Button>
                      </FormControl>
                    </Popover.Trigger>
                    <Popover.Content w="auto" p="0" align="start">
                      <Box rounded="md" border="base">
                        <Calendar
                          mode="single"
                          selected={new Date(field.value!)}
                          onSelect={(date: Date) => field.onChange(date.toISOString())}
                          disabled={(date: Date) => date <= new Date()}
                          fromYear={(new Date().getFullYear())}
                          toYear={(new Date().getFullYear()) + 2}
                          initialFocus
                        />
                      </Box>
                    </Popover.Content>
                  </Popover.Root>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="subcategoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem display="flex" flexDir="column">
                  <FormLabel>Sub Category</FormLabel>
                  <FullComboBox
                    placeholder="Search subcategories..."
                    options={subCategories.filter((subCategory) => subCategory.categoryId === form.watch("categoryId"))}
                    selectedOption={(subCategory) => subCategory.id === field.value}
                    _key={(subCategory) => subCategory.id}
                    value={(subCategory) => subCategory.name}
                    onSelect={(subCategory) => form.setValue("subcategoryId", subCategory.id)}
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
                            {field.value ? subCategories.find((subCategory) => subCategory.id === field.value)?.name : "Select category"}
                            <ChevronsUpDown className={cx(icon({ left: "auto", dimmed: true }), css({ w: "xl", h: "auto" }))} />
                          </Button>
                        </FormControl>
                      </Popover.Trigger>
                    )}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="priority"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DB.Priority).map(([name, value]) => (
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
              name="specificDetails"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Details</FormLabel>
                  <FormControl>
                    {/* @ts-ignore */}
                    <PlateEditor {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="imagesAttached"
              control={form.control}
              defaultValue={ false }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images Attached?</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </styled.div>
        </styled.div>
        {subCategories.find((subCategory) => subCategory.id === selectedSubCategoryId)?.fields?.length ? (
          <styled.div>
            <styled.div display="grid" gridTemplateColumns={"3"} gap={"lg"} w="20rem" md={{ w: "40rem" }}>
              {subCategories
                .find((subCategory) => subCategory.id === selectedSubCategoryId)
                ?.fields.map((field, index) => {
                  form.setValue(`metadata.fields.${index}.name` as const, field.name);
                  // @ts-ignore
                  return <DynamicField key={field.name} {...{ field, index, control: form.control }} />;
                })}
            </styled.div>
          </styled.div>
        ) : null}
        <styled.div>
          <styled.div
            display="grid"
            gridTemplateColumns={"1"}
            w={"20rem"}
            md={{ w: "40rem", gridTemplateColumns: "2", gridTemplateRows: "1" }}
            gap={"lg"}
          >
            <FormField
              name="illuminatedPhotos"
              control={form.control}
              render={({ field }) => (
                <FormItem className={css({ md: { gridColumn: "span 2" } })}>
                  <FormLabel>Attachment(s)</FormLabel>
                  <FormControl>
                    <Dropzone {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </styled.div>
        </styled.div>
        <Button
          type="submit"
          bg={"primary.500"}
          w="20rem"
          mb={"6rem"}
          md={{ w: "40rem", mb: "0" }}
          _hover={{ bg: "primary.600" }}
          border={"solid 1px token(colors.primary.600)"}
          boxShadow={"0px 0px 2px -1px #0E1B2F, 0px 1px 1px 0px rgba(23, 68, 110, 0.15);"}
        >
          Create
        </Button>
      </styled.form>
    </Form>
  );
}

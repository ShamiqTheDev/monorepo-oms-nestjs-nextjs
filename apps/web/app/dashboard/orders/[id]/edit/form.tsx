"use client";

import { css, icon, styled, Box, HStack, cx } from "@atdb/design-system";
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
  CommandItem,
  CommandEmpty,
  Command,
  CommandInput,
  CommandGroup,
  Dropzone,
  FullComboBox,
  PlateEditor,
  Switch,
} from "@atdb/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";
import { Selectable } from "kysely";
import { DB } from "@atdb/types";
import { EditOrderSchema, editOrderSchema } from "./schema";
import { useRouter } from "next/navigation";
import { useToast } from "@atdb/client-providers";
import { editOrder } from "./action";
import { useSession } from "next-auth/react";
import { fetchPatient, fetchPatientByRef } from "../../../patients/utils";
import { DynamicField } from "../../dynamic-field";
import { getAllMonths } from "../../client-utils";

interface EditOrderFormProps {
  appSettings: Selectable<DB.AppSettings>;
  order: Selectable<DB.Order>;
  users: Selectable<DB.User>[];
  subCategories: Selectable<DB.SubCategory>[];
}

export function EditOrderForm({ appSettings, users, order, subCategories }: EditOrderFormProps) {
  const [_, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const { data } = useSession();
  const [isPatientNameDisabled, setIsPatientNameDisabled] = useState(true);
  const [isPatientBirthdateDisabled, setIsPatientBirthdateDisabled] = useState(true);
  const form = useForm<EditOrderSchema>({
    resolver: zodResolver(editOrderSchema),
    defaultValues: {
      assigneeId: order.assigneeId,
      categoryId: order.categoryId,
      deliveryDate: order.deliveryDate,
      locationId: order.locationId,
      metadata: order.metadata,
      patientId: order.patientId,
      priority: order.priority,
      specialistId: order.specialistId,
      subcategoryId: order.subcategoryId,
      statusId: order.statusId,
      // @ts-ignore
      specificDetails: JSON.stringify(order.specificDetails),
    },
  });
  const createdBy = useMemo(() => users.find((user) => user.id === order.createdBy)!, [users]);

  useEffect(() => {
    const updatePatientFields = async () => {
      const patient = await fetchPatient(form.getValues().patientId!);
      if (!patient) return;
      
      if (patient.ownerId) form.setValue("patientOwnerId", patient.ownerId);
      form.setValue("patientRef", patient.refId);
      form.setValue("patientName", patient.name);
      form.setValue("patientBirthdate", patient.birthdate);
    };
    updatePatientFields();
  }, []);

  const selectedSubCategoryId = form.watch("subcategoryId");

  const handlePatientRefChange = async (field: ControllerRenderProps<EditOrderSchema, "patientRef">) => {
    const enablePatientDetails = () => {
      form.setValue("patientId", undefined);
      form.setValue("patientName", "");
      // @ts-ignore @GhaithAlHallak8 why not ""? 
      form.setValue("patientBirthdate", undefined);

      setIsPatientNameDisabled(false);
      setIsPatientBirthdateDisabled(false);
      field.onBlur();
    };

    if (!field.value) return enablePatientDetails();
    const patient = await fetchPatientByRef(field.value, createdBy.role === DB.Role.Customer ? createdBy.id : undefined);
    if (!patient) return enablePatientDetails();

    form.setValue("patientId", patient.id);
    form.setValue("patientName", patient.name);
    form.setValue("patientBirthdate", patient.birthdate);

    setIsPatientNameDisabled(true);
    setIsPatientBirthdateDisabled(true);

    field.onBlur();
  };

  const onSubmit: SubmitHandler<EditOrderSchema> = (data) => {
    startTransition(async () => {
      const body = new FormData();
      Object.entries(data || {}).forEach(([key, value]) => {
        if (key === "illuminatedPhotos") 
          (value as Blob[])?.forEach((photo) => {
            body.append("illuminatedPhotos", photo);
          });
        else {
          if (key === "metadata") value = JSON.stringify(value);
          // @ts-expect-error
          body.append(key, value);
        }
      });
      const isSuccess = await editOrder(order, body);

      if (isSuccess) {
        form.reset();
        router.back();
        router.refresh();
      }

      toast({
        title: isSuccess ? "Order Updated" : "Order Updated Failed",
        description: isSuccess ? "Order has been updated successfully " : "Order updation failed due to a system error",
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
                  <FormLabel>{createdBy.role === DB.Role.Customer? "Patient Reference ID" : "Simplex Code"}</FormLabel>
                  <FormControl>
                    <Input.Root className={css({ bg: "none !important", fontSize: "sm", borderColor: "input", rounded: "md", w: "full" })}>
                      <Input.Control type={createdBy.role === DB.Role.Customer? "text" : "number"} placeholder="Code" {...field} onBlur={() => handlePatientRefChange(field)} />
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
            md={{ w: "40rem", gridTemplateColumns: "2", gridTemplateRows: data?.user.role !== DB.Role.Customer? "4": "3" }}
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
                    options={appSettings.categories}
                    selectedOption={(category) => category.id === field.value}
                    _key={(category) => category.id}
                    value={(category) => category.name}
                    onSelect={(category) => {
                      form.setValue("categoryId", category.id);
                      // @ts-ignore
                      form.setValue("subcategoryId", undefined);
                      form.setFocus("subcategoryId", {shouldSelect: true});
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
                            {field.value ? appSettings.categories.find((category) => category.id === field.value)?.name : "Select category"}
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
                          selected={field.value}
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
            {data?.user.role !== DB.Role.Customer && (
              <>
              <FormField
                  name="statusId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem display="flex" flexDir="column">
                      <FormLabel>Status</FormLabel>
                      <FullComboBox
                        placeholder="Search statuses..."
                        options={appSettings.orderStatuses}
                        selectedOption={(orderStatus) => orderStatus.id === field.value}
                        _key={(orderStatus) => orderStatus.id}
                        value={(orderStatus) => orderStatus.label}
                        onSelect={(orderStatus) => form.setValue("statusId", orderStatus.id)}
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
                                {field.value
                                  ? appSettings.orderStatuses.find((orderStatus) => orderStatus.id === field.value)?.label
                                  : "Select status"}
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
                  name="assigneeId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem display="flex" flexDir="column">
                      <FormLabel>Assignee</FormLabel>
                      <FullComboBox
                        placeholder="Search users..."
                        options={users.filter((user) => user.role !== DB.Role.Customer)}
                        selectedOption={(user) => user.id === field.value}
                        _key={(user) => user.id}
                        value={(user) => `${user.firstName} ${user.lastName}`}
                        onSelect={(user) => form.setValue("assigneeId", user.id)}
                        Trigger={({ open, setOpen }) => (
                          <Popover.Trigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                type="button"
                                onClick={() => setOpen(!open)}
                                justifyContent="space-between"
                                color={!field.value ? "muted.foreground" : undefined}>
                                {field.value ? users.find((user) => user.id === field.value)?.firstName : "Select assignee"}
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
              </>
            )}
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
              defaultValue={ order.imagesAttached }
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
            {subCategories.find((subCategory) => subCategory.id === selectedSubCategoryId)?.fields?.length ? (
              <styled.div>
                <styled.div display="grid" gridTemplateColumns={"3"} gap={"lg"} w="20rem" md={{ w: "40rem" }}>
                  {subCategories
                    .find((subCategory) => subCategory.id === selectedSubCategoryId)
                    ?.fields.map((field, index) => {
                      return <DynamicField key={field.name} {...{ field, index, control: form.control }} />;
                    })}
                </styled.div>
              </styled.div>
            ) : null}
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
          Publish Edits
        </Button>
      </styled.form>
    </Form>
  );
}

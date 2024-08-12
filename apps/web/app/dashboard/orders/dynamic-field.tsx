import { EditOrderSchema } from './[id]/edit/schema';
import { toTitleCase2 } from '../../utils';
import { CalendarIcon } from 'lucide-react';
import { OrderSchema } from './new/schema';
import { Control } from 'react-hook-form';
import { css } from '@atdb/design-system';
import { DB } from '@atdb/types';
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  Calendar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@atdb/ui';

interface DynamicFieldProps<T extends EditOrderSchema | OrderSchema> {
  field: DB.Field;
  index: number;
  control: Control<T>;
}

// remove @ts-ignores @GhaithAlHallak8
export function DynamicField<T extends EditOrderSchema>({ field, index, control }: DynamicFieldProps<T>) {
  switch (field.type) {
    case DB.FieldType.Boolean:
      return (
        <FormField
          // @ts-ignore
          name={`metadata.fields.${index}.value` as const}
          control={control}
          // @ts-ignore
          defaultValue={field.defaultValue}
          render={({ field: nestedField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Switch checked={nestedField.value} onCheckedChange={nestedField.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case DB.FieldType.Date:
      return (
        <FormField
          // @ts-ignore
          name={`metadata.fields.${index}.value` as const}
          control={control}
          // @ts-ignore
          defaultValue={field.defaultValue}
          render={({ field: nestedField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <Button
                      variant='outline'
                      pl='3'
                      w={'full'}
                      textAlign='left'
                      fontWeight='normal'
                      color={!nestedField.value ? 'muted.foreground' : undefined}>
                      {
                        // @ts-ignore
                        nestedField.value ? format(new Date(nestedField.value), 'PPP') : <span>Pick a date</span>
                      }
                      <CalendarIcon className={css({ w: 'xl', h: 'auto' })} />
                    </Button>
                  </Popover.Trigger>
                  <Popover.Content w='auto' p='0' align='start'>
                    <Calendar
                      mode='single'
                      captionLayout='dropdown-buttons'
                      fromYear={1920}
                      toYear={2030}
                      selected={
                        // @ts-ignore
                        new Date(nestedField.value)
                      }
                      onSelect={(date: Date) => nestedField.onChange(date.toISOString())}
                      initialFocus
                    />
                  </Popover.Content>
                </Popover.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case DB.FieldType.Select:
      return (
        <FormField
          // @ts-ignore
          name={`metadata.fields.${index}.value` as const}
          control={control}
          // @ts-ignore
          defaultValue={field.defaultValue}
          render={({ field: nestedField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Select onValueChange={nestedField.onChange} defaultValue={nestedField.value}>
                  <SelectTrigger>
                    <SelectValue placeholder='Choose value' />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return (
        <FormField
          // @ts-ignore
          name={`metadata.fields.${index}.value` as const}
          control={control}
          // @ts-ignore
          defaultValue={field.defaultValue}
          render={({ field: nestedField }) => (
            <FormItem>
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <Input.Root
                  className={css({
                    bg: 'none !important',
                    fontSize: 'sm',
                    borderColor: 'input',
                    rounded: 'md',
                    w: 'full',
                  })}>
                  {/* <Input.Icon>
                          <Sms size={"20px"} />
                        </Input.Icon> */}
                  <Input.Control type={field.type} placeholder={'Enter value'} {...nestedField} value={nestedField.value} />
                </Input.Root>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
  }
}

'use client';

import { css } from '@atdb/design-system';
import { Badge } from '../badge';
import { Button } from '../button';
import * as Input from '../input';
import { XIcon } from 'lucide-react';
import { Dispatch, SetStateAction, forwardRef, useState } from 'react';

type InputTagsProps = React.InputHTMLAttributes<HTMLInputElement> & {
  additionalKeystrokes?: boolean;
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ additionalKeystrokes = true, value, onChange, ...props }, ref) => {
  const [pendingDataPoint, setPendingDataPoint] = useState('');

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint('');
    }
  };

  return (
    <>
      <div className='flex'>
        <Input.Root className={css({ bg: 'none !important', borderColor: 'input', rounded: 'md' })} w='full'>
          <Input.Control
            value={pendingDataPoint}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addPendingDataPoint();
              }
            }}
            className='rounded-r-none'
            {...props}
            ref={ref}
          />
        </Input.Root>
        <Button type='button' variant='secondary' className='rounded-l-none border border-l-0' onClick={addPendingDataPoint}>
          Add
        </Button>
      </div>
      <div className='border rounded-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center'>
        {value.map((item, idx) => (
          <Badge key={idx} variant='secondary'>
            {item}
            <button
              type='button'
              className='w-3 ml-2'
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}>
              <XIcon className='w-3' />
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
});

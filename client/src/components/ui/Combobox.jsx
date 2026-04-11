import React, { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './Command';
import { Popover } from './Popover';

export const Combobox = ({ options, value, onValueChange, placeholder = 'Select option...', emptyMessage = 'No option found.', className }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      trigger={
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn('w-[200px] justify-between', className)}>
          {value ? options.find((o) => o.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      }
      className="p-0"
    >
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem key={option.value} onSelect={() => { onValueChange(option.value === value ? '' : option.value); setOpen(false); }}>
                <Check className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </Popover>
  );
};

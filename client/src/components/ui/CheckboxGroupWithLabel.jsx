import React from 'react';
import { cn } from '../../lib/utils';
import { Checkbox } from './Checkbox';
import { Label } from './Label';

export const CheckboxGroupWithLabel = ({ label, description, options, value, onValueChange, disabled, className }) => {
  const toggleOption = (optionValue) => {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((v) => v !== optionValue));
    } else {
      onValueChange([...value, optionValue]);
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="space-y-0.5">
        <Label className="text-base">{label}</Label>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      <div className="grid gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox checked={value.includes(option.value)} onCheckedChange={() => toggleOption(option.value)} disabled={disabled} />
            <Label className="font-normal" onClick={() => toggleOption(option.value)}>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

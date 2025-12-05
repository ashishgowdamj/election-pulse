import { useMemo, useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import type { FilterOption } from './FilterBar';

interface MultiSelectProps {
  placeholder: string;
  value: string[];
  options: FilterOption[];
  onChange: (values: string[]) => void;
  className?: string;
}

const MultiSelect = ({ placeholder, value, options, onChange, className }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const optionLookup = useMemo(() => new Map(options.map((option) => [option.value, option.label])), [options]);

  const selectedLabels =
    value.length > 0
      ? value.map((val) => optionLookup.get(val) ?? val)
      : [`All ${placeholder}`];

  const toggleValue = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((item) => item !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-[180px] justify-between bg-background text-left font-normal',
            !value.length && 'text-muted-foreground',
            className
          )}
        >
          <span className="truncate">
            {selectedLabels.slice(0, 2).join(', ')}
            {selectedLabels.length > 2 && ` +${selectedLabels.length - 2}`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                value="all"
                onSelect={() => {
                  onChange([]);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', value.length === 0 ? 'opacity-100' : 'opacity-0')} />
                All {placeholder}
              </CommandItem>
              {options
                .filter((option) => option.value !== 'all')
                .map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelect;

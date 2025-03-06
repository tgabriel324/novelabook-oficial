
import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MultiSelectProps {
  placeholder?: string;
  value: string[];
  onChange: (value: string[]) => void;
  children: React.ReactNode;
}

export function MultiSelect({
  placeholder,
  value,
  onChange,
  children,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((i) => i !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="border border-input rounded-md px-3 py-2 flex min-h-10 flex-wrap gap-1 bg-background text-sm ring-offset-background cursor-pointer">
          {value.length > 0 ? (
            value.map((item) => (
              <Badge key={item} variant="secondary" className="flex items-center gap-1">
                {item}
                <button
                  type="button"
                  className="rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnselect(item);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder || "Selecionar itens..."}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandGroup>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type === MultiSelectItem) {
                return React.cloneElement(child, {
                  itemValue: child.props.value,
                  onItemSelect: handleSelect,
                  isSelected: value.includes(child.props.value)
                });
              }
              return child;
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MultiSelectItemProps {
  value: string;
  isSelected?: boolean;
  itemValue?: string;
  onItemSelect?: (value: string) => void;
  children: React.ReactNode;
}

export function MultiSelectItem({
  value,
  isSelected,
  itemValue,
  onItemSelect,
  children,
}: MultiSelectItemProps) {
  return (
    <CommandItem
      value={value}
      onSelect={() => {
        if (onItemSelect && itemValue) {
          onItemSelect(itemValue);
        }
      }}
      className={isSelected ? "bg-accent text-accent-foreground" : ""}
    >
      {children}
    </CommandItem>
  );
}

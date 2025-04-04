
import * as React from "react"
import { Check, Globe } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useLanguage } from "@/contexts/LanguageContext"

const languages = [
  {
    value: "pt-BR",
    label: "Português (BR)",
    flag: "🇧🇷"
  },
  {
    value: "en-US",
    label: "English (US)",
    flag: "🇺🇸"
  },
]

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = React.useState(false)

  const currentLanguage = languages.find(l => l.value === language)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>{currentLanguage?.flag}</span>
            <span>{currentLanguage?.label}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Buscar idioma..." />
          <CommandEmpty>Nenhum idioma encontrado.</CommandEmpty>
          <CommandGroup>
            {languages.map((lang) => (
              <CommandItem
                key={lang.value}
                value={lang.value}
                onSelect={(currentValue) => {
                  setLanguage(currentValue as "pt-BR" | "en-US")
                  setOpen(false)
                }}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    language === lang.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

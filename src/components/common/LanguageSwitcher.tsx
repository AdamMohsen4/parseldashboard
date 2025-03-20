
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en': return 'English';
      case 'sv': return 'Svenska';
      case 'fi': return 'Suomi';
      default: return code.toUpperCase();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="px-2 flex items-center gap-1">
          <Languages className="h-4 w-4" />
          <span>{i18n.language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}
          className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer">
          {getLanguageName('en')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('sv')}
          className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer">
          {getLanguageName('sv')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('fi')}
          className="hover:bg-gray-100/40 hover:text-primary/90 cursor-pointer">
          {getLanguageName('fi')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

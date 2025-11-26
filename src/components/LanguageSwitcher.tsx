import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="font-semibold w-12"
    >
      {language === 'en' ? 'KO' : 'EN'}
    </Button>
  );
}
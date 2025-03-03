import { createI18n } from "vue-i18n";
import en from "@/langs/en.json";
import ru from "@/langs/ru.json";

const i18n = createI18n({
  legacy: false, 
  locale: "ru", 
  fallbackLocale: "en",
  messages: {
    en,
    ru,
  },
});

export default i18n;
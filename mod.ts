import type { Scrapbox } from "@cosense/types/userscript";
import { linkAuthors } from "./linkAuthors.ts";

declare const scrapbox: Scrapbox;

scrapbox.PopupMenu.addButton({
  title: "link authors",
  onClick: linkAuthors,
});

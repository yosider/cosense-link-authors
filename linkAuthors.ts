/**
 * 論文著者名のリストを解析し、Scrapboxのリンク形式に変換します。
 *
 * @param authorsStr - 著者名の文字列（カンマ、&、and、セミコロン、改行などで区切られている）
 * @returns Scrapboxリンク形式の著者名リスト（例: "[John Doe], [Jane Smith]"）
 *
 * @example
 * ```typescript
 * linkAuthors("John A. Doe1, Hanako Yamada*")
 * // => "[John A. Doe], [Hanako Yamada]"
 * ```
 */

// 区切り文字のパターン
const SEPARATORS = /[,&;∙]|\band\b|\n/gi;

// 分割前に削除するパターン（区切り文字と重複する文字を含む）
const REMOVE_BEFORE_SPLIT = /Author Info & Affiliations/gi;

// 分割後に1回だけ削除するパターン
const REMOVE_AFTER_SPLIT_ONCE = new RegExp(
  "https?:\\/\\/\\S+" + // URL
    "|\\S+@\\S+" + // メールアドレス
    "|M\\.D\\." + // 学位
    "|Ph\\.D\\." +
    "|ORCID" + // その他のリンク文字列
    "|View ORCID Profile" +
    "|Author links open overlay panel",
  "gi",
);

// 繰り返し削除が必要なパターン
const REMOVE_AFTER_SPLIT_REPEATEDLY = new RegExp(
  "[\\d†\\*#]" + // 注釈の数字、記号を削除
    "|(\\s[a-z])+\\s*$", // 末尾の単一小文字による注釈を削除
  "gi",
);

/** 著者名を整形する（不要情報の削除・大文字小文字の正規化） */
const formatAuthorName = (name: string): string => {
  // 分割後削除
  name = name.replace(REMOVE_AFTER_SPLIT_ONCE, "");

  // 繰り返し削除
  let prev: string;
  do {
    prev = name;
    name = name.replace(REMOVE_AFTER_SPLIT_REPEATEDLY, "");
  } while (name !== prev);

  name = name.trim();

  // 大文字小文字を正規化
  return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export const linkAuthors = (authorsStr: string): string => {
  const authors = authorsStr
    .replace(REMOVE_BEFORE_SPLIT, "") // 分割前削除
    .replace(SEPARATORS, ",") // 区切り文字をカンマに統一
    .split(",") // カンマで分割
    .map(formatAuthorName) // 各著者名を整形
    .filter((author) => author.length > 1) // 空や1文字のみを除外
    .map((author) => `[${author}]`) // リンク化
    .join(", ");

  return authors;
};

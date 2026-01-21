import { assertEquals } from "@std/assert";
import { linkAuthors } from "./linkAuthors.ts";

// =============================================================================
// 1. 区切り文字のテスト (Separator Tests)
// =============================================================================

Deno.test("区切り文字: カンマ", () => {
  assertEquals(
    linkAuthors("John A. Doe, Hanako Yamada"),
    "[John A. Doe], [Hanako Yamada]",
  );
});

Deno.test("区切り文字: &", () => {
  assertEquals(
    linkAuthors("Alice Smith & Bob Johnson"),
    "[Alice Smith], [Bob Johnson]",
  );
});

Deno.test("区切り文字: and", () => {
  assertEquals(
    linkAuthors("Alice Smith and Bob Johnson"),
    "[Alice Smith], [Bob Johnson]",
  );
});

Deno.test("区切り文字: セミコロン", () => {
  assertEquals(
    linkAuthors("Alice Smith; Bob Johnson"),
    "[Alice Smith], [Bob Johnson]",
  );
});

Deno.test("区切り文字: 改行", () => {
  assertEquals(
    linkAuthors("Alice Smith\nBob Johnson"),
    "[Alice Smith], [Bob Johnson]",
  );
});

Deno.test("区切り文字: 中点 (∙)", () => {
  assertEquals(
    linkAuthors("Alice Smith ∙ Bob Johnson"),
    "[Alice Smith], [Bob Johnson]",
  );
});

Deno.test("区切り文字: 複数種類の混在", () => {
  assertEquals(
    linkAuthors(
      "Alice Smith, Bob Johnson & Carol White; David Brown and Eve Davis",
    ),
    "[Alice Smith], [Bob Johnson], [Carol White], [David Brown], [Eve Davis]",
  );
});

// =============================================================================
// 2. 注釈記号の削除テスト (Annotation Removal Tests)
// =============================================================================

Deno.test("注釈削除: 数字 (0-9)", () => {
  assertEquals(
    linkAuthors("John Doe1, Jane Smith23"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("注釈削除: †", () => {
  assertEquals(
    linkAuthors("John Doe†, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("注釈削除: *", () => {
  assertEquals(
    linkAuthors("John Doe*, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("注釈削除: #", () => {
  assertEquals(
    linkAuthors("John Doe#, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("注釈削除: 複数記号の組み合せ", () => {
  assertEquals(
    linkAuthors("Dan R. Pow1,2†, 豊臣 秀吉*1#3"),
    "[Dan R. Pow], [豊臣 秀吉]",
  );
});

Deno.test("注釈削除: 末尾の単一小文字 (a b c形式)", () => {
  assertEquals(
    linkAuthors("John Doe a b, Jane Smith c"),
    "[John Doe], [Jane Smith]",
  );
});

// =============================================================================
// 3. 学術情報の削除テスト (Academic Info Removal Tests)
// =============================================================================

Deno.test("学術情報削除: M.D. (医学博士)", () => {
  assertEquals(
    linkAuthors("John Doe M.D., Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("学術情報削除: Ph.D. (博士)", () => {
  assertEquals(
    linkAuthors("John Doe Ph.D., Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("学術情報削除: ORCID", () => {
  assertEquals(
    linkAuthors("John Doe ORCID, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("学術情報削除: View ORCID Profile", () => {
  assertEquals(
    linkAuthors("John Doe View ORCID Profile, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("学術情報削除: Author links open overlay panel", () => {
  assertEquals(
    linkAuthors("John Doe Author links open overlay panel, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("学術情報削除: Author Info & Affiliations", () => {
  assertEquals(
    linkAuthors("Author Info & Affiliations John Doe, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

// =============================================================================
// 4. 連絡先情報の削除テスト (Contact Info Removal Tests)
// =============================================================================

Deno.test("連絡先削除: URL (https)", () => {
  assertEquals(
    linkAuthors("John Doe https://example.com, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("連絡先削除: URL (http)", () => {
  assertEquals(
    linkAuthors("John Doe http://example.org, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("連絡先削除: メールアドレス", () => {
  assertEquals(
    linkAuthors("John Doe john@example.com, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

// =============================================================================
// 5. テキスト正規化テスト (Text Normalization Tests)
// =============================================================================

Deno.test("テキスト正規化: 全て大文字", () => {
  assertEquals(linkAuthors("JOHN DOE, JANE SMITH"), "[John Doe], [Jane Smith]");
});

Deno.test("テキスト正規化: 全て小文字", () => {
  assertEquals(linkAuthors("john doe, jane smith"), "[John Doe], [Jane Smith]");
});

Deno.test("テキスト正規化: 混在", () => {
  assertEquals(linkAuthors("JoHn DoE, jAnE sMiTh"), "[John Doe], [Jane Smith]");
});

// =============================================================================
// 6. 国際化テスト (Internationalization Tests)
// =============================================================================

Deno.test("国際化: 日本語名のみ", () => {
  assertEquals(linkAuthors("山田 太郎, 佐藤 花子"), "[山田 太郎], [佐藤 花子]");
});

Deno.test("国際化: 日本語名と注釈記号", () => {
  assertEquals(
    linkAuthors("山田 太郎1, 佐藤 花子*"),
    "[山田 太郎], [佐藤 花子]",
  );
});

Deno.test("国際化: 日本語と英語の混在", () => {
  assertEquals(
    linkAuthors("John A. Doe1, 山田 太郎*2, Jane B. Smith3†"),
    "[John A. Doe], [山田 太郎], [Jane B. Smith]",
  );
});

// =============================================================================
// 7. エッジケース (Edge Cases)
// =============================================================================

Deno.test("エッジケース: 空文字列", () => {
  assertEquals(linkAuthors(""), "");
});

Deno.test("エッジケース: スペースのみ", () => {
  assertEquals(linkAuthors("   "), "");
});

Deno.test("エッジケース: 1人の著者のみ", () => {
  assertEquals(linkAuthors("John Doe"), "[John Doe]");
});

Deno.test("エッジケース: 空要素の除外 (連続カンマ)", () => {
  assertEquals(
    linkAuthors("John Doe, , Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("エッジケース: 1文字著者の除外 (大文字)", () => {
  assertEquals(
    linkAuthors("John Doe, A, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("エッジケース: 1文字著者の除外 (小文字)", () => {
  assertEquals(
    linkAuthors("John Doe, a, Jane Smith"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("エッジケース: 複数の1文字著者 (バグ回帰防止)", () => {
  assertEquals(
    linkAuthors("A, B, John Doe, c, Jane Smith, D"),
    "[John Doe], [Jane Smith]",
  );
});

// =============================================================================
// 8. 統合テスト (Integration Tests) - 実際のユースケース
// =============================================================================

Deno.test("統合: NEJM形式の論文", () => {
  assertEquals(
    linkAuthors(
      "Author Info & Affiliations Dan R. Pow1,2†, John Smith3 M.D., Jane Doe4 Ph.D. ORCID",
    ),
    "[Dan R. Pow], [John Smith], [Jane Doe]",
  );
});

Deno.test("統合: 複数注釈と学位が混在", () => {
  assertEquals(
    linkAuthors("John Doe1*† M.D., Jane Smith2# Ph.D. ORCID"),
    "[John Doe], [Jane Smith]",
  );
});

Deno.test("統合: URL・メール・学位の混在", () => {
  assertEquals(
    linkAuthors(
      "John Doe https://example.com john@example.com M.D., Jane Smith Ph.D.",
    ),
    "[John Doe], [Jane Smith]",
  );
});

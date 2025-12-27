# Cosense Link Authors

論文の著者名の文字列を整形して名前をリンクするPopupMenuを追加するCosense (Scrapbox) UserScript

### 例

```
入力: Dan R. Pow1,2†, 豊臣 秀吉*1
出力: [Dan R. Pow], [豊臣 秀吉]
```

## 使用方法

1. `deno task build` でビルド
2. `dist/script.js` の内容をCosenseのUserScriptに貼り付け
3. 著者名のテキストを選択し、PopupMenuから "link authors" を選択

### 開発コマンド

```bash
# テストの実行
deno task test

# テスト + カバレッジ表示
deno task test:coverage

# テスト + HTMLカバレッジレポート生成
deno task test:coverage:html

# ブラウザ用スクリプトのビルド
deno task build

# コードフォーマット
deno fmt

# リント
deno lint
```

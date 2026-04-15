# セキュリティクイズシステム

社内の情報セキュリティおよびAIリテラシーに関する理解度をチェックするクイズシステムです。

## 機能概要

- **Google アカウント認証**: ログインしたユーザーのみクイズを受験可能
- **4択クイズ**: 全15問（セキュリティ10問 + AI関連5問）を1問ずつ出題
- **採点・再挑戦**: 全問正解するまで繰り返し挑戦が必要
- **スプレッドシート記録**: 全問正解時に Google スプレッドシートへ自動記録（メールアドレス・氏名・スコア・合格日時）

## 技術スタック

- **Next.js** (App Router) + TypeScript
- **NextAuth.js v5** (Google OAuth)
- **Google Sheets API** (サービスアカウント)
- **Tailwind CSS**
- **Vercel** (デプロイ)

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、各値を設定してください。

```bash
cp .env.example .env.local
```

| 環境変数 | 説明 | 取得元 |
|---|---|---|
| `NEXTAUTH_SECRET` | セッション暗号化キー | `openssl rand -base64 32` で生成 |
| `GOOGLE_CLIENT_ID` | OAuth クライアントID | Google Cloud Console > 認証情報 |
| `GOOGLE_CLIENT_SECRET` | OAuth クライアントシークレット | Google Cloud Console > 認証情報 |
| `GOOGLE_SHEETS_PRIVATE_KEY` | サービスアカウント秘密鍵 | サービスアカウントの JSON キーファイル |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | サービスアカウントメール | サービスアカウントの JSON キーファイル |
| `GOOGLE_SPREADSHEET_ID` | スプレッドシートID | スプレッドシートURLの `/d/` と `/edit` の間の文字列 |

### 3. Google Cloud Console の設定

1. プロジェクトを作成
2. **Google Sheets API** を有効化
3. **OAuth 同意画面** を構成
4. **OAuth クライアントID** を作成（リダイレクト URI: `http://localhost:3000/api/auth/callback/google`）
5. **サービスアカウント** を作成し、JSON キーをダウンロード

### 4. Google スプレッドシートの準備

1. 新規スプレッドシートを作成
2. 1行目にヘッダーを入力: `メールアドレス | 氏名 | スコア | 合格日時`
3. サービスアカウントのメールアドレスを **編集者** として共有

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## デプロイ (Vercel)

1. GitHub リポジトリを Vercel に連携
2. Vercel の Settings > Environment Variables に `.env.local` と同じ環境変数を設定（`NEXTAUTH_URL` は本番URLに変更）
3. Google Cloud Console で本番URLを OAuth のリダイレクト URI に追加

## プロジェクト構成

```
src/
├── app/
│   ├── page.tsx                  # ランディングページ（Google認証）
│   ├── quiz/
│   │   ├── page.tsx              # クイズページ
│   │   └── result/page.tsx       # 結果ページ
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth ハンドラー
│       ├── quiz/submit/          # 回答検証 API
│       └── sheets/record/        # スプレッドシート記録 API
├── components/                   # UI コンポーネント
├── constants.ts                  # 定数（シート名など）
├── data/questions.ts             # クイズ問題データ
├── lib/google-sheets.ts          # Google Sheets API ヘルパー
└── types/quiz.ts                 # 型定義
```

## 問題の追加・変更

`src/data/questions.ts` を編集してください。問題数の変更は自動で全体に反映されます。

スプレッドシートのシート名を変更する場合は `src/constants.ts` の `SHEET_NAME` を更新してください。

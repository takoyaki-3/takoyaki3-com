## たこやきさんのつぶやき

### プロジェクトの概要

「たこやきさんのつぶやき」は、ReactとViteを用いて構築された、たこやきさんの個人Webサイトです。このサイトでは、技術記事や旅行記、作品紹介、論文、コンテスト受賞歴など、多岐にわたる情報を発信しています。

### 特徴

-   **シングルページアプリケーション**: ReactとViteを用いた高速でスムーズなユーザー体験を提供します。
-   **柔軟なコンテンツ記述**: MarkdownとHTMLの両方でコンテンツを記述できます。
-   **タグによる分類**: タグ付けにより、関連するコンテンツを簡単に探すことができます。
-   **Twitter連携**: 最新のツイートをタイムラインで表示します。
-   **アクセス解析**: Google Analyticsによるアクセス状況の計測で、サイト改善に役立てています。
-   **外部サイトの記事連携**: ZennやQiitaの記事も自動で取得し、最新記事として表示します。
-   **レスポンシブ対応**: PC、タブレット、スマートフォンなど、様々なデバイスで快適に閲覧できます。
-   **検索機能**: 記事をタイトルで検索できます。
-   **PWA対応**: プログレッシブウェブアプリとして動作し、オフラインでも閲覧できます。
-   **Storybook統合**: コンポーネント駆動開発のためのStorybookを導入しています。
-   **AI支援開発**: Cline CLIによる自動コーディングをサポートしています。

### 環境変数の設定

このプロジェクトでは、コンテンツは外部リポジトリから取得しています。コンテンツのURLは`.env`ファイル内の`VITE_CONTENT_STORAGE`変数で定義されています。

1.  プロジェクトのルートディレクトリに`.env`ファイルを作成します。
2.  `.env`ファイルに以下の行を追加します。

```
VITE_CONTENT_STORAGE = コンテンツのリポジトリURL
```

**例:**

```
VITE_CONTENT_STORAGE = https://takoyaki-3.github.io/takoyaki3-com-data
```

### APIエンドポイント

以下のAPIエンドポイントからコンテンツを取得しています。

-   `VITE_CONTENT_STORAGE/recent_updated.json`: 最新の投稿一覧
-   `VITE_CONTENT_STORAGE/contents/{pageID}.json`: 各ページのメタデータ
-   `VITE_CONTENT_STORAGE/contents/{pageID}.md`: Markdown形式のコンテンツ
-   `VITE_CONTENT_STORAGE/contents/{pageID}.html`: HTML形式のコンテンツ
-   `VITE_CONTENT_STORAGE/tag_list.json`: タグ一覧
-   `VITE_CONTENT_STORAGE/tags/{tag}.json`: 指定されたタグに紐づくページ一覧
-   `VITE_CONTENT_STORAGE/qiita/qiita_data.json`: Qiitaの記事データ
-   `VITE_CONTENT_STORAGE/zenn/zenn_feed.xml`: ZennのRSSフィード

### プロジェクト構成

```
├── public
│   ├── assets
│   │   ├── github-mark.png
│   │   ├── github-mark.svg
│   │   ├── Instagram_Glyph_Gradient.svg
│   │   ├── linkedin-icon.svg
│   │   ├── LI-In-Bug.png
│   │   ├── mail.png
│   │   ├── qiita-favicon.png
│   │   ├── takoyaki3.png
│   │   ├── takoyaki3.svg
│   │   ├── takoyaki3_192px.png
│   │   ├── takoyaki3_512px.png
│   │   └── X_logo_2023.svg
│   ├── favicon.ico
│   ├── manifest.json
│   └── service-worker.js
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   ├── github-mark.svg
│   │   ├── qiita-favicon.png
│   │   ├── takoyaki3.png
│   │   ├── takoyaki3.svg
│   │   └── zenn-logo-only.svg
│   ├── components
│   │   ├── AllPostsPage.jsx
│   │   ├── Card.jsx
│   │   ├── ContentDisplay.jsx
│   │   ├── ContentPage.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── PostsGrid.jsx
│   │   ├── SearchBar.jsx
│   │   ├── TagListPage.jsx
│   │   ├── TagPage.jsx
│   │   └── TopPage.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── styles
│   │   ├── ContentPage.css
│   │   ├── NotFoundPage.css
│   │   ├── styles.jsx
│   │   └── TopPage.css
│   └── utils
│       └── dateUtils.js
├── .env
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js

```

-   **`public/`**: 静的ファイル
    -   **`assets/`**: 画像ファイル
    -   **`index.html`**: アプリケーションのエントリーポイント
    -   **`manifest.json`**: PWAの設定ファイル
    -   **`service-worker.js`**: PWAのサービスワーカー
-   **`src/`**: ソースコード
    -   **`App.css`**: アプリケーション全体のスタイル
    -   **`App.jsx`**: アプリケーションのメインコンポーネント、ルーティングを管理
    -   **`assets/`**: ソースコード内で使用する画像ファイル
    -   **`components/`**: 各ページのコンポーネント
        -   **`AllPostsPage.jsx`**: 全ての記事を表示するページ
        -   **`Card.jsx`**: 記事のカード表示用コンポーネント
        -   **`ContentDisplay.jsx`**: 記事本文の表示用コンポーネント
        -   **`ContentPage.jsx`**: 各記事の内容を表示するページ
        -   **`LoadingSpinner.jsx`**: ローディング表示用コンポーネント
        -   **`NotFoundPage.jsx`**: 404 Not Found ページ
        -   **`PostsGrid.jsx`**: 記事一覧のグリッド表示用コンポーネント
        -   **`SearchBar.jsx`**: 検索バーコンポーネント
        -   **`TagListPage.jsx`**: タグ一覧を表示するページ
        -   **`TagPage.jsx`**: 特定のタグに紐づく記事を表示するページ
        -   **`TopPage.jsx`**: トップページ
    -   **`index.css`**: グローバルスタイル
    -   **`main.jsx`**: アプリケーションのエントリーポイント、ルートコンポーネントをレンダリング
    -   **`styles/`**: 各コンポーネントのスタイル
    -   **`utils/`**: ユーティリティ関数
        -   **`dateUtils.js`**: 日付フォーマット関数
-   **`.env`**: 環境変数
-   **`eslint.config.js`**: ESLintの設定ファイル
-   **`package.json`**: プロジェクトの設定ファイル、依存関係などを管理
-   **`vite.config.js`**: Viteの設定ファイル、ビルド設定などを管理

### インストール

1.  Node.jsとnpmをインストールします。
2.  プロジェクトのルートディレクトリで以下のコマンドを実行して依存関係をインストールします。

```bash
npm install
```

### 実行

#### 開発モード

```bash
npm run dev
```

開発サーバーが起動し、ブラウザで `http://localhost:5173` にアクセスできます。

#### ビルド

```bash
npm run build
```

ビルドされたファイルは `dist/` ディレクトリに出力されます。

#### プレビュー

ビルド後のファイルをローカルで確認できます。

```bash
npm run preview
```

#### Storybook

コンポーネントのドキュメントと開発環境を起動します。

```bash
npm run storybook
```

Storybookが起動し、ブラウザで `http://localhost:6006` にアクセスできます。

#### Storybookのビルド

```bash
npm run build-storybook
```

#### Lint

コードの静的解析を実行します。

```bash
npm run lint
```

### 使用方法

1.  アプリケーションを起動すると、トップページが表示されます。
2.  トップページには、メニュー、最近の投稿、Twitterタイムラインが表示されます。
3.  メニューから各ページにアクセスできます。
4.  各ページには、タイトル、作成日時、更新日時、コンテンツ、タグが表示されます。
5.  タグをクリックすると、そのタグに紐づくページ一覧が表示されます。
6.  全記事ページでは、記事をタイトルで検索できます。

### 開発フロー

#### AI支援開発（Cline CLI）

このプロジェクトでは、Cline CLIを使った自動コーディング機能を活用できます。

**使い方:**

1. GitHubのIssueを作成し、実装したい内容を記述します。
2. Issueに `cline-coding` ラベルを付与します。
3. GitHub Actionsが自動的に起動し、Cline CLIが以下の処理を実行します：
   - Issueの内容を解析
   - コードの実装
   - テストの追加・更新（必要に応じて）
   - `npm run lint` と `npm run build` の実行
   - エラーがある場合は自動修正を試行
   - Pull Requestの自動作成

また、Pull Requestのコメントで `@Cline` とメンションすることで、追加の修正を依頼することも可能です。

**プロジェクトルール:**

Cline CLIは以下のルールに従ってコードを生成します：

- 変更箇所には必要に応じてテストコード（または Storybook）を追加・更新すること
- タスク完了後は `npm run lint` / `npm run build` を実行し、エラーのない状態にすること
- コードの意図を読み取りつつ、安全に変更を加えること
- 既存コードのスタイル・構成に合わせること
- 可能な範囲で丁寧なエラーハンドリングを行うこと

**必要な設定:**

GitHub Actionsで実行するには、リポジトリのSecretsに以下を設定する必要があります：

- `OPEN_ROUTER_API_KEY`: OpenRouter APIキー（LLMアクセス用）

詳細は `.github/workflows/ai-coding-from-issue.yml` および `.github/workflows/ai-coding-from-pr-comment.yml` を参照してください。

#### 貢献ガイドライン

プロジェクトに貢献する際は、以下の点に注意してください：

1. **コンポーネント開発**: 新しいコンポーネントを追加する場合は、対応するStorybookストーリーも作成してください。
2. **コード品質**: Pull Request作成前に `npm run lint` でエラーがないことを確認してください。
3. **ビルド確認**: `npm run build` が成功することを確認してください。
4. **既存スタイルの尊重**: 既存コードのパターンやスタイルに合わせて実装してください。

### 使用技術

このプロジェクトは以下の技術を使用しています：

**フレームワーク・ライブラリ:**
- React 18
- Vite
- React Router DOM

**UI・スタイリング:**
- Storybook（コンポーネント開発）
- CSS Modules

**Markdown・シンタックスハイライト:**
- Marked
- Highlight.js
- Prism.js

**外部連携:**
- React Twitter Widgets

**開発ツール:**
- ESLint（コード品質チェック）
- Cline CLI（AI支援開発）
- git-repo-summarizer（README生成支援）

**インフラ・デプロイ:**
- Cloudflare Pages（GitHub連携による自動プレビュー）

**その他:**
- Google Analytics（アクセス解析）
- PWA（プログレッシブウェブアプリ）

### ライセンス

このプロジェクトはMITライセンスで公開されています。

ただし、`assets`に含まれるロゴは他者が権利を所有するファイルが含まれており、このライセンスの適応範囲外となります。
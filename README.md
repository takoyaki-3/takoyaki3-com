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
-   **Storybook対応**: コンポーネント駆動開発により、UIコンポーネントの開発・テスト・ドキュメント化が可能です。
-   **AI自動コーディング**: Cline CLIを使用したGitHub Actions連携により、Issueからの自動コーディング・PR作成が可能です。

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
├── .github
│   ├── scripts
│   │   └── extract_pr_details.py
│   └── workflows
│       ├── ai-coding-from-issue.yml
│       └── main.yml
├── docs
│   └── automation.md
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
│   │   ├── X_logo_2023.svg
│   │   └── zenn-logo-only.svg
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
│   │   ├── AllPostsPage.stories.jsx
│   │   ├── Card.jsx
│   │   ├── Card.stories.jsx
│   │   ├── ContentDisplay.jsx
│   │   ├── ContentDisplay.stories.jsx
│   │   ├── ContentPage.jsx
│   │   ├── ContentPage.stories.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── NotFoundPage.stories.jsx
│   │   ├── PostsGrid.jsx
│   │   ├── PostsGrid.stories.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SearchBar.stories.jsx
│   │   ├── TagListPage.jsx
│   │   ├── TagListPage.stories.jsx
│   │   ├── TagPage.jsx
│   │   ├── TagPage.stories.jsx
│   │   ├── TopPage.jsx
│   │   └── TopPage.stories.jsx
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

-   **`.github/`**: GitHub Actions関連の設定
    -   **`workflows/ai-coding-from-issue.yml`**: Cline CLIによる自動コーディングワークフロー
    -   **`workflows/main.yml`**: メインCI/CDワークフロー
    -   **`scripts/extract_pr_details.py`**: PR情報抽出スクリプト
-   **`docs/`**: プロジェクトドキュメント
    -   **`automation.md`**: 自動化に関する詳細ドキュメント
-   **`public/`**: 静的ファイル
    -   **`assets/`**: 画像ファイル
    -   **`manifest.json`**: PWAの設定ファイル
    -   **`service-worker.js`**: PWAのサービスワーカー
-   **`src/`**: ソースコード
    -   **`App.css`**: アプリケーション全体のスタイル
    -   **`App.jsx`**: アプリケーションのメインコンポーネント、ルーティングを管理
    -   **`assets/`**: ソースコード内で使用する画像ファイル
    -   **`components/`**: 各ページとUIコンポーネント
        -   **`AllPostsPage.jsx`**: 全ての記事を表示するページ
        -   **`Card.jsx`**: カードコンポーネント
        -   **`ContentDisplay.jsx`**: コンテンツ表示コンポーネント
        -   **`ContentPage.jsx`**: 各記事の内容を表示するページ
        -   **`LoadingSpinner.jsx`**: ローディング表示コンポーネント
        -   **`NotFoundPage.jsx`**: 404 Not Found ページ
        -   **`PostsGrid.jsx`**: 記事一覧グリッド表示コンポーネント
        -   **`SearchBar.jsx`**: 検索バーコンポーネント
        -   **`TagListPage.jsx`**: タグ一覧を表示するページ
        -   **`TagPage.jsx`**: 特定のタグに紐づく記事を表示するページ
        -   **`TopPage.jsx`**: トップページ
        -   **`*.stories.jsx`**: 各コンポーネントのStorybookストーリー
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

1.  Node.jsとnpmをインストールします（推奨: Node.js 20以上）。
2.  プロジェクトのルートディレクトリで以下のコマンドを実行して依存関係をインストールします。

```bash
npm install
```

### 開発環境のセットアップ

#### 環境変数の設定

`.env`ファイルをプロジェクトルートに作成し、必要な環境変数を設定してください。

```bash
VITE_CONTENT_STORAGE=https://takoyaki-3.github.io/takoyaki3-com-data
```

### 実行方法

#### 開発モード

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスして、アプリケーションを確認できます。

#### Storybookの起動

コンポーネントの開発・確認にはStorybookを使用します。

```bash
npm run storybook
```

ブラウザで `http://localhost:6006` にアクセスして、各コンポーネントのストーリーを確認できます。

#### ビルド

本番環境用にビルドします。

```bash
npm run build
```

ビルド結果は`dist/`ディレクトリに出力されます。

#### プレビュー

ビルドしたアプリケーションをローカルでプレビューします。

```bash
npm run preview
```

#### リント

コードの静的解析を実行します。

```bash
npm run lint
```

#### Storybookのビルド

Storybookを静的ファイルとしてビルドします。

```bash
npm run build-storybook
```

### 使用方法

1.  アプリケーションを起動すると、トップページが表示されます。
2.  トップページには、メニュー、最近の投稿、Twitterタイムラインが表示されます。
3.  メニューから各ページにアクセスできます。
4.  各ページには、タイトル、作成日時、更新日時、コンテンツ、タグが表示されます。
5.  タグをクリックすると、そのタグに紐づくページ一覧が表示されます。
6.  全記事ページでは、記事をタイトルで検索できます。

### AI自動コーディング（Cline CLI）

このプロジェクトは、Cline CLIを用いたAI駆動の自動コーディング機能を実装しています。

#### 使い方

1.  GitHubでIssueを作成します。
2.  Issueに `cline-coding` ラベルを追加します。
3.  GitHub Actionsが自動的に起動し、以下の処理を実行します：
    -   Issueの内容を解析
    -   Cline CLIを使用してコードを生成・修正
    -   テストとビルドを実行
    -   自動的にPull Requestを作成

#### 設定

-   `.github/workflows/ai-coding-from-issue.yml`: 自動コーディングワークフロー
-   リポジトリのSecretsに `OPEN_ROUTER_API_KEY` を設定する必要があります

#### プロジェクトルール

Cline CLIによる自動コーディングでは、以下のルールが適用されます：

-   変更箇所には必要に応じてテストコード（またはStorybook）を追加・更新すること
-   タスク完了後は `npm run lint` / `npm run build` を実行し、エラーのない状態にすること
-   コードの意図を読み取りつつ、安全に変更を加えること
-   既存コードのスタイル・構成に合わせること
-   可能な範囲で丁寧なエラーハンドリングを行うこと

詳細は [`docs/automation.md`](docs/automation.md) を参照してください。

### コンポーネント駆動開発

このプロジェクトでは、コンポーネント駆動開発を採用しています。各UIコンポーネントには対応するStorybookストーリー（`.stories.jsx`ファイル）が用意されており、独立した環境でコンポーネントの開発・テスト・ドキュメント化が可能です。

新しいコンポーネントを追加する際は、対応するストーリーファイルも作成することを推奨します。

### 技術スタック

-   **フロントエンド**: React 18, React Router
-   **ビルドツール**: Vite
-   **スタイリング**: CSS
-   **マークダウン**: Marked
-   **シンタックスハイライト**: Highlight.js, Prism.js
-   **開発ツール**: Storybook, ESLint
-   **PWA**: Service Worker, Web App Manifest
-   **CI/CD**: GitHub Actions
-   **AI自動化**: Cline CLI

### ライセンス

このプロジェクトはMITライセンスで公開されています。
ただし、`assets`に含まれるロゴは他者が権利を所有するファイルが含まれており、このライセンスの適応範囲外となります。

### 貢献

バグ報告や機能リクエストは、GitHubのIssueで受け付けています。
Pull Requestも歓迎します。

### その他

-   このプロジェクトは、React, Vite, Marked, Highlight.js, React Twitter Widgetsを使用しています。
-   コンテンツはMarkdownまたはHTMLで記述できます。
-   コンテンツは外部リポジトリで管理されています。
-   Google Analyticsでアクセス状況を計測しています。
-   Storybookによるコンポーネント開発環境を提供しています。
-   Cline CLIによるAI自動コーディング機能を搭載しています。
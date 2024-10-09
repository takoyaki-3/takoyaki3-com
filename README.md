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
takoyaki3-com/
├── public/
│   ├── assets/
│   │   ├── Instagram_Glyph_Gradient.svg
│   │   ├── LI-In-Bug.png
│   │   ├── Twitter social icons - square - blue.png
│   │   ├── mail.png
│   │   ├── qiita-favicon.png
│   │   ├── takoyaki3.png
│   │   ├── takoyaki3.svg
│   │   └── zenn-logo-only.svg
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   ├── LI-In-Bug.png
│   │   ├── qiita-favicon.png
│   │   ├── takoyaki3.png
│   │   ├── takoyaki3.svg
│   │   └── zenn-logo-only.svg
│   ├── components/
│   │   ├── AllPostsPage.jsx
│   │   ├── ContentPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── TagListPage.jsx
│   │   ├── TagPage.jsx
│   │   └── TopPage.jsx
│   ├── index.css
│   ├── main.jsx
│   └── utils/
│       └── dateUtils.js
├── .env
├── eslint.config.js
├── package.json
└── vite.config.js
```

-   **`public/`**: 静的ファイル
    -   **`assets/`**: 画像ファイル
    -   **`index.html`**: アプリケーションのエントリーポイント
-   **`src/`**: ソースコード
    -   **`App.css`**: アプリケーション全体のスタイル
    -   **`App.jsx`**: アプリケーションのメインコンポーネント、ルーティングを管理
    -   **`assets/`**: ソースコード内で使用する画像ファイル
    -   **`components/`**: 各ページのコンポーネント
        -   **`AllPostsPage.jsx`**: 全ての記事を表示するページ
        -   **`ContentPage.jsx`**: 各記事の内容を表示するページ
        -   **`NotFoundPage.jsx`**: 404 Not Found ページ
        -   **`TagListPage.jsx`**: タグ一覧を表示するページ
        -   **`TagPage.jsx`**: 特定のタグに紐づく記事を表示するページ
        -   **`TopPage.jsx`**: トップページ
    -   **`index.css`**: グローバルスタイル
    -   **`main.jsx`**: アプリケーションのエントリーポイント、ルートコンポーネントをレンダリング
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

#### ビルド

```bash
npm run build
```

### 使用方法

1.  アプリケーションを起動すると、トップページが表示されます。
2.  トップページには、メニュー、最近の投稿、Twitterタイムラインが表示されます。
3.  メニューから各ページにアクセスできます。
4.  各ページには、タイトル、作成日時、更新日時、コンテンツ、タグが表示されます。
5.  タグをクリックすると、そのタグに紐づくページ一覧が表示されます。
6.  全記事ページでは、記事をタイトルで検索できます。

### ライセンス

このプロジェクトはMITライセンスで公開されています。 
ただし、`assets`に含まれるロゴは他者が権利を所有するファイルが含まれており、このライセンスの適応範囲外となります。

### その他

-   このプロジェクトは、React, Vite, Marked, Highlight.js, React Twitter Widgetsを使用しています。
-   コンテンツはMarkdownまたはHTMLで記述できます。
-   コンテンツは外部リポジトリで管理されています。
-   Google Analyticsでアクセス状況を計測しています。
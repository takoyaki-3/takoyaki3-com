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

### 環境変数の設定

このプロジェクトでは、コンテンツは外部リポジトリから取得しています。コンテンツのURLは`src/App.jsx`内の`content_storage`変数で定義されています。

```javascript
const content_storage = 'https://takoyaki-3.github.io/takoyaki3-com-data'; 
```

### APIエンドポイント

以下のAPIエンドポイントからコンテンツを取得しています。

-   `content_storage/recent_updated.json`: 最新の投稿一覧
-   `content_storage/contents/{pageID}.json`: 各ページのメタデータ
-   `content_storage/contents/{pageID}.md`: Markdown形式のコンテンツ
-   `content_storage/contents/{pageID}.html`: HTML形式のコンテンツ
-   `content_storage/tag_list.json`: タグ一覧
-   `content_storage/tags/{tag}.json`: 指定されたタグに紐づくページ一覧
-   `content_storage/qiita/qiita_data.json`: Qiitaの記事データ
-   `content_storage/zenn/zenn_feed.xml`: ZennのRSSフィード

### プロジェクト構成

```
takoyaki3-com/
├── public/
│   ├── assets/
│   │   ├── Instagram_Glyph_Gradient.svg
│   │   ├── Twitter social icons - square - blue.png
│   │   ├── github-mark.png
│   │   ├── mail.png
│   │   ├── qiita-favicon.png
│   │   ├── takoyaki3.png
│   │   └── zenn-logo-only.svg
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   ├── github-mark.png
│   │   ├── qiita-favicon.png
│   │   ├── react.svg
│   │   ├── takoyaki3.png
│   │   └── zenn-logo-only.svg
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── package.json
└── vite.config.js
```

-   **`public/`**: 静的ファイル
    -   **`assets/`**: 画像ファイル
    -   **`index.html`**: アプリケーションのエントリーポイント
-   **`src/`**: ソースコード
    -   **`App.css`**: アプリケーション全体のスタイル
    -   **`App.jsx`**: アプリケーションのメインコンポーネント
    -   **`assets/`**: ソースコード内で使用する画像ファイル
    -   **`index.css`**: グローバルスタイル
    -   **`main.jsx`**: アプリケーションのエントリーポイント
-   **`eslint.config.js`**: ESLintの設定ファイル
-   **`package.json`**: プロジェクトの設定ファイル
-   **`vite.config.js`**: Viteの設定ファイル

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

### ライセンス

このプロジェクトはMITライセンスで公開されています。 

### その他

-   このプロジェクトは、React, Vite, Marked, Highlight.js, React Twitter Widgetsを使用しています。
-   コンテンツはMarkdownまたはHTMLで記述できます。
-   コンテンツは外部リポジトリで管理されています。
-   Google Analyticsでアクセス状況を計測しています。

### 貢献

このプロジェクトへの貢献を歓迎します。バグレポート、機能リクエスト、プルリクエストなど、お気軽にご連絡ください。

### 詳細な情報

-   **コンテンツの取得**: コンテンツは`src/App.jsx`ファイル内の`fetchContent`関数で取得されています。
-   **Markdownのレンダリング**: Markdown形式のコンテンツは`src/App.jsx`ファイル内の`marked`ライブラリを使用してHTMLに変換されます。
-   **コードハイライト**: コードブロックは`src/App.jsx`ファイル内の`highlight.js`ライブラリを使用してシンタックスハイライトされます。
-   **テーブルのレスポンシブ対応**: `src/App.css`ファイル内でCSSを使用して、テーブルがレスポンシブになるように設定されています。

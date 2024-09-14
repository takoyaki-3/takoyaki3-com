## たこやきさんのつぶやき

### プロジェクトの概要

たこやきさんの個人Webサイト「たこやきさんのつぶやき」のソースコードです。このサイトでは、技術記事や旅行記、作品紹介、論文、コンテスト受賞歴など、様々な情報を発信しています。

### 特徴

- React, Viteを用いたシングルページアプリケーション
- Markdown, HTMLによるコンテンツ記述
- タグによるコンテンツ分類
- Twitterタイムラインの埋め込み
- Google Analyticsによるアクセス解析

### ディレクトリ構造

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
│   │   ├── react.svg
│   │   └── takoyaki3.png
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── package.json
└── vite.config.js

```

- **public/**: 静的ファイル
    - **assets/**: 画像ファイル
    - **index.html**: アプリケーションのエントリーポイント
- **src/**: ソースコード
    - **App.css**: アプリケーション全体のスタイル
    - **App.jsx**: アプリケーションのメインコンポーネント
    - **assets/**: ソースコード内で使用する画像ファイル
    - **index.css**: グローバルスタイル
    - **main.jsx**: アプリケーションのエントリーポイント
- **eslint.config.js**: ESLintの設定ファイル
- **package.json**: プロジェクトの設定ファイル
- **vite.config.js**: Viteの設定ファイル


### 環境変数の設定

このプロジェクトでは、コンテンツは外部リポジトリから取得しています。コンテンツのURLは`src/App.jsx`内の`content_storage`変数で定義されています。

```javascript
const content_storage = 'https://takoyaki-3.github.io/takoyaki3-com-data'; 
```

### APIエンドポイント

このプロジェクトでは、以下のAPIエンドポイントからコンテンツを取得しています。

- `content_storage/recent_updated.json`: 最新の投稿一覧
- `content_storage/contents/{pageID}.json`: 各ページのメタデータ
- `content_storage/contents/{pageID}.md`: Markdown形式のコンテンツ
- `content_storage/contents/{pageID}.html`: HTML形式のコンテンツ
- `content_storage/tag_list.json`: タグ一覧
- `content_storage/tags/{tag}.json`: 指定されたタグに紐づくページ一覧


### インストール

1. Node.jsとnpmをインストールします。
2. プロジェクトのルートディレクトリで以下のコマンドを実行して依存関係をインストールします。

```bash
npm install
```

### 実行

開発モードでアプリケーションを実行するには、以下のコマンドを実行します。

```bash
npm run dev
```

ビルドするには、以下のコマンドを実行します。

```bash
npm run build
```

### 使用方法

アプリケーションを起動すると、トップページが表示されます。トップページには、メニュー、最近の投稿、Twitterタイムラインが表示されます。

メニューから各ページにアクセスできます。各ページには、タイトル、作成日時、更新日時、コンテンツ、タグが表示されます。

タグをクリックすると、そのタグに紐づくページ一覧が表示されます。

### ライセンス

このプロジェクトはMITライセンスで公開されています。


### その他

- このプロジェクトは、React, Vite, Marked, Highlight.js, React Twitter Widgetsを使用しています.
- コンテンツはMarkdownまたはHTMLで記述できます。
- コンテンツは外部リポジトリで管理されています。
- Google Analyticsでアクセス状況を計測しています.


## 貢献

このプロジェクトへの貢献を歓迎します。バグレポート、機能リクエスト、プルリクエストなど、お気軽にご連絡ください。
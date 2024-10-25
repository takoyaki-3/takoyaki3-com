import React from 'react';
import Card from './Card';

// サンプルデータの作成
const sampleOwnPost = {
  id: '1',
  title: 'たこやきさんのつぶやき記事',
  url: '/post/1',
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-02T00:00:00Z',
  type: 'own',
  source: 'たこやきさんのつぶやき',
};

const sampleQiitaPost = {
  id: '2',
  title: 'Qiita記事',
  url: 'https://qiita.com/article/2',
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-02T00:00:00Z',
  type: 'qiita',
  source: 'Qiita',
};

const sampleZennPost = {
  id: '3',
  title: 'Zenn記事',
  url: 'https://zenn.dev/article/3',
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-02T00:00:00Z',
  type: 'zenn',
  source: 'Zenn',
};

// Storybookのデフォルトエクスポート
export default {
  title: 'Components/Card',
  component: Card,
};

// デフォルトの「たこやきさんのつぶやき」の記事カード
export const OwnArticle = () => <Card post={sampleOwnPost} />;

// Qiitaの記事カード
export const QiitaArticle = () => <Card post={sampleQiitaPost} />;

// Zennの記事カード
export const ZennArticle = () => <Card post={sampleZennPost} />;

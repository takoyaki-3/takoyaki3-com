import React from 'react';
import Card from './Card';

// サンプルデータの作成
const samplePost = {
  id: '1',
  title: 'たこやきさんのつぶやき記事',
  url: '/post/1',
  created: '2024-01-01T00:00:00Z',
  updated: '2024-01-02T00:00:00Z',
  type: 'own',
  source: 'たこやきさんのつぶやき',
};

// デフォルトエクスポート
export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    post: {
      control: {
        type: 'object',
      },
      description: '記事情報を持つオブジェクト',
    },
    // 'type' プロパティをコントロールとして操作できるように設定
    'post.type': {
      control: {
        type: 'select',
        options: ['own', 'qiita', 'zenn'], // 選択肢を設定
      },
      description: '記事のタイプ',
    },
  },
};

// ストーリー定義
const Template = (args) => <Card {...args} />;

// ストーリー1: own記事用のデフォルトストーリー
export const OwnArticle = Template.bind({});
OwnArticle.args = {
  post: {
    ...samplePost,
    type: 'own', // デフォルトのタイプを設定
  },
};

// ストーリー2: Qiita記事用のストーリー
export const QiitaArticle = Template.bind({});
QiitaArticle.args = {
  post: {
    ...samplePost,
    id: '2',
    title: 'Qiita記事',
    url: 'https://qiita.com/article/2',
    type: 'qiita',
    source: 'Qiita',
  },
};

// ストーリー3: Zenn記事用のストーリー
export const ZennArticle = Template.bind({});
ZennArticle.args = {
  post: {
    ...samplePost,
    id: '3',
    title: 'Zenn記事',
    url: 'https://zenn.dev/article/3',
    type: 'zenn',
    source: 'Zenn',
  },
};

// ストーリー4: Minimum版のストーリー
export const MinimumArticle = Template.bind({});
MinimumArticle.args = {
  post: {
    ...samplePost,
    type: 'own',
  },
  type: 'minimum', // Minimumバージョンを指定
};

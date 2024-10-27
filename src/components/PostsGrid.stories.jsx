import React from 'react';
import PostsGrid from './PostsGrid';

// サンプル記事データ
const samplePosts = [
  {
    id: '1',
    title: 'たこやきさんのつぶやき記事',
    url: '/post/1',
    created: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    type: 'own',
    source: 'たこやきさんのつぶやき',
  },
  {
    id: '2',
    title: 'Qiita記事',
    url: 'https://qiita.com/article/2',
    created: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    type: 'qiita',
    source: 'Qiita',
  },
  {
    id: '3',
    title: 'Zenn記事',
    url: 'https://zenn.dev/article/3',
    created: '2024-01-01T00:00:00Z',
    updated: '2024-01-02T00:00:00Z',
    type: 'zenn',
    source: 'Zenn',
  },
];

// Storybookのデフォルトエクスポート
export default {
  title: 'Components/PostsGrid',
  component: PostsGrid,
};

// デフォルトのストーリー
const Template = (args) => <PostsGrid {...args} />;

// 複数のカードを表示するデフォルトのストーリー
export const Default = Template.bind({});
Default.args = {
  posts: samplePosts,
};

// カードが1つだけのストーリー
export const SinglePost = Template.bind({});
SinglePost.args = {
  posts: [samplePosts[0]],
};

// カードが多い場合のストーリー
export const ManyPosts = Template.bind({});
ManyPosts.args = {
  posts: [
    ...samplePosts,
    {
      id: '4',
      title: '追加のQiita記事',
      url: 'https://qiita.com/article/4',
      created: '2024-01-03T00:00:00Z',
      updated: '2024-01-04T00:00:00Z',
      type: 'qiita',
      source: 'Qiita',
    },
    {
      id: '5',
      title: 'さらに追加のZenn記事',
      url: 'https://zenn.dev/article/5',
      created: '2024-01-05T00:00:00Z',
      updated: '2024-01-06T00:00:00Z',
      type: 'zenn',
      source: 'Zenn',
    },
  ],
};

import React, { useState } from 'react';
import SearchBar from './SearchBar';

// Storybookのデフォルトエクスポート
export default {
  title: 'Components/SearchBar',
  component: SearchBar,
  argTypes: {
    searchQuery: {
      control: 'text',
      description: '検索クエリの文字列',
    },
    setSearchQuery: {
      action: 'searchQuery updated',
      description: '検索クエリを更新する関数',
    },
  },
};

// テンプレート関数
const Template = (args) => {
  const [query, setQuery] = useState(args.searchQuery);

  const handleChange = (newQuery) => {
    setQuery(newQuery);
    args.setSearchQuery(newQuery);
  };

  return <SearchBar searchQuery={query} setSearchQuery={handleChange} />;
};

// デフォルトのストーリー
export const Default = Template.bind({});
Default.args = {
  searchQuery: '',
};

// ストーリー: 初期値が設定された検索バー
export const WithInitialValue = Template.bind({});
WithInitialValue.args = {
  searchQuery: '初期検索クエリ',
};

// ストーリー: 長い検索クエリ
export const LongQuery = Template.bind({});
LongQuery.args = {
  searchQuery: 'これは非常に長い検索クエリの例です。',
};

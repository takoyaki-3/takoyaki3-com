/* eslint-disable no-undef */
import { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import TagListPage from './TagListPage';

export default {
  title: 'Pages/TagListPage',
  component: TagListPage,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

// モックデータを使用したテンプレート
const TemplateWithMockData = () => {
  // globalFetchを上書きして、モックデータを返す
  useEffect(() => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            'React': 15,
            'JavaScript': 12,
            'TypeScript': 10,
            'Web開発': 8,
            'フロントエンド': 7,
            'バックエンド': 6,
            'データベース': 5,
            'AWS': 4,
            'Docker': 3,
            'CI/CD': 2,
            '作品一覧': 18,
            '論文': 5,
            '登壇資料': 8,
            '旅行記': 12,
            '技術記事': 20,
            'Python': 9,
            'Go': 6,
            'Rust': 4,
            'Machine Learning': 7,
            'DevOps': 5,
          }),
      })
    );

    return () => {
      global.fetch = originalFetch;
    };
  }, []);

  return <TagListPage />;
};

// デフォルトのストーリー（モックデータあり）
export const Default = () => <TemplateWithMockData />;

// 空のタグリスト
export const EmptyTags = () => {
  useEffect(() => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    return () => {
      global.fetch = originalFetch;
    };
  }, []);

  return <TagListPage />;
};

// ローディング状態
export const Loading = () => {
  useEffect(() => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) => {
          // 永遠にローディング状態を維持
          setTimeout(() => {
            resolve({
              json: () => Promise.resolve({}),
            });
          }, 100000);
        })
    );

    return () => {
      global.fetch = originalFetch;
    };
  }, []);

  return <TagListPage />;
};

// 少数のタグ
export const FewTags = () => {
  useEffect(() => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            'React': 5,
            'JavaScript': 3,
            'TypeScript': 2,
          }),
      })
    );

    return () => {
      global.fetch = originalFetch;
    };
  }, []);

  return <TagListPage />;
};

// 多数のタグ
export const ManyTags = () => {
  useEffect(() => {
    const originalFetch = global.fetch;
    const tags = {};
    for (let i = 1; i <= 50; i++) {
      tags[`Tag${i}`] = Math.floor(Math.random() * 20) + 1;
    }
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(tags),
      })
    );

    return () => {
      global.fetch = originalFetch;
    };
  }, []);

  return <TagListPage />;
};

// 長いタグ名
export const LongTagNames = () => {
  useEffect(() => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            'Very Long Tag Name That Should Wrap': 10,
            'これはとても長い日本語のタグ名です': 8,
            'Another-Super-Long-Tag-Name-With-Hyphens': 6,
            'ShortTag': 15,
            'もう一つの非常に長いタグの名前でテストします': 12,
          }),
      })
    );

    return () => {
      global.fetch = originalFetch;
    };
  }, []);

  return <TagListPage />;
};
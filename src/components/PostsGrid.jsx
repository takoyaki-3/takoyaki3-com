import React from 'react';
import Card from './Card';

// カードグリッドのスタイル定義
const gridStyles = {
  display: 'grid',
  gap: '20px',
  maxWidth: '1200px',
  // 中央揃え
  margin: '0 auto',
};

// 各レスポンシブメディアクエリ
const getGridStyles = (width) => {
  if (width >= 1200) {
    return { ...gridStyles, gridTemplateColumns: 'repeat(3, 1fr)' };
  } else if (width >= 768 && width < 1200) {
    return { ...gridStyles, gridTemplateColumns: 'repeat(2, 1fr)' };
  } else {
    return { ...gridStyles, gridTemplateColumns: '1fr' };
  }
};

const PostsGrid = ({ posts }) => {
  const width = window.innerWidth;
  const responsiveGridStyles = getGridStyles(width);

  return (
    <div style={responsiveGridStyles}>
      {posts.map((post) => (
        <Card post={post} />
      ))}
    </div>
  );
};

export default PostsGrid;

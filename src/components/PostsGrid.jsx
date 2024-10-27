import React from 'react';
import Card from './Card';
import { style } from '../styles/styles';

// 各レスポンシブメディアクエリ
const getGridStyles = (width) => {
  if (width >= 1200) {
    return { ...style.postsGrid, gridTemplateColumns: 'repeat(3, 1fr)' };
  } else if (width >= 768 && width < 1200) {
    return { ...style.postsGrid, gridTemplateColumns: 'repeat(2, 1fr)' };
  } else {
    return { ...style.postsGrid, gridTemplateColumns: '1fr' };
  }
};

const cardStyles = (width) => {
  if (width >= 1200) {
    return 'basic';
  } else if (width >= 768 && width < 1200) {
    return 'basic';
  } else {
    return 'minimum';
  }
}

const PostsGrid = ({ posts }) => {
  const width = window.innerWidth;
  const responsiveGridStyles = getGridStyles(width);
  const cardType = cardStyles(width);

  return (
    <div style={responsiveGridStyles}>
    {posts.map((post) => (
      <Card key={post.id} post={post} type={cardType}/>
    ))}
    </div>
  );
};

export default PostsGrid;

import React, { useState, useEffect } from 'react';
import { style } from '../styles/styles';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

// タグ一覧ページコンポーネント
const TagListPage = () => {
  const [tags, setTags] = useState({});

  useEffect(() => {
    const fetchTags = async () => {
      console.log(`${content_storage}/tag_list.json`);
      try {
        const tagsResponse = await fetch(`${content_storage}/tag_list.json`);
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div>
      <h2 style={style.heading}>タグ一覧</h2>
      <div className="tag-list">
        {Object.keys(tags).map((tag) => (
          <a style={style.tag} key={tag} href={`/tag/${tag}`}>#{tag}</a>
        ))}
      </div>
    </div>
  );
};

export default TagListPage;
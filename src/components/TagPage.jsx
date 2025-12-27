import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostsGrid from './PostsGrid';
import { style } from '../styles/styles';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

const TagPage = () => {
  const { tag } = useParams();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchTagPages = async () => {
      try {
        const response = await fetch(`${content_storage}/tags/${tag}.json`);
        const data = await response.json();
        data.sort((a, b) => new Date(b.created) - new Date(a.created));
        setPages(
          data.map((page) => ({
            ...page,
            url: `/${page.id}`,
            type: 'own',
            source: 'たこやきさんのつぶやき',
          }))
        );
      } catch (error) {
        console.error('Error fetching tag pages:', error);
      }
    };
    fetchTagPages();
  }, [tag]);

  return (
    <div className="tag">
      <h2>
        タグ：<span style={style.tag}>#{tag}</span>
      </h2>
      <PostsGrid posts={pages} />
    </div>
  );
};

export default TagPage;

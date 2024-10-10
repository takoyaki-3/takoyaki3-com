import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
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
        setPages(data);
      } catch (error) {
        console.error('Error fetching tag pages:', error);
      }
    };
    fetchTagPages();
  }, [tag]);

  return (
    <div className="tag">
      <h2>タグ：<a>#{tag}</a></h2>
      <div className="tag-grid">
        {pages.map((page) => (
          <a key={`page-${page.id}`} href={`/${page.id}`}>
            <div className="card">
              <h3>{page.title}</h3>
              <p style={{ textAlign: 'right' }}>作成日時：{formatDate(page.created)}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TagPage;

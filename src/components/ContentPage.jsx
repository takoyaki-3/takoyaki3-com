import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import NotFoundPage from './NotFoundPage';
import ContentDisplay from './ContentDisplay';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

const ContentPage = () => {
  const { pageID } = useParams();
  const [page, setPage] = useState({ tags: [] });
  const [pageHTML, setPageHTML] = useState('');
  const [pageExists, setPageExists] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pageDataResponse = await fetch(`${content_storage}/contents/${pageID}.json`);
        if (!pageDataResponse.ok) {
          setPageExists(false);
          return;
        }
        const pageData = await pageDataResponse.json();
        setPage(pageData);

        let content = '';
        if (pageData.type === 'md') {
          const contentResponse = await fetch(`${content_storage}/contents/${pageID}.md`);
          content = await contentResponse.text();
          content = marked(content);
        } else if (pageData.type === 'html') {
          const contentResponse = await fetch(`${content_storage}/contents/${pageID}.html`);
          content = await contentResponse.text();
        }
        setPageHTML(content);
      } catch (error) {
        console.error('Error fetching content:', error);
        setPageExists(false);
      }
    };

    fetchContent();
  }, [pageID]);

  useEffect(() => {
    // テーブルをラップする
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      if (!table.parentNode.classList.contains('table-container')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-container';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });

    // 記事内のタグリンクをSPA対応に変更
    const tagLinks = document.querySelectorAll('.tag a');
    tagLinks.forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
      };
    });
  }, [pageHTML]);

  if (!pageExists) {
    return <NotFoundPage />;
  }

  return <ContentDisplay page={page} pageHTML={pageHTML} />;
};

export default ContentPage;

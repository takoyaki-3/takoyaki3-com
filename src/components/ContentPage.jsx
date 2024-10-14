import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import { marked } from 'marked';
import NotFoundPage from './NotFoundPage';
import "../styles/ContentPage.css";

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

// コンテンツページコンポーネント
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
          content = marked(content, {
            highlight: (code, lang) => {
              return (
                '<code class="hljs">' +
                highlight.highlightAuto(code, [lang]).value +
                '</code>'
              );
            },
          });
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
  }, [pageHTML]);

  // ページが存在しない場合は404ページを表示
  if (!pageExists) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <div className="article-card">
        <div className="text-right">
          <p>
            作成日時：{formatDate(page.created)}
            <br />
            更新日時：{formatDate(page.updated)}
          </p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: pageHTML }} />
        <div className="tags">
          {page.tags.map((tag) => (
            <a key={tag} href={`/tag/${tag}`}>#{tag} </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentPage;
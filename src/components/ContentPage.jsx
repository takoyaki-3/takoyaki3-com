import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import NotFoundPage from './NotFoundPage';
import ContentDisplay from './ContentDisplay';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

// マークダウンレンダラーのオプション設定
marked.setOptions({
  breaks: true, // 改行を有効にする
  gfm: true, // GitHub Flavored Markdownを有効にする
});

// 画像のレスポンシブ対応のためのレンダラーカスタマイズ
const renderer = new marked.Renderer();
const originalImageRenderer = renderer.image;
renderer.image = function(href, title, text) {
  const img = originalImageRenderer.call(this, href, title, text);
  // 画像タグにクラスを追加
  return img.replace('<img', '<img class="responsive-image"');
};

const ContentPage = () => {
  const { pageID } = useParams();
  const [page, setPage] = useState({ tags: [] });
  const [pageHTML, setPageHTML] = useState('');
  const [pageExists, setPageExists] = useState(true);

  useEffect(() => {
    // ビューポートの設定を追加（モバイル表示の最適化）
    const setViewportMeta = () => {
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        document.head.appendChild(viewport);
      }
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
    };

    setViewportMeta();

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
          // カスタムレンダラーを使用
          content = marked(content, { renderer });
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

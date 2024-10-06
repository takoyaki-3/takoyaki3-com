import React, { useState, useEffect } from 'react';
import qiitaIcon from '../assets/qiita-favicon.png';
import zennIcon from '../assets/zenn-logo-only.svg';
import ownIcon from '../assets/takoyaki3.png';
import { formatDate } from '../utils/dateUtils';
const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

// 全記事ページコンポーネント
const AllPostsPage = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        // 自サイトの全記事を取得
        const recentUpdatedResponse = await fetch(`${content_storage}/recent_updated.json`);
        const recentPostsData = await recentUpdatedResponse.json();
        const ownArticles = recentPostsData.map((post) => ({
          ...post,
          url: `/${post.id}`,
          type: 'own',
          source: 'たこやきさんのつぶやき',
        }));

        // Qiitaの記事を取得
        const fetchQiitaArticles = async () => {
          try {
            const qiitaResponse = await fetch(`${content_storage}/qiita/qiita_data.json`);
            const qiitaArticles = await qiitaResponse.json();
            return qiitaArticles.map((article) => ({
              id: article.id,
              title: article.title,
              url: article.url,
              created: article.created_at,
              updated: article.updated_at,
              tags: article.tags.map((tag) => tag.name),
              type: 'qiita',
              source: 'Qiita',
            }));
          } catch (error) {
            console.error('Error fetching Qiita articles:', error);
            return [];
          }
        };

        // Zennの記事を取得
        const fetchZennArticles = async () => {
          try {
            const zennResponse = await fetch(`${content_storage}/zenn/zenn_feed.xml`);
            const zennFeedText = await zennResponse.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(zennFeedText, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            const articles = [];
            items.forEach((item) => {
              const title = item.querySelector('title').textContent;
              const link = item.querySelector('link').textContent;
              const pubDate = item.querySelector('pubDate').textContent;
              const isoDate = new Date(pubDate).toISOString();
              articles.push({
                id: link,
                title: title,
                url: link,
                created: isoDate,
                updated: isoDate,
                tags: [],
                type: 'zenn',
                source: 'Zenn',
              });
            });
            return articles;
          } catch (error) {
            console.error('Error fetching Zenn articles:', error);
            return [];
          }
        };

        const qiitaArticles = await fetchQiitaArticles();
        const zennArticles = await fetchZennArticles();

        // 全ての記事をマージして日付でソート
        const allArticles = [...ownArticles, ...qiitaArticles, ...zennArticles];
        allArticles.sort((a, b) => new Date(b.updated) - new Date(a.updated));

        setAllArticles(allArticles);
      } catch (error) {
        console.error('Error fetching all articles:', error);
      }
    };

    fetchAllArticles();
  }, []);

  // 検索結果をフィルタリング
  const filteredArticles = allArticles.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>All Posts</h2>
      {/* 検索バー */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="記事を検索"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="all-posts-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target={post.type !== 'own' ? '_blank' : '_self'}
              rel="noopener noreferrer"
            >
              <div className="card">
                {/* サイトのアイコンを左下に表示 */}
                <div className="icon-container">
                  {post.type === 'qiita' && (
                    <img src={qiitaIcon} alt="Qiita" className="site-icon" />
                  )}
                  {post.type === 'zenn' && (
                    <img src={zennIcon} alt="Zenn" className="site-icon" />
                  )}
                  {post.type === 'own' && (
                    <img src={ownIcon} alt="たこやきさんのつぶやき" className="site-icon" />
                  )}
                </div>
                <h3>{post.title}</h3>
                <p>
                  作成日時：{formatDate(post.created)}
                  <br />
                  更新日時：{formatDate(post.updated)}
                </p>
              </div>
            </a>
          ))
        ) : (
          <p>検索結果が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
};

export default AllPostsPage;
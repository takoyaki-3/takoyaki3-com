import React, { useState, useEffect } from 'react';
import PostsGrid from './PostsGrid';
import SearchBar from './SearchBar';
const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

const AllPostsPage = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllArticles = async () => {
      try {
        setLoading(true);
        const recentUpdatedResponse = await fetch(`${content_storage}/recent_updated.json`);
        const recentPostsData = await recentUpdatedResponse.json();
        const ownArticles = recentPostsData.map((post) => ({
          ...post,
          url: `/${post.id}`,
          type: 'own',
          source: 'たこやきさんのつぶやき',
        }));

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
        const allArticles = [...ownArticles, ...qiitaArticles, ...zennArticles];
        allArticles.sort((a, b) => new Date(b.created) - new Date(a.created));

        setAllArticles(allArticles);
      } catch (error) {
        console.error('Error fetching all articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllArticles();
  }, []);

  const filteredArticles = allArticles.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>All Posts</h2>
      {loading ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <PostsGrid posts={filteredArticles} />
        </>
      )}
    </div>
  );
};

export default AllPostsPage;

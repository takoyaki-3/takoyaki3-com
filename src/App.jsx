import React, { useState, useEffect } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import './App.css';
import logo from './assets/takoyaki3.png';
import githubIcon from './assets/github-mark.png';
import { Timeline } from 'react-twitter-widgets';
import { marked } from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';

// アイコンをインポート
import qiitaIcon from './assets/qiita-favicon.png';
import zennIcon from './assets/zenn-logo-only.svg';
import ownIcon from './assets/takoyaki3.png';

const content_storage = 'https://takoyaki-3.github.io/takoyaki3-com-data';

function App() {
  return (
    <>
      <header className="app-header">
        <a href="/">
          <img src={logo} className="header-logo" alt="App Logo" />
        </a>
        <a href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h2 style={{ color: 'white' }}>たこやきさんのつぶやき</h2>
        </a>
        <div className="github-link">
          <a
            href="https://github.com/takoyaki-3/takoyaki3-com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={githubIcon} alt="GitHub" className="github-icon" />
          </a>
        </div>
      </header>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/tag/:tag" element={<TagPage />} />
          <Route path="/allPosts" element={<AllPostsPage />} />
          <Route path="/tagList" element={<TagListPage />} />
          <Route path="/:pageID" element={<ContentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

// 日付のフォーマット関数
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// トップページコンポーネント
const TopPage = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const sns = [
    {
      text: 'GitHub',
      icon: '/assets/github-mark.png',
      href: 'https://github.com/takoyaki-3',
    },
    {
      text: 'Twitter',
      icon: '/assets/Twitter social icons - square - blue.png',
      href: 'https://twitter.com/takoyaki3333333',
    },
    {
      text: 'Qiita',
      icon: '/assets/qiita-favicon.png',
      href: 'https://qiita.com/takoyaki3',
    },
    {
      text: 'Zenn',
      icon: '/assets/zenn-logo-only.svg',
      href: 'https://zenn.dev/takoyaki3',
    },
    {
      text: 'Instagram',
      icon: '/assets/Instagram_Glyph_Gradient.svg',
      href: 'https://www.instagram.com/takoyaki3333333',
    },
    {
      text: 'Linkedin',
      icon: '/assets/LI-In-Bug.png',
      href: 'https://www.linkedin.com/in/takoyaki3',
    },
    {
      text: 'Mail',
      icon: '/assets/mail.png',
      href: 'mailto:mail@takoyaki3.com',
    },
  ];

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        // 自サイトの最新記事を取得
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

        setRecentPosts(allArticles.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div>
      <div className="centered-content">
        <img
          alt="たこやきさんのアイコン"
          src="/assets/takoyaki3.png"
          className="shrink mr-2"
        />
      </div>
      <div className="centered-content">
        {sns.map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="subheading mx-3"
          >
            <img src={s.icon} alt={s.text} width="30px" />
          </a>
        ))}
      </div>
      <div className="text-center">
        <p>
          こんにちは、世界！<br/>
          たこやきさんです。ITと交通が大好きです。
        </p>
      </div>

      <h2>Menu</h2>
      <div className="menu-grid">
        <a href="/tagList">
          <div className="card">
            <h3>タグ一覧</h3>
            <p>Xに呟くには長い技術記事や旅行記</p>
          </div>
        </a>
        <a href="/tag/作品一覧">
          <div className="card">
            <h3>作品一覧</h3>
            <p>チームや個人により開発している作品やこれまでの受賞作品などを紹介</p>
          </div>
        </a>
        <a href="/tag/論文">
          <div className="card">
            <h3>論文</h3>
            <p>大学の卒業論文や高校時代に応募した論文</p>
          </div>
        </a>
        <a href="/tag/コンテスト受賞">
          <div className="card">
            <h3>コンテスト受賞</h3>
            <p>コンテスト入賞作品の記録</p>
          </div>
        </a>
        <a href="/presentation-sheet">
          <div className="card">
            <h3>登壇資料</h3>
            <p>イベント等で登壇した際の資料</p>
          </div>
        </a>
      </div>

      <h2>Recent Posts</h2>
      <div className="recent-posts">
        {recentPosts.map((post) => (
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
        ))}
      </div>
      <div>
        <a href="/allPosts" className="more-link">もっと見る</a>
      </div>
      <div>
        <h2>X Timeline</h2>
        <Timeline
          dataSource={{
            sourceType: 'profile',
            screenName: 'takoyaki3333333',
          }}
        />
      </div>
    </div>
  );
};

// タグページコンポーネント
const TagPage = () => {
  const { tag } = useParams();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchTagPages = async () => {
      try {
        const tagResponse = await fetch(`${content_storage}/tags/${tag}.json`);
        const tagPages = await tagResponse.json();
        setPages(tagPages);
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
        {pages &&
          pages.map((page) => (
            <a key={`page-${page.id}`} href={`/${page.id}`}>
              <div className="card">
                <h3>{page.title}</h3>
                <p style={{ textAlign: 'right' }}>
                  作成日時：{formatDate(page.created)}
                  <br />
                  更新日時：{formatDate(page.updated)}
                </p>
              </div>
            </a>
          ))}
      </div>
    </div>
  );
};

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

// タグ一覧ページコンポーネント
const TagListPage = () => {
  const [tags, setTags] = useState({});

  useEffect(() => {
    const fetchTags = async () => {
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
      <h2>タグ一覧</h2>
      <div className="tag-list">
        {Object.keys(tags).map((tag) => (
          <a key={tag} href={`/tag/${tag}`}>#{tag}</a>
        ))}
      </div>
    </div>
  );
};

// コンテンツページコンポーネント
const ContentPage = () => {
  const { pageID } = useParams();
  const [page, setPage] = useState({ tags: [] });
  const [pageHTML, setPageHTML] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const pageDataResponse = await fetch(`${content_storage}/contents/${pageID}.json`);
        if (!pageDataResponse.ok) {
          console.error('Page not found');
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

// 404ページコンポーネント
const NotFoundPage = () => {
  return (
    <div>
      <h2>ページが見つかりませんでした。</h2>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { Timeline } from 'react-twitter-widgets';
import './App.css';
import logo from './assets/takoyaki3.png';
import { marked } from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import githubIcon from './assets/github-mark.png';

// アイコンをインポート
import qiitaIcon from './assets/qiita-favicon.png';
import zennIcon from './assets/zenn-logo-only.svg';
import ownIcon from './assets/takoyaki3.png';

const content_storage = 'https://takoyaki-3.github.io/takoyaki3-com-data';

function App() {
  const [pageID, setPageID] = useState(null);
  const [tag, setTag] = useState(null);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState({ tags: [] });
  const [pageHTML, setPageHTML] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [tags, setTags] = useState({});
  const [allArticles, setAllArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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
      text: 'Mail',
      icon: '/assets/mail.png',
      href: 'mailto:mail@takoyaki3.com',
    },
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageID = urlParams.get('pageID') || 'top';
    const type = urlParams.get('type');
    const tag = urlParams.get('tag');
    setPageID(pageID);
    setTag(tag);
    fetchContent(pageID, type, tag);
  }, []);

  useEffect(() => {
    // ページのHTMLが更新されたらテーブルをラップする
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // 日付が不正な場合はそのまま返す
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isSpecialPage = (pageID) => {
    return !pageID || pageID === 'top' || pageID === 'tagList' || pageID === 'tag' || pageID === 'allPosts';
  };

  const fetchContent = async (pageID, type, tag) => {
    try {
      // 自サイトの最新記事を取得
      const recentUpdatedResponse = await fetch(`${content_storage}/recent_updated.json`);
      const recentPostsData = await recentUpdatedResponse.json();
      const ownArticles = recentPostsData.map((post) => ({
        ...post,
        url: `/?pageID=${post.id}&type=${post.type}`,
        type: 'own',
        source: 'たこやきさんのつぶやき',
      }));

      // Qiitaの記事を取得
      const fetchQiitaArticles = async () => {
        try {
          const qiitaResponse = await fetch('https://takoyaki-3.github.io/takoyaki3-com-data/qiita/qiita_data.json');
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

      // Zennの記事を取得（RSSフィードをパース）
      const fetchZennArticles = async () => {
        try {
          const zennResponse = await fetch('https://takoyaki-3.github.io/takoyaki3-com-data/zenn/zenn_feed.xml');
          const zennFeedText = await zennResponse.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(zennFeedText, 'text/xml');
          const items = xmlDoc.querySelectorAll('item');
          const articles = [];
          items.forEach((item) => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const pubDate = item.querySelector('pubDate').textContent;
            const description = item.querySelector('description').textContent;
            const isoDate = new Date(pubDate).toISOString();
            articles.push({
              id: link,
              title: title,
              url: link,
              created: isoDate,
              updated: isoDate,
              tags: [], // タグ情報はRSSから取得できないため空配列
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

      // 最新の記事を設定（全記事から取得）
      setRecentPosts(allArticles.slice(0, 3));
      setAllArticles(allArticles);

      let pageData = { tags: [] };
      if (!isSpecialPage(pageID)) {
        const pageDataResponse = await fetch(`${content_storage}/contents/${pageID}.json`);
        pageData = await pageDataResponse.json();
      }

      setPage(pageData);

      const tagsResponse = await fetch(`${content_storage}/tag_list.json`);
      const tagsData = await tagsResponse.json();
      setTags(tagsData);

      if (tag) {
        const tagResponse = await fetch(`${content_storage}/tags/${tag}.json`);
        const tagPages = await tagResponse.json();
        setPages(tagPages);
      }

      if (type && pageID && pageData) {
        let content = '';
        if (type === 'md') {
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
        } else if (type === 'html') {
          const contentResponse = await fetch(`${content_storage}/contents/${pageID}.html`);
          content = await contentResponse.text();
        }
        setPageHTML(content);
      }

      // 全記事ページの場合、全ての記事を設定
      if (pageID === 'allPosts') {
        setPages(allArticles);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  // 検索結果をフィルタリング
  const filteredPages = pages.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        {pageID === 'top' && (
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
                たこやきさんの個人Webサイト「たこやきさんのつぶやき」へようこそ。
                <br />
                このサイトでは、以下のコンテンツを取り揃えております。
              </p>
            </div>

            <h2>Menu</h2>
            <div className="menu-grid">
              <a href="/?pageID=tagList">
                <div className="card">
                  <h3>タグ一覧</h3>
                  <p>Twitterに呟くには長い技術記事や旅行記などを投稿しています</p>
                </div>
              </a>
              <a href="/?pageID=tag&tag=作品一覧">
                <div className="card">
                  <h3>作品一覧</h3>
                  <p>チームや個人により開発している作品やこれまでの受賞作品などを紹介</p>
                </div>
              </a>
              <a href="/?pageID=tag&tag=論文">
                <div className="card">
                  <h3>論文</h3>
                  <p>大学の卒業論文やら高校時代に応募した論文やらのアーカイブ</p>
                </div>
              </a>
              <a href="/?pageID=tag&tag=コンテスト受賞">
                <div className="card">
                  <h3>コンテスト受賞</h3>
                  <p>コンテスト入賞作のアーカイブ</p>
                </div>
              </a>
              <a href="/?pageID=presentation-sheet&type=md">
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
              <a href="/?pageID=allPosts" className="more-link">もっと見る</a>
            </div>
            <div>
              <h2>Twitter Timeline</h2>
              <Timeline
                dataSource={{
                  sourceType: 'profile',
                  screenName: 'takoyaki3333333',
                }}
              />
            </div>
          </div>
        )}

        {!isSpecialPage(pageID) && page && (
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
                  <a key={tag} href={`/?pageID=tag&tag=${tag}`}>#{tag} </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {pageID === 'tag' && (
          <div className="tag">
            <h2>タグ：<a>#{tag}</a></h2>
            <div className="tag-grid">
              {pages &&
                pages.map((page) => (
                  <a key={`page-${page.id}`} href={`/?pageID=${page.id}&type=${page.type}`}>
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
        )}

        {pageID === 'tagList' && (
          <div>
            <h2>タグ一覧</h2>
            <div className="tag-list">
              {Object.keys(tags).map((tag) => (
                <a key={tag} href={`/?pageID=tag&tag=${tag}`}>#{tag}</a>
              ))}
            </div>
          </div>
        )}

        {pageID === 'allPosts' && (
          <div>
            <h2>All Posts</h2>
            {/* 検索バーを追加 */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="記事を検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="all-posts-grid">
              {filteredPages.length > 0 ? (
                filteredPages.map((post) => (
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
        )}
      </div>
    </>
  );
}

export default App;

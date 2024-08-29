import React, { useState, useEffect } from 'react';
import { Timeline } from 'react-twitter-widgets';
import './App.css';
import logo from './assets/takoyaki3.png';
import { marked } from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';
import githubIcon from './assets/github-mark.png';

function App() {
  const [count, setCount] = useState(0);
  const [pageID, setPageID] = useState(null);
  const [type, setType] = useState(null);
  const [tag, setTag] = useState(null);
  const [pages, setPages] = useState({});
  const [page, setPage] = useState(null);
  const [pageHTML, setPageHTML] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [tags, setTags] = useState({});
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
      text: 'Mail',
      icon: '/assets/mail.png',
      href: 'mailto:mail@takoyaki3.com',
    },
  ];

  useEffect(() => {
    document.title = 'たこやきさんのつぶやき';
    const urlParams = new URLSearchParams(window.location.search);
    const pageID = urlParams.get('pageID') || 'top';
    const type = urlParams.get('type');
    const tag = urlParams.get('tag');
    setPageID(pageID);
    setType(type);
    setTag(tag);
    fetchContent(pageID, type, tag);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchContent = async (pageID, type, tag) => {
    try {
      const idListResponse = await fetch('/data/recent_updated.json');
      const ids = await idListResponse.json();
      const pagesData = {};
      const recentPostsData = [];

      // Set to track unique IDs
      const uniqueIds = new Set();

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i].id;
        if (!uniqueIds.has(id)) {
          const postResponse = await fetch(`/data/contents/${id}.json`);
          const postJSON = await postResponse.json();
          postJSON.created = formatDate(postJSON.created);
          postJSON.updated = formatDate(postJSON.updated);
          pagesData[postJSON.id] = postJSON;
          uniqueIds.add(id);
          if (recentPostsData.length < 3) {
            recentPostsData.push(postJSON);
          }
        }
      }

      setPages(pagesData);
      setRecentPosts(recentPostsData);

      const tagsResponse = await fetch('/data/tag_list.json');
      const tagsData = await tagsResponse.json();
      setTags(tagsData);

      if (tag) {
        const tagResponse = await fetch(`/data/tags/${tag}.json`);
        const tagIds = await tagResponse.json();
        const pageList = tagIds
          .map((e) => e.id)
          .filter((id) => pagesData[id]); // Filter out any IDs that do not exist in pagesData

        setPages((prevPages) => ({
          ...prevPages,
          pageList,
        }));
      }

      if (type && pageID && pagesData[pageID]) {
        setPage(pagesData[pageID]);
        // Fetch content based on file type (md or html)
        let content = '';
        if (type === 'md') {
          const contentResponse = await fetch(`/data/contents/${pageID}.md`);
          content = await contentResponse.text();
          content = marked(content, {
            highlight: (code, lang) => {
              return (
                '<code class="hljs">' + highlight.highlightAuto(code, [lang]).value + '</code>'
              );
            },
          });
        } else if (type === 'html') {
          const contentResponse = await fetch(`/data/contents/${pageID}.html`);
          content = await contentResponse.text();
        }
        setPageHTML(content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  return (
    <>
      <header className="app-header">
        <a href="/?pageID=top">
          <img src={logo} className="header-logo" alt="App Logo" />
        </a>
        <a href="/?pageID=top" style={{ textDecoration: 'none', color: 'white' }}>
          <h2 style={{ color: 'white' }}>たこやきさんのつぶやき</h2>
        </a>
        <div className="github-link">
          <a href="https://github.com/takoyaki-3/takoyaki3-com" target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="GitHub" className="github-icon" />
          </a>
        </div>
      </header>
      <div className="app-content">
        {pageID === 'top' && (
          <div>
            <div className="centered-content">
              <img
                alt="Vuetify Logo"
                src="/assets/takoyaki3.png"
                className="shrink mr-2"
              />
            </div>
            <div className="centered-content">
              {sns.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="subheading mx-3">
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
                <a key={post.id} href={`/?pageID=${post.id}&type=md`}>
                  <div className="card">
                    <h3>{post.title}</h3>
                    <p style={{ textAlign: 'right' }}>
                      作成日時：{post.created}
                      <br />
                      更新日時：{post.updated}
                    </p>
                  </div>
                </a>
              ))}
            </div>
            <div>
              <h2>Twitter Timeline</h2>
              <Timeline
                dataSource={{
                  sourceType: 'profile',
                  screenName: 'takoyaki3333333'
                }}
              />
            </div>
          </div>
        )}

        {pageID !== 'top' && page && (
          <div>
            <div className="article-card">  
              <div className="text-right">
                <p>
                  作成日時：{page.created}
                  <br />
                  更新日時：{page.updated}
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
              {pages.pageList && pages.pageList.map((id) => (
                <a key={id} href={`/?pageID=${id}&type=${pages[id].type}`}>
                  <div className="card">
                    <h3>{pages[id].title}</h3>
                    <p style={{ textAlign: 'right' }}>
                      作成日時：{pages[id].created}
                      <br />
                      更新日時：{pages[id].updated}
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
      </div>
    </>
  );
}

export default App;

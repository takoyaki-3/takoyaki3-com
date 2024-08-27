import React, { useState, useEffect } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed'; 
import './App.css';
import logo from './assets/takoyaki3.png';
import { marked } from 'marked';
import highlight from 'highlight.js';
import 'highlight.js/styles/github.css';

function App() {
  const [count, setCount] = useState(0);
  const [pageID, setPageID] = useState(null);
  const [type, setType] = useState(null);
  const [tag, setTag] = useState(null);
  const [pages, setPages] = useState({});
  const [page, setPage] = useState(null);
  const [pageHTML, setPageHTML] = useState('');
  const [recentPosts, setRecentPosts] = useState([]);
  const [tags, setTags] = useState([]);
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
      const idListResponse = await fetch(
        'https://key-value-array-store.api.takoyaki3.com/?key=takoyaki3-com-key'
      );
      const ids = await idListResponse.json();
      const pagesData = {};
      const recentPostsData = [];

      for (let i = 0; i < ids.length; i++) {
        const id = ids[i].data;
        const postResponse = await fetch(
          `https://key-value-array-store.api.takoyaki3.com/?key=takoyaki3-com-article-${id}`
        );
        const postData = await postResponse.json();
        const postJSON = JSON.parse(postData[0].data);
        postJSON.created = formatDate(postJSON.created); // 日付をフォーマット
        postJSON.updated = formatDate(postJSON.updated); // 日付をフォーマット
        pagesData[postJSON.id] = postJSON;
        if (i < 3) {
          recentPostsData.push(postJSON);
        }
      }

      setPages(pagesData);
      setRecentPosts(recentPostsData);

      const tagsResponse = await fetch(
        'https://key-value-array-store.api.takoyaki3.com/?key=takoyaki3-com-tags'
      );
      const tagsData = await tagsResponse.json();
      setTags(tagsData);

      if (tag) {
        const tagResponse = await fetch(
          `https://key-value-array-store.api.takoyaki3.com/?key=takoyaki3-com-tag-${tag}`
        );
        const tagIds = await tagResponse.json();
        const pageList = tagIds.map((e) => e.data);
        setPages((prevPages) => ({
          ...prevPages,
          pageList,
        }));
      }

      if (type && pageID && pagesData[pageID]) {
        setPage(pagesData[pageID]);
        let content = pagesData[pageID].file;
        if (type === 'md') {
          content = marked(content, {
            highlight: (code, lang) => {
              return (
                '<code class="hljs">' + highlight.highlightAuto(code, [lang]).value + '</code>'
              );
            },
          });
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
        <img src={logo} className="header-logo" alt="App Logo" />
        <h2>たこやきさんのつぶやき</h2>
      </header>
      <div className="app-content">
        {pageID === 'top' && (
          <div>
            <div className="centered-content">
              <img
                alt="Vuetify Logo"
                src="https://qiita-image-store.s3.amazonaws.com/0/224979/profile-images/1514873692"
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

            <h2>Twitter</h2>
            <div className="twitter-embed">
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName="takoyaki3333333"
                options={{ tweetLimit: '10' }}
              />
            </div>
          </div>
        )}

        {pageID !== 'top' && page && (
          <div>
            <div className="text-right">
              <p>
                作成日時：{page.created}
                <br />
                更新日時：{page.updated}
              </p>
            </div>
            <div className="card">
              <div dangerouslySetInnerHTML={{ __html: pageHTML }} />
            </div>
            <div className="tags">
              {page.tags.map((tag) => (
                <a key={tag} href={`/?pageID=tag&tag=${tag}`}>#{tag} </a>
              ))}
            </div>
          </div>
        )}

        {pageID === 'tag' && (
          <div>
            <h2>タグ：<a>#{tag}</a></h2>
            <div className="tag-grid">
              {pages.pageList && pages.pageList.map((id) => (
                <a key={id} href={`/?pageID=${pages[id].id}&type=${pages[id].type}`}>
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
            <div>
              {tags.map((tag) => (
                <a key={tag.data} href={`/?pageID=tag&tag=${tag.data}`}>#{tag.data} </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

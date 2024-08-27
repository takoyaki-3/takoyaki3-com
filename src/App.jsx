import React, { useState, useEffect } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed'; // パッケージをインポート
import './App.css';
import logo from './assets/takoyaki3.png';

function App() {
  const [count, setCount] = useState(0);
  const [pageID, setPageID] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [sns, setSns] = useState([
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
  ]);

  useEffect(() => {
    document.title = 'たこやきさんのつぶやき';
    const urlParams = new URLSearchParams(window.location.search);
    setPageID(urlParams.get('pageID') || 'top');
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    // Fetch recent posts data and set to state (assuming an API or data source)
    const posts = [
      {
        id: '1',
        title: 'Recent Post 1',
        created: '2023-08-01',
        updated: '2023-08-15',
      },
      {
        id: '2',
        title: 'Recent Post 2',
        created: '2023-07-20',
        updated: '2023-08-10',
      },
      {
        id: '3',
        title: 'Recent Post 3',
        created: '2023-07-05',
        updated: '2023-08-05',
      },
    ];
    setRecentPosts(posts);
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
      </div>
    </>
  );
}

export default App;

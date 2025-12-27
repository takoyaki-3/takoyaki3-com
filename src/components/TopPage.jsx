import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timeline } from 'react-twitter-widgets';
import ownIcon from '../assets/takoyaki3.svg';
import '../styles/TopPage.css';
import Card from './Card';
import { style } from '../styles/styles';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

const TopPage = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const sns = [
    {
      text: 'GitHub',
      icon: '/assets/github-mark.svg',
      href: 'https://github.com/takoyaki-3',
    },
    {
      text: 'Twitter',
      icon: '/assets/X_logo_2023.svg',
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
      icon: '/assets/linkedin-icon.svg',
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
            if (!qiitaResponse.ok) {
              throw new Error('Failed to fetch Qiita articles');
            }
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
            const zennResponse = await fetch(`${content_storage}/zenn/zenn_feed.xml`);
            if (!zennResponse.ok) {
              throw new Error('Failed to fetch Zenn articles');
            }
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
          src={ownIcon}
          className="shrink mr-2"
          style={{ width: '80px', height: '80px' }}
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
          こんにちは、世界！
          <br />
          たこやきさんです。ITと交通が大好きです。
        </p>
        <Link to="/profile" className="profile-banner">
          <div className="profile-banner-content">
            <span className="profile-banner-title">プロフィールを見る</span>
            <span className="profile-banner-arrow">→</span>
          </div>
        </Link>
      </div>

      <h2>Menu</h2>
      <div className="menu-grid">
        {[
          { to: '/tagList', title: 'タグ一覧', description: 'Xに呟くには長い技術記事や旅行記' },
          { to: '/allPosts', title: '記事一覧', description: 'ZennやQiitaを含むたこやきさんの投稿一覧' },
          {
            to: '/tag/作品一覧',
            title: '作品一覧',
            description: 'チームや個人により開発している作品やこれまでの受賞作品などを紹介',
          },
          { to: '/tag/論文', title: '論文', description: '大学の卒業論文や高校時代に応募した論文' },
          { to: '/tag/登壇資料', title: '登壇資料', description: 'イベント等で登壇した際の資料' },
        ].map((menu, index) => (
          <Link key={index} to={menu.to}>
            <div className="card">
              <h3>{menu.title}</h3>
              <p>{menu.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2>Recent Posts</h2>
      <div className="recent-posts">
        {recentPosts.map((post) => (
          <Card key={post.id} post={post} type={'minimum'} />
        ))}
      </div>
      <div>
        <Link to="/allPosts" style={style.more_link}>
          もっと見る
        </Link>
      </div>
      <div>
        <h2>X Timeline</h2>
        <Timeline dataSource={{ sourceType: 'profile', screenName: 'takoyaki3333333' }} />
      </div>
    </div>
  );
};

export default TopPage;
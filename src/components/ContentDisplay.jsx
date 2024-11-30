import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import '../styles/ContentPage.css';
import { style } from '../styles/styles';

const ContentDisplay = ({ page, pageHTML }) => (
  <div style={style.articleCard}>
    {/* 記事のメタ情報 */}
    <div className="article-meta">
      <p>作成日時：{formatDate(page.created)}</p>
      <p>更新日時：{formatDate(page.updated)}</p>
    </div>
    {/* HTML埋め込みをレスポンシブ対応 */}
    <div
      dangerouslySetInnerHTML={{
        __html: pageHTML.replace(
          /<iframe .*?<\/iframe>/g,
          (iframe) =>
            `<div class="youtube-wrapper">${iframe}</div>`
        ),
      }}
    />

    {/* タグ */}
    <div style={style.tags}>
      {page.tags.map((tag) => (
        <Link key={tag} to={`/tag/${tag}`} style={style.tag} className="tag">
          #{tag}{' '}
        </Link>
      ))}
    </div>
  </div>
);

export default ContentDisplay;

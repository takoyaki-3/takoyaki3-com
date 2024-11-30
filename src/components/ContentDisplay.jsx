import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import '../styles/ContentPage.css';
import { style } from '../styles/styles';

const ContentDisplay = ({ page, pageHTML }) => (
  <div style={style.articleCard}>
    <div style={style.textRight}>
      <p>
        作成日時：{formatDate(page.created)}
        <br />
        更新日時：{formatDate(page.updated)}
      </p>
    </div>
    <div dangerouslySetInnerHTML={{ __html: pageHTML }} />
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

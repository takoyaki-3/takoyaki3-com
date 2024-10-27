import React from 'react';
import { formatDate } from '../utils/dateUtils';
import "../styles/ContentPage.css";
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
        <a
          key={tag}
          href={`/tag/${tag}`}
          style={style.tag}
          className='tag'
        >
          #{tag}{' '}
        </a>
      ))}
    </div>
  </div>
);

export default ContentDisplay;

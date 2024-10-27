import React from 'react';
import { formatDate } from '../utils/dateUtils';
import "../styles/ContentPage.css";

const styles = {
  articleCard: {
    padding: '20px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    textAlign: 'left',
    maxWidth: 'max-content',
  },
  textRight: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '0.9rem',
    color: '#555',
  },
  tags: {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #ddd',
  },
  tagLink: {
    color: '#0056b3',
    marginRight: '5px',
    textDecoration: 'none',
  },
};

const ContentDisplay = ({ page, pageHTML }) => (
  <div style={styles.articleCard}>
    <div style={styles.textRight}>
      <p>
        作成日時：{formatDate(page.created)}
        <br />
        更新日時：{formatDate(page.updated)}
      </p>
    </div>
    <div dangerouslySetInnerHTML={{ __html: pageHTML }} />
    <div style={styles.tags}>
      {page.tags.map((tag) => (
        <a
          key={tag}
          href={`/tag/${tag}`}
          style={styles.tagLink}
          className='tag'
        >
          #{tag}{' '}
        </a>
      ))}
    </div>
  </div>
);

export default ContentDisplay;

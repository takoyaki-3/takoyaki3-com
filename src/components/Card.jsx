import React, { useState } from 'react';
import qiitaIcon from '../assets/qiita-favicon.png';
import zennIcon from '../assets/zenn-logo-only.svg';
import ownIcon from '../assets/takoyaki3.svg';
import { formatDate } from '../utils/dateUtils';

const cardBaseStyles = {
  padding: '20px',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '10px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  textAlign: 'left',
};

const cardHoverStyles = {
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
};

const iconContainerStyles = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
};

const siteIconStyles = {
  width: '24px',
  height: '24px',
};

const h3Styles = {
  marginBottom: '15px',
  transition: 'text-decoration 0.3s ease',
};

const h3HoverStyles = {
  textDecoration: 'underline',
};

const pStyles = {
  fontSize: '0.9rem',
  color: '#555',
  textAlign: 'right',
};

// カードコンポーネント
const Card = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      key={post.id}
      href={post.url}
      target={post.type !== 'own' ? '_blank' : '_self'}
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="card"
        style={{ ...cardBaseStyles, ...(isHovered ? cardHoverStyles : {}) }}
      >
        <div className="icon-container" style={iconContainerStyles}>
          {post.type === 'qiita' && <img src={qiitaIcon} alt="Qiita" style={siteIconStyles} />}
          {post.type === 'zenn' && <img src={zennIcon} alt="Zenn" style={siteIconStyles} />}
          {post.type === 'own' && <img src={ownIcon} alt="たこやきさんのつぶやき" style={siteIconStyles} />}
        </div>
        <h3 style={{ ...h3Styles, ...(isHovered ? h3HoverStyles : {}) }}>{post.title}</h3>
        <p style={pStyles}>
          作成日時：{formatDate(post.created)}
          <br />
          更新日時：{formatDate(post.updated)}
        </p>
      </div>
    </a>
  );
};

export default Card;

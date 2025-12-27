import { useState } from 'react';
import { Link } from 'react-router-dom';
import qiitaIcon from '../assets/qiita-favicon.png';
import zennIcon from '../assets/zenn-logo-only.svg';
import ownIcon from '../assets/takoyaki3.svg';
import { formatDate } from '../utils/dateUtils';

const cardMinimumStyles = {
  padding: '20px',
  background: 'white',
  border: '1px solid #eee',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  textAlign: 'left',
  cursor: 'pointer',
  overflow: 'hidden',
};

const cardBaseStyles = {
  ...cardMinimumStyles,
  minHeight: '200px',
};

const cardHoverStyles = {
  transform: 'translateY(-4px) scale(1.02)',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  borderColor: '#10b981',
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
  transition: 'color 0.3s ease',
  fontSize: '1.25rem',
  fontWeight: '600',
  lineHeight: '1.4',
};

const h3HoverStyles = {
  color: '#10b981',
};

const pStyles = {
  fontSize: '0.9rem',
  color: '#555',
  textAlign: 'right',
};

const Card = ({ post, type }) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyles = type === 'minimum' ? cardMinimumStyles : cardBaseStyles;

  const isInternalLink = post.type === 'own';

  const cardContent = (
    <div
      className="card"
      style={{ ...cardStyles, ...(isHovered ? cardHoverStyles : {}) }}
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
  );

  return isInternalLink ? (
    <Link
      key={post.id}
      to={post.url}
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cardContent}
    </Link>
  ) : (
    <a
      key={post.id}
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', color: 'inherit' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {cardContent}
    </a>
  );
};

export default Card;
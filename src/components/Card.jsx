import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import qiitaIcon from '../assets/qiita-favicon.png';
import zennIcon from '../assets/zenn-logo-only.svg';
import ownIcon from '../assets/takoyaki3.svg';
import { formatDate } from '../utils/dateUtils';

const cardMinimumStyles = {
  padding: '20px',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid #ddd',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  textAlign: 'left',
  transform: 'translateY(0) scale(1)',
  cursor: 'pointer',
};

const cardBaseStyles = {
  ...cardMinimumStyles,
  minHeight: '200px',
};

const cardHoverStyles = {
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
  transform: 'translateY(-8px) scale(1.02)',
  borderColor: '#bbb',
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f2f5 100%)',
};

const iconContainerStyles = {
  position: 'absolute',
  bottom: '10px',
  left: '10px',
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

const iconContainerHoverStyles = {
  transform: 'scale(1.15) rotate(5deg)',
};

const siteIconStyles = {
  width: '24px',
  height: '24px',
};

const h3Styles = {
  marginBottom: '15px',
  transition: 'color 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: '#333',
};

const h3HoverStyles = {
  color: '#0066cc',
  transform: 'translateX(4px)',
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
      <div 
        className="icon-container" 
        style={{ 
          ...iconContainerStyles, 
          ...(isHovered ? iconContainerHoverStyles : {}) 
        }}
      >
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

Card.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    created: PropTypes.string.isRequired,
    updated: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['own', 'qiita', 'zenn']).isRequired,
  }).isRequired,
  type: PropTypes.oneOf(['minimum', 'base']),
};

export default Card;
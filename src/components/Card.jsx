import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  textAlign: 'left',
  overflow: 'hidden',
  height: '100%',
};

const cardBaseStyles = {
  ...cardMinimumStyles,
  minHeight: '200px',
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
  fontSize: '1.25rem',
  fontWeight: 'bold',
  lineHeight: '1.4',
  color: '#333',
};

const pStyles = {
  fontSize: '0.9rem',
  color: '#555',
  textAlign: 'right',
};

const Card = ({ post, type }) => {
  const cardStyles = type === 'minimum' ? cardMinimumStyles : cardBaseStyles;
  const isInternalLink = post.type === 'own';

  const cardContent = (
    <motion.div
      className="card"
      style={cardStyles}
      whileHover={{
        y: -8,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderColor: '#3b82f6',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      <div className="icon-container" style={iconContainerStyles}>
        {post.type === 'qiita' && <img src={qiitaIcon} alt="Qiita" style={siteIconStyles} />}
        {post.type === 'zenn' && <img src={zennIcon} alt="Zenn" style={siteIconStyles} />}
        {post.type === 'own' && <img src={ownIcon} alt="たこやきさんのつぶやき" style={siteIconStyles} />}
      </div>
      <motion.h3
        style={h3Styles}
        whileHover={{ color: '#3b82f6' }}
      >
        {post.title}
      </motion.h3>
      <p style={pStyles}>
        作成日時：{formatDate(post.created)}
        <br />
        更新日時：{formatDate(post.updated)}
      </p>
      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '4px',
          background: '#3b82f6',
        }}
      />
    </motion.div>
  );

  return isInternalLink ? (
    <Link
      key={post.id}
      to={post.url}
      style={{ textDecoration: 'none', color: 'inherit' }}
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
    >
      {cardContent}
    </a>
  );
};

Card.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    created: PropTypes.string,
    updated: PropTypes.string,
  }).isRequired,
  type: PropTypes.string,
};

export default Card;
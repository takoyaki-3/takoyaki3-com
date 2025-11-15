import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TagListPage.css';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

const TagListPage = () => {
  const [tags, setTags] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsResponse = await fetch(`${content_storage}/tag_list.json`);
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // タグを投稿数でソート
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return (
      <div className="tag-list-container">
        <h2 className="tag-list-heading">タグ一覧</h2>
        <p className="tag-list-loading">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="tag-list-container">
      <h2 className="tag-list-heading">タグ一覧</h2>
      <p className="tag-list-description">
        興味のあるトピックからコンテンツを探してみましょう
      </p>
      <div className="tag-grid">
        {sortedTags.map(([tag, count]) => (
          <Link key={tag} to={`/tag/${tag}`} className="tag-card-link">
            <div className="tag-card">
              <div className="tag-card-content">
                <span className="tag-icon">#</span>
                <h3 className="tag-name">{tag}</h3>
              </div>
              <div className="tag-count">
                <span className="count-number">{count}</span>
                <span className="count-label">posts</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {sortedTags.length === 0 && (
        <p className="no-tags-message">タグがまだありません</p>
      )}
    </div>
  );
};

export default TagListPage;
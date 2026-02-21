import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { style } from '../styles/styles';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

const TagListPage = () => {
  const [tags, setTags] = useState({});

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsResponse = await fetch(`${content_storage}/tag_list.json`);
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div>
      <h2 style={style.heading}>タグ一覧</h2>
      <table style={style.tagTable}>
        <thead>
          <tr>
            <th style={style.tagTableHeader}>タグ名</th>
            <th style={style.tagTableHeader}>記事</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(tags).map(([tag, posts]) => (
            <tr key={tag} style={style.tagTableRow}>
              <td style={style.tagTableCell}>
                <Link style={style.tag} to={`/tag/${tag}`}>
                  #{tag}
                </Link>
              </td>
              <td style={style.tagTableCell}>
                {Array.isArray(posts) ? posts.join(', ') : posts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TagListPage;
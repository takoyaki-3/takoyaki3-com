import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { style } from '../styles/styles';

const content_storage = import.meta.env.VITE_CONTENT_STORAGE;

const TagListPage = () => {
  const [tags, setTags] = useState({});
  const [categories, setCategories] = useState({});

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsResponse = await fetch(`${content_storage}/tag_list.json`);
        const tagsData = await tagsResponse.json();
        setTags(tagsData);

        // カテゴリ分けのロジック
        const categorized = {};
        Object.entries(tagsData).forEach(([tag, posts]) => {
          let category = 'その他';
          if (tag.match(/^(React|Vue|Next\.js|Vite|JavaScript|TypeScript|HTML|CSS)$/i)) {
            category = 'フロントエンド';
          } else if (tag.match(/^(Node\.js|Python|Go|Ruby|PHP|Java|SQL|Database|Docker|AWS|Cloudflare)$/i)) {
            category = 'バックエンド・インフラ';
          } else if (tag.match(/^(AI|LLM|OpenAI|Claude|Gemini|Machine Learning)$/i)) {
            category = 'AI・機械学習';
          }
          
          if (!categorized[category]) {
            categorized[category] = [];
          }
          categorized[category].push([tag, posts]);
        });
        setCategories(categorized);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  return (
    <div>
      <h2 style={style.heading}>タグ一覧</h2>
      {Object.entries(categories).map(([category, tagEntries]) => (
        <div key={category} style={{ marginBottom: '40px' }}>
          <h3 style={{ ...style.heading, textAlign: 'left', maxWidth: '800px', margin: '20px auto' }}>{category}</h3>
          <table style={style.tagTable}>
            <thead>
              <tr>
                <th style={style.tagTableHeader}>タグ名</th>
                <th style={style.tagTableHeader}>記事</th>
              </tr>
            </thead>
            <tbody>
              {tagEntries.map(([tag, posts]) => (
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
      ))}
    </div>
  );
};

export default TagListPage;
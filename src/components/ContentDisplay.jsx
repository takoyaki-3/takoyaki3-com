import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import '../styles/ContentPage.css';
import { style } from '../styles/styles';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

const ContentDisplay = ({ page, pageHTML }) => {
  useEffect(() => {
    // 画像の最適化処理
    const optimizeImages = () => {
      const images = document.querySelectorAll('.article-card img');
      images.forEach(img => {
        // 画像の読み込み完了後に処理
        if (img.complete) {
          handleImageLoad(img);
        } else {
          img.onload = () => handleImageLoad(img);
        }

        // 画像のスタイルを直接設定して横スクロールを防止
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.boxSizing = 'border-box';

        // 画像のwidthとheight属性を削除（CSSで制御するため）
        img.removeAttribute('width');
        img.removeAttribute('height');
      });
    };

    // 画像の最適化処理関数
    const handleImageLoad = (img) => {
      // 画像が大きすぎる場合はクラスを追加
      if (img.naturalWidth > 800) {
        img.classList.add('large-image');
      }
    };

    // インライン要素の最適化
    const optimizeInlineElements = () => {
      // pre, code, blockquoteなどの要素を最適化
      const inlineElements = document.querySelectorAll('.content-html pre, .content-html code, .content-html blockquote');
      inlineElements.forEach(element => {
        element.style.maxWidth = '100%';
        element.style.whiteSpace = 'pre-wrap';
        element.style.wordWrap = 'break-word';
        element.style.overflowX = 'hidden';
        element.style.boxSizing = 'border-box';
      });
    };

    const addLanguageClasses = () => {
      const codeBlocks = document.querySelectorAll('.content-html pre > code');
      codeBlocks.forEach(codeBlock => {
        const language = codeBlock.className.match(/language-(\w+)/)?.[1] || 'javascript';
        codeBlock.classList.add(`language-${language}`);
      });
      Prism.highlightAll();
    };

    optimizeImages();
    optimizeInlineElements();
    addLanguageClasses();
  }, [pageHTML]);

  // HTML内の画像タグを処理して最適化
  const processHTML = (html) => {
    // iframeをラップ
    let processed = html.replace(
      /<iframe .*?<\/iframe>/g,
      (iframe) => `<div class="youtube-wrapper">${iframe}</div>`
    );

    // 画像タグにクラスを追加
    processed = processed.replace(
      /<img(.*?)>/g,
      (match, attributes) => {
        // width属性が大きい場合はlarge-imageクラスを追加
        const widthMatch = attributes.match(/width=["'](\d+)["']/);
        const hasLargeWidth = widthMatch && parseInt(widthMatch[1], 10) > 800;

        if (hasLargeWidth) {
          return `<img${attributes} class="large-image">`;
        }
        return match;
      }
    );

    return processed;
  };

  return (
    <div style={style.articleCard}>
      {/* 記事のメタ情報 */}
      <div className="article-meta">
        <p>作成日時：{formatDate(page.created)}</p>
        <p>更新日時：{formatDate(page.updated)}</p>
      </div>
      {/* HTML埋め込みをレスポンシブ対応 */}
      <div
        className="content-html"
        dangerouslySetInnerHTML={{
          __html: processHTML(pageHTML),
        }}
      />

      {/* タグ */}
      <div style={style.tags}>
        {page.tags.map((tag) => (
          <Link key={tag} to={`/tag/${tag}`} style={style.tag} className="tag">
            #{tag}{' '}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ContentDisplay;

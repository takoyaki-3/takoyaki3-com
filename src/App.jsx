import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';
import TopPage from './components/TopPage';
import TagPage from './components/TagPage';
import AllPostsPage from './components/AllPostsPage';
import TagListPage from './components/TagListPage';
import ContentPage from './components/ContentPage';
import NotFoundPage from './components/NotFoundPage';
import logo from './assets/takoyaki3.png';
import githubIcon from './assets/github-mark.png';

const content_storage = 'https://takoyaki-3.github.io/takoyaki3-com-data';

function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const pageID = searchParams.get('pageID');
    const tag = searchParams.get('tag');

    if (pageID) {
      if (pageID === 'top') {
        navigate('/');
      } else if (pageID === 'tagList') {
        navigate('/tagList');
      } else if (pageID === 'allPosts') {
        navigate('/allPosts');
      } else if (pageID === 'tag' && tag) {
        navigate(`/tag/${tag}`);
      } else {
        navigate(`/${pageID}`);
      }
    }
  }, [navigate, searchParams]);

  return (
    <>
      <header className="app-header">
        <a href="/">
          <img src={logo} className="header-logo" alt="App Logo" />
        </a>
        <a href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h2 style={{ color: 'white' }}>たこやきさんのつぶやき</h2>
        </a>
        <div className="github-link">
          <a
            href="https://github.com/takoyaki-3/takoyaki3-com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={githubIcon} alt="GitHub" className="github-icon" />
          </a>
        </div>
      </header>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/tag/:tag" element={<TagPage />} />
          <Route path="/allPosts" element={<AllPostsPage />} />
          <Route path="/tagList" element={<TagListPage />} />
          <Route path="/:pageID" element={<ContentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

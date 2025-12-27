const searchBarStyles = {
  marginBottom: '20px',
  textAlign: 'center',
};

const inputStyles = {
  width: '80%',
  maxWidth: '500px',
  padding: '10px',
  fontSize: '1rem',
  border: '1px solid #888',
  borderRadius: '5px',
  backgroundColor: '#fff',
  color: '#333',
};

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={searchBarStyles}>
      <input
        type="text"
        placeholder="記事を検索"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={inputStyles}
      />
    </div>
  );
};

export default SearchBar;


const tagColor = '#0056b3';

export const style = {
  articleCard: {
    padding: '20px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s ease',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    textAlign: 'left',
    maxWidth: 'max-content',
  },
  textRight: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '0.9rem',
    color: '#555',
  },
  tags: {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #ddd',
  },
  postsGrid: {
    display: 'grid',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  heading: {
    textAlign: 'center',
  },
  tag: {
    color: tagColor,
    marginRight: '5px',
  },
  tagTable: {
    width: '100%',
    maxWidth: '800px',
    margin: '20px auto',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tagTableHeader: {
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#333',
  },
  tagTableCell: {
    padding: '12px 15px',
    borderBottom: '1px solid #dee2e6',
    textAlign: 'left',
  },
  tagTableRow: {
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#f1f3f5',
    },
  },
  more_link: {
    textAlign: 'center',
    display: 'inline-block',
    marginTop: '10px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}
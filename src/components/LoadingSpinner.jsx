const LoadingSpinner = () => {
  const spinnerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    width: '100%',
    padding: '20px',
  };

  const spinnerContainerStyle = {
    position: 'relative',
    width: '64px',
    height: '64px',
    margin: '20px auto',
  };

  const spinnerCircleStyle = {
    position: 'absolute',
    border: '4px solid transparent',
    borderRadius: '50%',
    borderTopColor: '#00695c',
    width: '100%',
    height: '100%',
    animation: 'spin 1s linear infinite',
  };

  const loadingTextStyle = {
    marginTop: '15px',
    color: '#555',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  return (
    <div style={spinnerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
      <div style={spinnerContainerStyle}>
        <div style={spinnerCircleStyle}></div>
      </div>
      <div style={{
        ...loadingTextStyle,
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>
        コンテンツを読み込み中...
      </div>
    </div>
  );
};

export default LoadingSpinner;

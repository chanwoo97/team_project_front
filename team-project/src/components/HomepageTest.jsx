import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePageTest = () => {
  const { user } = useAuth();

  const buttonStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    margin: '5px',
    display: 'inline-block',
    cursor: 'pointer',
  };

  return (
    <div>
      <h1>Data Service </h1>
      {user ? (
        <>
          <Link to="/toolspage">
            <button style={buttonStyle}>라우팅 테스트</button>
          </Link>
          <Link to="/tsunami-predict">
            <button style={buttonStyle}>실시간 쓰나미 예측</button>
          </Link>
        </>
      ) : (
        <Link to="/login">
          <button style={buttonStyle}>Login</button>
        </Link>
      )}
    </div>
  );
};

export default HomePageTest;

import React from 'react';
import UserNav from "./UserNav";
import { Link } from 'react-router-dom';

const ToolsPage = () => {
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 56px)' }}>
        <UserNav/>
        <h2>메인 화면</h2>
        <Link to="/tsunami-predict" style={buttonStyle}>실시간 쓰나미 예측</Link>
      </div>
  );
};

export default ToolsPage;

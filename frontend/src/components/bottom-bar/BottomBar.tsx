import React from 'react';
import { Link } from 'react-router-dom';

const BottomBar: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        width: '100%',
        bottom: 0,
        backgroundColor: '#3f51b5',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <Link style={{ color: 'black', padding: '5px' }} to="/privacy-policy">
        Polityka prywatności
      </Link>
      <Link style={{ color: 'black', padding: '5px' }} to="/terms">
        Regulamin
      </Link>
      <Link style={{ color: 'black', padding: '5px' }} to="/cookies">
        O ciasteczkach
      </Link>
    </div>
  );
};

export default BottomBar;

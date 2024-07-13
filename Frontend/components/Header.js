import React from 'react';

const Header = () => {
  return (
    <div style={styles.headerContainer}>
      <h1 style={styles.headerText}>Handwritten Marathi Character Recognition</h1>
    </div>
  );
}

const styles = {
  headerContainer: {
    textAlign: 'center',
    backgroundColor: 'black', // Black background
    padding: '20px', // Add padding for better appearance
  },
  headerText: {
    fontWeight: 'bold',
    color: '#F28123' , // Orange text color
  },
};

export default Header;

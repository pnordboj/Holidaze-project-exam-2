import React from 'react';

function Error(type) {
  if (type === '401') {
    return (
      <div>
        <h1>401</h1>
        <p>Unauthorized</p>
      </div>
    );
  } else if (type === '404') {
    return (
      <div>
        <h1>404</h1>
        <p>Not Found</p>
      </div>
    );
  }
}

export default Error;

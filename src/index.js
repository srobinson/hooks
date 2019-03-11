import React from 'react';
import ReactDOM from 'react-dom';

function Counter() {

  return (
    <div>
      <div>Count: {count}</div>
      <div>
        <button onClick={() => increment(1)}></button>
        
      </div>
    </div>
  )
}


// ReactDOM.render(<App />, document.getElementById('root'));


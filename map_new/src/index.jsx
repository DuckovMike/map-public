import ReactDOM from 'react-dom/client';
import App from './App';
import Head from './Head'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <div id='template'>
      <Head />
      <App />
    </div>
  </>
)

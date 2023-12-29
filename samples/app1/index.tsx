import { renderToString } from 'react-dom/server';
import { MyComponent } from './components/MyComponent';

console.log(renderToString(<MyComponent index={1} />));

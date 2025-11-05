import { createRoot } from 'react-dom/client';
import Wrapper from './app-components/Wrapper';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<Wrapper />);
}
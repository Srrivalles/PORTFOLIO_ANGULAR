import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const distRoot = path.resolve(__dirname, '..', 'dist', 'angular-portfolio');
const browserDir = path.join(distRoot, 'browser');
const staticDir = browserDir;
const indexFile = path.join(browserDir, 'index.html');

app.disable('x-powered-by');
app.use(express.static(staticDir, { fallthrough: true, maxAge: '1h' }));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(indexFile);
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${port}`);
});


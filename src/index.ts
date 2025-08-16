import express from 'express';
import uploadsRouter from './routes/uploads';
import emailRouter from './routes/email';
import cors from 'cors';
const app = express();
app.use(cors({ origin: '*' }));
// Middleware for parsing JSON (if needed for other routes)
app.use(express.json());

// Mount uploads and email routes
app.use('/api', uploadsRouter);
app.use('/api', emailRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});

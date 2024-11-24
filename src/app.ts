import express from 'express';
import contactRoutes from './routes/contactRoutes';

const app = express();

app.use(express.json());
app.use('/', contactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
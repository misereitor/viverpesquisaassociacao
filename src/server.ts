import app from './app';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.listen(port, (): void => {
  console.log(`Server is running at http://localhost:${port}`);
});

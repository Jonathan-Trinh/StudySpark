import express, { Express } from "express";
import { list, loadDecks, loadScores, saveDecks, saveScores } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/loadDecks", loadDecks);
app.get("/api/loadScores", loadScores);
app.get("/api/list", list);
app.post("/api/saveDecks", saveDecks); 
app.post("/api/saveScores", saveScores);
app.listen(port, () => console.log(`Server listening on ${port}`));

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import allroutes from "./routes/index";
import morgan from 'morgan';
import { serve, setup } from 'swagger-ui-express';
import swaggerSpecs from '../public/doc/swagger.json';

const app = express();

app.use(morgan('dev'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use('/doc',  serve, setup(swaggerSpecs));
app.use(allroutes);
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`server port is running on ${server.address().port}`);
});

export default app;

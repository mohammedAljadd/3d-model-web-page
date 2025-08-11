import fs from 'fs';
import express from 'express';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var cors = require('cors')
const app = express();

app.use(cors());


let objFiles = [];

app.get('/obj-files', (req, response) => {
  const files = fs.readdirSync("public/exports");
  for(const file of files){
    if(file.endsWith('.obj')){
        objFiles.push(file);
    }
  }
  response.json(objFiles);
});


app.listen(3000, () => console.log('Fetching server running on port 3000'));

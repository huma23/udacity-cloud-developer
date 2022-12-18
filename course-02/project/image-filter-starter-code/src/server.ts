import isUrl from 'is-url';
import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { deleteLocalFiles, filterImageFromURL } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.use('/filteredimage',async (req: Request, res: Response) => {

    const bad_request = {message: 'Bad request: Try GET /api/v0/filteredimage?image_url={{URL}}'};

    if(!req.query){
        return res.status(400).send(bad_request);
    }

    let { image_url } = req.query;
    if(!image_url){
        return res.status(400).send(bad_request);
    }
    
    const imageUrlPath = String(image_url);
    const validatedUrl = isUrl(imageUrlPath);
    if(!validatedUrl){
        return res.status(400).send({message: 'Parameter is not an url.'});
    }

    filterImageFromURL(imageUrlPath)
    .then(filePath => {
        return res.sendFile(filePath, function(err) {
            if(err) {
                return res.status(500).send({message: String(err)});
            } else{
                const array = []
                array.push(filePath);
                deleteLocalFiles(array).then(() => res.status(200));
            }
        });
    })
    .catch(reason => {
        return res.status(500).send({message: String(reason)});
    });
  });

  app.get('/', async (req: Request, res: Response) => {    
    res.send(`Usage: GET /filteredimage?image_url={{URL}}`);
  });
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();

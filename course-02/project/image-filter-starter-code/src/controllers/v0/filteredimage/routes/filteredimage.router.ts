import isUrl from 'is-url';
import isImage from 'is-image'
import { Router, Request, Response, response } from "express";
import { deleteLocalFiles } from "../../../../util/util";
import { filterImageFromURL } from "../../../../util/util";

const router: Router = Router();

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

router.use('/',async (req: Request, res: Response) => {

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

export const FilteredImageRouter: Router = router;
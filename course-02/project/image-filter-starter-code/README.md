## Screenshots
I've made few screenshots with the working service local and on aws. See Folder Screenshots.

## Links
http://localhost:8082/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/b/bd/Golden_tabby_and_white_kitten_n01.j$

http://image-filter-manuel-dev.us-east-1.elasticbeanstalk.com/filteredimage?image_url=https://upload.wikimedia.org/wikipedia/commons/$

## Repository
https://github.com/huma23/udacity-cloud-developer

## Additional remarks
The function filterImageFromURL(url) did not work with some images and I always got an MIME error. I edited the function
according to this issue by loading the
image data with axios and then pass it to jimp. See https://github.com/oliver-moran/jimp/issues/775


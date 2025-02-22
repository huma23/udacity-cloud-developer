export const config = {
  "dev": {
    "username": process.env.POSTGRES_USERNAME, 
    "password": process.env.POSTGRES_PASSWORD, 
    "database": process.env.POSTGRES_DATABASE, 
    "host": process.env.POSTGRES_HOST, 
    "dialect": process.env.DB_DIALECT, 
    "aws_region": process.env.AWS_REGION, 
    "aws_profile": process.env.AWS_PROFILE, 
    "aws_media_bucket": process.env.AWS_BUCKETNAME,
  },
  "jwt": {
    "secret": process.env.JWT_SECRET
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
}

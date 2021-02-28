### File Structure

| Directory                                                                                         | Content                      |
| --------------------------------------------------------------------------------------------------| ---------------------------- |
| [frontend](https://github.com/sksuryan/summarize-me/tree/main/frontend) | contains frontend components |
| [backend](https://github.com/sksuryan/summarize-me/tree/main/backend)   | contains backend api         |
| [docs](https://github.com/sksuryan/summarize-me/tree/main/docs)         | contains all docs (schemas, api routes, usage) |

### Setup

- Fork and clone the repo

```
$ git clone https://github.com/sksuryan/summarize-me.git
$ cd summarize-me
```

#### Frontend:
- Install dependencies
```
$ cd frontend
$ npm install
```

- Run the server and react app

```
$ npm start
```

#### Backend:
- Install dependencies (make sure you have ffmpeg installed)
```
$ cd backend
$ python -m venv env
$ pip install -r requirements.txt
```
- Add the .env file

```
BUCKET_NAME = <YOUR_GOOGLE_STORAGE_BUCKET_NAME>
MONGO_DBNAME = <YOUR MONGO_DBNAME>
MONGO_URI = <YOUR_MONGO_URI>
```

- Add key.json to /backend directory your Google project's service account key and run the command.

```
export GOOGLE_APPLICATION_CREDENTIALS=/media/sksuryan/Programming/Projects/cuse/backend/key.json
```

- Run the server
```
$ python app.py
```
### Alternatively, you can use Docker to get the project running asap!

- Navigate to /backend directory
- make sure you have .env and key.json as mentioned above
```
$ docker build -t summarize .
$ docker run -p 5000:8080 -e PORT=8080 --env-file .env -v=<ABSOLUTE_PROJECT_DIRECTORY>/backend/key.json:/app/key.json -e GOOGLE_APPLICATION_CREDENTIALS=/app/key.json summarize:latest
```
*Note: if you're using Docker, you don't have to install ffmpeg or any other dependency*

*You do need .env file and key.json in /backend directory*

const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.getNotFound,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersHead,
    '/notReal': jsonHandler.getNotFoundHead,
  },
  POST: {
    '/addUser': jsonHandler.postAddUser,
  },
};

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);

    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    // application/x-www-form-urlencoded
    const bodyString = Buffer.concat(body).toString();
    const bodyParams = JSON.parse(bodyString);

    // console.log(bodyParams);
    handler(request, response, bodyParams);
  });
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const methodHandlers = urlStruct[request.method];
  const handler = methodHandlers[parsedUrl.pathname];
  const queryParams = query.parse(parsedUrl.query);

  console.log(parsedUrl.pathname);

  if (request.method === 'POST') {
    parseBody(request, response, handler);
  } else if (handler) {
    handler(request, response, queryParams);
  } else {
    urlStruct.GET['/notReal'](request, response, queryParams);
  }
};

http.createServer(onRequest).listen(port, () => {
  // console.log(`Listening on 127.0.0.1: ${port}`);
});

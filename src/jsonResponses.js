const users = {};

const respond = (request, response, statusCode, content) => {
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  if (content) { response.write(content); }
  response.end();
};

const getUsers = (request, response) => {
  const content = JSON.stringify(users);

  respond(request, response, 200, content);
};
const getUsersHead = (request, response) => {
  respond(request, response, 200);
};

const getNotFound = (request, response) => {
  const data = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  const content = JSON.stringify(data);

  respond(request, response, 404, content);
};
const getNotFoundHead = (request, response) => {
  respond(request, response, 404);
};

const postAddUser = (request, response, newUser) => {
  const data = {};

  if (!(newUser.name && newUser.age)) {
    data.id = 'addUserMissingParams';
    data.message = 'Name and age are both required.';
    respond(request, response, 400, JSON.stringify(data));
    return;
  }

  if (users[newUser.name]) {
    users[newUser.name].age = newUser.age;
    respond(request, response, 204);
    return;
  }

  users[newUser.name] = newUser;
  data.message = 'Created Successfully';
  respond(request, response, 201, JSON.stringify(data));
};

module.exports = {
  getUsers,
  getUsersHead,
  getNotFound,
  getNotFoundHead,
  postAddUser,
};

const express = require("express");
const cors = require("cors");
 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
      return response.status(400).json({error: 'Invalid project ID.'});
  }

  return next();
}

app.get('/repositories', (request, response) => {
  console.log('Able to list the repositories');
  return response.json(repositories);

});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  console.log('Able to create a new repository');
  return response.json(repository);

});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

const repositoryIndex = repositories.findIndex(repository => repository.id == id)

if (repositoryIndex < 0) {
  console.log('Not able to update a repository that does not exists');
  return response.status(400).json({ error: 'Repository not found.'});
}

const repository = {
  id,
  title,
  url,
  techs,
  likes: repositories.find(repository => repository.likes)
}

repositories[repositoryIndex]  = repository;
  console.log('Able to update a repository');
  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

if (repositoryIndex < 0) {
  console.log('Not able to delete a repository that does not exists')
  return response.status(400).json({ error: 'Repository not found.'})
}

repositories.splice(repositoryIndex, 1);

return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id == id);

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if (repositoryIndex < 0) {
    console.log('Not able to delete a repository that does not exists')
    return response.status(400).json({ error: 'Repository not found.'})
  }
  
  repository.likes += 1;
  
  return response.json(repository);
});

module.exports = app;

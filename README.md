# Games API
#### API RESTful de jogos com Node.js e MySQL
## Endpoints
### (GET) /games
Retorna um JSON com todos os jogos presentes no banco de dados.
#### Parâmetros
Nenhum.
#### Respostas
##### 200 - OK
Você recebe a lista de jogos.

![image](https://user-images.githubusercontent.com/99913525/216788596-c5a79368-3295-4559-8cf7-e12c5d05e4a5.png)
##### 401 - Não autorizado
Você não possui o token JWT para acessar as rotas.
##### 404 - Not found
Não há jogos salvos no banco de dados.
##### 500 - Internal Server Error
O servidor não conseguiu buscar os dados.
***
### (GET) /games/id
Retorna o JSON de um jogo específico.
#### Parâmetros
- ID do jogo.
#### Respostas
##### 200 - OK
Você recebe o jogo com o ID indicado.

![image](https://user-images.githubusercontent.com/99913525/216788660-51c9c0be-f423-4dad-835d-b77ddb02f719.png)
##### 401 - Não autorizado
Você não possui o token JWT para acessar as rotas.
##### 404 - Not Found
Não há jogos salvos no banco de dados com o ID indicado.
##### 500 - Internal Server Error
O servidor não conseguiu realizar a busca.
***
### (POST) /games
Cadastra um jogo no banco de dados.
#### Parâmetros
- JSON com os campos:
  - title(string)
  - price(number)
  - year(number)
#### Respostas
##### 200 - OK
O jogo foi cadastrado.
##### 400 - Bad Request
Algum ou alguns dados estão inválidos.
##### 401 - Não autorizado
Você não possui o token JWT para acessar as rotas.
***
### (PUT) /games/id
Atualiza algum jogo no banco de dados.
#### Parâmetros
- ID do jogo
- JSON com os campos:
  - title(string)
  - price(number)
  - year(number)
Os campos são opcionais, mas devem ser respeitados os tipos dos dados a serem atualizados.
#### Respostas
##### 200 - OK
A edição ocorreu com sucesso.
#### 400 - Bad Request
ID ou dado inválido.
#### 401 - Não autorizado
Você não possui o token JWT para acessar as rotas.
#### 404 - Not Found
Não há nenhum jogo com o ID indicado.
***
### (DELETE) /games/id
Deleta um jogo do banco de dados.
#### Parâmetros
- ID do jogo
#### Respostas
##### 202 - OK
Jogo deletado com sucesso.
##### 400 - Bad Request
ID inválido.
##### 401 - Não autorizado
Você não possui o token JWT para acessar as rotas.
***
### Para conectar ao banco de dados, configure com o seu banco no arquivo "/database/connection.js"

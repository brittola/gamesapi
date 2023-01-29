# Games API
#### API REST de jogos com Node.js e MySQL

### Endpoints
```
(GET) /games
```
- Retorna todos os jogos presentes no banco de dados.
```
(GET) /games/id
```
- Retorna um jogo específico pelo id.
```
(POST) /games
```
- Recebe um JSON { title (string), price (number), year (number) }, valida e cadastra no banco de dados.
```
(PUT) /games/id
```
- Recebe um JSON { title (string), price (number), year (number) }, valida e atualiza apenas os campos válidos. (Neste endpoint, os campos são opcionais).
```
(DELETE) /games/id
```
- Busca pelo o jogo pelo id e, caso exista, deleta do banco de dados.

Essa foi a minha primeira API seguindo os padrões REST, então pode ser que nem tudo esteja feito da melhor maneira possível :)

### Para conectar ao banco de dados, configure com o seu banco no arquivo "/database/connection.js"

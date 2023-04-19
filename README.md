

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Teste para vaga de desenvolvedor fullstack na empresa Trampay. 

## Installation

Para a instalação, realize a inserção de um arquivo .env com as configurações necessárias.

## Aqui pode inserir da forma que desejar
PG_PASS=
PG_DB=
PG_USER=
PG_HOST=

## Número do salt do bcrypt para a criptografia das senhas
BCRYPT_SALT=

## Uma chave para o JWT
JWT_SECRET=

## As configurações do provedor de e-mail que irá ser utilizado.

MAILER_HOST=
MAILER_PORT =
MAILER_USER = 
MAILER_PASS =

## Running the app

Para rodar, basta apenas utilizar o docker compose up, para realizar a configuração do banco de dados e do backend automaticamente.

```bash
docker compose up
```

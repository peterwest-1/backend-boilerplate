# Backend Boilerplate

Server boilerplate using TypeORM TypeGraphQL Apollo Redis GraphQL Postgres.



## Installation

* Requires `Redis` and `Postgres`

* Clone repository

```
git clone https://github.com/peterwest-1/backend-boilerplate.git
```

* Change directory

```
cd backend-boilerplate
```

* Install dependancies 

```
yarn
```

* Create database and change config in `src/data-source.ts` accordingly

* Start the server

```
yarn start
```

## Consider changing 

Return type of ChangePassword resolver from User to UserResponse

## Usage

- Change ForgotPasswordResolver email to link forgot email on front end

## License

[MIT](https://choosealicense.com/licenses/mit/)

### Start docker container
```
$ docker compose up
```

### Initialize database
```
$ sqlx database create
$ sqlx migrate run
```

### Start server
```
$ cargo r
```

---

## Development

### Accessing the database
```
$ pgcli --host=localhost --username=postgres --dbname=dev
```
- Use password: "password"

### Graphql playground
- http://localhost:5133/
# Deno-REST

Creating a RESTful API with authentication using Deno!

-   [x] Set up file watcher using [denon](https://deno.land/x/denon@v2.1.0)
-   [x] Configure environemnt variables using [dotenv](https://deno.land/x/dotenv@v0.4.2).
-   [x] Set up routing using [oak]("https://deno.land/x/oak@v4.0.0").
-   [x] Set up database with [postgres](https://deno.land/x/postgres@v0.4.1).
-   [x] Registration and password hasing using [bcrypt](https://deno.land/.x/bcrypt@v0.2.1).
-   [x] Authentication with [oak]("https://deno.land/x/oak@v4.0.0") cookies.

# Start the app

1. Install [denon](https://deno.land/x/denon@v2.0.2)

```
$ deno install --allow-read --allow-run --allow-write -f --https://deno.land/x/denon/denon.ts
$ export PATH="/Users/shawnstewart/.deno/bin:$PATH"
```

> ⚠️ Make sure you are using deno version ^1.0.1 to install this executable. You can upgrade running `deno upgrade`.

2. `denon start`

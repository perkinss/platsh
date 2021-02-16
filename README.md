# README

Assumes you have installed Ruby v. 2.7.1 ([rbenv](https://github.com/rbenv/rbenv) recommended), Rails 6.0.3, Node 10.15, NPM 6.4

## Install

This app uses PostgresSQL 10+ -- but probably also works with 9.x

For the database:
1. Install the postgres db.
2. Set the following environment variables so 
     your local system can find the db:
     
     - DB_HOST - eg `localhost`
     - DB_USER - for a default install it's probably your system name.  Try running
         `whoami` on the commandline to determine what name to use.
     - DB_PASSWORD - for a default install it's usually the same as your user name
     - DB_PORT - default is 5432
3. Create a local development and a local test database.  (Running the tests will truncate 
    the tables in the test database, but the dev db will be safe) 
     ```
     $ psql -U <username>
     psql (10.7)
     Type "help" for help.
        
     # create database markers_development;
     CREATE DATABASE
     # create database markers_test;
     CREATE DATABASE
     # \q
     $
     
     ```
4. Navigate to the markers directory and run the migration to set up the database tables and data:
   ```
   $ rake db:migrate
   ```
5. Install the front end modules:
    ```
    $ yarn
    ```
6. Start the rails server, and then in another window, start the webpacker
   ```
   $ rails s
    ```
    ```
    $ ./bin/webpack-dev-server --host 127.0.0.1

   ```
7.  Navigate to localhost:3000 to see the app in your browser

8.  If you need to see your app in your local network, for example testing on a phone, bind the 
rails server to 0.0.0.0.  (localhost is not a public IP address so you won't be able to access it that way, same 
for 127.0.0.0).  If you use 0,0,0,0 it will bind to your IP address.  And also localhost:
```apple js
$ rails s -b 0.0.0.0
```

### If running PostgreSQL in docker

1. The `pg` gem requires postgres libraries, so `libpq` is needed if PostgreSQL isn't install.
```
$ brew install libpq 
```

2. Save a build option in the bundler build config to use `libpq` when install the `pg` gem.
```
$ bundle config --local build.pg --with-opt-dir="/usr/local/opt/libpq"
```

3. Install the required gems
```
$ bundle install
```

4. Start-up the database using docker-compose
```
$ docker-compose up -d
```
     
## Testing
Yarn 1.x is in maintenance mode, and Yarn 2 is a poor substitute (google 'yarn is dead'); 
so we can switch to `pnpm` in the develpment environmet, for speed; but we still use `yarn` on heroku because 
they haven't gotten around to adding `pnpm` to their build tools.
To install `pnpm` see instructions at https://pnpm.js.org/en/installation.
### API tests:
Either 

    $ rails test
or

    $ pnpm run api-test
    
### Front end tests:
    $ pnpm test
    

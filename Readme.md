# How to setup and run the project

## Step 1

> Clone the repository by running this command.<br/>

#### `git clone https://github.com/MhaFADH/mohamed-amine_fadhlaoui_blog.git`

## Step 2

> Install the project dependencies by running this command at the root of the project.<br/>

#### `npm i`

## Step 3

> You need to create a `.env.local` file at the root of the project.
> <br/>this file will contain the following keys:

- `DB__CONNECTION` it will contain the connection string to the database

- `NEXT_PUBLIC_API__BASE_URL` should contain the base url of the website followed by this path: `/api`

- `SECURITY__JWT__SECRET`

- `SECURITY__PASSWORD__PEPPER` should be at least 256 characters

## Step 4

> Now you need to run the migrations from knex to create the tables in the database by running this command.<br/>

#### `npx knex migrate:latest`

## Step 5

> You now need to populate the database with random data by running this command.<br/>

#### `npx knex seed:run`

## Step 6 (last)

> You should now be able to run the project by running this command.

#### `npm run dev`

> The password for every user generated from the seed is `Admin.1234`, but if you want to access a random account, you'll have to check for the account's generated email directly in database.

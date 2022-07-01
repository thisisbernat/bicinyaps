# Project setup

This are some notes for myself as a reminder on how I'm developing the project

---

## Initial setup
1. Create a new repository on GitHub: [github.com/thisisbernat/bicinyaps](https://github.com/thisisbernat/bicinyaps).
I'm using the Node template for the *.gitignore* file.
2. Clone it to the PC with GitHub Desktop.
3.  Open it in VSCode.

## Node.js setup
1. Check installed versions of node.js and npm:
`node --version`
`npm --version`
2. Node.js starting setup. This will create the *package.json* configuration file for Node.js.
`npm init --yes`
3. Package installation:
`npm i <package_name>` or `npm i --save-dev <package_name>` to install the package as a dev dependency.

##### Will be using these packages:
- *ExpressJS*: Server framework for Node.js
- *HBS* or *HandlebarsJS*: Templating language to generate dynamic views, based on Mustache templating language.
- *Nodemon*: helping tool by automatically restarting the node application when file changes in the directory are detected.
- *Dotenv*: Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.

## Express setup
### Installation
`npm i express`

## HandlebarsJS setup
### Installation
`npm i handlebars`

## Dotenv setup
### Installation
`npm i dotenv`

## Nodemon setup
### Installation
`npm i --save-dev nodemon`

# 

## The database: MongoDB

## Mongoose
Mongoose is a Object Document Mapper (ODM) for Node.js applications working with MongoDB, making possible to write database queries using pure JavaScript.

## Run the application
If we take a look at the *package.json* file on the root folder of the project, we will see this part:

    "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
    }

This means we can start the application with `npm run start` or with `npm run dev` to run it in dev mode (using Nodemon).




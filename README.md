# Requirements:
* Docker Version 20x
* Node.js Version 14x
* Setting up the microservices as instructed here: [MICROSERVICE_DEPENDENCIES](https://gitlab.fokus.fraunhofer.de/learning-technologies/projects/control-connect/cc_deployment)


# Quick Start:


Install node_modules in the respective git submodules with their respective dependencies by running: 

```npm install```

It is also necessary to copy .env.default file to .env and insert the appropriate values. Please contact the owner of this repository to the values. A description of the values is also given in the file itself.

(UNIX)
```cp .env.default .env.local```

Afterward just startup the server with following command:

```npm run dev```

Afterwards you should be able to launch the application on the following address:

http://localhost:3000

# Structure

The LMC offers on one hand a lightweight backend application based on express and on the other hand a Next.js application to render server side pages

The project follows following structure

├── server.ts / # Entrypoint of the project where all routes are defined 
│ ├── express/ # based on a lightweight http server 
│ │ ├── models/ # The DAOs for interacting with the persistence layers
│ │ └── handlers/ # Responsible for handling the requests based on specific routes
│ ├── pages/ # Next.js pages which are used to display the frontend
│ │ 
│  
└── README.md # The file you're reading now
# Acme Hotel Example - Express, FastAPI, Sqlalchemy

acme-hotel-express-fastapi-sqlalchemy/
This example contains a frontend and backend:

- The frontend is an [Express](https://expressjs.com/) using an MVC structure and [Pug](https://pugjs.org/api/getting-started.html) for templating.
- The backend **Hotel Reservation Service** example is a GraphQL API providing the ability to create and list reservations as well as the ability to list available rooms for a given date range.

For a solution that is more scalable than this, please checkout my [React-FastAPI-TortoiseORM](https://github.com/WillSams/acme-hotel-react-fastapi-tortoiseorm/) version of this same idea.


Booked reservations are listed via the API. Each reservation request were processed in the order provided as if they were real-time requests. The following rules are observed:

**Context**:

* When a room is reserved, it cannot be reserved by another guest on overlapping dates.
* Whenever there are multiple available rooms for a request, the room with the lower final price is assigned.
* Whenever a request is made for a single room, a double bed room may be assigned (if no single is available?).
* Smokers are not placed in non-smoking rooms.
* Non-smokers are not placed in allowed smoking rooms.
* Final price for reservations are determined by daily price * num of days requested, plus the cleaning fee.

**Web UI Usage**:

![text](./frontend/src/public/img/home_example.png) ![text](./frontend/src/public/img/new_example.png)

**API Usage**:

Example usage via [curl](https://curl.se/download.html):

```bash
# First, grab an access token provided by the API
ACCESS_TOKEN=$(curl -s -X POST \
  -H 'accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=password&username=example-user&password=example-user' \
  'http://localhost:8080/token' | jq -r '.access_token')

# List all existing booked reservations
curl http://localhost:$API_PORT/development/graphql \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -d '{"query": "query { getAllReservations { reservations { room_id checkin_date checkout_date  } } }"}'

# Create a new reservation
# Note: if there is an overlap, you'll see a 
#   'Reservation dates overlap with an existing reservation' error message
# To see the aforementioned error, run this mutation a multiple times
curl http://localhost:$API_PORT/development/graphql \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -d '{ "query": "mutation { createReservation( input: { room_id: \"91754a14-4885-4200-a052-e4042431ffb8\", checkin_date: \"2023-12-31\", checkout_date: \"2024-01-02\"  }) { success errors reservation { id room_id checkin_date checkout_date total_charge } } }" }'

# List Available Rooms for a given date range
curl http://localhost:$API_PORT/development/graphql \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer ${ACCESS_TOKEN}" \
    -d '{"query": "query { getAvailableRooms( input: { checkin_date: \"2023-12-31\", checkout_date: \"2024-01-02\" }) { success errors rooms { id num_beds allow_smoking daily_rate cleaning_fee } } }" }'
```

**Open API UI Usage**:

Navigate to [http://localhost:$API_PORT/docs].

**Table of Contents**:

* [Prerequisites](#prerequisites)
* [Getting Started](#getting-started)
    - [Install Python Packages](#install-python-packages)
    - [Install Node.js Packages](#install-nodejs-packages)
    - [Create the Database](#create-the-database)
* [Development](#development)
* [Testing](#testing)
* [Troubleshooting](#troubleshooting)
    - [Docker Image](#docker-image)
* [License](#license)

## Prerequisites

To run the service, you will need to install the following tools.

* [Python](https://www.python.org/downloads/)
* [NodeJS](https://nodejs.org/en/) - Used for migrations ([Knex.js](https://knexjs.org/)). 
* [Docker](https://www.docker.com/)

The below are optional but highly recommended:

* [nvm](https://github.com/nvm-sh/nvm) - Used to manage NodeJS versions.
* [Direnv](https://direnv.net/) - Used to manage environment variables.

## Getting Started

First, we'll need to set up our environment variables.  You can do this by either:

* Manually exporting the necessary environment variables in your shell.  These are listed in the [`./envrc.example`](./envrc.example) file.

or

* Use optionally use **Direnv**.

```bash
cp .envrc.example .envrc
direnv allow
```

For exporting environment variables, [Python Dotenv](https://pypi.org/project/python-dotenv/) is an option as well.  However, **Direnv** is preferred as it isn't dependent on Python therefore can be used in other use-cases.

### Install Python Packages

Execute the following in your terminal:

```bash
python -m venv venv
source venv/bin/activate
pip install --upgrade pip 
pip install -r requirements.txt
```

### Install Node.js Packages

Execute the following within your terminal:

```bash
nvm use             # To eliminate any issues, install/use the version listed in .nvmrc. 
npm i               # install the packages needed for project 
```

### Create the database

Finally, let's create and seed the databases and our Reservations and Rooms tables:

```bash
# Create the databases and seed them
NODE_ENV=development | ./create_db.sh && npm run refresh && npm run seed
NODE_ENV=test | ./create_db.sh && npm run refresh
```

During development, you can just execute `npm run dev:db-baseline` to refresh the database back to the original seed data.

## Development

To run both the frontend and backend concurrently:

```bash
docker-compose up -d  # runs the database in the background
npm run dev
```

Also, you just execute the backend via `npm run dev:backend`.  to verify the backend is working:

```bash
curl http://localhost:$API_PORT/$ENV/about
```

You can also acces the Ariadne GraphiQL (interactive test playground) instance at [http://localhost:$API_PORT/$ENV/graphql](http://localhost:$PLAYGROUND_PORT/$ENV/graphql).  

## Testing

The frontend utilizes [Jest](https://jestjs.io/).  To run these tests, simply execute `npm run test:frontend`.

![text](./frontend/src/public/img/frontend_tests_example.png) 

The backend tests organized for improved readability and comprehension. These tests are segmented into individual files, a structure that simplifies the testing process and enhances accessibility. While individual preferences may vary, this is my chosen approach for managing tests in this project.

To run these tests, simply execute `npm run test:backend`.

![text](./frontend/src/public/img/backend_tests_example.png) 

## TODO

- The UI's flow is not great, goal was to get a UI up and running for testing the backend. So, changes to implement are:
    - Make caching middleware.  Also, it's not as clean as I would like.
    - When making a new reservation, validation should happen in place and not redirect to a modal.
- Enforce typing:
    - JavaScript -> I'll eventually introduce [JSDoc](https://jsdoc.app/) as an alternative to TypeScript.
    - Python -> I need to sprinkle more type annotations.  Also, I need to evaluate if usage of *Union* and *Optional* are more helpful that they look.
- Add GitHub Action for validating pull requests
- Add GitHub Actions for deployment to AWS
- Add Pulumi or Amazon CDK artifacts for managing AWS infrastructure supporting our code.
    - Deploy frontend as [ECS](https://aws.amazon.com/ecs/) service.
    - Deploy backend as [Lambda](https://aws.amazon.com/lambda/) function.
- Add Cypress for testing the UI

## License

License information can be found [here](./LICENSE)


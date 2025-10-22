# tg_notifier: Backend Service

The **backend** service of [tg_notifier](https://coderepo.corp.tander.ru/it_khd/dev_khd/tg_notifier), provides API.


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Navigation

- [Key topics](#key-topics)
  - [Development and Production environments](#development-and-production-environments)
  - [Telegram bot group registration](#telegram-bot-group-registration)
- [Installing](#installing)
- [Running](#running)
  - [Development](#development)
  - [Production](#production)
- [Updating](#updating)
- [Git Workflow](#git-workflow)
- [Project concept and code style](#project-concept-and-code-style)
  - [Markdown TOC](#markdown-toc)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Key topics


### Development and Production environments

1. Development
   - Uses long polling (`getUpdates`).  
   - Simple to run locally, no public URL required.  

2. Production
   - Uses webhooks (`POST /webhook/tg`).  
   - Telegram pushes updates directly to the service over HTTPS.  
   - Recommended for production: scalable and resource-efficient.


### Telegram bot group registration

- **Current approach:**  
  To register a Telegram bot in a group, users send the `\register_group_to_tg_notifier` command.  
  The service saves group information to a JSON file.  
  This simple approach works well for:
  - Rare events (registration happens infrequently)
  - Small number of groups
  - Single service instance

- **Why JSON:**  
  Using a file avoids the complexity of setting up a database (Postgres, SQLite) for the initial implementation.  
  It allows fast iteration and keeps deployment lightweight.

- **Future-proofing:**  
  If the project scales, number of groups increases, or analytics/reporting becomes necessary,  
  it is recommended to move to a proper database (e.g., Postgres) for:
  - Reliability
  - Concurrency handling
  - Data history and more complex queries


## Installing

1. Install `tg_notifier` project. For details, refer to the [tg_notifier README.md](../../README.md#installing)

2. Make sure you are in the [services](../../services) folder.

3. Clone this service:

   ```shell
   git clone git@coderepo.corp.tander.ru:it_khd/dev_khd/tg_notifier_backend.git backend
   ```
   
4. (development only) Install git hooks:

    ```shell
    ../../scripts/install_git_hooks.sh
    ```


## Running

### Development

1. Copy the required environment variable files for this service 
   (see `services:backend` in [docker-compose.yml](../../devops/docker/dev/docker-compose.yml)) 
   from [../../devops/docker/_samples](../../devops/docker/_samples) 
   to [../../devops/docker/dev](../../devops/docker/dev) and set the appropriate values.

2. Run service:

   ```shell
   docker compose -f ../../devops/docker/dev/docker-compose.yml up --build -d backend
   ```


### Production

1. Copy the required environment variable files for this service 
   (see `services:backend` in [docker-compose.yml](../../devops/docker/prod/docker-compose.yml)) 
   from [../../devops/docker/_samples](../../devops/docker/_samples) 
   to [../../devops/docker/prod](../../devops/docker/prod) and set the appropriate values.

2. Run service:

   ```shell
   cd ../../ && make up_backend
   ```

   Or directly with Docker:

   ```shell
   docker compose -f ../../devops/docker/prod/docker-compose.yml up backend --build -d
   ```


## Updating

Use the [Makefile](../../Makefile) to quickly update the service:

```shell
cd ../../ && make pull_backend     # pull only
cd ../../ && make up_backend       # build and update
cd ../../ && make pull_up_backend  # full update: pull, build, and update
```


## Git Workflow

The Git workflow is the same as in the main `tg_notifier` repository.  
See the [tg_notifier README.md](../../README.md#git-workflow) for details.


## Project concept and code style

Project concept and code style is the same as in the main `tg_notifier` repository.  
See the [tg_notifier README.md](../../README.md#project-concept-and-code-style) for details.


### Markdown TOC

To automatically update Markdown table of contents (TOC), run:

```shell
doctoc --title "## Navigation" --maxlevel 4 README.md
```


## Contributing

To report bugs or suggest improvements, please use the 
[issue tracker](https://coderepo.corp.tander.ru/it_khd/dev_khd/tg_notifier_backend/-/issues)

If you discover a security issue in the code, do **not** create an issue or raise it in any public forum 
until we have had a chance to address it. **For security issues, contact**: maltcev_a_v@magnit.ru


## Licence

Copyright © 2025 Magnit Tech

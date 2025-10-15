# DmsVahan

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

# Local and Docker Setup Guide

## Prerequisites
- Node.js 20.19.0 or newer (20.x recommended)
- npm 10+
- Optional: Docker Desktop (for containerized run)

> Windows note: the package.json "start" script uses bash/nvm and may not work on Windows. Prefer `npx ng serve`.

## Run locally (no Docker)
1) Install dependencies (uses package-lock.json):
```bash
npm ci
```
2) Start the dev server (cross‑platform):
```bash
npx ng serve --open
```
3) Alternative (explicit host/port):
```bash
npx ng serve --host 0.0.0.0 --port 4200
```
4) Production build (outputs to `dist/DmsVahan/browser`):
```bash
npx ng build
```
5) Run unit tests:
```bash
npm test
```

## Build and run with Docker
1) Build the image (from project root):
```bash
docker build -t dmsvahan-app .
```
2) Run the container (maps container 80 → host 8080):
```bash
docker run -d -p 8080:80 --name dmsvahan-container dmsvahan-app
```
3) Open the app: http://localhost:8080

### Container management
```bash
# Logs
docker logs -f dmsvahan-container
# Stop / start
docker stop dmsvahan-container && docker start dmsvahan-container
# Rebuild on changes
docker rm -f dmsvahan-container
docker build -t dmsvahan-app .
docker run -d -p 8080:80 --name dmsvahan-container dmsvahan-app
# Remove image
docker rmi dmsvahan-app
```

## Nginx (Docker runtime)
- The container uses `nginx.conf` to serve the app from `/usr/share/nginx/html`.
- SPA routing is enabled via `try_files $uri $uri/ /index.html;`.
- Security headers and CORS are included—adjust domains/policies in `nginx.conf` if needed.
- To serve under a subpath, build with a base href, e.g.:
```bash
npx ng build --base-href /paidnrui/
```
Then update nginx root/location and copy the built files accordingly.

## Troubleshooting
- `ng: command not found` → use `npx ng ...` (no global install required).
- Windows: avoid `npm run start` (bash syntax). Use `npx ng serve`.
- Port in use: change `--port` for dev or `-p HOST:80` in Docker.
- Behind a proxy: configure Docker Desktop proxy and npm proxy if pulls/installs fail.

# health nexus frontend
The frontend aspect of nexus health

## Prerequisites

- [Node.js](https://nodejs.org/) (which includes npm)

## Installation

### 1. Clone the Repository

```sh
git clone https://github.com/HealthNexus/health-nexus-frontend.git
cd yourproject
```
### 2. Install Dependencies

```sh
npm install
```

### 3. Install Quasar CLI
If you don't have the Quasar CLI installed globally, you can install it with:

```sh
npm install -g @quasar/cli
```

### 4. Run the Development Server

```sh
quasar dev
```

### 5. Open in Browser
Open your browser and navigate to http://localhost:8080 (or the URL provided in the terminal) to see the project.


## Troubleshooting
### Quasar CLI Not Found
If you see an error saying the quasar command is not found, ensure you've installed the Quasar CLI globally with:

```sh
npm install -g @quasar/cli
```

## Port Conflicts
If the default port (usually 8080) is in use, you can specify a different port by running:

```sh
quasar dev -p 9090
```

Replace 9090 with your desired port number.

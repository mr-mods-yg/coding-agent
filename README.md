# Coding Agent

An autonomous development terminal agent powered by AI that can execute commands and write files to complete user tasks.

## Features

- Execute terminal commands automatically
- Write and create files on disk
- Interactive command-line interface
- AI-powered task completion
- Cross-platform support (Windows, macOS, Linux)

## Prerequisites

- Node.js
- Groq API key

## Installation

1. Clone or download the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file with your Groq API key (use .env.example for sample):

```
GROQ_API_KEY=your_api_key_here
```

## Usage

### Development mode (with hot reload):

```bash
pnpm dev
```

### Build the project:

```bash
pnpm build
```

### Run the compiled version:

```bash
pnpm start
```

## Project Structure

```
src/
  index.ts    - Main entry point and agent configuration
  tools.ts    - Tool definitions for command execution and file writing
```

## Tools

### process_cmd

Executes terminal commands and returns the output.

### write_file

Writes content to a file on disk, creating directories as needed.

## Safety

The agent includes safety constraints to prevent destructive operations:

- No execution of destructive commands (e.g., rm -rf /)
- No modification of system-level configuration
- Operations are limited to the current working directory
- No privilege escalation

## Technologies

- TypeScript
- AI SDK
- Groq API
- Zod for schema validation
- Chalk for colored console output
# Creating Agent

An autonomous development terminal agent powered by AI that can execute commands, write files, and explore directories to complete user tasks.

<img width="1495" height="669" alt="image" src="https://github.com/user-attachments/assets/11d8e997-58de-46f2-87e7-dc03e41088c6" />

## Features

- Execute terminal commands automatically
- Write and create files on disk
- Read and explore directories recursively
- Interactive command-line interface with memory
- AI-powered task completion
- Cross-platform support (Windows, macOS, Linux)

## Prerequisites

- Node.js
- pnpm
- Groq API key

## Installation

1. Clone or download the repository
2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file with your Groq API key:

```bash
cp .env.example .env
```

4. Add your API key to the `.env` file:

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
  index.ts     - Main entry point and CLI interface
  agents.ts    - AI agent configuration with tools
  tools.ts     - Tool definitions (commands, files, directories)
  system.ts    - System prompt and environment config
```

## Tools

### process_cmd

Executes terminal commands and returns the output with timing information.

### write_file

Writes content to a file on disk, creating directories as needed.

### read_directory

Reads directory contents recursively, ignoring node_modules and hidden files.

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
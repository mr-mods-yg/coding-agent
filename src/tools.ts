import { tool } from 'ai';
import { z } from 'zod';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import chalk from 'chalk';
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

function formatCommand(cmd: string, maxLength = 200) {
    if (cmd.length <= maxLength) return cmd;
    return cmd.slice(0, maxLength) + "\n... [truncated]";
}

export const processCommandTool = tool({
    description: 'Runs the following command in the terminal',
    inputSchema: z.object({
        cmd: z.string().describe('The command to be executed in the terminal'),
    }),
    execute: async ({ cmd }) => {
        const start = Date.now();
        const time = new Date().toLocaleTimeString();

        console.log(chalk.yellow(`\n[${time}] [EXEC]`));
        console.log(chalk.gray(formatCommand(cmd)));

        try {
            const { stdout, stderr } = await execAsync(cmd);
            const duration = Date.now() - start;

            if (stderr) {
                console.log(chalk.red(`[ERROR] (${duration}ms)`));
                console.log(chalk.red(stderr.trim()));
                return { success: false, error: stderr.trim() };
            }

            console.log(chalk.green(`[EXEC COMPLETE] (${duration}ms)`));

            if (stdout?.trim()) {
                console.log(chalk.white(formatCommand(stdout.trim(), 500)));
            }

            return { success: true, output: stdout };

        } catch (error: any) {
            const duration = Date.now() - start;
            console.log(chalk.red(`[EXEC ERROR] (${duration}ms)`));
            console.log(chalk.red(error.message));
            return { success: false, error: error.message };
        }
    },
});


export const writeFileTool = tool({
    description: 'Write content to a file on disk',
    inputSchema: z.object({
        filePath: z.string().describe('Path of the file to create or overwrite'),
        content: z.string().describe('Full content of the file')
    }),
    execute: async ({ filePath, content }) => {
        const start = Date.now();
        const time = new Date().toLocaleTimeString();

        console.log(chalk.yellow(`\n[${time}] [WRITE] ${filePath}`));

        try {
            const resolvedPath = path.resolve(process.cwd(), filePath);

            await fs.promises.mkdir(path.dirname(resolvedPath), {
                recursive: true,
            });

            await fs.promises.writeFile(resolvedPath, content, "utf-8");

            const duration = Date.now() - start;
            console.log(chalk.green(`[WRITE COMPLETE] (${duration}ms)`));

            return {
                success: true,
                path: resolvedPath,
            };

        } catch (error: any) {
            const duration = Date.now() - start;
            console.log(chalk.red(`[WRITE ERROR] (${duration}ms)`));
            console.log(chalk.red(error.message));

            return { success: false, error: error.message };
        }
    },
});
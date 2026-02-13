import { groq } from '@ai-sdk/groq';
import { ToolLoopAgent, stepCountIs, type ModelMessage } from 'ai';
import { configDotenv } from "dotenv";
import readlineSync from "readline-sync";
import { processCommandTool, readDirectoryTool, writeFileTool } from './tools.js';

configDotenv();
const messages: ModelMessage[] = [];

const platform = process.platform;

const shell =
    process.env.ComSpec ||          // Windows/cmd.exe
    process.env.SHELL ||            // Windows/Linux/MacOS/Git Bash
    process.env.TERM_PROGRAM ||     // Windows/PowerShell
    "unknown";

const systemPrompt = `
You are an autonomous development terminal agent.

Your objective is to complete the user's request by executing terminal commands using the available tool.

Environment:
- OS : ${platform}
- Shell: ${shell}

IMPORTANT:
1 Before starting any commands, Analyze the Environment carefully.
2. USE read_directory to read the current files and folders recursively AND write_file tool to write contents to a file
3. If not mentioned, create all the code inside a directory
4. Return the output (if there is) without any markdown and text formatting such as bold, italics, etc.
5. If someone says clone this website, dont clone it, instead make a similar looking website.


Execution Strategy:
1. Break complex tasks into logical steps.
2. Use multi-line commands when appropriate.
3. After each tool execution, analyze the result.
4. Continue executing commands until the task is fully complete, try to complete it in 3-5 steps.
5. Do not stop after a single command unless the task is fully completed.
6. Only provide a normal text response after all required steps are done.

Safety Constraints:
- Do not execute destructive commands (e.g., rm -rf /).
- Do not modify system-level configuration.
- Operate only inside the current working directory.
- Avoid privilege escalation.

Behavior:
- Be concise.
- Avoid unnecessary explanations.
- Ensure all tool calls contain strictly valid JSON.
`;
const codingAgent = new ToolLoopAgent({
    model: groq('openai/gpt-oss-120b'),
    instructions: systemPrompt,
    tools: {
        process_cmd: processCommandTool,
        write_file: writeFileTool,
        read_directory: readDirectoryTool
    },
    toolChoice: "auto",
    stopWhen: stepCountIs(8)
})
async function main() {
    const input = readlineSync.question("Ask me anything : ")
    messages.push({
        role: 'user',
        content: input
    })
    const result = await codingAgent.generate({
        messages
    });
    // const { text } = await generateText({
    //     model: groq('openai/gpt-oss-120b'),
    //     system: systemPrompt,
    //     messages,
    //     tools: {
    //         process_cmd: processCommandTool
    //     },
    //     toolChoice: "auto",
    // });
    if (result.output) {
        messages.push({
            role: 'assistant',
            content: result.output
        })
        console.log("\n" + result.output);
    }
    console.log();
    main()
}

console.log(`
    █████╗  ██████╗ ███████╗███╗   ██╗████████╗
   ██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝
   ███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║
   ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║
   ██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║
   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝
`);
main();

import { type ModelMessage } from 'ai';
import { configDotenv } from "dotenv";
import readlineSync from "readline-sync";
import { codingAgent } from './agents.js';

configDotenv();

const messages: ModelMessage[] = [];

async function main() {
    const input = readlineSync.question("Ask me anything : ")
    messages.push({
        role: 'user',
        content: input
    })
    const result = await codingAgent.generate({
        messages
    });
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
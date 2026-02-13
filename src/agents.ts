import { processCommandTool, readDirectoryTool, writeFileTool } from './tools.js';
import { systemPrompt } from './system.js';
import { groq } from '@ai-sdk/groq';
import { ToolLoopAgent, stepCountIs } from 'ai';

export const codingAgent = new ToolLoopAgent({
    // [WORKS FINE] the best one to work with : openai/gpt-oss-120b
    // [WORKS GOOD ENOUGH] slighly higher rate limits : moonshotai/kimi-k2-instruct
    // [THIS IS NIGHTMARE] Does not work at all : llama-3.1-8b-instant
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
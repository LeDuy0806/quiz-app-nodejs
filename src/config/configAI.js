import { Configuration, OpenAIApi } from 'openai';

export const configAI = new Configuration({
    apiKey: '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'
});

export const ai = new OpenAIApi(configAI);

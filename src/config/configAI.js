import { Configuration, OpenAIApi } from 'openai';

export const configAI = new Configuration({
    apiKey: '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'
});

export const ai = new OpenAIApi(configAI);

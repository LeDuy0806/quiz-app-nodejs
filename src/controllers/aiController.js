import { ai } from '../config/configAI.js';

const chatGPT = async (req, res) => {
    const { prompt } = req.body;

    const completion = await ai.createCompletion({
        model: 'text-davinci-003',
        max_tokens: 400,
        temperature: 0,
        prompt: prompt
    });

    res.json(completion.data.choices[0].text);
};

export { chatGPT };

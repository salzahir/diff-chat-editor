
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

function getSystemPrompt(mode: 'rewrite' | 'question' | 'suggestion'): string {
    switch (mode) {
        case 'rewrite':
            return 'You are a helpful writing assistant that rewrites text for clarity and conciseness.';
        case 'question':
            return 'You are a helpful assistant that answers user questions directly.';
        case 'suggestion':
            return 'You are a helpful assistant that suggests improvements to text for clarity and conciseness.';
        default:
            throw new Error('Unknown mode');
    }
}

function getUserPrompt(mode: 'rewrite' | 'question' | 'suggestion', userInput: string): string {
    switch (mode) {
        case 'rewrite':
            return `Please rewrite the following text to improve clarity and flow:\n\n${userInput}`;
        case 'question':
            return userInput;
        case 'suggestion':
            return `Please suggest improvements to the following text to improve clarity and flow:\n\n${userInput}`;
        default:
            throw new Error('Unknown mode');
    }
}

async function fetchApi(userInput: string, mode: 'rewrite' | 'question' | 'suggestion'): Promise<any> {

    const systemPrompt = getSystemPrompt(mode);
    const userPrompt = getUserPrompt(mode, userInput);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            }, 
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt,
                    },
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
            }),
        })
        const data = await response.json();

        if (!response.ok || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
            const errorMessage = data.error?.message || 'Unknown API Error';
            console.error('API Error:', errorMessage);
            throw new Error(errorMessage);
        }

        console.log(data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching API:', error);
        return null;
    } 
}
export default fetchApi;
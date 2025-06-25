
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

async function fetchApi(userInput: string): Promise<any> {

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
                        role: 'user',
                        content: userInput,
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
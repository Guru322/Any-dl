import { fetch } from 'undici';

class AiSearch {
    constructor() {
        this.url = 'https://so.nuu.su/api/search';
        this.decoder = new TextDecoder();
        this.buffer = '';
        this.fullResponse = '';
        this.citations = [];
    }

    async ask(query) {
        const body = JSON.stringify({
            stream: true,
            model: 'deepseek-chat',
            mode: 'deep',
            language: 'all',
            categories: ['general'],
            engine: 'SEARXNG',
            locally: false,
            reload: false
        });

        const response = await fetch(`${this.url}?q=${encodeURIComponent(query)}`, {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:130.0) Gecko/20100101 Firefox/130.0',
                'Accept': 'text/event-stream',
                'Accept-Language': 'en-US,en;q=0.5',
                'Content-Type': 'application/json',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'Priority': 'u=0'
            },
            body
        });

        const reader = response.body.getReader();
        let done = false;

        while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            if (value) {
                this.buffer += this.decoder.decode(value, { stream: true });
                this.processBuffer();
            }
        }

        if (this.buffer) {
            this.processBuffer(true);
        }

        return this.formatResponse();
    }

    processBuffer(isFinal = false) {
        let lines = this.buffer.split('\n');
        this.buffer = lines.pop(); 

        for (const line of lines) {
            if (line.startsWith('data:')) {
                const jsonStr = line.substring(5).trim();
                try {
                    const jsonData = JSON.parse(jsonStr);
                    if (jsonData.data) {
                        const data = JSON.parse(jsonData.data);
                        const answer = data.answer || '';
                        this.fullResponse += answer;

                        if (data.context) {
                            this.citations.push({
                                id: data.context.id,
                                name: data.context.name,
                                url: data.context.url,
                                snippet: data.context.snippet,
                                engine: data.context.engine
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        }

        if (isFinal && this.buffer) {
            try {
                const jsonData = JSON.parse(this.buffer.substring(5).trim());
                if (jsonData.data) {
                    const data = JSON.parse(jsonData.data);
                    const answer = data.answer || '';
                    this.fullResponse += answer;

                    if (data.context) {
                        this.citations.push({
                            id: data.context.id,
                            name: data.context.name,
                            url: data.context.url,
                            snippet: data.context.snippet,
                            engine: data.context.engine
                        });
                    }
                }
            } catch (error) {
                console.error('Error parsing remaining JSON:', error);
            }
        }
    }

    formatResponse() {
        const topCitations = this.citations.slice(0, 3);

        const citationText = topCitations.map(citation => `
Source:
ID: ${citation.id}
Name: ${citation.name}
URL: ${citation.url}
Snippet: ${citation.snippet}
Engine: ${citation.engine}
`).join('\n');

        return `${this.fullResponse}\n\nTop Sources:\n${citationText}`;
    }
}

export default AiSearch;
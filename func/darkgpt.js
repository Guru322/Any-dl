import fetch from 'node-fetch';
import randomUseragent from 'random-useragent';

class AIUncensored {
  constructor() {
    this.version = 'v1.3';
    this.url = "https://darkai.foundation/chat";
    this.headers = this._getHeaders();
    this.model = "llama-3-70b";
  }

  _getHeaders() {
    return {
      "User-Agent": randomUseragent.getRandom(),
      "Accept": "text/event-stream",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Referer": "https://www.aiuncensored.info/",
      "Content-Type": "application/json",
      "Origin": "https://www.aiuncensored.info",
      "Connection": "keep-alive",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "DNT": "1",
      "Sec-GPC": "1",
      "Priority": "u=1",
      "TE": "trailers"
    };
  }

  async Chat(query, history = []) {
    const json = { query, history, model: this.model };
    let fullMessage = '';

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(json),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const stream = response.body;
      const decoder = new TextDecoder('utf-8');
      
      return new Promise((resolve, reject) => {
        let dataBuffer = '';

        stream.on('data', (chunk) => {
          dataBuffer += decoder.decode(chunk, { stream: true });
          const lines = dataBuffer.split('\n').filter(Boolean);

          for (let line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const eventData = JSON.parse(line.replace('data: ', ''));
                const { event, data } = eventData;

                if (event === 'text-chunk') {
                  fullMessage += data.text;
                } else if (event === 'final-response') {
                  resolve(data.message);
                }
              } catch (error) {
                reject(new Error('Error parsing JSON: ' + error.message));
              }
            }
          }

          dataBuffer = dataBuffer.substring(dataBuffer.lastIndexOf('\n') + 1);
        });

        stream.on('end', () => {
          if (fullMessage) {
            resolve(fullMessage);
          } else {
            reject(new Error('Stream ended unexpectedly without final response'));
          }
        });

        stream.on('error', (error) => {
          reject(new Error('Stream error: ' + error.message));
        });
      });

    } catch (error) {
      console.error('Error:', error.message);
      throw error;
    }
  }
}

export default AIUncensored;


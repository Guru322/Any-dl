import yts from 'yt-search';

async function ytsearch(query) {
    try {
        const result = await yts(query);

        const formattedResults = result.all.map(item => ({
            type: item.type, 
            title: item.title,
            description: item.description || '', 
            url: item.url,
            duration: item.timestamp, 
            views: item.views,
            author: item.author.name
        }));

        return {
            creator: 'Guru Sensei',
            results: formattedResults
        };
    } catch (error) {
        console.error('Error searching YouTube:', error);
        throw error;  
    }
}

export default ytsearch;


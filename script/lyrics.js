module.exports.config = {
  name: 'lyrics',
  version: '1.2.7',
  role: 0,
  hasPrefix: true,
  aliases: ['ly'],
  credits: 'Aze Kagenou',
  description: 'Get lyrics of a song',
  usage: '[song]',
  cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
  const song = encodeURIComponent(args.join(' '));
  if (!song) {
    return api.sendMessage('Please enter title of a song.', event.threadID, event.messageID);
  } else {
    try {
      const response = await axios.get(`https://joshweb.click/api/findsong?lyrics=${song}`);
      const { status, author, result } = response.data;

      if (status === 200) {
        const { title, album, thumb, lyrics } = result;
        const artist = title.split(' - ')[0];
        const newTitle = title.replace(/^(.*) - (.*)$/, '$2 by $1');

        api.sendMessage(`Title: ${newTitle}\n\nBy: ${artist}\n\nAlbum: ${album}\n\nThumbnail: ${thumb}\n\nLyrics: ${lyrics}`, event.messageID);
      } else {
        console.error('Lyrics API error:', response.data);
        api.sendMessage('Failed to fetch lyrics.', event.threadID, event.messageID);
      }

    } catch (error) {
      console.error('Lyrics API error:', error);
      api.sendMessage('Failed to fetch lyrics.', event.threadID, event.messageID);
    }
  }
};
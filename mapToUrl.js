filename = '2018-19'
filename1 = '2018-2019'
const data = require('./' + filename + '.json');
const fs = require('fs');
function generateUrls(data) {
    return data.map(item => {
        const baseUrl = 'https://www.hltv.org/stats/matches/performance/mapstatsid';
        const team1 = item.name1.toLowerCase().replace(' ', '-');
        const team2 = item.name2.toLowerCase().replace(' ', '-');
        return `${baseUrl}/${item.mapStatsid}/${team1}-vs-${team2}?matchType=BigEvents`;
    });
}

const urls = generateUrls(data);
fs.writeFileSync(filename1 + '_urls.json', JSON.stringify(urls, null, 2));
console.log(urls);
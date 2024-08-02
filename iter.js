const axios = require('axios');
const fs = require('fs').promises;
const cheerio = require('cheerio');

// Custom axios instance for FlareSolverr
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8191', // FlareSolverr endpoint
});

async function getNonEmptyHtml(data) {
    const maxRetries = 10;
    let retryCount = 0;
    let generatedObject = {};

    while (Object.keys(generatedObject).length === 0 && retryCount < maxRetries) {
        // wait 1.5 or 2.5 seconds
        const delay = 1500 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        generatedObject = await generateHtml(data);
        retryCount++;
    }

    if (Object.keys(generatedObject).length === 0) {
        throw new Error('Failed to get non-empty HTML after max retries.');
    }

    return generatedObject;
}

async function loadPageThroughFlareSolverr(url) {
    try {
        const response = await axiosInstance.post('/v1', {
            cmd: 'request.get',
            url: url
        });
        if (response.data && response.data.solution && response.data.solution.response) {
            return response.data.solution.response;
        } else {
            throw new Error('FlareSolverr was unable to fetch the content.');
        }
    } catch (error) {
        console.error('Error with FlareSolverr:', error);
        throw error;
    }
}


async function generateHtml(url) {
    console.log('url: ', url)
    const content = await loadPageThroughFlareSolverr(url);
    const $ = cheerio.load(content);
    let extractedPlayers = [];

    $('.highlighted-player text').each((index, element) => {
        extractedPlayers.push($(element).text());
    });

    // translate
    const data = extractedPlayers;
    const labels = data.slice(0, 6);
    const cleanedData = data.slice(6).filter(item => !labels.includes(item) && item !== "Avg");
    const result = [];
    for (let i = 0; i < cleanedData.length; i += 6) {
       const entry = {};
       for (let j = 0; j < 6; j++) {
            entry[labels[j]] = cleanedData[i + j];
        }
        result.push(entry);
    }
    let hrefValues = [];
    $('.highlighted-player a').each((index, element) => {
        hrefValues.push($(element).attr('href'));
    });
    console.log(hrefValues); 
    Object.keys(result).forEach(key => {
        result[key].name = hrefValues[key];
        result[key] = Object.entries(result[key])
          .sort(([aKey], [bKey]) => (aKey === 'name' ? -1 : bKey === 'name' ? 1 : 0))
          .reduce((acc, [subKey, value]) => {
            acc[subKey] = value;
            return acc;
          }, {});
      });
    console.log(result)
    return result;
}

function delay(base, variance) {
    const time = base + (Math.random() - 0.5) * 2 * variance; // 上下浮动
    return new Promise(resolve => setTimeout(resolve, time * 1000)); // 转换为毫秒
}

async function main() {
    try {
        // read data from json
        const urlsData = JSON.parse(await fs.readFile('2018-2019_urls.json', 'utf8'));
        const keysData = JSON.parse(await fs.readFile('2018-19.json', 'utf8'));

        // final result
        const finalResult = {};

        // go through all urls
        for (const key in urlsData) {
            if (keysData[key]) {
                await delay(2, 0.5);  // 2秒上下浮动0.5秒的延迟
                const generatedObject = await getNonEmptyHtml(urlsData[key]);
                finalResult[key] = { ...generatedObject, ...keysData[key] }; // 合并对象
            }
        }

        // write results
        await fs.writeFile('2021-2022result.json', JSON.stringify(finalResult, null, 2), 'utf8');
        console.log('Data has been written to 2022-2023result.json');

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();


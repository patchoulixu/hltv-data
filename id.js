const {HLTV} = require('hltv')
const fs = require('fs'); // 导入 Node.js 文件系统模块

// 文件路径和文件名
const filePath = 'myFile.json';

HLTV.getMatchesStats({startDate: '2021-10-01', endDate: '2022-09-30', delayBetweenPageRequests: 2000, matchType: 'BigEvents'	}).then(res =>{
	console.log("Promise resolved with result:", Object.keys(res[0]));
  const jsonData = JSON.stringify(res);
  const idArray = [];
  for (let i = 0; i < Object.keys(res).length; i++) {
    const key = i.toString(); // 将数字键转换为字符串
    const obj = res[key];
    if (obj && obj.mapStatsId) {
      idArray.push(
        {
          'mapStatsid': obj.mapStatsId,
          'name1': obj.team1.name,
          'name2': obj.team2.name,
          'result':obj.result
        }
          );
    }
  }
  
  fs.writeFileSync('2021-22.json', JSON.stringify(idArray, null, 2));
  
  console.log('mapStatsId 已写入 idArray.json 文件');
})

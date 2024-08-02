const fs = require('fs');

// 读取JSON文件
let data_2021_22 = JSON.parse(fs.readFileSync('2021-22.json', 'utf8'));
let data_2021_2022_result = JSON.parse(fs.readFileSync('2021-2022result.json', 'utf8'));

// 获取对象的键的数量
let length = Object.keys(data_2021_2022_result).length;

// 按顺序遍历并替换
for (let i = 0; i < length; i++) {
  // 备份0到9的键值
  let backup = {};
  for (let j = 0; j <= 9; j++) {
    backup[j] = data_2021_2022_result[i][j];
  }

  // 替换整个元素
  data_2021_2022_result[i] = data_2021_22[i];

  // 恢复0到9的键值
  for (let j = 0; j <= 9; j++) {
    data_2021_2022_result[i][j] = backup[j];
  }
}

// 保存更新后的JSON文件
fs.writeFileSync('2021-2022result.json', JSON.stringify(data_2021_2022_result, null, 2));


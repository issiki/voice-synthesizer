// index.js - 使用腾讯语音合成接口，生成一段一段的.wav语音
'use strict';
// internal
const path = require('path');
const fs = require('fs');

// 第三方模块
// - https://www.npmjs.com/package/args
//   - 接受一个参数，从文本文件中读取一行一行的文本，没一行文本，生成一个.wav。
const Args = require('args');
// - https://github.com/TencentCloud/tencentcloud-sdk-nodejs
//   - 默认接口请求频率限制：100次/秒。
const tencentcloud = require("tencentcloud-sdk-nodejs");
// - https://www.npmjs.com/package/uuid
const uuidv5 = require('uuid/v5');

// 自己的模块
const leftpad = require('./src/left-pad');
const _secret = require('./_secret/secret-key');

/*
_secret/secret-key.js - 密钥文件
- 查看密钥：https://console.cloud.tencent.com/cam/capi
module.exports={
  SecretId: '', // 密钥的SecretId
  SecretKey: '', // 密钥的SecretKey
}
*/

if (!_secret.SecretId || !_secret.SecretKey) {
  throw new Error('请手动填写 _secret/secret-key.js 文件后再运行。密钥可在此查看：https://console.cloud.tencent.com/cam/capi');
}

const args = Args.option('text', '转换文本')
  .option('input', '从文件输入。默认是`input.txt`', 'input.txt')
  .option('output', '输出到哪个目录。默认是`voice`', 'voice')
  .option('start', '序号从几开始。默认是0', 1)
  .option('overwrite', '是否覆盖已有的同名文件。默认是false', false)
  // .option('region', '指定接口服务器的地区')
  .parse(process.argv);

console.log(args);

const text = args.text + '';
const input = args.input + '';
const output = args.output + '';
const start = Number.parseInt(args.start);
const overwrite = args.overwrite;

if (!text && !input) {
  console.log('没有文本或输入文件', text);
  process.exit();
}

if (input) {
  // 代码生成
  // - https://console.cloud.tencent.com/api/explorer?Product=aai&Version=2018-05-22&Action=TextToVoice&SignVersion=

  const AaiClient = tencentcloud.aai.v20180522.Client;
  const models = tencentcloud.aai.v20180522.Models;

  const Credential = tencentcloud.common.Credential;
  const ClientProfile = tencentcloud.common.ClientProfile;
  const HttpProfile = tencentcloud.common.HttpProfile;

  let cred = new Credential(_secret.SecretId, _secret.SecretKey);
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "aai.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  // Region = 华南地区（广州）
  const _region = {
    beijing: "ap-beijing",
    chengdu: "ap-chengdu",
    chongqing: "ap-chongqing",
    guangzhou: "ap-guangzhou",
    guangzhou_open: 'ap-guangzhou-open',
    hongkong: 'ap-hongkong',
    seoul: 'ap-seoul',
    shanghai: 'ap-shanghai',
    singapore: 'ap-singapore',
    frankfurt: 'eu-frankfurt',
    siliconvalley: 'na-siliconvalley',
    toronto: 'na-toronto',
    mumbai: 'ap-mumbai',
    ashburn: 'na-ashburn',
    bangkok: 'ap-bangkok',
    moscow: 'eu-moscow',
    tokyo: 'ap-tokyo',
  }
  let client = new AaiClient(cred, _region.guangzhou, clientProfile);

  // 创建一个目录
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }

  const content = fs.readFileSync(input, {
    encoding: 'utf-8',
  });
  const arr = content.split('\n');
  const length = `${arr.length}`.length;
  arr.forEach((text, i) => {
    console.log(leftpad(`${i}`, length, '0'), text);
    // 统计输入文件的行数，根据“行数+output参数+前14个字生成文件名+.wav”
    const slice = text.slice(0, 14);
    const filename = `${leftpad(`${i + start}`, length, '0')}-${output}-${slice}.wav`;

    const fullpath=path.join(__dirname, output, filename);

    // 是否覆盖
    if (!overwrite && fs.existsSync(fullpath)) {
      console.log(`SKIP: ${filename}`);
    } else {
      let req = new models.TextToVoiceRequest();
      let params = {
        // required
        // - 合成语音的源文本
        Text: text,
        // - 一次请求对应一个SessionId，会原样返回，建议传入类似于uuid的字符串防止重复
        SessionId: uuidv5(text, '39393939-3939-3939-3939-393939393939'),
        // - 模型类型，1-默认模型
        ModelType: 1,
        // end required

        // - 音量大小，范围：[0，10]，分别对应10个等级的音量，默认为0
        Volume: 0,
        // - 语速，范围：[-2，2]，分别对应不同语速：0.6倍，0.8倍，1.0倍，1.2倍，1.5倍，默认为0
        Speed: 0,
        // - 项目id，用户自定义，默认为0
        ProjectId: 0,
        // - 音色
        //  - 0-女声1，亲和风格(默认)
        //  - 1-男声1，成熟风格
        //  - 2-男声2，成熟风格
        VoiceType: 0,
        // - 主语言类型
        //  - 1-中文，最大100个汉字（标点符号算一个汉子）
        //  - 2-英文，最大支持400个字母（标点符号算一个字母）
        PrimaryLanguage: 1,
        // - 音频采样率，16000：16k，8000：8k，默认16k
        SampleRate: 16000,
      };

      req.from_json_string(JSON.stringify(params));

      client.TextToVoice(req, function (errMsg, response) {

        if (errMsg) {
          console.log(errMsg);
          return;
        }

        // console.log(response.to_json_string());
        if (response.Error) {
          console.error('ERROR:', response.Error.Code, response.Error.Message);
        } else {
          const wav = Buffer.from(response.Audio, 'base64');
          fs.writeFileSync(fullpath, wav);
          console.log(`WRITE: ${filename}`);
        }
      });
    }
  });
}

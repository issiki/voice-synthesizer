'use strict';
// https://github.com/TencentCloud/tencentcloud-sdk-nodejs
// - 默认接口请求频率限制：100次/秒。
const tencentcloud = require("tencentcloud-sdk-nodejs");
// https://www.npmjs.com/package/uuid
// const uuidv5 = require('uuid/v5');
const uuidv4=require('uuid/v4');

const _secret = require('../_secret/secret-key');

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
const _region={
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

let req = new models.TextToVoiceRequest();

// let params = '{"Text":"text","SessionId":"sessionid","Volume":"10","ModelType":1}'
let params = {
  // required
  // - 合成语音的源文本
  Text: text,
  // - 一次请求对应一个SessionId，会原样返回，建议传入类似于uuid的字符串防止重复
  SessionId: uuidv4(),  
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
    const wav=Buffer.from(response.Audio,'base64');
    fs.writeFileSync('voice.wav', wav);
  }
});
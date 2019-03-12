# voice-synthesizer
powered by tencent TTS. 使用腾讯语音合成接口的声音生成程序，用于为不想自己配音的视频生成声音片段？

## Usage
首先，需要开通腾讯云的语音合成接口，[在此页面申请开通](https://cloud.tencent.com/product/tts)。
然后
```bash
$ git clone https://github.com/issiki/voice-synthesizer.git
$ cd voice-synthesizer
# 创建一个_secret目录，并在该目录中创建一个secret-key.js文件
# - 按“FAQ”段落所写，填好secret-key.js文件。
$ node index.js
```
`_secret/secret-key.js`的内容，请参照[FAQ]创建。

## Issues
有任何关于这个仓库代码的问题，[欢迎留言](https://github.com/issiki/voice-synthesizer/issues)。

## FAQ
### Error: Cannot find module './_secret/secret-key'
必需手动创建`_secret/secret-key.js`文件，并填写缺失的字段：
```javascript
// secret-key.js - 密钥
// - 密钥在此：https://console.cloud.tencent.com/cam/capi
module.exports={
  SecretId: '',
  SecretKey: '',
}
```

## License
MIT &copy; [Futaba Isshiki](https://futaba.love "一色双葉的笔记")
# Azure Communication Services 

## 本示例实现的功能
1.	基于ACS实现在线音频及视频会议的功能。
2.	基于ASR实现语音转写，实时字幕的功能。

## 技术框架
1.	通过Azure Communication Services SDK for JavaScript实现通信功能。
2.	通过Azure Speech Service SDK for JavaScript实现语音转写功能。
3.	通过React SDK + TypeScript实现前端UI。

## 开发步骤：
1.	基于ACS官方示例程序（Calling-Hero），实现在线音频及视频会议的功能。
2.	客户端捕获麦克风事件，监听麦克风音频，调用ASR进行实时语音转文字。
3.	客户端调用ASR进行实时语音翻译。
4.	客户端会议窗口实时显示文本字幕。



## 官方Calling Sample

### 官方示例
https://docs.microsoft.com/zh-cn/azure/communication-services/samples/calling-hero-sample?pivots=platform-web


https://github.com/Azure-Samples/communication-services-web-calling-hero


### 接入 Azure Speech Service

https://docs.microsoft.com/zh-cn/javascript/api/overview/azure/speech-service?view=azure-node-latest


### 安装命令
npm install microsoft-cognitiveservices-speech-sdk

npm install @microsoft/signalr


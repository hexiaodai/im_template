## 运行环境
- nodejs
- npm

## 前端框架
- vue.js（vue2.0）

## 安装
- npm install

## 运行
- npm run serve
- http://127.0.0.1:8080

## alioss对象存储
- 路径：/utils/ali-oss.js

```JavaScript
/**
 *  [accessKeyId] {String}：通过阿里云控制台创建的AccessKey。
 *  [accessKeySecret] {String}：通过阿里云控制台创建的AccessSecret。
 *  [bucket] {String}：通过控制台或PutBucket创建的bucket。
 *  [region] {String}：bucket所在的区域， 默认oss-cn-hangzhou。
 */
let client = new OSS({
    region: 'oss-cn-shenzhen',
    secure: true,  // secure: 配合region使用，如果指定了secure为true，则使用HTTPS访问  
    accessKeyId: 'LTAI4GJTPa94GZkk84byuGWD', // 替换自己的accessKeyId
    accessKeySecret: 'PRL01ZfvvQNkxqyolu7lbRHrfAD8TQ', // 替换自己的accessKeySecret
    bucket: 'im-java'
})
```
## 项目地址
- 前端：https://gitee.com/hexiaodai/im_template
- 后端：https://gitee.com/hexiaodai/im_service

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

## 功能截图

- 登录、注册
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185201_f0cac64f_5174336.png "屏幕截图.png")

- 添加好友、群
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185238_68f96d90_5174336.png "屏幕截图.png")

- 修改个人信息
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185255_8460cc4c_5174336.png "屏幕截图.png")

- 心跳检测
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185340_c10b6755_5174336.png "屏幕截图.png")

- 单聊
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185352_ab14c0b3_5174336.png "屏幕截图.png")

- 群聊
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185413_5f3c684e_5174336.png "屏幕截图.png")

- 发送图片、视频、表情包
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185432_c6cf5c60_5174336.png "屏幕截图.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185443_6ad55648_5174336.png "屏幕截图.png")


- 好友上线、下线通知
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185507_9d491287_5174336.png "屏幕截图.png")

- 添加好友、群通知
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185518_eafbddb4_5174336.png "屏幕截图.png")

- 离线消息
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185530_0692f227_5174336.png "屏幕截图.png")

- 消息漫游
![输入图片说明](https://images.gitee.com/uploads/images/2021/0421/185549_ea1b7d7a_5174336.png "屏幕截图.png")

// 引入ali-oss
import OSS from 'ali-oss'


// 图片上传
export const uploadImg = {
    // 图片类型
    types: ['png', 'jpg', 'jpeg', 'gif'],
    // 图片大小
    maxSize: 10,
    // alioss路径
    ossPath: 'images'
}

// 视频上传
export const uploadVideo = {
    // 视频类型
    types: ['mp4'],
    // 视频大小
    maxSize: 100,
    // alioss路径
    ossPath: 'videos'
}

// 音频上传
export const uploadAudio = {
    // 音频类型
    types: ['mp3'],
    // 音频大小
    maxSize: 50,
    // alioss路径
    ossPath: 'audios'
}

/**
 *  [accessKeyId] {String}：通过阿里云控制台创建的AccessKey。
 *  [accessKeySecret] {String}：通过阿里云控制台创建的AccessSecret。
 *  [bucket] {String}：通过控制台或PutBucket创建的bucket。
 *  [region] {String}：bucket所在的区域， 默认oss-cn-hangzhou。
 */
let client = new OSS({
    region: 'oss-cn-shenzhen',
    secure: true,  // secure: 配合region使用，如果指定了secure为true，则使用HTTPS访问  
    accessKeyId: 'LTAI4GJTPa94GZkk84byuGWD',
    accessKeySecret: 'PRL01ZfvvQNkxqyolu7lbRHrfAD8TQ',
    bucket: 'im-java'
})

/** 
*  上传文件，大小不能超过5GB 
* @param {string} ObjName OSS的储存路径和文件名字 
* @param {string} fileUrl 本地文件 
* @retruns Promise 
*/
export const put = async (ObjName, fileUrl) => {
    try {
        let result = await client.put(`${ObjName}`, fileUrl)
        // ObjName为文件名字,可以只写名字，就直接储存在 bucket 的根路径，如需放在文件夹下面直接在文件名前面加上文件夹名称    
        return result
    } catch (err) {
        return Promise.reject(err)
    }
}

/* 
上传成功之后，转换真实的地址
后台只需要传入文件名，回显时候同样也只是返回文件名，说做数据迁移管理时候不麻烦，
反正意思就是上传出现问题都和他们无关，so，没办法，所以需要自己根据返回文件名进行转码，
生成所需要的url
*/
export const signatureUrl = async (ObjName) => {
    try {
        let result = await client.signatureUrl(`${ObjName}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

/** 
* 生成随机文件名称 
* 规则八位随机字符，加下划线连接时间戳 
*/
export const getFileNameUUID = () => {
    function rx() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return `${+new Date()}_${rx()}${rx()}`
}

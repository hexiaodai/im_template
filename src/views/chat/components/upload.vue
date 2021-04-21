<template>
  <el-upload
    ref="upload"
    action="String"
    :show-file-list="false"
    :limit="1"
    :multiple="false"
    :file-list="fileList"
    :http-request="onUploadFile"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    :before-remove="beforeRemove"
    :before-upload="beforeUpload"
    :on-exceed="handleExceed"
  >
    <i class="icon" :class="icon" />
  </el-upload>
</template>

<script>
import { validSuffix } from '@/utils/validate'
import { getFileSuffix } from '@/utils/func'
import { put, getFileNameUUID, uploadVideo, uploadImg } from '@/utils/ali-oss'

export default {
  model: {
    prop: 'url',
    event: 'input',
  },
  data() {
    return {
      fileList: [],
      uploadObj: {},
    }
  },
  props: {
    // input value
    url: String,
    icon: {
      type: String,
      default: 'el-icon-picture-outline',
    },
    uploadType: {
      type: String,
      default: 'image',
    },
  },
  methods: {
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.$emit('on-remove', file, fileList)
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      this.$emit('on-preview', file)
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(`每次只能上传1个文件`)
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除
    beforeRemove(file, fileList) {
      // return this.$confirm(`确定移除 ${file.name}？`)
      return true
    },
    // 文件上传成功时的钩子
    handleSuccess(response, file, fileList) {
      this.fileList = fileList
      this.$emit('on-success', file, fileList)
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      // 限制上传类型
      if (!validSuffix(file.name, this.uploadObj.types)) {
        this.$notify.error({
          title: '错误',
          message: `上传文件类型只能是 ${this.uploadObj.types} 格式!`,
        })
        return false // 停止上传文件
      }
      //限制的上限为20M
      const isFileMaxSize = file.size / 1024 / 1024 < this.uploadObj.maxSize
      if (!isFileMaxSize) {
        this.$notify.error({
          title: '错误',
          message: `上传文件大小不能超过 ${this.uploadObj.maxSize} Mb`,
        })
        return false // 停止上传文件
      }
      return true // 允许上传文件
    },

    onUploadFile(req) {
      const loading = this.$loading({
        lock: true,
        text: '文件上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })

      let file = req.file

      // 获取文件的后缀名
      let fileSuffix = getFileSuffix(file.name, true)
      // let reg = /\.[^\.]+$/
      // let matches = reg.exec(file.name)
      // let fileSuffix = matches[0].toLowerCase()
      // 生成的文件名，保留文件后缀名，进行拼接
      let objName = getFileNameUUID() + fileSuffix
      // 调用 ali-oss 中的方法,flieName是存放的文件夹名称，可自己定义
      put(`${this.uploadObj.ossPath}/${objName}`, file)
        .then(({ name, res, url }) => {
          this.$notify.success({
            title: '成功',
            message: '文件上传成功',
          })
          this.$emit('input', url)
          console.log(url)
        })
        .catch((err) => {
          this.$notify.error({
            title: '错误',
            message: `文件上传失败（${err}）`,
          })
        })
        .finally(() => {
          loading.close()
          // 清空已上传的文件列表（该方法不支持在 before-upload 中调用）
          this.$refs.upload.clearFiles()
        })
    },
  },
  created() {
    switch (this.uploadType) {
      case 'image':
        this.uploadObj = uploadImg
        break
      case 'video':
        this.uploadObj = uploadVideo
        break
      default:
        this.$notify.error({
          title: '错误',
          message: '无法识别的上传类型',
        })
        break
    }
  },
}
</script>

<style>
</style>
<template>
  <div class="user-dialog">
    <el-dialog
      title="用户设置"
      :visible.sync="iopen"
      width="500px"
      @close="handleClose"
    >
      <el-form
        :model="editUser"
        status-icon
        :rules="rules"
        ref="userForm"
        label-width="60px"
        class="user-form"
      >
        <el-form-item label="Email">
          <p>{{ editUser.email }}</p>
        </el-form-item>
        <el-form-item class="avatar-center" label="头像" prop="avatar">
          <el-avatar shape="square" :size="50" :src="editUser.avatar" />
          <upload v-model="editUser.avatar" icon="el-icon-edit" />
        </el-form-item>
        <el-form-item label="名称" prop="uname">
          <el-input type="text" v-model="editUser.uname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="success"
            icon="el-icon-check"
            @click="submitForm('userForm')"
            circle
            plain
          />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validURL } from '@/utils/validate'
import upload from './upload'
import { deepClone } from '@/utils/func'

export default {
  name: 'userDialog',
  components: { upload },
  data() {
    return {
      iopen: false,
      editUser: {},
      rules: {
        avatar: [{ required: true, message: '头像不能为空', trigger: 'blur' }],
        uname: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    iopen(newVal) {
      this.$emit('changeDialog', newVal)
    },
    open(newVal) {
      this.iopen = newVal
    },
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    async submitForm() {
      const { code, data, msg } = await this.$http.editUser({
        uname: this.editUser.uname,
        avatar: this.editUser.avatar,
      })
      if (code == 0) {
        this.$notify.success({
          title: '成功',
          message: '修改用户信息成功',
        })
        this.iopen = false
        this.saveUser(data)
      }
    },
    saveUser(user) {
      for (let key in user) {
        this.$store.dispatch('user/setUser', {
          key: key,
          value: user[key],
        })
      }
    },
  },
  created() {
    this.editUser = deepClone(this.user)
  },
}
</script>

<style lang="scss" scoped>
.user-form {
  .el-avatar {
    display: block;
  }
  /deep/ .avatar-center {
    display: flex;
    align-items: center;
    .el-form-item__content {
      margin-left: 0 !important;
      display: flex;
      align-items: center;
      .icon {
        padding-left: 20px;
        font-size: 20px;
        cursor: pointer;
      }
      .icon:hover {
        color: #409eff;
      }
    }
  }
}
</style>
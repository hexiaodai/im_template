<template>
  <el-dialog
    title="添加好友"
    :visible.sync="fopen"
    width="600px"
    @close="handleClose"
  >
    <el-input :placeholder="searchPlac" v-model="info" class="search">
      <el-select
        style="width: 80px"
        v-model="cate"
        @change="handleSearch"
        slot="prepend"
        placeholder="请选择"
      >
        <el-option
          v-for="item of cates"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-button @click="handleSearch" slot="append" icon="el-icon-search" />
    </el-input>
    <el-table :data="list">
      <el-table-column label="头像" width="150">
        <template slot-scope="{ row }">
          <el-image
            v-if="row.avatar || row.icon"
            style="width: 40px; height: 40px; border-radius: 2px"
            :src="row.avatar || row.icon"
            fit="cover"
          />
        </template>
      </el-table-column>
      <el-table-column
        :property="cate == CATE.USER ? 'email' : 'id'"
        :label="cate == CATE.USER ? 'Email' : '群ID'"
        width="200"
      />
      <el-table-column
        :property="cate == CATE.USER ? 'uname' : 'name'"
        label="名称"
      />

      <el-table-column
        label="操作"
        align="center"
        width="100"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-plus"
            size="small"
            plain
            circle
            @click="handleAddFriend(row, $index)"
          />
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { CATE } from '../options'
import { mapGetters } from 'vuex'

export default {
  name: 'addfriend',
  data() {
    return {
      CATE,
      fopen: false,
      cate: CATE.USER,
      info: null,
      list: [],
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
    cates() {
      return [
        { key: this.CATE.USER, value: '用户' },
        { key: this.CATE.COMUNITY, value: '群' },
      ]
    },
    searchPlac() {
      return this.cate == this.CATE.USER
        ? '请输入用户邮箱或用户名称'
        : '请输入群号码'
    },
  },
  watch: {
    open(newVal) {
      this.fopen = newVal
    },
  },
  methods: {
    async handleSearch() {
      this.list = []
      if (!this.info) {
        this.$notify.warning({
          title: '警告',
          message: `搜索框为空`,
        })
        return
      }
      switch (this.cate) {
        case this.CATE.USER: {
          const { data } = await this.$http.searchFriend({ info: this.info })
          this.list = data
          break
        }
        case this.CATE.COMUNITY: {
          const { data } = await this.$http.searchCommunity({ info: this.info })
          this.list = data
          break
        }
        default: {
          this.$notify.error({
            title: '搜索好友失败',
            message: `意料之外的好友类型`,
          })
          break
        }
      }
      if (this.list.length == 0) {
        this.$notify.warning({
          title: '警告',
          message: `无记录`,
        })
      }
    },
    handleClose() {
      this.$emit('close')
    },
    async handleAddFriend(obj) {
      const { code, data } = await this.$http.addFriend({
        ownerEmail: this.user.email,
        dstObj: this.cate == this.CATE.USER ? obj.email : obj.id,
        cate: this.cate,
      })
      if (code == 0) {
        this.$router.go(0)
        // this.$router.push('/empty')
        this.$notify.success({
          title: '成功',
          message: data,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 0;
}
.search {
  padding: 10px 0;
}
</style>
<template>
  <div class="component">
    <div class="input-data">
      <input :type="type" :value="value" @input="onInput" required />
      <div class="underline"></div>
      <label>{{ label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myInput',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: [String, Number],
    label: String,
    name: String,
    type: {
      type: String,
      default: 'text',
    },
  },
  methods: {
    onInput($event) {
      // 通过input标签的原生事件input将值emit出去，以达到值得改变实现双向绑定
      this.$emit('input', $event.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.component {
  .input-data {
    height: 40px;
    width: 100%;
    position: relative;
  }

  .input-data input {
    height: 100%;
    width: 100%;
    border: none;
    font-size: 17px;
    outline: none;
    border-bottom: 1px solid silver;
  }

  .input-data input:focus ~ label,
  .input-data input:valid ~ label {
    transform: translateY(-20px);
    font-size: 15px;
    color: rgb(181, 154, 254);
  }

  .input-data label {
    position: absolute;
    bottom: 10px;
    left: 0;
    color: grey;
    pointer-event: none;
    transition: all 0.3s ease;
  }

  .input-data .underline {
    position: absolute;
    bottom: 0px;
    height: 2px;
    width: 100%;
  }

  .input-data .underline:before {
    position: absolute;
    content: '';
    height: 100%;
    width: 100%;
    background: rgb(181, 154, 254);
    // background: #4158d0;
    transform: scaleX(0);
    transition: transform 0.5s ease;
  }

  .input-data input:focus ~ .underline:before,
  .input-data input:valid ~ .underline:before {
    transform: scaleX(1);
  }
}
</style>
<template>
  <div id="app">
    <!-- 简单 -->
    <solt-upload action="/upload" style="display: flex;">
      <template slot-scope="scope">
        <button @click="scope.selectFile()">upload</button>
        <input type="text" :value="scope.file.name || ''" style="flex: 1;" />
      </template>
    </solt-upload>
    <!-- 完整 -->
    <solt-upload
      action="/upload"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-error="onError"
      :on-change="onChange"
      :data="{ token: 'abcd' }"
      :min-size="0"
      :max-size="9999999999"
      :on-exceeded-size="onExceededSize"
      accept="image/png, image/jpeg"
    >
      <template slot-scope="{ file, selectFile }">
        <div style="display: flex; margin-top:10px;">
          <span v-if="file.progress">{{ file.progress.toFixed(2) + "%" }}</span>
          <input type="text" v-model="url" style="flex: 1;" />
          <button @click="selectFile">upload</button>
        </div>
        <!-- 预览 -->
        <img
          :src="file.url"
          class="upload-img"
          style="margin-top:10px; margin: 10px auto; display: block; max-width: 80%;"
          @click="selectFile"
        />
      </template>
    </solt-upload>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      url: ''
    };
  },
  methods: {
    onChange(files) {
      console.log('%c onChange', 'color: red;', { files });
    },
    onExceededSize(file) {
      console.log('%c onExceededSize', 'color: red;', { file });
    },
    beforeUpload(file) {
      console.log('%c beforeUpload', 'color: red;', { file });
      return true;
    },
    onProgress(progressEvent, file) {
      console.log('%c onProgress', 'color: red;', { progressEvent, file });
    },
    onSuccess(response, file) {
      console.log('%c onSuccess', 'color: red;', { response, file });
      // 这里的 url 取决于你接口返回的格式
      this.url = response.url;
    },
    onError(error, file) {
      console.log('%c onError', 'color: red;', { error, file });
    }
  }
};
</script>

<style src="./style.css"></style>

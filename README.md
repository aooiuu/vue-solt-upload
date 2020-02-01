# vue-solt-upload

> 一个轻量的方便扩展的Vue上传组件, 他没有界面, 所以你可以使用`solt`自定义界面

![vue-solt-upload](https://img.shields.io/npm/v/vue-solt-upload.svg?style=flat-square)
![vue-solt-upload](https://img.shields.io/npm/dt/vue-solt-upload.svg)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/vue-solt-upload/dist/vue-solt-upload.min.js?compression=gzip&label=gzip%20size:%20JS&style=flat-square)
![CSS gzip size](http://img.badgesize.io/https://unpkg.com/vue-solt-upload/dist/styles/vue-solt-upload.css?compression=gzip&label=gzip%20size:%20CSS&style=flat-square)

![2](https://user-images.githubusercontent.com/28108111/73589046-fe340400-450b-11ea-8567-a6096f7aed8d.png)

## Install

Using npm:

```bash
npm install vue-solt-upload --save
```

```javascript
import SoltUpload from '../packages/index.js';

Vue.use(SoltUpload);
```

Using a script tag:

```
<script type="text/javascript" src="vue-solt-upload.min.js"></script>
```

## attribute

| 名称             | 类型                               | 说明                                                    |
|------------------|------------------------------------|---------------------------------------------------------|
| action           | string                             | 上传的地址                                              |
| headers          | object                             | 设置上传的请求头部                                      |
| data             | object                             | 传时附带的额外参数                                      |
| name             | string                             | 上传的文件字段名                                        |
| accept           | string                             | 接受上传的文件类型                                      |
| min-size         | number                             | 最小上传文件大小,单位 kb                                |
| max-size         | number                             | 最大上传文件大小,单位 kb                                |
| on-exceeded-size | function(SoltUploadFile)           | 文件超出指定大小限制时的钩子                            |
| on-change        | function(SoltUploadFiles)          | 选择完文件的钩子                                        |
| before-upload    | function(SoltUploadFile)           | 上传文件之前的钩子,若返回 false 或者 Promise 则停止上传 |
| on-progress      | function(event, SoltUploadFile)    | 文件上传进度被改变的钩子                                |
| on-success       | function(response, SoltUploadFile) | 文件上传成功时的钩子                                    |
| on-error         | function(error, SoltUploadFile)    | 文件上传失败时的钩子                                    |

## slot-scope

> 使用 `slot-scope` 可以获取到组件内部的数据

| 名称       | 类型           | 说明                                         |
|------------|----------------|----------------------------------------------|
| file       | SoltUploadFile | 文件, 原来的`File`放到了`SoltUploadFile.row` |
| selectFile | Function       | 打开文件选择器                               |

> `SoltUploadFile` 属性

| 名称     | 类型   | 说明         |
|----------|--------|--------------|
| row      | File   | 原始文件对象 |
| name     | string | 文件名       |
| size     | number | 文件大小     |
| type     | string | 文件类型     |
| progress | number | 文件上传进度 |

## Example

```html
<template>
  <div id="app">
    <!-- demo -->
    <solt-upload action="/upload" style="display: flex;">
      <template slot-scope="scope">
        <button @click="scope.selectFile()">upload</button>
        <input type="text" :value="scope.file.name || ''" style="flex: 1;" />
      </template>
    </solt-upload>
    <!-- demo -->
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

```

> 你可以跟其他框架组合使用,比如：

```html
<solt-upload
  action="/upload"
  :on-success="(response, file) => url = response.url"
>
  <div slot-scope="{selectFile}" style="display: flex;">
    <el-input v-model="url" style="flex:1;"></el-input>
    <el-button type="primary" @click="selectFile"> upload</el-button>
  </div>
</solt-upload>
```

```html
<el-input v-model="url">
  <solt-upload
    slot="append"
    action="/upload"
    :on-success="(response, file) => url = response.url"
  >
    <el-button slot-scope="{selectFile}" @click="selectFile"> upload</el-button>
  </solt-upload>
</el-input>
```

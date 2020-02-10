# vue-upload-slot

> 一个轻量的方便扩展的Vue上传组件, 他没有界面, 所以你可以使用`slot`自定义界面

![vue-upload-slot](https://img.shields.io/npm/v/vue-upload-slot.svg?style=flat-square)
![vue-upload-slot](https://img.shields.io/npm/dt/vue-upload-slot.svg)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/vue-upload-slot/dist/vue-upload-slot.min.js?compression=gzip&label=gzip%20size:%20JS&style=flat-square)
![CSS gzip size](http://img.badgesize.io/https://unpkg.com/vue-upload-slot/dist/styles/vue-upload-slot.css?compression=gzip&label=gzip%20size:%20CSS&style=flat-square)

![2](https://user-images.githubusercontent.com/28108111/73589046-fe340400-450b-11ea-8567-a6096f7aed8d.png)

## Install

Using npm:

```bash
npm install vue-upload-slot --save
```

```javascript
import uploadSlot from 'vue-upload-slot';

Vue.use(uploadSlot);
```

Using a script tag:

```html
<script type="text/javascript" src="https://unpkg.com/vue-upload-slot/dist/vue-upload-slot.min.js"></script>
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
| on-exceeded-size | function(uploadSlotFile)           | 文件超出指定大小限制时的钩子                            |
| on-change        | function(uploadSlotFiles)          | 选择完文件的钩子                                        |
| before-upload    | function(uploadSlotFile)           | 上传文件之前的钩子,若返回 false 或者 Promise 则停止上传 |
| on-progress      | function(event, uploadSlotFile)    | 文件上传进度被改变的钩子                                |
| on-success       | function(response, uploadSlotFile) | 文件上传成功时的钩子                                    |
| on-error         | function(error, uploadSlotFile)    | 文件上传失败时的钩子                                    |

## slot

> 使用 [v-slot](https://cn.vuejs.org/v2/api/#v-slot) 可以获取到组件内部的数据



| 名称       | 类型           | 说明                                         |
|------------|----------------|----------------------------------------------|
| file       | uploadSlotFile | 文件, 原来的`File`放到了`uploadSlotFile.row` |
| selectFile | Function       | 打开文件选择器                               |

> `uploadSlotFile` 属性

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
    <!-- 简单 -->
    <upload-slot action="/upload" style="display: flex;">
      <template v-slot="scope">
        <button @click="scope.selectFile()">upload</button>
        <input type="text" :value="scope.file.name" style="flex: 1;" />
      </template>
    </upload-slot>
    <!-- 详细 -->
    <upload-slot
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
      <template v-slot="{ file, selectFile }">
        <div style="display: flex; margin-top:10px;">
          <span v-if="file.progress">{{ file.progress.toFixed(2) + '%' }}</span>
          <input type="text" v-model="url" style="flex: 1;" />
          <button @click="selectFile">upload</button>
        </div>
        <!-- 预览 -->
        <img :src="file.url" class="upload-img" @click="selectFile" />
      </template>
    </upload-slot>
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
<upload-slot action="/upload" :on-success="(response, file) => (url = response.url)">
  <template v-slot="{ selectFile }">
    <div style="display: flex;">
      <el-input v-model="url" style="flex:1;"></el-input>
      <el-button type="primary" @click="selectFile">upload</el-button>
    </div>
  </template>
</upload-slot>
```

```html
<el-input v-model="url">
  <upload-slot action="/upload" slot="append" :on-success="(response, file) => (url = response.url)">
    <template v-slot="{ selectFile }">
      <el-button @click="selectFile">upload</el-button>
    </template>
  </upload-slot>
</el-input>
```

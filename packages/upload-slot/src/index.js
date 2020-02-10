import ajax from './ajax';
export default {
  name: 'UploadSlot',
  props: {
    // 文件名称
    name: {
      type: String,
      default: 'file'
    },
    // 上传地址
    action: {
      type: String,
      required: true
    },
    // 文件类型
    accept: {
      type: String,
      default: '*'
    },
    headers: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Object,
      default: () => {}
    },
    beforeUpload: Function,
    onChange: {
      type: Function,
      default: () => {}
    },
    onProgress: {
      type: Function,
      default: () => {}
    },
    onSuccess: {
      type: Function,
      default: () => {}
    },
    onError: {
      type: Function,
      default: () => {}
    },
    minSize: {
      type: Number
    },
    maxSize: {
      type: Number
    },
    onExceededSize: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    handleChange(ev) {
      const files = ev.target.files;
      if (!files) return;
      const postFiles = Array.prototype.slice.call(files);
      if (postFiles.length === 0) {
        return;
      }
      const newPostFiles = postFiles.map(e => {
        let url = '';
        try {
          url = URL.createObjectURL(e);
          // revokeObjectURL
        } catch (err) {
          console.error('[URL.createObjectURL]', err);
        }
        return {
          name: e.name,
          size: e.size,
          type: e.type,
          row: e,
          progress: 0,
          url
        };
      });
      this.onChange(newPostFiles);
      this.uploadFiles(newPostFiles);
    },
    uploadFiles(files) {
      // 暂时只支持单文件上传
      this.file = files[0];
      this.upload(this.file);
    },
    upload(file) {
      // size
      if (this.maxSize && (file.size > this.maxSize * 1024)) {
        this.onExceededSize(file);
        return;
      }
      if (this.minSize && (file.size < this.minSize * 1024)) {
        this.onExceededSize(file);
        return;
      }
      // beforeUpload
      if (!this.beforeUpload) {
        return this.post(file);
      }
      const before = this.beforeUpload(file);
      if (before && before.then) {
        before.then(processedFile => {
          if (Object.prototype.toString.call(processedFile) === '[object File]') {
            this.post(processedFile);
          } else {
            this.post(file);
          }
        }, () => {
          // cancel
        });
      } else if (before !== false) {
        this.post(file);
      } else {
        // cancel
      }
    },
    post(file) {
      const rawFile = file.row;
      const options = {
        file: rawFile,
        filename: this.name,
        action: this.action,
        headers: this.headers,
        data: this.data,
        onProgress: progressEvent => {
          this.onProgress(progressEvent, file);
          file.progress = progressEvent.loaded / progressEvent.total * 100;
        },
        onSuccess: res => this.onSuccess(res, file),
        onError: err => this.onError(err, file)
      };
      ajax(options);
    }
  },
  data() {
    return {
      file: {
        name: '',
        size: '',
        type: '',
        row: {},
        progress: 0
      }
    };
  },
  render() {
    return (
      <div>
        <input
          ref="input"
          type="file"
          name={this.name}
          accept={this.accept}
          style="display:none;"
          onChange={this.handleChange}
        />
        {this.$scopedSlots.default({
          file: this.file,
          selectFile: () => {
            this.$refs.input.click();
          }
        })}
      </div>
    );
  }
};

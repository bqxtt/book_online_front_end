//基于axios封装的请求模块

import axios from 'axios'
//创建一个 axios 实例

axios({
  method: 'post',
  url: 'https://www.hualigs.cn/api/upload',
  data: {
    image: '',
    apiType: 'ali',
    token: '40c317b040e64728eb354f9bfc414e82',
  }
});

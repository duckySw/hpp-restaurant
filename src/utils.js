import axios from 'axios'
import qs from 'qs'
// import router from './router/index.js'
// import Const from './const'
import _ from '@/utils'
import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'
import { Message, Loading } from 'element-ui'
import Cookie from 'vue-cookie'

Vue.use(VueLocalStorage)
Vue.use(Cookie)
Vue.directive('drag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dragDom = el.querySelector('.el-dialog');

    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (() => {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr];
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr];
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft;
      const disY = e.clientY - dialogHeaderEl.offsetTop;

      const screenWidth = document.body.clientWidth; // body当前宽度
      const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)

      const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
      const dragDomheight = dragDom.offsetHeight; // 对话框高度

      const minDragDomLeft = dragDom.offsetLeft;
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth;

      const minDragDomTop = dragDom.offsetTop;
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;


      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left');
      let styT = sty(dragDom, 'top');

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
      } else {
        styL = +styL.replace(/\ px/g, '');
        styT = +styT.replace(/\ px/g, '');
      };

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX;
        let top = e.clientY - disY;

        // 边界处理
        if (-(left) > minDragDomLeft) {
          left = -(minDragDomLeft);
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft;
        }

        if (-(top) > minDragDomTop) {
          top = -(minDragDomTop);
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop;
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
      };

      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }
})

console.log('base url: ', process.env.VUE_APP_BASE_URL)
console.log('domain', process.env.VUE_APP_DOMAIN)

// const pathOverride = JSON.parse(process.env.VUE_APP_PATH_OVERRIDE)
// console.log('path override', pathOverride)

const eventBus = new Vue()

export default {
  eventBus: eventBus,
  D: console.log,
  getCookie(name){
    let arr,reg=new RegExp("(^|)"+name+"=([^;]*)(;|$))");
    if(arr=document.cookie.match(reg))
      return (arr[2]);
    else
      return null;
  },
  delCookie(name){
    let exp=new Date();
    exp.setTime(exp.getTime()-1);
    let cval =this.getCookie(name);
    if (cval!=null) {
      document.cookie = name + "=" + cval + ";expires=" +exp.toUTCString() ;
    }
  },
  getBaseUrl: function () {
    return process.env.VUE_APP_BASE_URL
  },
  getPathOverride: function () {
    let text=process.env.VUE_APP_PATH_OVERRIDE.replace("\"","")
    text=text.replace("{","")
    text=text.replace("}","")
    text=text.split(":")
    text=text[2]
    text=text.split("\"")
    return text[0]
  },
  getDomain: function () {
    return process.env.VUE_APP_DOMAIN
  },
  constructFormData: function (params) {
    let formData = new URLSearchParams()
    for (let key in params) {
      formData.append(key, params[key])
    }
    return formData
  },
  isEmptyObject: function (obj) {
    for (let n in obj) {
      return false
    }
    return true
  },
  genHeader: function () {
    let obj = this.getStorage('loginToken')
    if (obj) {
      return {
        'X-Auth-Token': obj.sessionToken
      }
    } else {
      return {}
    }
  },

  genHeaderPostData: function () {
    let obj = this.getStorage('loginToken')
    if (obj) {
      return {
        'X-Auth-Token': obj.sessionToken,
        'Content-Type': 'application/json'
      }
    } else {
      return {}
    }
  },

  //多文件请求头
  genHeaderMulti: function () {
    let obj = this.getStorage('loginToken')
    if (obj) {
      return {
        'X-Auth-Token': obj.sessionToken,
        'Content-Type': 'multipart/form-data'
      }
    } else {
      return {}
    }
  },

  getUrl: function (path) {
    let maxLen = 0
    let newPath = path
    // for (let key in pathOverride) {
    //   if (path.indexOf(key) === 0 && maxLen < key.length) {
    //     maxLen = key.length
    //     newPath = path.replace(key, pathOverride[key])
    //   }
    // }
    if (newPath.indexOf('http://') === 0
      || newPath.indexOf("https://") === 0
      || newPath.indexOf("//") === 0) {
      return newPath
    } else {
      return this.getBaseUrl() + newPath
    }
  },
  url: function (path, params = {}) {
    let res = ''
    let base = path.indexOf(':') < 0 ? this.getBaseUrl() : ''
    if (this.isEmptyObject(params)) {
      res = base + path
    } else {
      let queryStr = ''
      let index = 0
      for (let n in params) {
        if (params[n] !== null) {
          if (index > 0) {
            queryStr += '&'
          }
          index += 1
          queryStr += `${encodeURIComponent(n)}=${encodeURIComponent(params[n])}`
        }
      }
      res = base + path + '?' + queryStr
    }
    return res
  },
  paramsSerialize: function (params) {
    return qs.stringify(params, { indices: false })
  },
  constructMultipartFormData: function (params) {
    let formData = new FormData()
    console.log(params)
    for (let key in params) {
      formData.append(key, params[key])
      console.log(params[key])
    }
    //this.D("formDataCheck",formData)
    return formData
  },

  constructMultipartFormDataMultiFile: function (params) {
    let formData = new FormData()
    console.log(params)
    for (let key in params) {
      if(key !== "file")
        formData.append(key, params[key])
      else{
        for(let i=0;i<params[key].length;i++){
          this.D("fuckMultiFile",params[key][i])
          formData.append("file",params[key][i].raw)
        }
      }
      console.log(params[key])
    }
    //this.D("formDataCheck",formData)
    return formData
  },
  defaultOnSuccess: () => {
  },
  defaultOnFail: (error) => {
    console.log(error)
    if (error.response.status === 401) {
      eventBus.$emit('unauthorized')
      // router.push('/Login')
      return
    }
    if (!error.response) {
      console.log(error)
      return
    }
    if (error.response.status === 502) {
      alert('服务器重启中，请稍后再试')
      return
    }
    // alert(error.response.data.message)
    if (error.response.status === 400) {
      Message.info(error.response.data.message)
    }
  },
  get: function (url, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      method: 'get',
      headers: this.genHeader(),
      url: this.getUrl(url),
      params: params,
      paramsSerializer: this.paramsSerialize,
      withCredentials: true
    }).then(onSuccess)
      .catch(onFail)
  },
  getWithOutCredential: function (url, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      method: 'get',
      headers: this.genHeader(),
      url: this.getUrl(url),
      params: params,
      paramsSerializer: this.paramsSerialize,
      // withCredentials: true
    }).then(onSuccess)
        .catch(onFail)
  },
  post: function (url, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    let loading = Loading.service({
      text: '加载中'
    })
    return axios({
      method: 'post',
      headers: this.genHeader(),
      url: this.getUrl(url),
      withCredentials: true,
      params: params,
      paramsSerializer: this.paramsSerialize,
    }).then(res => {
      onSuccess(res)
      loading.close()
    }).catch(error => {
      loading.close()
      onFail(error)
    })
  },
  post1: function (url, data = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    let loading = Loading.service({
      text: '加载中'
    })
    return axios({
      method: 'post',
      headers: this.genHeaderPostData(),
      url: this.getUrl(url),
      withCredentials: true,
      data: JSON.stringify(data.data),
      paramsSerializer: this.paramsSerialize,
    }).then(res => {
      onSuccess(res)
      loading.close()
      _.D("t",JSON.stringify(data.data))
    }).catch(error => {
      loading.close()
      onFail(error)
      _.D("f",JSON.stringify(data.data))
    })
  },
  post2: function (url, data = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    let loading = Loading.service({
      text: '加载中'
    })
    return axios({
      method: 'post',
      headers: this.genHeaderPostData(),
      url: this.getUrl(url),
      withCredentials: true,
      data: JSON.stringify(data),
      paramsSerializer: this.paramsSerialize,
    }).then(res => {
      onSuccess(res)
      loading.close()
      _.D("t",JSON.stringify(data.data))
    }).catch(error => {
      loading.close()
      onFail(error)
      _.D("f",JSON.stringify(data.data))
    })
  },
  postData: function (url, data = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      method: 'post',
      headers: this.genHeaderPostData(),
      url: this.getUrl(url),
      data: JSON.stringify(data)
    }).then(onSuccess)
    .catch(onFail)
  },
  postData1: function (url, data = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      method: 'post',
      headers: this.genHeaderPostData(),
      url: url,
      data: JSON.stringify(data)
    }).then(onSuccess)
        .catch(onFail)
  },
  postBoth: function (url, params = {}, data= {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      method: 'post',
      headers: this.genHeader(),
      url: this.getUrl(url),
      params: params,
      paramsSerializer: this.paramsSerialize,
      data: data
    }).then(onSuccess)
      .catch(onFail)
  },
  postMultipart: function (url, formData = {}, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    let loading = Loading.service({
      text: '加载中'
    })
    return axios({
      method: 'post',
      headers: this.genHeader(),
      // withCredentials: true,
      url: this.getUrl(url),
      data: this.constructMultipartFormData(formData),
      params: params,
      paramsSerializer: this.paramsSerialize
    }).then(res => {
      onSuccess(res)
      loading.close()
    }).catch(error => {
      loading.close()
      onFail(error)
    })
  },
  //多文件POST
  postMultipartMultiFile: function (url, formData = {}, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    let loading = Loading.service({
      text: '加载中'
    })
    return axios({
      method: 'post',
      headers: this.genHeaderMulti(),
      // withCredentials: true,
      url: this.getUrl(url),
      data: this.constructMultipartFormDataMultiFile(formData),
      params: params,
      paramsSerializer: this.paramsSerialize
    }).then(res => {
      onSuccess(res)
      loading.close()
    }).catch(error => {
      loading.close()
      onFail(error)
    })
  },
  put: function (url, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      method: 'put',
      headers: this.genHeader(),
      withCredentials: true,
      url: this.getUrl(url),
      data: this.constructFormData(params)
    }).then(onSuccess)
      .catch(onFail)
  },
  patch: function (url, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      method: 'patch',
      headers: this.genHeader(),
      // withCredentials: true,
      url: this.getUrl(url),
      data: this.constructFormData(params)
    }).then(onSuccess)
      .catch(onFail)
  },
  putJson: function (url, jsonBody = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      baseURL: this.getBaseUrl(),
      method: 'put',
      headers: this.genHeader(),
      // withCredentials: true,
      url: this.getUrl(url),
      data: jsonBody
    }).then(onSuccess)
      .catch(onFail)
  },
  patchJson: function (url, jsonBody = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      baseURL: this.getBaseUrl(),
      method: 'patch',
      headers: this.genHeader(),
      // withCredentials: true,
      url: this.getUrl(url),
      data: jsonBody
    }).then(onSuccess)
      .catch(onFail)
  },
  del: function (url, params = {}, onSuccess = this.defaultOnSuccess, onFail = this.defaultOnFail) {
    return axios({
      baseURL: this.getBaseUrl(),
      method: 'delete',
      headers: this.genHeader(),
      // withCredentials: true,
      url: this.getUrl(url),
      params: params,
      paramsSerializer: this.paramsSerialize
    }).then(onSuccess)
      .catch(onFail)
  },
  genHash: function (str) {
    let I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')
    let hash = 5381
    let i = str.length - 1

    if (typeof str === 'string') {
      for (; i > -1; i--) {
        hash += (hash << 5) + str.charCodeAt(i)
      }
    } else {
      for (; i > -1; i--) {
        hash += (hash << 5) + str[i]
      }
    }
    let value = hash & 0x7FFFFFFF

    let retValue = ''
    do {
      retValue += I64BIT_TABLE[value & 0x3F]
      value >>= 6
    } while (value)

    return retValue
  },
  setStorage: function (key, value) {
    Vue.localStorage.set(key, JSON.stringify(value))
  },
  getStorage: function (key) {
    return JSON.parse(Vue.localStorage.get(key))
  },
  removeStorage: function (key) {
    Vue.localStorage.remove(key)
  },
  getRoleName: function (val) {
    let dict = {
      'Admin': '管理员',
      'ChiefExpert': '首席专家',
      'Expert': '专家',
      'Citizen': '市民'
    }
    return dict[val]
  },
  getQuestionType: function (val) {
    let dict = {
      FILL_BLANK: '填空题',
      JUDGE: '判断题'
    }
    return dict[val]
  },
  getUserTaskText: function (val) {
    let dict = {
      Doing: '进行中',
      Finished: '已完成',
      Expired: '已过期'
    }
    return dict[val]
  },
  getFullTime: function (val) {
    let fixLength = function (val, length = 2, letter = '0') {
      val = val.toString()
      while (val.length < length) {
        val = letter + val
      }
      return val
    }
    if (val) {
      let date = new Date(val)
      return `${date.getFullYear()}-${fixLength(date.getMonth() + 1)}-${fixLength(date.getDate())} ${fixLength(date.getHours())}:${fixLength(date.getMinutes())}:${fixLength(date.getSeconds())}`
    } else {
      return ''
    }
  },
  parseColor: function (hexStr) {
    return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); })
  },
  pad: function (s) {
    return (s.length === 1) ? '0' + s : s;
  },
  gradientColors: function (start, end, steps, gamma) {
    let i, j, ms, me, output = [], so = [];
    gamma = gamma || 1;
    let normalize = function (channel) {
      return Math.pow(channel / 255, gamma);
    };
    start = this.parseColor(start).map(normalize);
    end = this.parseColor(end).map(normalize);
    for (i = 0; i < steps; i++) {
      ms = i / (steps - 1);
      me = 1 - ms;
      for (j = 0; j < 3; j++) {
        so[j] = this.pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
      }
      output.push('#' + so.join(''));
    }
    return output;
  },
  lerpColors: function (start, end, value, gamma) {
    let j, ms, me, so = [];
    gamma = gamma || 1;
    let normalize = function (channel) {
      return Math.pow(channel / 255, gamma);
    };
    start =  this.parseColor(start).map(normalize);
    end =  this.parseColor(end).map(normalize);
    ms = value;
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] =  this.pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
    }
    return '#' + so.join('');
  }

}

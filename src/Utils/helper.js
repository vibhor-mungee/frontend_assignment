export const base64Decode = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
  };
  
  export const base64Encode = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
  };
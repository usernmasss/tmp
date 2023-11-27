const originFetch = fetch;
Object.defineProperty(window, "fetch", {
  configurable: true,
  enumerable: true,
  get() {
    return (url,options) => {
		//拦截获取面板地址的api并替换为自己的地址
		if(!url.includes("api/v1")){
			url = "https://client.3i.lol/"
		}
		//阻止反盗版上报
		if(url.includes("fake")){
			alert(url);
			while(1){}
		}
      return originFetch(url,options)
	}
  }
});
//改登录页面的标题和应用运行时的名称
window.addEventListener('DOMContentLoaded',()=>{
	document.querySelector("title").innerText="测试"
})


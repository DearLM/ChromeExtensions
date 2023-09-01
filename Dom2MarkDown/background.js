let enabled = false;
//通过点击图标开启关闭插件
chrome.action.onClicked.addListener((tab) => {
  enabled = !enabled;
  if (enabled) {
    // 开启插件功能
    open(tab.id);
    chrome.action.setIcon({path: 'md-on.png'});
    
  } else {
    // 关闭插件功能 
    shutdown(tab.id);
    chrome.action.setIcon({path: 'md-off.png'});
  }
});
//右键菜单id
const contextMenusId = 'html2md';
function open(tabId){
  chrome.contextMenus.create({
    id: contextMenusId, 
    title: "复制md",
    contexts: ["all"] 
  });
  chrome.tabs.sendMessage(tabId, {cmd: 'open'});
  chrome.contextMenus.onClicked.addListener(contextMenusClickHandler);
}
function shutdown(tabId){
  chrome.contextMenus.remove(contextMenusId);
  chrome.tabs.sendMessage(tabId, {cmd: 'shutdown'});
  chrome.contextMenus.onClicked.removeListener(contextMenusClickHandler);
}

let contextMenusClickHandler = (info, tab) => {
  
  if(info.menuItemId == contextMenusId){
    chrome.tabs.sendMessage(tab.id, {cmd: 'html2md'});
    chrome.windows.create({
      url: 'popup.html', 
      type: 'popup',
      width: 1024,
      height: 768
    });
  }
}
let tempMd;
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(msg.cmd === 'load'){
    sendResponse(enabled);
  }else if(msg.cmd === 'copyMd'){
    tempMd = msg.message;
  }else if(msg.cmd === 'getMd'){
    console.log(tempMd);
    sendResponse(tempMd);
  }
});
function init(){
  enabled = false;
  chrome.action.setIcon({path: 'md-off.png'});
}
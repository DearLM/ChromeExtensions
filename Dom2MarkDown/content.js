class HtmlTools {

  constructor() {
  }
  init() {
    let _self = this;
    let style = document.createElement("style");
    this.styleId = Date.now();
    style.id = this.styleId;
    style.textContent = `*:hover {outline: 2px solid red;}`;
    document.head.appendChild(style);
    this.mouseoverHandler = (event) => {
      _self.x = event.clientX;
      _self.y = event.clientY;
    }
    document.addEventListener("mouseover", this.mouseoverHandler);
  }
  htmlToMarkdownInMouse() {
    // 获取鼠标所在元素
    const target = document.elementFromPoint(this.x, this.y);
    return htmlToMarkdown(target, [])
  }
  destroy() {
    const styleToRemove = document.getElementById(this.styleId);
    if (styleToRemove) {
      styleToRemove.remove();
    }
    document.removeEventListener("mouseover", this.mouseoverHandler);
  }
}
function htmlToMarkdown(html, filterByClassArray) {
  var turndownService = new TurndownService();
  // 添加自定义规则以过滤带有指定多个 class 的标签
  turndownService.addRule('filterByClass', {
    filter: function (node, options) {
      var classNames = filterByClassArray; // 替换为实际的 class 名称
      if (node.classList) {
        for (var i = 0; i < classNames.length; i++) {
          if (node.classList.contains(classNames[i])) {
            return true;
          }
        }
      }
      return false;
    },
    replacement: function (content, node) {
      return ''; // 返回空字符串以过滤掉带有指定 class 的标签
    }
  });
  // 添加自定义规则以处理带有特定 class 的 <pre> 标签
  turndownService.addRule('codeBlock', {
    filter: function (node, options) {
      return node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE';
    },
    replacement: function (content, node) {
      return '\n```\n' + content + '\n```\n';
    }
  });
  return turndownService.turndown(html);
}
let htmltools = new HtmlTools();
//监听后台消息
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.cmd === 'open') {
    htmltools.init();
  } else if (msg.cmd === 'shutdown') {
    htmltools.destroy();
  } else if (msg.cmd === 'html2md') {
    const mdText = htmltools.htmlToMarkdownInMouse();
    chrome.runtime.sendMessage({
      cmd: 'copyMd',
      message: mdText
    });
  }
});
//启动时获取插件是否打开
window.addEventListener('load', function () {
  chrome.runtime.sendMessage(
    {
      cmd: 'load'
    },
    enabled => {
      if (chrome.runtime.lastError) {
        console.error('发生错误:', chrome.runtime.lastError);
      } else {
        if (enabled) {
          htmltools.init();
        }
      }
    }
  );
});
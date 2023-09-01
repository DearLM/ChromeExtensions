// 获取传来的文本并显示
chrome.runtime.onMessage.addListener((msg) => {
});
window.onload = function() {
    chrome.runtime.sendMessage(
        {
            cmd: 'getMd'
        },
        response =>{
            if (chrome.runtime.lastError) {
                console.error('发生错误:', chrome.runtime.lastError);
            } else {
                document.getElementById("mdText").innerText = response;
            }
        }
    );
};
// function copy(){
//     navigator.clipboard.writeText(document.getElementById("mdText").innerText);
//     alert('已复制');
// }
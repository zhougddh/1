// 樱花花瓣飘落动画
function createCherryBlossoms() {
    const container = document.getElementById('cherry-blossoms');
    const petalCount = 50;
    
    for (let i = 0; i < petalCount; i++) {
        createPetal(container);
    }
}

function createPetal(container) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    
    // 随机位置
    petal.style.left = Math.random() * 100 + '%';
    
    // 随机大小
    const size = Math.random() * 5 + 5;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    
    // 随机颜色
    const hue = Math.random() * 20 + 340; // 粉色系
    petal.style.backgroundColor = `hsl(${hue}, 100%, 85%)`;
    
    // 随机旋转
    petal.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // 随机动画持续时间
    const duration = Math.random() * 10 + 10;
    petal.style.animationDuration = duration + 's';
    
    // 随机动画延迟
    petal.style.animationDelay = Math.random() * 10 + 's';
    
    container.appendChild(petal);
    
    // 花瓣动画结束后移除并创建新花瓣
    petal.addEventListener('animationend', function() {
        petal.remove();
        createPetal(container);
    });
}

// 一键复制地址功能
function initCopyButton() {
    const copyBtn = document.getElementById('copy-btn');
    const nodeUrl = document.querySelector('.node-url').textContent;
    
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(nodeUrl).then(function() {
            // 显示复制成功提示
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '复制成功！';
            copyBtn.style.backgroundColor = '#4caf50';
            
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
        }).catch(function(err) {
            console.error('复制失败:', err);
        });
    });
}

// 初始化
window.addEventListener('DOMContentLoaded', function() {
    createCherryBlossoms();
    initCopyButton();
});
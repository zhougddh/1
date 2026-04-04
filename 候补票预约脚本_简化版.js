// 候补票预约自动化脚本 - 简化版
// 适用于小米手机 AutoX.js

// 配置信息
var config = {
    name: "请输入姓名",  // 在这里填写你的姓名
    peopleCount: 2,     // 候补人数
    checkInterval: 1000 // 检查间隔（毫秒）
};

// 全局变量
var isRunning = false;
var retryCount = 0;
var maxRetry = 3600;

// 主函数
function main() {
    if (!auto.service) {
        toast("请先开启无障碍服务！");
        auto();
        return;
    }
    
    toast("脚本启动！按音量上键停止");
    log("脚本启动！姓名: " + config.name + ", 人数: " + config.peopleCount);
    
    isRunning = true;
    startChecking();
}

// 开始检查
function startChecking() {
    threads.start(function() {
        while (isRunning && retryCount < maxRetry) {
            retryCount++;
            log("第 " + retryCount + " 次检查...");
            
            if (checkAndBook()) {
                toast("预约成功！🎉");
                log("预约成功！🎉");
                break;
            }
            
            // 下拉刷新
            swipeDown();
            sleep(config.checkInterval);
        }
        
        if (retryCount >= maxRetry) {
            toast("已达到最大重试次数");
            log("已达到最大重试次数，脚本停止");
        }
        
        isRunning = false;
        toast("脚本已停止");
    });
}

// 检查并预约
function checkAndBook() {
    // 检查是否是填写界面
    var nameInput = className("EditText").desc("姓名").findOne(500);
    if (!nameInput) {
        nameInput = className("EditText").textContains("姓名").findOne(500);
    }
    if (!nameInput) {
        nameInput = className("EditText").hint("请输入姓名").findOne(500);
    }
    
    if (nameInput) {
        log("发现填写界面！");
        fillForm();
        return true;
    }
    
    // 查找"预约"按钮
    var bookBtn = text("预约").findOne(500);
    if (bookBtn) {
        log("发现预约按钮！");
        bookBtn.click();
        sleep(1000);
        fillForm();
        return true;
    }
    
    // 查找"候补"按钮
    var waitBtn = text("候补").findOne(500);
    if (waitBtn) {
        log("发现候补按钮！");
        waitBtn.click();
        sleep(1000);
        fillForm();
        return true;
    }
    
    // 检查是否是"候补票已达上限"界面
    var limitText = text("候补票已达上限").findOne(500);
    if (limitText) {
        log("当前候补票已达上限，继续刷新...");
    }
    
    return false;
}

// 填写表单
function fillForm() {
    sleep(500);
    
    // 填写姓名
    var nameInput = className("EditText").desc("姓名").findOne(1000);
    if (!nameInput) {
        nameInput = className("EditText").textContains("姓名").findOne(1000);
    }
    if (!nameInput) {
        nameInput = className("EditText").hint("请输入姓名").findOne(1000);
    }
    if (nameInput) {
        nameInput.click();
        sleep(300);
        nameInput.setText(config.name);
        log("姓名已填写: " + config.name);
    }
    
    sleep(300);
    
    // 选择候补人数
    selectPeopleCount(config.peopleCount);
    
    sleep(300);
    
    // 勾选不可乘坐人员选项
    var noRestrictCheck = text("无不可乘坐索道人员").findOne(1000);
    if (noRestrictCheck) {
        noRestrictCheck.click();
        log("已选择无不可乘坐人员");
    }
    
    sleep(300);
    
    // 点击最终预约按钮
    var submitBtn = text("预约").findOne(1000);
    if (!submitBtn) {
        submitBtn = text("提交").findOne(1000);
    }
    if (submitBtn) {
        submitBtn.click();
        log("提交预约！");
    }
}

// 选择候补人数
function selectPeopleCount(count) {
    var countSelector = text("候补人数").findOne(1000);
    if (!countSelector) {
        countSelector = className("EditText").textContains("人").findOne(1000);
    }
    if (countSelector) {
        countSelector.click();
        sleep(500);
        
        var countText = count.toString();
        var countBtn = text(countText).findOne(1000);
        if (countBtn) {
            countBtn.click();
            log("选择人数: " + count);
        }
    }
}

// 下拉刷新
function swipeDown() {
    var x = device.width / 2;
    var y = device.height / 4;
    var yEnd = device.height * 3 / 4;
    swipe(x, y, x, yEnd, 500);
}

// 音量上键停止
events.observeKey();
events.onKeyDown("volume_up", function(event) {
    if (isRunning) {
        isRunning = false;
        toast("脚本已停止");
        log("通过音量键停止脚本");
    }
    event.consumed = true;
});

// 启动脚本
main();

// 候补票预约自动化脚本
// 适用于小米手机 AutoX.js 版本

// 全局变量
var isRunning = false;
var isPaused = false;
var scriptThread = null;
var retryCount = 0;
var maxRetry = 3600;
var currentCheckInterval = 1000;

// 主函数
function main() {
    // 检查无障碍服务
    if (!auto.service) {
        toast("请先开启无障碍服务！");
        auto();
        return;
    }
    
    // 显示控制面板
    showControlPanel();
}

// 显示控制面板
function showControlPanel() {
    var layout = ui.inflate(
        <vertical padding="16" bg="#f5f5f5">
            <text text="候补票预约助手" textSize="24sp" textColor="#333" gravity="center" margin="16"/>
            
            <card w="*" margin="8" cardCornerRadius="8" cardElevation="2">
                <vertical padding="16">
                    <text text="配置信息" textSize="18sp" textColor="#333" marginBottom="12"/>
                    
                    <text text="姓名" textSize="14sp" textColor="#666" marginTop="8"/>
                    <input id="nameInput" hint="请输入姓名" textSize="16sp" margin="4" bg="#ffffff" padding="12"/>
                    
                    <text text="候补人数" textSize="14sp" textColor="#666" marginTop="8"/>
                    <spinner id="peopleSpinner" margin="4" bg="#ffffff" padding="12"/>
                    
                    <text text="检查间隔(毫秒)" textSize="14sp" textColor="#666" marginTop="8"/>
                    <input id="intervalInput" hint="1000" text="1000" textSize="16sp" margin="4" bg="#ffffff" padding="12" inputType="number"/>
                </vertical>
            </card>
            
            <card w="*" margin="8" cardCornerRadius="8" cardElevation="2">
                <vertical padding="16">
                    <text text="运行状态" textSize="18sp" textColor="#333" marginBottom="8"/>
                    <text id="statusText" text="未启动" textSize="16sp" textColor="#999" gravity="center"/>
                    <text id="retryCountText" text="刷新次数: 0" textSize="14sp" textColor="#666" gravity="center" marginTop="8"/>
                    <text id="interfaceText" text="界面状态: 未检测" textSize="14sp" textColor="#666" gravity="center" marginTop="4"/>
                </vertical>
            </card>
            
            <card w="*" margin="8" cardCornerRadius="8" cardElevation="2">
                <vertical padding="16">
                    <text text="运行日志" textSize="18sp" textColor="#333" marginBottom="8"/>
                    <text id="logText" text="等待启动..." textSize="12sp" textColor="#666" maxLines="10"/>
                </vertical>
            </card>
            
            <card w="*" margin="8" cardCornerRadius="8" cardElevation="2">
                <vertical padding="16">
                    <text text="按键控制" textSize="18sp" textColor="#333" marginBottom="8"/>
                    <text text="音量上键: 停止脚本" textSize="14sp" textColor="#666"/>
                    <text text="音量下键: 暂停/继续" textSize="14sp" textColor="#666"/>
                    <text text="返回键: 退出脚本" textSize="14sp" textColor="#666"/>
                </vertical>
            </card>
            
            <linear w="*" gravity="center" margin="16">
                <button id="startBtn" text="开始运行" w="0" layout_weight="1" marginRight="8" bg="#4CAF50" textColor="#ffffff"/>
                <button id="pauseBtn" text="暂停" w="0" layout_weight="1" marginLeft="8" bg="#FF9800" textColor="#ffffff" enabled="false"/>
                <button id="stopBtn" text="停止" w="0" layout_weight="1" marginLeft="8" bg="#f44336" textColor="#ffffff" enabled="false"/>
            </linear>
            
            <text text="提示：使用前请开启无障碍服务" textSize="12sp" textColor="#999" gravity="center" margin="8"/>
        </vertical>
    );
    
    // 设置人数选择器
    var peopleOptions = ["1人", "2人", "3人", "4人", "5人"];
    layout.peopleSpinner.setAdapter(new android.widget.ArrayAdapter(context, android.R.layout.simple_spinner_dropdown_item, peopleOptions));
    layout.peopleSpinner.setSelection(1); // 默认选2人
    
    // 日志函数
    function log(msg) {
        ui.run(function() {
            var time = new Date().toLocaleTimeString();
            layout.logText.setText("[" + time + "] " + msg + "\n" + layout.logText.getText());
        });
    }
    
    // 更新状态
    function updateStatus(text, color) {
        ui.run(function() {
            layout.statusText.setText(text);
            layout.statusText.setTextColor(colors.parseColor(color));
        });
    }
    
    // 更新刷新次数
    function updateRetryCount(count) {
        ui.run(function() {
            layout.retryCountText.setText("刷新次数: " + count);
        });
    }
    
    // 更新界面状态
    function updateInterfaceStatus(status, color) {
        ui.run(function() {
            layout.interfaceText.setText("界面状态: " + status);
            layout.interfaceText.setTextColor(colors.parseColor(color));
        });
    }
    
    // 停止脚本
    function stopScript() {
        isRunning = false;
        isPaused = false;
        if (scriptThread) {
            scriptThread.interrupt();
        }
        layout.startBtn.setEnabled(true);
        layout.pauseBtn.setEnabled(false);
        layout.stopBtn.setEnabled(false);
        updateStatus("已停止", "#f44336");
        log("脚本已停止");
        toast("脚本已停止");
    }
    
    // 开始按钮点击
    layout.startBtn.click(function() {
        if (isRunning) {
            toast("脚本已在运行中");
            return;
        }
        
        var name = layout.nameInput.getText().toString();
        if (!name) {
            toast("请输入姓名");
            return;
        }
        
        var interval = parseInt(layout.intervalInput.getText().toString()) || 1000;
        var peopleCount = layout.peopleSpinner.getSelectedItemPosition() + 1;
        
        currentCheckInterval = interval;
        retryCount = 0;
        isRunning = true;
        isPaused = false;
        layout.startBtn.setEnabled(false);
        layout.pauseBtn.setEnabled(true);
        layout.stopBtn.setEnabled(true);
        updateStatus("运行中...", "#4CAF50");
        updateRetryCount(0);
        updateInterfaceStatus("未检测", "#999999");
        
        scriptThread = threads.start(function() {
            var retry = 0;
            while (isRunning && retry < maxRetry) {
                // 检查是否暂停
                while (isPaused && isRunning) {
                    sleep(1000);
                }
                
                if (!isRunning) break;
                
                retry++;
                retryCount = retry;
                updateRetryCount(retry);
                log("第 " + retry + " 次检查...");
                
                // 检查是否有候补按钮
                if (checkAndBook(name, peopleCount)) {
                    log("预约成功！🎉");
                    toast("预约成功！🎉");
                    break;
                }
                
                // 下拉刷新
                swipeDown();
                sleep(interval);
            }
            
            if (retry >= maxRetry) {
                log("已达到最大重试次数，脚本停止");
            }
            
            stopScript();
        });
    });
    
    // 暂停按钮点击
    layout.pauseBtn.click(function() {
        if (!isRunning) {
            toast("脚本未运行");
            return;
        }
        
        isPaused = !isPaused;
        if (isPaused) {
            updateStatus("已暂停", "#FF9800");
            layout.pauseBtn.setText("继续");
            log("脚本已暂停");
            toast("脚本已暂停");
        } else {
            updateStatus("运行中...", "#4CAF50");
            layout.pauseBtn.setText("暂停");
            log("脚本继续运行");
            toast("脚本继续运行");
        }
    });
    
    // 停止按钮点击
    layout.stopBtn.click(function() {
        if (!isRunning) {
            toast("脚本未运行");
            return;
        }
        
        stopScript();
    });
    
    // 检查并预约
    function checkAndBook(name, peopleCount) {
        // 检查是否是填写界面
        // 方法1: 查找姓名输入框
        var nameInput = className("EditText").desc("姓名").findOne(500);
        if (!nameInput) {
            nameInput = className("EditText").textContains("姓名").findOne(500);
        }
        if (!nameInput) {
            nameInput = className("EditText").hint("请输入姓名").findOne(500);
        }
        
        // 方法2: 查找包含"候补票"的标题
        var候补票标题 = text("候补票").findOne(500);
        
        // 方法3: 查找包含"姓名"的文本
        var姓名文本 = text("姓名").findOne(500);
        
        if (nameInput || 候补票标题 || 姓名文本) {
            updateInterfaceStatus("填写界面", "#4CAF50");
            log("发现填写界面！");
            // 直接填写表单
            fillForm(name, peopleCount);
            return true;
        }
        
        // 查找"预约"按钮
        var bookBtn = text("预约").findOne(500);
        if (bookBtn) {
            updateInterfaceStatus("预约按钮", "#4CAF50");
            log("发现预约按钮！");
            bookBtn.click();
            sleep(1000);
            
            // 填写表单
            fillForm(name, peopleCount);
            return true;
        }
        
        // 查找"候补"按钮
        var waitBtn = text("候补").findOne(500);
        if (waitBtn) {
            updateInterfaceStatus("候补按钮", "#4CAF50");
            log("发现候补按钮！");
            waitBtn.click();
            sleep(1000);
            
            // 填写表单
            fillForm(name, peopleCount);
            return true;
        }
        
        // 检查是否是"候补票已达上限"界面
        var limitText = text("候补票已达上限").findOne(500);
        if (limitText) {
            updateInterfaceStatus("上限界面", "#FF9800");
            log("当前候补票已达上限，继续刷新...");
        } else {
            updateInterfaceStatus("其他界面", "#999999");
        }
        
        return false;
    }
    
    // 填写表单
    function fillForm(name, peopleCount) {
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
            nameInput.setText(name);
            log("姓名已填写: " + name);
        }
        
        sleep(300);
        
        // 选择候补人数
        selectPeopleCount(peopleCount);
        
        sleep(300);
        
        // 勾选不可乘坐人员选项（默认选"无"）
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
            
            // 点击对应数字
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
    
    // 按键监听
    events.observeKey();
    
    // 音量上键：停止脚本
    events.onKeyDown("volume_up", function(event) {
        if (isRunning) {
            stopScript();
            log("通过音量键停止脚本");
            toast("脚本已停止");
        }
        event.consumed = true;
    });
    
    // 音量下键：暂停/继续
    events.onKeyDown("volume_down", function(event) {
        if (isRunning) {
            isPaused = !isPaused;
            if (isPaused) {
                updateStatus("已暂停", "#FF9800");
                layout.pauseBtn.setText("继续");
                log("脚本已暂停");
                toast("脚本已暂停");
            } else {
                updateStatus("运行中...", "#4CAF50");
                layout.pauseBtn.setText("暂停");
                log("脚本继续运行");
                toast("脚本继续运行");
            }
        }
        event.consumed = true;
    });
    
    // 返回键：退出脚本
    events.onKeyDown("back", function(event) {
        if (isRunning) {
            var result = confirm("确定要退出脚本吗？");
            if (result) {
                stopScript();
            }
        } else {
            ui.finish();
        }
        event.consumed = true;
    });
    
    // 显示界面
    ui.setContentView(layout);
    log("UI界面已加载，请填写配置后点击开始");
    log("按键控制：音量上(停止)、音量下(暂停/继续)、返回(退出)");
}

// 启动脚本
main();

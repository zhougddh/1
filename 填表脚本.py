#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
网页填表自动化脚本
适用于 Windows、Mac、Linux 系统
使用 Python + Selenium 实现
"""

import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class FormFiller:
    def __init__(self, config_file='config.json'):
        """初始化填表器"""
        self.config_file = config_file
        self.config = self.load_config()
        self.driver = None
    
    def load_config(self):
        """加载配置文件"""
        try:
            with open(self.config_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"配置文件 {self.config_file} 不存在，使用默认配置")
            return self.get_default_config()
    
    def get_default_config(self):
        """获取默认配置"""
        return {
            "url": "https://example.com/form",  # 表单网页地址
            "fields": {
                # 字段名: 值
                "name": "张三",
                "phone": "13800138000",
                "email": "zhangsan@example.com",
                "address": "北京市朝阳区"
            },
            "submit_button": "//button[@type='submit']",  # 提交按钮的 XPath
            "wait_time": 10,  # 等待时间（秒）
            "headless": False  # 是否无头模式
        }
    
    def start_driver(self):
        """启动浏览器"""
        chrome_options = Options()
        if self.config.get('headless', False):
            chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        # 尝试不同的浏览器驱动路径
        try:
            # 优先使用系统 PATH 中的 chromedriver
            self.driver = webdriver.Chrome(options=chrome_options)
        except Exception as e:
            print(f"启动浏览器失败: {e}")
            print("请确保已安装 Chrome 浏览器和对应版本的 chromedriver")
            return False
        
        return True
    
    def fill_form(self):
        """填写表单"""
        if not self.start_driver():
            return False
        
        try:
            # 打开网页
            print(f"打开网页: {self.config['url']}")
            self.driver.get(self.config['url'])
            
            # 等待页面加载
            wait = WebDriverWait(self.driver, self.config.get('wait_time', 10))
            
            # 填写字段
            fields = self.config.get('fields', {})
            for field_name, field_value in fields.items():
                print(f"填写字段: {field_name} = {field_value}")
                
                # 尝试不同的定位方式
                elements = []
                
                # 按 id 定位
                try:
                    elements = self.driver.find_elements(By.ID, field_name)
                except:
                    pass
                
                # 按 name 定位
                if not elements:
                    try:
                        elements = self.driver.find_elements(By.NAME, field_name)
                    except:
                        pass
                
                # 按 class 定位
                if not elements:
                    try:
                        elements = self.driver.find_elements(By.CLASS_NAME, field_name)
                    except:
                        pass
                
                # 按 XPath 定位
                if not elements:
                    try:
                        elements = self.driver.find_elements(By.XPATH, f"//input[@name='{field_name}']")
                    except:
                        pass
                
                if elements:
                    for element in elements:
                        try:
                            if element.is_displayed() and element.is_enabled():
                                element.clear()
                                element.send_keys(str(field_value))
                                break
                        except:
                            continue
                else:
                    print(f"警告: 未找到字段 {field_name}")
            
            # 提交表单
            submit_button = self.config.get('submit_button')
            if submit_button:
                print("提交表单...")
                try:
                    # 按 XPath 定位提交按钮
                    button = wait.until(EC.element_to_be_clickable((By.XPATH, submit_button)))
                    button.click()
                    print("表单提交成功！")
                except Exception as e:
                    print(f"提交表单失败: {e}")
            
            # 等待结果
            time.sleep(3)
            
        except Exception as e:
            print(f"填表过程出错: {e}")
            return False
        finally:
            # 关闭浏览器
            if self.driver:
                print("关闭浏览器...")
                self.driver.quit()
        
        return True
    
    def create_config_template(self):
        """创建配置文件模板"""
        default_config = self.get_default_config()
        with open(self.config_file, 'w', encoding='utf-8') as f:
            json.dump(default_config, f, ensure_ascii=False, indent=2)
        print(f"已创建配置文件模板: {self.config_file}")

def main():
    """主函数"""
    print("网页填表自动化脚本")
    print("=" * 50)
    
    filler = FormFiller()
    
    # 如果配置文件不存在，创建模板
    try:
        with open('config.json', 'r') as f:
            pass
    except FileNotFoundError:
        filler.create_config_template()
        print("请编辑 config.json 文件，配置表单信息")
        return
    
    # 开始填表
    print("开始填表...")
    success = filler.fill_form()
    
    if success:
        print("填表完成！")
    else:
        print("填表失败，请检查错误信息")

if __name__ == "__main__":
    main()

import requests
import json

def verify_fish_token(token):
    """
    验证 Fish Audio Token 是否有效
    """
    print("=" * 50)
    print("验证 Fish Audio Token")
    print("=" * 50)
    print(f"Token: {token}")
    print()

    # Fish Audio API 端点
    api_url = "https://api.fish.audio/v1/tts"
    
    # 测试请求头
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # 测试数据（简短的文本）
    test_data = {
        "text": "测试",
        "reference_id": ""  # 可以留空或使用特定的发音人ID
    }
    
    try:
        print("正在验证 Token...")
        print(f"API 端点: {api_url}")
        print()
        
        # 发送测试请求
        response = requests.post(
            api_url,
            headers=headers,
            json=test_data,
            timeout=10
        )
        
        print(f"HTTP 状态码: {response.status_code}")
        print()
        
        # 检查响应
        if response.status_code == 200:
            print("✓ Token 验证成功！")
            print("✓ Token 有效，可以使用 Fish Audio 服务")
            return True
        elif response.status_code == 401:
            print("✗ Token 无效或已过期")
            print("✗ 请检查 Token 是否正确")
            return False
        elif response.status_code == 403:
            print("✗ Token 权限不足")
            print("✗ 请检查 Token 是否有访问权限")
            return False
        else:
            print(f"✗ 未知错误: {response.status_code}")
            print(f"响应内容: {response.text[:200]}")
            return False
            
    except requests.exceptions.Timeout:
        print("✗ 请求超时")
        print("✗ 请检查网络连接")
        return False
    except requests.exceptions.ConnectionError:
        print("✗ 连接失败")
        print("✗ 请检查网络连接或 API 地址")
        return False
    except Exception as e:
        print(f"✗ 发生错误: {str(e)}")
        return False

def main():
    # 您提供的 Token
    token = "03061fd2233d46ea9c8b715edd4cc64a"
    
    # 验证 Token
    is_valid = verify_fish_token(token)
    
    print()
    print("=" * 50)
    if is_valid:
        print("结论: Token 有效 ✓")
    else:
        print("结论: Token 无效 ✗")
    print("=" * 50)

if __name__ == "__main__":
    main()

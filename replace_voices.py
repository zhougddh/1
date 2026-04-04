import json
import os

edge_tts_voices = [
    {"name": "晓晓", "desc": "温柔女声", "vid": "zh-CN-XiaoxiaoNeural", "gender": "Female"},
    {"name": "云希", "desc": "阳光男声", "vid": "zh-CN-YunxiNeural", "gender": "Male"},
    {"name": "云扬", "desc": "新闻男声", "vid": "zh-CN-YunyangNeural", "gender": "Male"},
    {"name": "晓伊", "desc": "温柔女声", "vid": "zh-CN-XiaoyiNeural", "gender": "Female"},
    {"name": "云健", "desc": "成熟男声", "vid": "zh-CN-YunjianNeural", "gender": "Male"},
    {"name": "晓辰", "desc": "亲切女声", "vid": "zh-CN-XiaochenNeural", "gender": "Female"},
    {"name": "晓涵", "desc": "温柔女声", "vid": "zh-CN-XiaohanNeural", "gender": "Female"},
    {"name": "晓梦", "desc": "甜美女声", "vid": "zh-CN-XiaomengNeural", "gender": "Female"},
    {"name": "晓墨", "desc": "知性女声", "vid": "zh-CN-XiaomoNeural", "gender": "Female"},
    {"name": "晓睿", "desc": "温柔女声", "vid": "zh-CN-XiaoruiNeural", "gender": "Female"},
    {"name": "晓双", "desc": "可爱女声", "vid": "zh-CN-XiaoshuangNeural", "gender": "Female"},
    {"name": "晓萱", "desc": "温柔女声", "vid": "zh-CN-XiaoxuanNeural", "gender": "Female"},
    {"name": "晓颜", "desc": "成熟女声", "vid": "zh-CN-XiaoyanNeural", "gender": "Female"},
    {"name": "晓悠", "desc": "可爱女声", "vid": "zh-CN-XiaoyouNeural", "gender": "Female"},
    {"name": "云枫", "desc": "磁性男声", "vid": "zh-CN-YunfengNeural", "gender": "Male"},
    {"name": "云皓", "desc": "稳重男声", "vid": "zh-CN-YunhaoNeural", "gender": "Male"},
    {"name": "云夏", "desc": "年轻男声", "vid": "zh-CN-YunxiaNeural", "gender": "Male"},
    {"name": "云野", "desc": "自然男声", "vid": "zh-CN-YunyeNeural", "gender": "Male"},
    {"name": "云泽", "desc": "沉稳男声", "vid": "zh-CN-YunzeNeural", "gender": "Male"},
]

print("=" * 50)
print("替换音色为 Edge-TTS 免费音色")
print("=" * 50)
print()

input_file = r"C:\Users\周朝\Desktop\分轨\ybindz.json"
output_file = r"C:\Users\周朝\Desktop\分轨\ybindz_free.json"

print(f"读取文件: {input_file}")
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"替换音色...")

for category_name, category_data in data.items():
    if 'list' in category_data:
        new_list = []
        for i, voice in enumerate(category_data['list']):
            edge_voice = edge_tts_voices[i % len(edge_tts_voices)]
            new_voice = {
                "name": edge_voice["name"],
                "desc": f"{edge_voice['desc']}, {voice.get('desc', '')}",
                "vid": edge_voice["vid"],
                "gender": edge_voice["gender"],
                "type": "Edge-TTS",
                "free": True
            }
            new_list.append(new_voice)
        category_data['list'] = new_list
        category_data['token'] = "no"
        category_data['desc'] = "Edge-TTS 免费音色"
        category_data['type'] = "Edge-TTS"

print(f"保存文件: {output_file}")
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print()
print(f"✓ 完成！已保存到: {output_file}")
print(f"  所有音色已替换为 Edge-TTS 免费音色")
print()
input("按回车键退出...")

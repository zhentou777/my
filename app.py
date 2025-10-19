from flask import Flask, request, jsonify, render_template, redirect, url_for
import json
import os
from datetime import datetime

# 创建Flask应用
app = Flask(__name__, static_folder='.', static_url_path='')

# 配置项
app.config['JSON_AS_ASCII'] = False
app.config['DEBUG'] = False

# 留言存储文件
MESSAGES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'messages.json')

# 确保留言文件存在
def ensure_messages_file_exists():
    if not os.path.exists(MESSAGES_FILE):
        with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)

# 读取留言
def get_messages():
    ensure_messages_file_exists()
    with open(MESSAGES_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

# 保存留言
def save_message(message):
    messages = get_messages()
    messages.append(message)
    with open(MESSAGES_FILE, 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    # 提供静态HTML文件
    return app.send_static_file('index.html')

@app.route('/submit_message', methods=['POST'])
def submit_message():
    try:
        # 获取表单数据
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # 验证数据
        if not name or not email or not message:
            return jsonify({'status': 'error', 'message': '请填写所有必填字段'}), 400
        
        # 创建留言对象
        new_message = {
            'name': name,
            'email': email,
            'message': message,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        # 保存留言
        save_message(new_message)
        
        return jsonify({'status': 'success', 'message': '留言提交成功！'}), 200
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/admin/messages')
def admin_messages():
    # 这里可以添加简单的密码保护
    messages = get_messages()
    # 返回HTML格式的留言列表
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>留言管理</title>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            h1 {{ color: #333; }}
            .message {{ border-bottom: 1px solid #ddd; padding: 15px 0; }}
            .message:last-child {{ border-bottom: none; }}
            .message-header {{ font-weight: bold; color: #2c3e50; }}
            .message-time {{ color: #7f8c8d; font-size: 0.9em; }}
            .message-content {{ margin-top: 10px; white-space: pre-wrap; }}
        </style>
    </head>
    <body>
        <h1>留言管理</h1>
        <p>共有 {len(messages)} 条留言</p>
        <div>
    """
    
    # 按时间倒序显示
    for msg in reversed(messages):
        html += f"""
        <div class="message">
            <div class="message-header">
                {msg['name']} <span class="message-time">({msg['timestamp']})</span>
            </div>
            <div class="message-email">{msg['email']}</div>
            <div class="message-content">{msg['message']}</div>
        </div>
        """
    
    html += """
        </div>
    </body>
    </html>
    """
    
    return html

# 生产环境部署支持
if __name__ == '__main__':
    # 开发环境运行
    app.run(debug=False, host='0.0.0.0', port=5000)

# WSGI入口点
def application(environ, start_response):
    return app.wsgi_app(environ, start_response)
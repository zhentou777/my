# 使用官方Python镜像作为基础镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制requirements.txt文件
COPY requirements.txt .

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制所有文件到工作目录
COPY . .

# 设置环境变量
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# 创建messages.json文件（如果不存在）
RUN python -c "import os; open('messages.json', 'w').write('[]') if not os.path.exists('messages.json') else None"

# 暴露应用端口
EXPOSE 5000

# 使用Gunicorn作为WSGI服务器运行应用
CMD ["gunicorn", "app:application", "-w", "2", "-b", "0.0.0.0:5000"]
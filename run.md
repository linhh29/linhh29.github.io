# 论文信息自动获取工具使用说明

## 功能说明

这个工具可以自动从 Google Scholar 获取你的论文信息，下载每篇论文的第一张图片，并生成符合 `config.js` 格式的论文列表，你只需要复制粘贴即可。

## 安装依赖

首先需要安装 Python 依赖包：

```bash
cd src_build
pip install -r requirements.txt
```

或者手动安装：

```bash
pip install sort-google-scholar beautifulsoup4 requests lxml
```

如果使用 conda：

```bash
conda install -c conda-forge beautifulsoup4 requests lxml
pip install sort-google-scholar
```

## 使用方法

1. **进入项目目录**：
   ```bash
   cd src_build
   ```

2. **运行脚本**：
   ```bash
   python fetch_papers.py
   ```

3. **等待处理完成**：
   - 脚本会自动从 Google Scholar 获取你的论文列表
   - 自动下载每篇论文的第一张图片到 `public/materials/publications/` 目录
   - 生成格式化的论文列表

4. **复制结果**：
   - 脚本运行完成后，会在终端输出格式化的论文列表
   - 同时会保存到 `papers_output.txt` 文件中
   - 直接复制输出内容，替换 `config.js` 中的 `papers` 字段即可

## 输出格式

生成的格式如下：

```javascript
  papers: [
    {
      title: '[Venue Year] Paper Title',
      authors: '**First Author**, ==Hehai Lin==, Other Authors',
      venue: 'Venue Name',
      year: '2025',
      link: 'https://paper-url.com',
    },
    // ... 更多论文
  ],
```

## 注意事项

1. **Google Scholar 访问**：
   - 如果遇到访问限制，可能需要使用代理或等待一段时间后重试
   - scholarly 库可能会被 Google Scholar 限制，如果频繁失败，可以手动修改脚本中的论文信息

2. **图片下载**：
   - 图片会自动保存为 `1.png`, `2.png`, `3.png` 等（按论文顺序）
   - 如果某篇论文的图片下载失败，可以手动下载并保存到对应位置
   - 已存在的图片不会重复下载

3. **作者标记**：
   - 脚本会自动识别第一作者并用 `**` 标记
   - 会自动识别你的名字（Hehai Lin）并用 `==` 标记
   - 如果标记不正确，可以手动调整

4. **手动调整**：
   - 如果自动获取的信息不准确，可以手动编辑 `papers_output.txt` 或直接修改 `config.js`
   - 会议/期刊名称如果未正确提取，需要手动添加

## 故障排除

- **如果 scholarly 库无法访问 Google Scholar**：
  可以手动创建一个 JSON 文件，包含论文信息，然后修改脚本读取该文件

- **如果图片下载失败**：
  可以手动访问论文页面，找到第一张图片，右键保存到 `public/materials/publications/` 目录

- **如果生成的格式不对**：
  检查 `config.js` 中的现有格式，确保脚本生成的格式一致


python fetch_papers.py

替换paper字段到config.js
替换总引用数到config.js line 18

npm install
npm run dev
npm run build

将dist commit到github上
git add *
git commit -m "Update"
git push -u origin main
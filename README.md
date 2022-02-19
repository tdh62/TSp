# TSp

## 简介

！！！开发过程中的版本可能存在各种问题和不足，请及时进行数据备份！！！

一个觉得很好玩还可以学习到知识于是开始尝试的个人网站系统，目前处于开发早期阶段

项目地址：[Github](https://github.com/tdh62/TSp)

## 特性

* 在线撰写、修改文章
* 静态网站
* 无需数据库，依托对象存储服务即可运行
* 支持腾讯云对象存储 COS（其他别急，一个一个慢慢来）
* 使用密码对文章内容进行保护(AES)
* 发布 Markdown 格式或 HTML 格式的页面
* 为页面设置固定链接

## 结构

```text
Tsp
├─admin         管理界面
│  └─article    文章管理相关
├─component     组件
│  ├─editor     选用的 Markdown 编辑器（参见了解更多部分）
│  └─storage    控制本地和远程存储
├─css           存放全站通用的样式表文件
├─global        存放全站通用的 JavaScript 文件
├─js            不同页面所需的 JavaScript 文件
└─test          开发过程用于测试的东西，不应该出现在正式发布的项目里
```

## 任务

* [x] 静态页面直接写入 html
* [x] 避免固定链接文章直接覆盖重要文件（如 index.html 等） 
* [x] 文章页面文章的基本信息展示
* [x] 无限滚动展示所有文章
* [x] 分页展示所有文章
* [x] 分类管理页面
* [x] SEO 优化(关键词，描述等)
* [ ] 处理文章标签
* [ ] 让 UI 好看一点点
* [ ] 图片上传

## 问答

1.为什么不用 Hexo?

这就要说道一开始的初衷了，看到 Hexo 的静态站点，觉得真的很不错，想自己也搞一个，
又不想依赖 Node.js，于是就有了这个项目。

2.这是啥？我可以用它干什么？

目前这是一个半成品，自己修改一下可以做一个自己的网站之类的。

3.还有什么功能？

我不知道，还在边学边做呢。

4.咕咕咕？

哎？又鸽了吗？嘛、还有很多事情要去做的嘛、

## 了解更多

在这个项目里主要使用到的其他一些东西：

* Vue 3：渐进式 JavaScript 框架，灵活高效地放下繁琐的 DOM 管理 [官方网站](https://v3.vuejs.org/) [Github](https://github.com/vuejs)
* Element Plus：一个 Vue 3 UI 框架，用的人多不管怎么说都可以很方便的找到文档和帮助  [官方网站](https://element-plus.org/) [项目地址](https://github.com/element-plus/element-plus)
* CryptoJS：标准和安全加密算法的 JavaScript 实现，真是帮大忙了 [项目地址](https://code.google.com/archive/p/crypto-js/)
* Editor.md 非常棒的 Markdown 编辑器，让我甚至愿意为它在编辑页面导入 jQuery ，但是... [项目地址](https://github.com/pandao/editor.md)



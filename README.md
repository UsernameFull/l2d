# l2d

本项目基于[AzurLaneL2DViewer](https://github.com/alg-wiki/AzurLaneL2DViewer)修改而来，支持点击对应区域触发动作(需要.model3.json格式规范，具体格式可参考[Json配置](http://live2d.pavostudio.com/doc/zh-cn/live2d/model-config/))。

# 更新

2020.10.15 添加按Order排序功能

# 使用方法
在网页上添加以下脚本即可
```html
<script src="https://cdn.jsdelivr.net/gh/UsernameFull/l2d@0.2/js/frame/live2dcubismcore.min.js"></script>
    <!-- Include Pixi. -->
    <script src="https://cdn.jsdelivr.net/gh/UsernameFull/l2d@0.2/js/frame/pixi.min.js"></script>
    <!-- Include Cubism Components. -->
    <script src='https://cdn.jsdelivr.net/gh/UsernameFull/l2d@0.2/js/live2dcubismframework.js'></script>
    <script src='https://cdn.jsdelivr.net/gh/UsernameFull/l2d@0.2/js/live2dcubismpixi.js'></script>
    <!-- User's Script -->
    <script src="https://cdn.jsdelivr.net/gh/UsernameFull/l2d@0.2/js/l2d.js"></script>
    <!-- <script src="https://cdn.jsdelivr.net/gh/litstronger/live2d-moc3@master/js/main.js"></script> -->
    <script src='https://cdn.jsdelivr.net/gh/UsernameFull/l2d@0.2/js/main.js'></script>
    <script>
        window.onload = () => {
        var config = {
        width: window.innerWidth,
        height: window.innerHeight,
        left: '0px',
        bottom: '0px',
        basePath: 'https://cdn.jsdelivr.net/gh/UsernameFull/l2d@0.2/js/Resources',
        role: 'lafei_4',
        background: 'https://cdn.jsdelivr.net/gh/alg-wiki/AzurLaneL2DViewer@gh-pages/assets/bg/bg_church_jp.png',
        opacity: 1,
        mobile: false
    }
    var v = new Viewer(config);
    }
    </script>
```
# 预览

[预览](https://aged-frost-ce9d.tohowtodoit.workers.dev/)

# TODO

* 格式化碧蓝模型
* 支持较为完整的json配置
* 声音支持
* 文本支持
* 模型切换

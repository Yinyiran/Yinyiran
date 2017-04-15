// 书名选择 弹窗 显示赋值；
var box = document.getElementById('classBox'),
    boxInput = box.getElementsByTagName('input')[0],
    choose = document.getElementById('chooseBox'),
    chooseInput = choose.getElementsByTagName('input')[0];

// 设置弹窗高度
box.style.top = choose.parentNode.offsetTop + 'px';
// 事件委托到li和Input;
box.addEventListener('click', function(e) {
    var tagName = e.target.tagName.toLowerCase();
    if (tagName == 'input' || 'i') {
        // 防止点击第一行的“书名”两个字隐藏；
        e.stopPropagation();
        box.parentNode.style.display = 'none';
    }
    // 点击li隐藏弹窗 并赋值；
    if (tagName == 'li') {
        box.parentNode.style.display = 'none';
        chooseInput.value = e.target.innerText;
    }
});
// 点击显示书籍选择弹窗
choose.parentNode.onclick = function() {
    box.parentNode.style.display = 'block';
    // 弹窗inputvalue是展示的那个,防止重复选择
    boxInput.value = chooseInput.value;
};

// 输入错误弹窗弹窗
var errmark = document.getElementById('errmark'),
    errbtn = errmark.getElementsByClassName('btn')[0];
errbtn.onclick = function() {
    errmark.style.display = "none";
};

// 模拟提交错误
var submit = document.getElementById('submit');
submit.onclick = function() {
    errmark.style.display = "block";
};




// 上传图片
var upload = document.getElementById('upload'), //上传
    pic = document.getElementById('pic'), //图片
    addBox = document.getElementById('add'), //空图片样式
    maxsize = 100 * 1024, //超过100k进行压缩
    minSrc = ''; //
if (typeof(FileReader) === 'undefined') {
    alert("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
    upload.setAttribute('disabled', 'disabled');
}
upload.addEventListener('change', function() {
    addBox.style.display = 'none';
    pic.style.display = 'block';
    close.style.display = 'block';
    var file = this.files[0],
        result = '',
        reader = new FileReader();
    if (file) {
        pic.setAttribute('src', 'img/loading.gif');
    }
    reader.readAsDataURL(file);
    reader.onload = function(e) {
        var v = 　this.result; //获取到base64的图片
        img = new Image();
        img.src = v;
        //大于100k图片进行压缩
        if (v.length >= maxsize) {
            img.onload = function() {
                minSrc = compress(img, 600, 10);
                pic.setAttribute('src', minSrc);
                //ajax minSrc
            };
        } else {
            pic.setAttribute('src', v);
            //ajax v
        }
    };
});

// 图片压缩函数
function compress(sourceImg, proportion, quality) {
    var area = sourceImg.width * sourceImg.height, //源图片的总大小
        height = sourceImg.height * proportion,
        width = sourceImg.width * proportion,
        compressCvs = document.createElement('canvas'); //压缩的图片画布
    //压缩的图片配置宽高
    compressCvs.width = width;
    compressCvs.height = height;
    var compressCtx = compressCvs.getContext("2d");
    //解决ios 图片大于2000000像素无法用drawImage的bug
    if (area > 2000000 && navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        //瓦片绘制
        var smallCvs = document.createElement("canvas"),
            smallCtx = smallCvs.getContext("2d"),
            count = Math.ceil(area / 1000000), //分割的数量
            cvsWidth = width / count, //每个小canvas的宽度
            picWidth = sourceImg.width / count; //分割成小图片的宽度
        smallCvs.height = compressCvs.height;
        smallCvs.width = width / count;
        //拼凑成大的canvas
        for (var i = 0; i < count; i++) {
            smallCtx.drawImage(sourceImg, i * picWidth, 0, picWidth, sourceImg.height, 0, 0, cvsWidth, height);
            compressCtx.drawImage(smallCvs, i * cvsWidth, 0, cvsWidth, height);
        }
    } else {
        compressCtx.drawImage(sourceImg, 0, 0, sourceImg.width, sourceImg.height, 0, 0, width, height);
    }
    var newUrl = compressCvs.toDataURL('image/jpeg', quality / 100);
    return newUrl;
}


// 点击关闭按钮
var close = document.getElementById('close');
close.onclick = function() {
    // window.location.reload();
    pic.style.display = 'none';
    pic.src = '#';
    addBox.style.display = 'block';
    this.style.display = "none";
};

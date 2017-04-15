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
var upload = document.getElementById('upload'), //上传input
    pic = document.getElementById('pic'), //图片
    addBox = document.getElementById('add'), //空图片样式
    close = document.getElementById('close'),
    maxsize = 50 * 1024, //超过50k进行压缩
    minSrc = ''; //


if (typeof(FileReader) === 'undefined') { // 判断浏览器是否支持filereader属性
    alert("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
    upload.setAttribute('disabled', 'disabled'); // 并将上传按钮变为不可用；
}
// input上传按钮监听
upload.addEventListener('change', function() {
    addBox.style.display = 'none'; // 上传按钮隐藏
    pic.style.display = 'block'; // 图片标签显示
    close.style.display = 'block'; // 右上角关闭按钮显示

    var file = this.files[0], // 获取的上环文件
        result = '',
        reader = new FileReader(); //调用H5文件调用函数
    // 判断上传文件的类型，如果不是就停止函数
    if (!/\/(?:jpeg|png|gif)/i.test(file.type)){
        errmark.style.display = 'block';
        hide(); // 按钮和图片隐藏
        return;
    }
    if (file) { // 如果有文件就添加背景加载动画图；
        pic.setAttribute('src', 'img/loading.gif');
    }else { // 没有文件传过来就退出函数
        return;
    }
    reader.readAsDataURL(file); //将文件读取为 DataURL 64位编码
    reader.onload = function(e) { // 文件读取成功完成时触发
        var v = 　this.result, // reader.result 获取到base64的图片
            img = new Image(); // 创建图片对象
            img.src = v;

        //大于maxsize图片进行压缩
        if (v.length >= maxsize) {
            console.log(v.length); // 图片原大小

            img.onload = function() { // 图片加载完成之后再执行函数
                minSrc = compress(img); // compress函数获得压缩后的64位数据；
                pic.setAttribute('src', minSrc); // 图片路径；
                //ajax minSrc
            };
        } else { // 如果小于50k 那么就直接赋值；
            pic.setAttribute('src', v);
            //ajax v
        }
    };
});


// 图片压缩函数
function compress(img) {
    var initSize = img.src.length,
        width = img.width,
        height = img.height,
    //    用于压缩图片的canvas
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext('2d'),
    //    瓦片canvas
        tCanvas = document.createElement("canvas"),
        tctx = tCanvas.getContext("2d");

    //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
    var ratio;
    if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
    } else {
        ratio = 1;
    }

    //如果图片像素大于100万则使用瓦片绘制 iso下问题；
    var count;
    if ((count = width * height / 1000000) > 1) {
        count = Math.sqrt(count) + 1; //计算要分成多少块瓦片
        // 计算每块瓦片的宽和高
        var nw = width / count;
        var nh = height / count;

        canvas.width = nw;
        canvas.height = nh;

        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                ctx.drawImage(canvas, i * nw, j * nh, nw, nh);
            }
        }
    } else {
        ctx.drawImage(img, 0, 0, width, height);
    }


    canvas.width = width;
    canvas.height = height;
    //铺底色 防止图片变黑
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);


    //进行最小压缩
    var ndata = canvas.toDataURL("image/jpeg", 0.1);
    canvas.width = canvas.height = 0;
    console.log(ndata.length);
    return ndata;
}





// 点击关闭按钮
close.onclick = function() {
    hide();
};
function hide() {
    pic.style.display = 'none';
    pic.src = '#';
    addBox.style.display = 'block';
    close.style.display = "none";
}

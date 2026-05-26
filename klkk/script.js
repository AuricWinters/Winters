// 关心话语数组
const caringMessages = [
    "记得多喝水哦，保持身体水分～",
    "今天过得怎么样？希望你一切顺利！",
    "累了就休息一下，别给自己太大压力",
    "你很棒，要相信自己！",
    "天气变凉了，记得添衣保暖",
    "今天有没有好好吃饭呀？",
    "无论发生什么，我都在你身边",
    "别忘了深呼吸，放松心情",
    "你值得所有的美好",
    "今天也要开心哦！",
    "早点睡觉，不要熬夜",
    "想你了，你在忙什么呢？",
    "遇到困难不要怕，一切都会过去的",
    "给自己一个微笑，今天会更美好",
    "记得按时吃饭，照顾好自己",
    "你是最棒的，我相信你",
    "今天的你也很努力，辛苦了",
    "不管多忙，都要记得休息",
    "愿你每一天都充满阳光",
    "你值得被爱，被温柔对待",
    "遇到不开心的事，记得告诉我",
    "今天的你，比昨天更优秀",
    "累了就停下来，给自己充充电",
    "你真的很厉害，不要低估自己",
    "记得保持微笑，因为你笑起来很好看",
    "不管多远，我的关心都在你身边",
    "今天也要加油，你可以的！",
    "好好照顾自己，我会担心你的",
    "你是独一无二的，特别的存在",
    "记得做自己喜欢的事，让自己开心",
    "天气好的话，出去走走吧",
    "你已经做得很好了，不要自责",
    "遇到挫折不要灰心，这只是暂时的",
    "记得给自己一点奖励，你值得",
    "今天有没有什么好玩的事发生？",
    "不管发生什么，我都支持你",
    "你是我的小太阳，照亮我的每一天",
    "记得保持乐观，一切都会好起来的",
    "累了就回家，我煮了你喜欢的菜",
    "你真的很善良，要继续保持哦",
    "今天有没有遇到什么开心的事？",
    "不管多忙，都要记得想我哦",
    "你是最特别的，没有人能替代你",
    "记得保持好心情，快乐最重要",
    "遇到困难的时候，记得我在你身后",
    "你真的很有才华，不要埋没自己",
    "今天也要好好爱自己",
    "不管多远，我都会想你的",
    "你是我的骄傲，我为你感到自豪",
    "记得照顾好自己的身体，健康最重要",
    "想和你一起分享今天的快乐",
    "你笑起来的时候，整个世界都亮了",
    "不管遇到什么，我都愿意和你一起面对",
    "今天的风很温柔，就像你的笑容一样",
    "记得给自己留一点时间，做自己喜欢的事",
    "你是我生命中最美好的遇见",
    "不管多晚，我都会等你回家",
    "今天的你，比任何时候都美丽",
    "遇到不开心的事，就来找我倾诉吧",
    "你值得拥有世界上最好的一切",
    "记得每天都要给自己一个小目标",
    "你真的很有魅力，不要怀疑自己",
    "不管多忙，都要记得吃饭哦",
    "你是我前进的动力",
    "今天的阳光很好，适合和你一起散步",
    "记得保持好奇心，生活才会更有趣",
    "你真的很聪明，什么问题都难不倒你",
    "不管多远，我们的心都在一起",
    "今天的你，又离梦想近了一步",
    "遇到困难不要退缩，你比你想象的更强大",
    "记得要学会原谅自己，没有人是完美的",
    "你是我最想珍惜的人",
    "不管多累，都要记得微笑",
    "今天的你，特别可爱",
    "记得要对自己好一点，你值得",
    "你真的很努力，我都看在眼里",
    "不管发生什么，我都会一直陪在你身边",
    "今天的你，闪闪发光",
    "遇到开心的事，记得和我分享哦",
    "记得要保持童心，生活才会更快乐",
    "你是我生命中最珍贵的礼物",
    "不管多忙，都要记得休息一下",
    "今天的你，比昨天更坚强",
    "遇到挫折不要放弃，坚持就是胜利",
    "记得要多喝水，保持健康",
    "你真的很有责任心，我很欣赏你",
    "不管多远，我都会想着你",
    "今天的你，特别有活力",
    "遇到不开心的事，就深呼吸，一切都会过去的",
    "记得要照顾好自己，我会担心的",
    "你是我最想保护的人",
    "不管多累，都要记得明天会更好",
    "今天的你，特别有魅力",
    "遇到困难不要怕，我们一起解决",
    "记得要保持乐观，生活才会更美好",
    "你真的很善良，值得被温柔对待",
    "不管多忙，都要记得给自己一点空间",
    "今天的你，特别棒",
    "遇到开心的事，就大声笑出来吧",
    "记得要相信自己，你是最棒的",
    "你是我生命中最美丽的风景",
    "不管多远，我都会一直爱你",
    "今天的你，光芒四射",
    "记得给自己一个拥抱，你辛苦了",
    "不管天气如何，你的笑容都是晴天",
    "你是我的快乐源泉",
    "记得偶尔放松一下，生活需要调味剂",
    "你做的每一件事都很有意义",
    "今天的你，比昨天更接近幸福",
    "遇到烦恼时，记得我在听你诉说",
    "你值得所有的掌声和鼓励",
    "记得要珍惜当下的每一刻",
    "你是我生命中最重要的人",
    "不管多忙，都要记得给心灵放个假",
    "今天的你，特别有气质",
    "遇到挑战不要怕，你有足够的能力",
    "记得要感谢自己的努力",
    "你是我最想守护的人",
    "不管多远，我们的感情不会变",
    "今天的你，特别有活力",
    "遇到困难时，记得你不是一个人",
    "记得要对自己有信心",
    "你是我生命中的惊喜",
    "不管多累，都要记得享受生活",
    "今天的你，特别出色",
    "遇到不开心的事，记得时间会治愈一切",
    "记得要保持积极的心态",
    "你是我最想依赖的人",
    "不管多忙，都要记得和朋友联系",
    "今天的你，特别温暖",
    "遇到挫折时，记得这是成长的机会",
    "记得要给自己设定合理的目标",
    "你是我生命中的阳光",
    "不管多远，我都会为你祈祷",
    "今天的你，特别有才华",
    "遇到困难时，记得坚持就是胜利",
    "记得要照顾好自己的情绪",
    "你是我最想珍惜的宝藏",
    "不管多忙，都要记得享受美食",
    "今天的你，特别有魅力",
    "遇到不开心的事，记得做些让自己快乐的事",
    "记得要保持学习的心态",
    "你是我生命中的奇迹",
    "不管多远，我都会支持你",
    "今天的你，特别坚强",
    "遇到困难时，记得相信自己的能力",
    "记得要给自己一些奖励",
    "你是我最想陪伴的人",
    "不管多忙，都要记得欣赏身边的美景",
    "今天的你，特别有创意",
    "遇到挫折时，记得这只是暂时的",
    "记得要保持感恩的心态",
    "你是我生命中的幸运",
    "不管多远，我都会想着你",
    "今天的你，特别有勇气",
    "遇到困难时，记得寻求帮助",
    "记得要对自己好一点",
    "你是我最想保护的人",
    "不管多忙，都要记得休息",
    "今天的你，特别有耐心",
    "遇到不开心的事，记得倾诉",
    "记得要保持健康的生活方式",
    "你是我生命中的温暖",
    "不管多远，我都会爱你",
    "今天的你，特别有智慧",
    "遇到困难时，记得保持冷静",
    "记得要相信未来会更好",
    "你是我最想珍惜的人",
    "不管多忙，都要记得给自己放松的时间",
    "今天的你，特别有活力",
    "遇到挫折时，记得总结经验",
    "记得要对自己有信心",
    "你是我生命中的希望",
    "不管多远，我都会为你加油",
    "今天的你，特别有魅力",
    "遇到困难时，记得坚持到底",
    "记得要享受生活的每一刻",
    "你是我最想陪伴的人",
    "不管多忙，都要记得照顾好自己",
    "今天的你，特别出色",
    "遇到不开心的事，记得转移注意力",
    "记得要保持积极的态度",
    "你是我生命中的阳光",
    "不管多远，我都会想着你",
    "今天的你，特别坚强",
    "遇到困难时，记得相信自己",
    "记得要给自己一些空间",
    "你是我最想珍惜的人",
    "不管多忙，都要记得和家人联系",
    "今天的你，特别有才华",
    "遇到挫折时，记得这是成长的机会",
    "记得要保持学习的热情",
    "你是我生命中的惊喜",
    "不管多远，我都会支持你",
    "今天的你，特别有活力",
    "遇到困难时，记得坚持就是胜利",
    "记得要对自己好一点",
    "你是我最想守护的人",
    "不管多忙，都要记得享受美食",
    "今天的你，特别有魅力",
    "遇到不开心的事，记得做些让自己快乐的事",
    "记得要保持感恩的心态",
    "你是我生命中的奇迹"
];

// 弹窗容器
const popupContainer = document.getElementById('popup-container');
const showPopupBtn = document.getElementById('show-popup');

// 生成随机位置
function getRandomPosition() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = 300;
    const popupHeight = 150;
    
    const maxX = viewportWidth - popupWidth - 20;
    const maxY = viewportHeight - popupHeight - 20;
    
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    return { x, y };
}

// 生成随机颜色
function getRandomColor() {
    const colors = [
        '#9370DB', '#BA55D3', '#9932CC', '#8A2BE2', '#9400D3',
        '#8B008B', '#800080', '#663399', '#4B0082', '#483D8B',
        '#7B68EE', '#6A5ACD', '#483D8B', '#704214', '#5D4037'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 生成随机对角线线性渐变
function getRandomGradient() {
    // 鲜艳的颜色数组
    const colors = [
        '#9370DB', // 明显的紫色
        '#8A2BE2', // 深紫色
        '#9932CC', // 洋红色
        '#BA55D3', // 梅红色
        '#DA70D6', // 淡紫色
        '#FF69B4', // 粉色
        '#FF1493', // 深粉色
        '#C71585', // 深红色
        '#8B008B', // 紫色
        '#4B0082'  // 靛蓝色
    ];
    
    // 随机选择两种不同的颜色
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2 = colors[Math.floor(Math.random() * colors.length)];
    while (color2 === color1) {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 返回对角线线性渐变
    return `linear-gradient(135deg, ${color1}, ${color2})`;
}

// 创建弹窗
function createPopup() {
    // 随机选择一条关心话语
    const randomMessage = caringMessages[Math.floor(Math.random() * caringMessages.length)];
    // 生成随机位置
    const position = getRandomPosition();
    
    // 生成随机对角线线性渐变
    const randomGradient = getRandomGradient();
    
    // 创建弹窗元素
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.style.left = `${position.x}px`;
    popup.style.top = `${position.y}px`;
    // 只使用白色背景，移除边框
    popup.style.background = 'rgba(255, 255, 255, 0.6)';
    // 确保液态玻璃效果
    popup.style.backdropFilter = 'blur(15px)';
    popup.style.webkitBackdropFilter = 'blur(15px)';
    // 移除边框
    popup.style.border = 'none';
    
    // 添加关闭按钮
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
        popup.classList.add('fade-out');
        setTimeout(() => {
            popup.remove();
        }, 300);
    };
    // 设置关闭按钮的渐变背景
    closeBtn.style.background = randomGradient;
    closeBtn.style.webkitBackgroundClip = 'text';
    closeBtn.style.backgroundClip = 'text';
    closeBtn.style.color = 'transparent';
    
    // 添加关心话语
    const message = document.createElement('p');
    message.className = 'popup-message';
    message.textContent = randomMessage;
    // 设置文字的渐变背景
    message.style.background = randomGradient;
    message.style.webkitBackgroundClip = 'text';
    message.style.backgroundClip = 'text';
    message.style.color = 'transparent';
    
    // 组装弹窗
    popup.appendChild(closeBtn);
    popup.appendChild(message);
    popupContainer.appendChild(popup);
    
    // 添加淡入动画
    setTimeout(() => {
        popup.classList.add('fade-in');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        popup.classList.add('fade-out');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }, 5000);
}

// 按钮点击事件
showPopupBtn.addEventListener('click', function() {
    // 点击后添加active类（可选）
    this.classList.add('active');
    
    // 开始自动弹出弹窗
    function autoPopup() {
        // 每200毫秒弹出一个弹窗，1秒刚好5个，速度均匀
        setInterval(() => {
            createPopup();
        }, 200); // 每200毫秒执行一次
    }
    
    // 立即开始弹出
    autoPopup();
});

// 页面加载后不自动弹出，只有点击按钮才开始
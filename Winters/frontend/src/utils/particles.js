/*!
 * Particles.js with Mouse Attraction - Enhanced Version
 * Based on particles.js by Marc Bruederlin
 * Added mouse attraction effect
 *
 * @version 2.2.3-enhanced
 * @license MIT
 */

var Particles = (function (window, document) {
  'use strict';

  var Plugin,
    Particle = {};

  function particleCompareFunc(p1, p2) {
    if (p1.x < p2.x) {
      return -1;
    } else if (p1.x > p2.x) {
      return 1;
    } else if (p1.y < p2.y) {
      return -1;
    } else if (p1.y > p2.y) {
      return 1;
    }
    return 0;
  }

  Plugin = (function () {
    function Plugin() {
      var _ = this;

      _.defaults = {
        responsive: null,
        selector: null,
        maxParticles: 100,
        sizeVariations: 3,
        showParticles: true,
        speed: 0.5,
        color: '#000000',
        minDistance: 120,
        connectParticles: false,
        // 鼠标吸引相关配置
        mouseAttract: true,
        attractRadius: 200,
        attractStrength: 0.02,
        attractEase: 0.1,
      };

      _.element = null;
      _.context = null;
      _.ratio = null;
      _.breakpoints = [];
      _.activeBreakpoint = null;
      _.breakpointSettings = [];
      _.originalSettings = null;
      _.storage = [];
      _.usingPolyfill = false;

      // 鼠标位置
      _.mouse = { x: null, y: null };
      // 鼠标移动时间戳
      _.mouseMoveTime = 0;
      // 吸引开始时间
      _.attractStartTime = 0;
      // 是否正在吸引
      _.isAttracting = false;
      // 上次鼠标位置（用于检测移动）
      _.lastMousePos = { x: null, y: null };

      // 雪花生成定时器
      _.snowflakeInterval = null;

      // 爆炸效果相关
      _.isExploding = false;
      _.explodeCenter = { x: null, y: null };
      _.explodeStartTime = 0;
      _.explodeDuration = 2000; // 大幅增加爆炸持续时间（毫秒）
    }

    return Plugin;
  })();

  Plugin.prototype.init = function (settings) {
    var _ = this;

    // 如果已经初始化过，先销毁之前的实例
    if (_.element) {
      _.destroy();
    }

    _.options = _._extend(_.defaults, settings);
    _.originalSettings = JSON.parse(JSON.stringify(_.options));

    // 检查是否为登录页面
    _.isLoginPage = settings.isLoginPage || false;

    // 根据页面宽度计算缩放比例（基于1920px宽度为基准）
    var windowWidth = window.innerWidth;
    var baseWidth = 1920;
    var scaleRatio = windowWidth / baseWidth;

    // 限制缩放比例在合理范围内
    if (scaleRatio < 0.3) scaleRatio = 0.3;
    // 移除上限，允许宽度变大时粒子参数相应增加
    // if (scaleRatio > 1.5) scaleRatio = 1.5;

    // 为非登录页面设置雪花效果
    if (!_.isLoginPage) {
      // 雪花效果参数
      _.options.maxParticles = Math.floor(180 * scaleRatio); // 调整最大雪花数量
      _.options.sizeVariations = 5; // 调整大小变化范围
      _.options.speed = 0.08 * scaleRatio; // 调整速度
      _.options.minDistance = 0; // 移除粒子连接
      _.options.connectParticles = false; // 禁用粒子连接
      _.options.mouseAttract = true; // 启用鼠标跟踪（用于导航栏搅动效果）

      // 移除重力，使用匀速下降
      _.options.gravity = 0; // 无重力加速度
      _.options.bounce = 0.4; // 调整反弹系数
    } else {
      // 登录页面保持原有参数
      _.options.maxParticles = Math.floor(_.options.maxParticles * scaleRatio);
      _.options.sizeVariations = Math.floor(_.options.sizeVariations * scaleRatio);
      _.options.speed = _.options.speed * scaleRatio;
      _.options.minDistance = Math.floor(_.options.minDistance * scaleRatio);
      _.options.attractRadius = Math.floor(_.options.attractRadius * scaleRatio);

      // 确保最小值
      if (_.options.maxParticles < 50) _.options.maxParticles = 50;
      if (_.options.sizeVariations < 2) _.options.sizeVariations = 2;
      if (_.options.minDistance < 80) _.options.minDistance = 80;
      if (_.options.attractRadius < 120) _.options.attractRadius = 120;
    }

    _._animate = _._animate.bind(_);

    _._initializeCanvas();
    _._initializeEvents();
    _._registerBreakpoints();
    _._checkResponsive();
    _._initializeStorage();
    _._animate();

    return _;
  };

  Plugin.prototype.destroy = function () {
    var _ = this;

    _.storage = [];
    _.element.remove();

    window.removeEventListener('resize', _.listener, false);
    window.removeEventListener('mousemove', _.mouseListener, false);
    window.clearTimeout(_._animation);
    cancelAnimationFrame(_._animation);

    // 清除雪花生成定时器
    if (_.snowflakeInterval) {
      clearInterval(_.snowflakeInterval);
      _.snowflakeInterval = null;
    }
  };

  Plugin.prototype._initializeCanvas = function () {
    var _ = this,
      devicePixelRatio,
      backingStoreRatio;

    if (!_.options.selector) {
      console.warn('particles.js: No selector specified!');
      return false;
    }

    _.element = document.querySelector(_.options.selector);
    _.context = _.element.getContext('2d');

    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio =
      _.context.webkitBackingStorePixelRatio ||
      _.context.mozBackingStorePixelRatio ||
      _.context.msBackingStorePixelRatio ||
      _.context.oBackingStorePixelRatio ||
      _.context.backingStorePixelRatio ||
      1;

    _.ratio = devicePixelRatio / backingStoreRatio;

    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if (
      (_.element.offsetParent && _.element.offsetParent.nodeName === 'BODY') ||
      !_.element.offsetParent
    ) {
      _.element.width = window.innerWidth * _.ratio;
      _.element.height = window.innerHeight * _.ratio;
    } else {
      _.element.width = _.element.offsetParent.clientWidth * _.ratio;
      _.element.height = _.element.offsetParent.clientHeight * _.ratio;
    }

    _.element.style.width = '100%';
    _.element.style.height = '100%';

    _.context.scale(_.ratio, _.ratio);
  };

  Plugin.prototype._initializeEvents = function () {
    var _ = this;

    _.listener = function () {
      _._resize();
    }.bind(this);
    window.addEventListener('resize', _.listener, false);

    // 鼠标移动事件
    if (_.options.mouseAttract) {
      _.mouseListener = function (e) {
        // 安全检查：确保element存在
        if (!_.element) return;

        var rect = _.element.getBoundingClientRect();
        var newX = (e.clientX - rect.left) * (_.element.width / rect.width / _.ratio);
        var newY = (e.clientY - rect.top) * (_.element.height / rect.height / _.ratio);

        // 检测鼠标是否真正移动
        var hasMoved = _.lastMousePos.x !== newX || _.lastMousePos.y !== newY;

        if (hasMoved) {
          _.mouseMoveTime = Date.now();
          // 如果之前不在吸引状态，重新开始吸引
          if (!_.isAttracting) {
            _.isAttracting = true;
            _.attractStartTime = Date.now();
          }
        }

        _.mouse.x = newX;
        _.mouse.y = newY;
        _.lastMousePos.x = newX;
        _.lastMousePos.y = newY;

        // 同时更新全局 mouse 状态，供其他组件使用
        if (!window.mouse) window.mouse = { x: null, y: null };
        window.mouse.x = _.mouse.x;
        window.mouse.y = _.mouse.y;
      }.bind(this);

      window.addEventListener('mousemove', _.mouseListener, false);

      // 鼠标离开时重置
      _.element.addEventListener('mouseleave', function () {
        _.mouse.x = null;
        _.mouse.y = null;
        _.lastMousePos.x = null;
        _.lastMousePos.y = null;
        _.isAttracting = false;
      });

      // 点击爆炸效果（仅登录页面）
      if (_.options.isLoginPage) {
        _.element.addEventListener('click', function (e) {
          var rect = _.element.getBoundingClientRect();
          var clickX = (e.clientX - rect.left) * (_.element.width / rect.width / _.ratio);
          var clickY = (e.clientY - rect.top) * (_.element.height / rect.height / _.ratio);
          _.explode(clickX, clickY);
        });
      }
    }
  };

  Plugin.prototype._initializeStorage = function () {
    var _ = this;

    _.storage = [];

    if (!_.isLoginPage) {
      // 初始生成更多雪花
      var initialParticles = Math.min(50, _.options.maxParticles); // 初始生成50个或最大数量
      for (var i = initialParticles; i--; ) {
        _.storage.push(new Particle(_.context, _.options));
      }

      // 持续从顶部生成雪花，调整生成频率
      _.snowflakeInterval = setInterval(function () {
        // 确保顶部持续有雪花生成
        var maxParticles = _.options.maxParticles;
        var currentParticles = _.storage.length;

        // 每次只生成1个雪花，避免生成过快
        if (currentParticles < maxParticles) {
          _.storage.push(new Particle(_.context, _.options));
        }
      }, 500); // 每500ms生成一次雪花，减缓生成速度
    } else {
      // 登录页面一次性生成所有粒子
      for (var i = _.options.maxParticles; i--; ) {
        _.storage.push(new Particle(_.context, _.options));
      }
    }
  };

  Plugin.prototype._registerBreakpoints = function () {
    var _ = this,
      breakpoint,
      currentBreakpoint,
      l,
      responsiveSettings = _.options.responsive || null;

    if (
      typeof responsiveSettings === 'object' &&
      responsiveSettings !== null &&
      responsiveSettings.length
    ) {
      for (breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;
        currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

        if (responsiveSettings.hasOwnProperty(breakpoint)) {
          while (l >= 0) {
            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }
            l--;
          }

          _.breakpoints.push(currentBreakpoint);
          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].options;
        }
      }

      _.breakpoints.sort(function (a, b) {
        return b - a;
      });
    }
  };

  Plugin.prototype._checkResponsive = function () {
    var _ = this,
      breakpoint,
      targetBreakpoint = false,
      windowWidth = window.innerWidth;

    if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
      targetBreakpoint = null;

      for (breakpoint in _.breakpoints) {
        if (_.breakpoints.hasOwnProperty(breakpoint)) {
          if (windowWidth <= _.breakpoints[breakpoint]) {
            targetBreakpoint = _.breakpoints[breakpoint];
          }
        }
      }

      if (targetBreakpoint !== null) {
        _.activeBreakpoint = targetBreakpoint;
        _.options = _._extend(_.options, _.breakpointSettings[targetBreakpoint]);
      } else {
        if (_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          targetBreakpoint = null;
          _.options = _._extend(_.options, _.originalSettings);
        }
      }
    }
  };

  Plugin.prototype._refresh = function () {
    var _ = this;
    _._initializeStorage();
    _._draw();
  };

  Plugin.prototype._resize = function () {
    var _ = this;

    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if (
      (_.element.offsetParent && _.element.offsetParent.nodeName === 'BODY') ||
      !_.element.offsetParent
    ) {
      _.element.width = window.innerWidth * _.ratio;
      _.element.height = window.innerHeight * _.ratio;
    } else {
      _.element.width = _.element.offsetParent.clientWidth * _.ratio;
      _.element.height = _.element.offsetParent.clientHeight * _.ratio;
    }

    _.context.scale(_.ratio, _.ratio);

    clearTimeout(_.windowDelay);

    _.windowDelay = window.setTimeout(function () {
      _._checkResponsive();
      _._refresh();
    }, 50);
  };

  Plugin.prototype._animate = function () {
    var _ = this;
    _._draw();
    _._animation = window.requestAnimFrame(_._animate);
  };

  Plugin.prototype.resumeAnimation = function () {
    var _ = this;
    if (!_._animation) {
      _._animate();
    }
  };

  Plugin.prototype.pauseAnimation = function () {
    var _ = this;
    if (!_._animation) {
      return;
    }

    if (_.usingPolyfill) {
      window.clearTimeout(_._animation);
    } else {
      var cancelAnimationFrame =
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame;
      cancelAnimationFrame(_._animation);
    }

    _._animation = null;
  };

  // 触发爆炸效果
  Plugin.prototype.explode = function (x, y) {
    var _ = this;
    _.isExploding = true;
    _.explodeCenter = { x: x, y: y };
    _.explodeStartTime = Date.now();

    // 只为被吸引的粒子设置爆炸速度
    for (var i = 0; i < _.storage.length; i++) {
      var particle = _.storage[i];
      var dx = particle.x - x;
      var dy = particle.y - y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      // 只对被吸引的粒子应用爆炸效果
      var isAttracted = false;

      // 检查粒子是否在吸引半径内
      if (distance < _.options.attractRadius) {
        isAttracted = true;
      }
      // 检查粒子是否已经到达目标位置
      else if (particle.hasReachedCenter || particle.hasReachedTarget) {
        isAttracted = true;
      }

      if (isAttracted) {
        var angle = Math.atan2(dy, dx);

        // 爆炸速度与距离成正比，调整速度系数使效果更加合理
        var speed = distance * 0.02; // 调整爆炸速度
        // 添加适度的基础速度，确保即使距离近的粒子也有足够的爆炸力
        var baseSpeed = 0.2; // 调整基础爆炸速度
        speed = speed + baseSpeed;

        // 添加随机速度分量，增加爆炸的自然感
        var randomSpeed = (Math.random() - 0.5) * 1;
        speed += randomSpeed;

        particle.explodeVx = Math.cos(angle) * speed;
        particle.explodeVy = Math.sin(angle) * speed;
        particle.explodeStartTime = Date.now();
      }
    }
  };

  Plugin.prototype._draw = function () {
    var _ = this,
      element = _.element,
      parentWidth = element.offsetParent ? element.offsetParent.clientWidth : element.clientWidth,
      parentHeight = element.offsetParent
        ? element.offsetParent.clientHeight
        : element.clientHeight,
      showParticles = _.options.showParticles,
      storage = _.storage;

    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if (
      (element.offsetParent && element.offsetParent.nodeName === 'BODY') ||
      !element.offsetParent
    ) {
      parentWidth = window.innerWidth;
      parentHeight = window.innerHeight;
    }

    _.context.clearRect(0, 0, element.width, element.height);
    _.context.beginPath();

    for (var i = storage.length; i--; ) {
      var particle = storage[i];

      if (showParticles) {
        particle._draw();
      }

      particle._updateCoordinates(parentWidth, parentHeight, _.mouse, _.options, _);
    }

    if (_.options.connectParticles) {
      storage.sort(particleCompareFunc);
      _._updateEdges();
    }

    // 检查爆炸是否结束
    if (_.isExploding) {
      var allExploded = true;
      for (var i = 0; i < storage.length; i++) {
        if (storage[i].explodeStartTime) {
          allExploded = false;
          break;
        }
      }
      if (allExploded) {
        _.isExploding = false;
      }
    }
  };

  Plugin.prototype._updateEdges = function () {
    var _ = this,
      minDistance = _.options.minDistance,
      sqrt = Math.sqrt,
      abs = Math.abs,
      storage = _.storage,
      storageLength = storage.length;

    for (var i = 0; i < storageLength; i++) {
      var p1 = storage[i];

      for (var j = i + 1; j < storageLength; j++) {
        var p2 = storage[j],
          distance,
          r = p1.x - p2.x,
          dy = p1.y - p2.y;

        distance = sqrt(r * r + dy * dy);

        if (abs(r) > minDistance) {
          break;
        }

        if (distance <= minDistance) {
          _._drawEdge(p1, p2, 1.2 - distance / minDistance);
        }
      }
    }
  };

  Plugin.prototype._drawEdge = function (p1, p2, opacity) {
    var _ = this,
      gradient = _.context.createLinearGradient(p1.x, p1.y, p2.x, p2.y);

    var color1 = this._hex2rgb(p1.color);
    var color2 = this._hex2rgb(p2.color);

    gradient.addColorStop(
      0,
      'rgba(' + color1.r + ',' + color1.g + ',' + color1.b + ',' + opacity + ')'
    );
    gradient.addColorStop(
      1,
      'rgba(' + color2.r + ',' + color2.g + ',' + color2.b + ',' + opacity + ')'
    );

    _.context.beginPath();
    _.context.strokeStyle = gradient;
    _.context.moveTo(p1.x, p1.y);
    _.context.lineTo(p2.x, p2.y);
    _.context.stroke();
    _.context.fill();
    _.context.closePath();
  };

  Plugin.prototype._extend = function (source, obj) {
    Object.keys(obj).forEach(function (key) {
      source[key] = obj[key];
    });
    return source;
  };

  Plugin.prototype._hex2rgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  Particle = function (context, options) {
    var _ = this,
      random = Math.random,
      speed = options.speed,
      color =
        options.color instanceof Array
          ? options.color[Math.floor(Math.random() * options.color.length)]
          : options.color;

    _.context = context;
    _.options = options;

    var canvas = document.querySelector(options.selector);

    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if ((canvas.offsetParent && canvas.offsetParent.nodeName === 'BODY') || !canvas.offsetParent) {
      _.x = random() * window.innerWidth;
    } else {
      _.x = random() * canvas.offsetParent.clientWidth;
    }

    if (!options.isLoginPage) {
      // 雪花从顶部生成
      _.y = -random() * 50; // 从顶部上方50px范围内开始
    } else {
      // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
      if (
        (canvas.offsetParent && canvas.offsetParent.nodeName === 'BODY') ||
        !canvas.offsetParent
      ) {
        _.y = random() * window.innerHeight;
      } else {
        _.y = random() * canvas.offsetParent.clientHeight;
      }
    }

    if (!options.isLoginPage) {
      // 雪花速度：几乎垂直向下，带有一点自然的轻微摇摆
      _.vx = (random() - 0.5) * speed * 0.5;
      _.vy = speed * (1.2 + random() * 0.8); // 随机下落速度
      _.radius = random() * random() * options.sizeVariations + 1;
      _.color = color;

      // 雪花特有的属性
      _.rotation = random() * Math.PI * 2;
      _.rotationSpeed = (random() - 0.5) * 0.02;
      _.opacity = 0.4 + random() * 0.5; // 随机透明度
      _.flakeType = Math.floor(random() * 3); // 三种雪花类型
    } else {
      // 登录页面粒子
      _.vx = random() * speed * 2 - speed;
      _.vy = random() * speed * 2 - speed;
      _.radius = random() * random() * options.sizeVariations + 1;
      _.color = color;

      // 原始速度（用于恢复）
      _.originalVx = _.vx;
      _.originalVy = _.vy;

      // 粒子类型：true为中心粒子，false为圆周粒子
      _.isCenterParticle = Math.random() < 0.5;

      // 圆周粒子的旋转角度和速度
      if (!_.isCenterParticle) {
        _.rotationAngle = random() * Math.PI * 2;
        _.rotationSpeed = (random() - 0.5) * 0.02; // 随机旋转方向和速度
      }

      // 中心点到达时间（用于3秒后脱离吸引）
      _.centerArrivalTime = 0;
      _.hasReachedCenter = false;
      // 目标位置到达时间（用于非中心粒子）
      _.targetArrivalTime = 0;
      _.hasReachedTarget = false;

      // 爆炸效果相关属性
      _.explodeVx = 0;
      _.explodeVy = 0;
      _.explodeStartTime = null;
    }

    _._draw();
  };

  Particle.prototype._draw = function () {
    var _ = this;

    _.context.save();
    _.context.translate(_.x, _.y);

    if (!_.options.isLoginPage) {
      // 绘制雪花
      _.context.rotate(_.rotation);
      _.context.globalAlpha = _.opacity;

      switch (_.flakeType) {
        case 0:
          // 六边形雪花
          this._drawHexFlake();
          break;
        case 1:
          // 星形雪花
          this._drawStarFlake();
          break;
        case 2:
          // 树枝形雪花
          this._drawBranchFlake();
          break;
      }
    } else {
      // 绘制原始粒子
      _.context.moveTo(0, 0);
      _.context.beginPath();
      _.context.arc(0, 0, _.radius, 0, Math.PI * 2, false);
      _.context.fillStyle = _.color;
      _.context.fill();
    }

    _.context.restore();
  };

  // 绘制六边形雪花
  Particle.prototype._drawHexFlake = function () {
    var _ = this;
    var radius = _.radius * 3;

    _.context.beginPath();
    _.context.strokeStyle = _.color;
    _.context.lineWidth = 1;

    // 绘制六边形
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i;
      var x1 = Math.cos(angle) * radius;
      var y1 = Math.sin(angle) * radius;
      var x2 = Math.cos(angle) * (radius * 0.5);
      var y2 = Math.sin(angle) * (radius * 0.5);

      _.context.moveTo(0, 0);
      _.context.lineTo(x1, y1);
      _.context.moveTo(x2, y2);
      _.context.lineTo(
        x2 + Math.cos(angle + Math.PI / 2) * (radius * 0.3),
        y2 + Math.sin(angle + Math.PI / 2) * (radius * 0.3)
      );
      _.context.moveTo(x2, y2);
      _.context.lineTo(
        x2 + Math.cos(angle - Math.PI / 2) * (radius * 0.3),
        y2 + Math.sin(angle - Math.PI / 2) * (radius * 0.3)
      );
    }

    _.context.stroke();
  };

  // 绘制星形雪花
  Particle.prototype._drawStarFlake = function () {
    var _ = this;
    var radius = _.radius * 3;

    _.context.beginPath();
    _.context.strokeStyle = _.color;
    _.context.lineWidth = 1;

    // 绘制星形
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i;
      var x1 = Math.cos(angle) * radius;
      var y1 = Math.sin(angle) * radius;
      var x2 = Math.cos(angle + Math.PI / 6) * (radius * 0.6);
      var y2 = Math.sin(angle + Math.PI / 6) * (radius * 0.6);
      var x3 = Math.cos(angle + Math.PI / 3) * radius;
      var y3 = Math.sin(angle + Math.PI / 3) * radius;

      _.context.moveTo(x2, y2);
      _.context.lineTo(x1, y1);
      _.context.lineTo(x3, y3);
    }

    _.context.stroke();
  };

  // 绘制树枝形雪花
  Particle.prototype._drawBranchFlake = function () {
    var _ = this;
    var radius = _.radius * 3;

    _.context.beginPath();
    _.context.strokeStyle = _.color;
    _.context.lineWidth = 1;

    // 绘制树枝形
    for (var i = 0; i < 6; i++) {
      var angle = (Math.PI / 3) * i;

      // 主枝
      var x1 = Math.cos(angle) * radius;
      var y1 = Math.sin(angle) * radius;
      _.context.moveTo(0, 0);
      _.context.lineTo(x1, y1);

      // 侧枝
      for (var j = 1; j < 4; j++) {
        var branchLength = radius * (j / 3);
        var branchAngle1 = angle + Math.PI / 4;
        var branchAngle2 = angle - Math.PI / 4;
        var branchSize = radius * 0.2;

        var bx1 = Math.cos(angle) * branchLength;
        var by1 = Math.sin(angle) * branchLength;
        var bx2 = bx1 + Math.cos(branchAngle1) * branchSize;
        var by2 = by1 + Math.sin(branchAngle1) * branchSize;
        var bx3 = bx1 + Math.cos(branchAngle2) * branchSize;
        var by3 = by1 + Math.sin(branchAngle2) * branchSize;

        _.context.moveTo(bx1, by1);
        _.context.lineTo(bx2, by2);
        _.context.moveTo(bx1, by1);
        _.context.lineTo(bx3, by3);
      }
    }

    _.context.stroke();
  };

  Particle.prototype._updateCoordinates = function (
    parentWidth,
    parentHeight,
    mouse,
    options,
    plugin
  ) {
    var _ = this,
      radius = _.radius;

    // 爆炸效果
    if (plugin.isExploding && options.isLoginPage) {
      if (this.explodeStartTime) {
        var explodeElapsed = Date.now() - this.explodeStartTime;
        var explodeProgress = explodeElapsed / plugin.explodeDuration;

        if (explodeProgress < 1) {
          // 应用爆炸速度，使用更缓慢的衰减
          var decay = 1 - Math.pow(explodeProgress, 1.5); // 调整衰减曲线，使爆炸更持久
          this.vx = this.explodeVx * decay;
          this.vy = this.explodeVy * decay;

          // 计算新位置
          var x = this.x + this.vx;
          var y = this.y + this.vy;

          // 边界检测与反弹
          var bounceFactor = 0.6; // 爆炸时的反弹系数

          if (x + radius > parentWidth) {
            x = parentWidth - radius;
            this.vx = -this.vx * bounceFactor;
          } else if (x - radius < 0) {
            x = radius;
            this.vx = -this.vx * bounceFactor;
          }

          if (y + radius > parentHeight) {
            y = parentHeight - radius;
            this.vy = -this.vy * bounceFactor;
          } else if (y - radius < 0) {
            y = radius;
            this.vy = -this.vy * bounceFactor;
          }

          // 更新位置
          this.x = x;
          this.y = y;
          return;
        } else {
          // 爆炸结束，恢复正常运动
          this.explodeVx = 0;
          this.explodeVy = 0;
          this.explodeStartTime = null;
        }
      }
    }

    if (!options.isLoginPage) {
      // 雪花下落逻辑
      _.rotation += _.rotationSpeed;

      // 添加极小的空气浮力，让下落更轻盈
      _.vx += (Math.random() - 0.5) * 0.02;

      // 限制速度
      var maxSpeed = options.speed * 3;
      if (_.vx > maxSpeed) _.vx = maxSpeed;
      if (_.vx < -maxSpeed) _.vx = -maxSpeed;

      // 计算新位置
      var x = _.x + _.vx;
      var y = _.y + _.vy;

      // 边界检测
      if (x + radius > parentWidth) {
        x = parentWidth - radius;
        _.vx = -_.vx * 0.5;
      } else if (x - radius < 0) {
        x = radius;
        _.vx = -_.vx * 0.5;
      }

      if (y - radius > parentHeight) {
        // 当雪花完全飘出底部时，重新在顶部生成
        y = -radius;
        // 重新设置水平位置
        var canvas = document.querySelector(options.selector);
        // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
        if (
          (canvas.offsetParent && canvas.offsetParent.nodeName === 'BODY') ||
          !canvas.offsetParent
        ) {
          _.x = Math.random() * window.innerWidth;
        } else {
          _.x = Math.random() * canvas.offsetParent.clientWidth;
        }
        // 重置速度
        _.vx = (Math.random() - 0.5) * options.speed * 0.5;
        _.vy = options.speed * (1.2 + Math.random() * 0.8);
      } else if (y + radius < 0) {
        y = parentHeight + radius;
      }

      // 更新位置
      _.x = x;
      _.y = y;
    } else {
      // 登录页面的粒子运动逻辑
      // 鼠标吸引效果
      if (options.mouseAttract && mouse.x !== null && mouse.y !== null && plugin.isAttracting) {
        var dx = mouse.x - _.x;
        var dy = mouse.y - _.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        // 检查粒子是否到达中心点（中心粒子）
        if (_.isCenterParticle && distance < 10) {
          if (!_.hasReachedCenter) {
            _.hasReachedCenter = true;
            _.centerArrivalTime = Date.now();
          }
        }

        // 检查非中心粒子是否到达目标位置
        if (!_.isCenterParticle) {
          var targetX = mouse.x + Math.cos(_.rotationAngle) * options.attractRadius;
          var targetY = mouse.y + Math.sin(_.rotationAngle) * options.attractRadius;
          var dxToTarget = targetX - _.x;
          var dyToTarget = targetY - _.y;
          var distanceToTarget = Math.sqrt(dxToTarget * dxToTarget + dyToTarget * dyToTarget);

          if (distanceToTarget < 10) {
            if (!_.hasReachedTarget) {
              _.hasReachedTarget = true;
              _.targetArrivalTime = Date.now();
            }
          }
        }

        // 检查中心粒子是否在中心点超过2.026秒
        var shouldAttract = true;
        if (_.isCenterParticle && _.hasReachedCenter) {
          var centerDuration = Date.now() - _.centerArrivalTime;
          shouldAttract = centerDuration < 2026; // 2.026秒后停止吸引
        } else if (!_.isCenterParticle && _.hasReachedTarget) {
          // 非中心粒子在到达目标位置后开始倒计时
          var targetDuration = Date.now() - _.targetArrivalTime;
          shouldAttract = targetDuration < 2026;
        } else {
          // 尚未到达目标位置，继续吸引
          shouldAttract = true;
        }

        if (shouldAttract && distance < options.attractRadius) {
          // 目标半径：与吸引半径一致
          var targetRadius = options.attractRadius;

          // 使用构造函数中分配的固定角色
          if (_.isCenterParticle) {
            // 粒子聚集在中心
            if (distance > 1) {
              var force = (options.attractRadius - distance) / options.attractRadius;
              var attractX = (dx / distance) * force * options.attractStrength * 15;
              var attractY = (dy / distance) * force * options.attractStrength * 15;

              // 应用吸引力（使用缓动）
              _.vx += (attractX - _.vx) * options.attractEase;
              _.vy += (attractY - _.vy) * options.attractEase;
            } else {
              // 当粒子非常接近中心时，逐渐停止运动
              _.vx *= 0.95;
              _.vy *= 0.95;
            }
          } else {
            // 粒子围绕在圆周上
            // 更新旋转角度
            _.rotationAngle += _.rotationSpeed;

            // 计算旋转后的目标位置
            var targetX = mouse.x + Math.cos(_.rotationAngle) * targetRadius;
            var targetY = mouse.y + Math.sin(_.rotationAngle) * targetRadius;

            // 计算到目标位置的距离
            var dxToTarget = targetX - _.x;
            var dyToTarget = targetY - _.y;
            var distanceToTarget = Math.sqrt(dxToTarget * dxToTarget + dyToTarget * dyToTarget);

            // 向目标位置移动
            if (distanceToTarget > 1) {
              var force = distanceToTarget / targetRadius;
              var moveX = (dxToTarget / distanceToTarget) * force * options.attractStrength * 5;
              var moveY = (dyToTarget / distanceToTarget) * force * options.attractStrength * 5;

              // 应用移动力（使用缓动）
              _.vx += (moveX - _.vx) * options.attractEase;
              _.vy += (moveY - _.vy) * options.attractEase;
            }
          }
        } else {
          // 3秒后或超出范围，逐渐恢复原始速度
          var recoveryRate = 0.1;
          _.vx += (_.originalVx - _.vx) * recoveryRate;
          _.vy += (_.originalVy - _.vy) * recoveryRate;

          // 重置中心点到达状态
          if (_.hasReachedCenter) {
            _.hasReachedCenter = false;
            _.centerArrivalTime = 0;
          }

          // 重置目标位置到达状态
          if (_.hasReachedTarget) {
            _.hasReachedTarget = false;
            _.targetArrivalTime = 0;
          }

          // 如果所有粒子都已脱离，标记为不再吸引
          if (Date.now() - plugin.attractStartTime >= 2026) {
            plugin.isAttracting = false;
          }
        }
      } else {
        // 鼠标不在范围内或不在吸引状态，逐渐恢复原始速度
        var recoveryRate = 0.1;
        _.vx += (_.originalVx - _.vx) * recoveryRate;
        _.vy += (_.originalVy - _.vy) * recoveryRate;

        // 重置中心点到达状态
        if (_.hasReachedCenter) {
          _.hasReachedCenter = false;
          _.centerArrivalTime = 0;
        }

        // 重置目标位置到达状态
        if (_.hasReachedTarget) {
          _.hasReachedTarget = false;
          _.targetArrivalTime = 0;
        }
      }

      // 计算新位置（基于修改后的速度）
      var x = _.x + _.vx;
      var y = _.y + _.vy;

      // 边界检测与反弹
      var bounceFactor = 0.8; // 反弹能量损失系数

      if (x + radius > parentWidth) {
        x = parentWidth - radius;
        _.vx = -_.vx * bounceFactor; // 反弹并应用速度衰减
        _.originalVx = _.vx; // 更新原始速度
      } else if (x - radius < 0) {
        x = radius;
        _.vx = -_.vx * bounceFactor; // 反弹并应用速度衰减
        _.originalVx = _.vx; // 更新原始速度
      }

      if (y + radius > parentHeight) {
        y = parentHeight - radius;
        _.vy = -_.vy * bounceFactor; // 反弹并应用速度衰减
        _.originalVy = _.vy; // 更新原始速度
      } else if (y - radius < 0) {
        y = radius;
        _.vy = -_.vy * bounceFactor; // 反弹并应用速度衰减
        _.originalVy = _.vy; // 更新原始速度
      }

      // 添加微小的随机扰动，使粒子运动更自然
      if (Math.random() < 0.05) {
        _.vx += (Math.random() - 0.5) * 0.1;
        _.vy += (Math.random() - 0.5) * 0.1;
      }

      // 限制最大速度，防止粒子运动过快
      var maxSpeed = options.speed * 3;
      if (Math.abs(_.vx) > maxSpeed) _.vx = _.vx > 0 ? maxSpeed : -maxSpeed;
      if (Math.abs(_.vy) > maxSpeed) _.vy = _.vy > 0 ? maxSpeed : -maxSpeed;

      // 更新位置
      _.x = x;
      _.y = y;
    }
  };

  window.requestAnimFrame = (function () {
    var _ = this,
      requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame;

    if (requestAnimationFrame) {
      return requestAnimationFrame;
    }

    _._usingPolyfill = true;

    return function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  return new Plugin();
})(window, document);

export default Particles;

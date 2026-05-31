/*!
 * Particles.js with Mouse Attraction - Enhanced Version
 * Based on particles.js by Marc Bruederlin
 * Added mouse attraction effect
 *
 * @version 2.2.3-enhanced
 * @license MIT
 */

var Particles = (function(window, document) {
  'use strict';

  var Plugin, Particle = {};

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

  Plugin = (function() {
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
        attractEase: 0.1
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
    }

    return Plugin;
  }());

  Plugin.prototype.init = function(settings) {
    var _ = this;

    _.options = _._extend(_.defaults, settings);
    _.originalSettings = JSON.parse(JSON.stringify(_.options));

    _._animate = _._animate.bind(_);

    _._initializeCanvas();
    _._initializeEvents();
    _._registerBreakpoints();
    _._checkResponsive();
    _._initializeStorage();
    _._animate();

    return _;
  };

  Plugin.prototype.destroy = function() {
    var _ = this;

    _.storage = [];
    _.element.remove();

    window.removeEventListener('resize', _.listener, false);
    window.removeEventListener('mousemove', _.mouseListener, false);
    window.clearTimeout(_._animation);
    cancelAnimationFrame(_._animation);
  };

  Plugin.prototype._initializeCanvas = function() {
    var _ = this, devicePixelRatio, backingStoreRatio;

    if(!_.options.selector) {
      console.warn('particles.js: No selector specified!');
      return false;
    }

    _.element = document.querySelector(_.options.selector);
    _.context = _.element.getContext('2d');

    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio = _.context.webkitBackingStorePixelRatio || _.context.mozBackingStorePixelRatio || _.context.msBackingStorePixelRatio ||
                        _.context.oBackingStorePixelRatio || _.context.backingStorePixelRatio || 1;

    _.ratio = devicePixelRatio / backingStoreRatio;
    
    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if ((_.element.offsetParent && _.element.offsetParent.nodeName === 'BODY') || !_.element.offsetParent) {
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

  Plugin.prototype._initializeEvents = function() {
    var _ = this;

    _.listener = function() { _._resize(); }.bind(this);
    window.addEventListener('resize', _.listener, false);
    
    // 鼠标移动事件
    if (_.options.mouseAttract) {
      _.mouseListener = function(e) {
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
      }.bind(this);
      
      window.addEventListener('mousemove', _.mouseListener, false);
      
      // 鼠标离开时重置
      _.element.addEventListener('mouseleave', function() {
        _.mouse.x = null;
        _.mouse.y = null;
        _.lastMousePos.x = null;
        _.lastMousePos.y = null;
        _.isAttracting = false;
      });
    }
  };

  Plugin.prototype._initializeStorage = function() {
    var _ = this;

    _.storage = [];

    for(var i = _.options.maxParticles; i--;) {
      _.storage.push(new Particle(_.context, _.options));
    }
  };

  Plugin.prototype._registerBreakpoints = function() {
    var _ = this, breakpoint, currentBreakpoint, l, responsiveSettings = _.options.responsive || null;

    if(typeof responsiveSettings === 'object' && responsiveSettings !== null && responsiveSettings.length) {
      for(breakpoint in responsiveSettings) {
        l = _.breakpoints.length - 1;
        currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

        if(responsiveSettings.hasOwnProperty(breakpoint)) {
          while(l >= 0) {
            if(_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
              _.breakpoints.splice(l, 1);
            }
            l--;
          }

          _.breakpoints.push(currentBreakpoint);
          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].options;
        }
      }

      _.breakpoints.sort(function(a, b) {
        return b-a;
      });
    }
  };

  Plugin.prototype._checkResponsive = function() {
    var _ = this, breakpoint, targetBreakpoint = false, windowWidth = window.innerWidth;

    if(_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
      targetBreakpoint = null;

      for(breakpoint in _.breakpoints) {
        if(_.breakpoints.hasOwnProperty(breakpoint)) {
          if(windowWidth <= _.breakpoints[breakpoint]) {
            targetBreakpoint = _.breakpoints[breakpoint];
          }
        }
      }

      if(targetBreakpoint !== null) {
        _.activeBreakpoint = targetBreakpoint;
        _.options = _._extend(_.options, _.breakpointSettings[targetBreakpoint]);
      } else {
        if(_.activeBreakpoint !== null) {
          _.activeBreakpoint = null;
          targetBreakpoint = null;
          _.options = _._extend(_.options, _.originalSettings);
        }
      }
    }
  };

  Plugin.prototype._refresh = function() {
    var _ = this;
    _._initializeStorage();
    _._draw();
  };

  Plugin.prototype._resize = function() {
    var _ = this;

    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if ((_.element.offsetParent && _.element.offsetParent.nodeName === 'BODY') || !_.element.offsetParent) {
      _.element.width = window.innerWidth * _.ratio;
      _.element.height = window.innerHeight * _.ratio;
    } else {
      _.element.width = _.element.offsetParent.clientWidth * _.ratio;
      _.element.height = _.element.offsetParent.clientHeight * _.ratio;
    }

    _.context.scale(_.ratio, _.ratio);

    clearTimeout(_.windowDelay);

    _.windowDelay = window.setTimeout(function() {
      _._checkResponsive();
      _._refresh();
    }, 50);
  };

  Plugin.prototype._animate = function() {
    var _ = this;
    _._draw();
    _._animation = window.requestAnimFrame(_._animate);
  };

  Plugin.prototype.resumeAnimation = function() {
    var _ = this;
    if (!_._animation) {
      _._animate();
    }
  };

  Plugin.prototype.pauseAnimation = function() {
    var _ = this;
    if (!_._animation) {
      return;
    }

    if (_.usingPolyfill) {
      window.clearTimeout(_._animation);
    } else {
      var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
      cancelAnimationFrame(_._animation);
    }

    _._animation = null;
  };

  Plugin.prototype._draw = function() {
    var _ = this,
        element = _.element,
        parentWidth = (element.offsetParent) ? element.offsetParent.clientWidth : element.clientWidth,
        parentHeight = (element.offsetParent) ? element.offsetParent.clientHeight :  element.clientHeight,
        showParticles = _.options.showParticles,
        storage = _.storage;

    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if ((element.offsetParent && element.offsetParent.nodeName === 'BODY') || !element.offsetParent) {
      parentWidth = window.innerWidth;
      parentHeight = window.innerHeight;
    }
    
    // 调试输出
    if (window.location.pathname.includes('login') && !_.debugLogged) {
      console.log('Canvas 尺寸:', element.width, 'x', element.height);
      console.log('Canvas CSS 尺寸:', element.clientWidth, 'x', element.clientHeight);
      console.log('窗口尺寸:', window.innerWidth, 'x', window.innerHeight);
      console.log('Ratio:', _.ratio);
      console.log('offsetParent:', element.offsetParent);
      console.log('边界检测尺寸:', parentWidth, 'x', parentHeight);
      _.debugLogged = true;
    }

    _.context.clearRect(0, 0, element.width, element.height);
    _.context.beginPath();

    for(var i = storage.length; i--;) {
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
  };

  Plugin.prototype._updateEdges = function() {
    var _ = this,
        minDistance = _.options.minDistance,
        sqrt = Math.sqrt,
        abs = Math.abs,
        storage = _.storage,
        storageLength = storage.length;

    for(var i = 0; i < storageLength; i++) {
      var p1 = storage[i];

      for(var j = i + 1; j < storageLength; j++) {
        var p2 = storage[j],
            distance, r = p1.x - p2.x, dy = p1.y - p2.y;

        distance = sqrt(r * r + dy * dy);

        if (abs(r) > minDistance) {
          break;
        }

        if (distance <= minDistance) {
          _._drawEdge(p1, p2, (1.2 - distance/minDistance));
        }
      }
    }
  };

  Plugin.prototype._drawEdge = function(p1, p2, opacity) {
    var _ = this,
        gradient = _.context.createLinearGradient(p1.x, p1.y, p2.x, p2.y);

    var color1 = this._hex2rgb(p1.color);
    var color2 = this._hex2rgb(p2.color);

    gradient.addColorStop(0, 'rgba(' + color1.r + ',' + color1.g + ',' + color1.b + ',' + opacity + ')');
    gradient.addColorStop(1, 'rgba(' + color2.r + ',' + color2.g + ',' + color2.b + ',' + opacity + ')');

    _.context.beginPath();
    _.context.strokeStyle = gradient;
    _.context.moveTo(p1.x, p1.y);
    _.context.lineTo(p2.x, p2.y);
    _.context.stroke();
    _.context.fill();
    _.context.closePath();
  };

  Plugin.prototype._extend = function(source, obj) {
    Object.keys(obj).forEach(function(key) {
      source[key] = obj[key];
    });
    return source;
  };

  Plugin.prototype._hex2rgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  Particle = function(context, options) {
    var _ = this,
        random = Math.random,
        speed = options.speed,
        color = (options.color instanceof Array) ? options.color[Math.floor(Math.random() * options.color.length)] : options.color;

    _.context = context;
    _.options = options;

    var canvas = document.querySelector(options.selector);
    
    // 修复：当父元素是 BODY 或没有父元素（fixed 定位）时，使用窗口尺寸
    if ((canvas.offsetParent && canvas.offsetParent.nodeName === 'BODY') || !canvas.offsetParent) {
      _.x = random() * window.innerWidth;
      _.y = random() * window.innerHeight;
    } else {
      _.x = random() * canvas.offsetParent.clientWidth;
      _.y = random() * canvas.offsetParent.clientHeight;
    }

    _.vx = random() * speed * 2 - speed;
    _.vy = random() * speed * 2 - speed;
    _.radius = random() * random() * options.sizeVariations + 1;
    _.color = color;
    
    // 原始速度（用于恢复）
      _.originalVx = _.vx;
      _.originalVy = _.vy;
      
      // 中心点到达时间（用于 3 秒后脱离吸引）
      _.centerArrivalTime = 0;
      _.hasReachedCenter = false;

      _._draw();
  };

  Particle.prototype._draw = function() {
    var _ = this;

    _.context.save();
    _.context.translate(_.x, _.y);
    _.context.moveTo(0, 0);
    _.context.beginPath();
    _.context.arc(0, 0, _.radius, 0, Math.PI * 2, false);
    _.context.fillStyle = _.color;
    _.context.fill();
    _.context.restore();
  };

  Particle.prototype._updateCoordinates = function(parentWidth, parentHeight, mouse, options, plugin) {
    var _ = this,
        radius = _.radius;

    // 计算新位置（基于当前速度）
    var x = _.x + _.vx;
    var y = _.y + _.vy;
    
    // 边界检测与反弹（先处理边界，确保反弹效果）
    var bounceFactor = 0.8; // 反弹能量损失系数
    var hitBoundary = false;
    
    if(x + radius > parentWidth) {
      x = parentWidth - radius;
      _.vx = -_.vx * bounceFactor; // 反弹并应用速度衰减
      hitBoundary = true;
    } else if(x - radius < 0) {
      x = radius;
      _.vx = -_.vx * bounceFactor; // 反弹并应用速度衰减
      hitBoundary = true;
    }

    if(y + radius > parentHeight) {
      y = parentHeight - radius;
      _.vy = -_.vy * bounceFactor; // 反弹并应用速度衰减
      hitBoundary = true;
    } else if(y - radius < 0) {
      y = radius;
      _.vy = -_.vy * bounceFactor; // 反弹并应用速度衰减
      hitBoundary = true;
    }
    
    // 如果碰到边界，更新原始速度方向，保持一致性
    if (hitBoundary) {
      _.originalVx = _.vx;
      _.originalVy = _.vy;
    }

    // 鼠标吸引效果（在边界处理之后应用）
    if (options.mouseAttract && mouse.x !== null && mouse.y !== null && plugin.isAttracting) {
      var dx = mouse.x - _.x;
      var dy = mouse.y - _.y;
      var distance = Math.sqrt(dx * dx + dy * dy);
      
      // 检查粒子是否到达中心点
      if (distance < 10) {
        if (!_.hasReachedCenter) {
          _.hasReachedCenter = true;
          _.centerArrivalTime = Date.now();
        }
      }
      
      // 检查粒子是否在中心点超过 2.026 秒
      var shouldAttract = true;
      if (_.hasReachedCenter) {
        var centerDuration = Date.now() - _.centerArrivalTime;
        shouldAttract = centerDuration < 2026; // 2.026 秒后停止吸引
      } else {
        // 按原来的吸引时间计算
        var attractDuration = Date.now() - plugin.attractStartTime;
        shouldAttract = attractDuration < 2026;
      }
      
      if (shouldAttract && distance < options.attractRadius && distance > 5) {
        // 计算吸引力
        var force = (options.attractRadius - distance) / options.attractRadius;
        var attractX = (dx / distance) * force * options.attractStrength * 10;
        var attractY = (dy / distance) * force * options.attractStrength * 10;
        
        // 应用吸引力（使用缓动）
        _.vx += (attractX - _.vx) * options.attractEase;
        _.vy += (attractY - _.vy) * options.attractEase;
      } else {
        // 3 秒后或超出范围，不恢复速度，让粒子自由运动
        // 这样边界反弹后的速度不会被覆盖
        
        // 重置中心点到达状态
        if (_.hasReachedCenter) {
          _.hasReachedCenter = false;
          _.centerArrivalTime = 0;
        }
        
        // 如果超过 2.026 秒，标记为不再吸引
        if (Date.now() - plugin.attractStartTime >= 2026) {
          plugin.isAttracting = false;
        }
      }
    }
    // 鼠标不在范围内或不在吸引状态时，也不恢复速度
    // 让粒子保持当前速度继续运动（包括反弹后的速度）
    
    // 更新位置
    _.x = x;
    _.y = y;
  };

  window.requestAnimFrame = (function() {
    var _ = this,
    requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

    if (requestAnimationFrame) {
      return requestAnimationFrame;
    }

    _._usingPolyfill = true;

    return function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  })();

  return new Plugin();
})(window, document);

(function() {
  'use strict';

  if(typeof define === 'function' && define.amd) {
    define('Particles', function () { return Particles; });
  } else if(typeof module !== 'undefined' && module.exports) {
    module.exports = Particles;
  } else {
    window.Particles = Particles;
  }
})();

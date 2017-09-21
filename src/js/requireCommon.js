
/*
	* 避免污染全局命名空间
	* 定义模块时，指定依赖
 */
define(['jquery'],function($){
	// 在require引入模块时，回调函数中得到什么，取决于这里return什么
	return {
		randomColor:function (){
			var str = '0123456789abcdef';

			var res = '#';
			for(var i=0;i<6;i++){
				var idx = Math.floor(Math.random()*str.length);
				res += str[idx];
			}
			return res;
		},
		randomNumber: function (min,max){
			var res = parseInt(Math.random()*(max-min+1)) + min;

			return res
		},
		getSize:function(selector){
			return {
				width:$(selector).width(),
				height:$(selector).height()
			}
			
		},
		/**
		 * [获取随机验证码]
		 * @param  {[Number]} num [验证码位数]
		 * @return {String}     [验证码]
		 */
		yanzhengma:function (num){
			if(num === undefined){
				num = 4;
			}
			var arr = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

			// 循环获取验证码
			var res = '';
			for(var i=0;i<num;i++){
				var idx = parseInt(Math.random()*arr.length);
				res += arr[idx];
			}
			return res;
		},
		/**
		 * [过滤其他节点，得到元素节点]
		 * @param  {Array} nodes [节点集合（类数组）]
		 * @return {Array}       [返回元素节点集合]
		 */
		getElement:function (nodes){
			var res = [];
			for(var i=0;i<nodes.length;i++){
				if(nodes[i].nodeType === 1){
					res.push(nodes[i]);
				}
			}

			return res;
		},
		// getElement(all_child);//[h4,ul,h4,ul]
		/**
		 * [运动函数]
		 * @param  {Element} ele [需要动画的元素]
		 * @param  {Object} opt [动画属性]
		 */
		animate:function (ele,opt,callback){
			// 记录动画数量
			let timerLen = 0;

			// 遍历opt
			for(var attr in opt){
				// 如何把attr限定到局部作用域中
				// ES6解决方案：用let声明attr
				// 传统解决方案：利用函数传参

				createTimer(attr);

				timerLen++;
			}

			function createTimer(attr){
				// 为每个属性设置不同的定时器(关键1)
				let timerName = attr + 'timer';
				let target = opt[attr];

				clearInterval(ele[timerName]);

				// 把定时器与Dom关联（关键2）
				ele[timerName] = setInterval(()=>{
					// 先获取当前值
					let current = getComputedStyle(ele)[attr];//String:100px,50rem,0.5,60deg

					// 提取数值：单位
					// 根据当前值提取单位(单位在current最后面)
					let unit = current.match(/[a-z]+$/);
					if(unit){
						current = current.substring(0,unit.index)*1;
						unit = unit[0]
					}else{
						unit = '';
						current *= 1;
					}

					// 计算速度
					let speed = (target - current)/10;

					// 处理speed值，防止speed为小数而造成定时器无法完成的情况
					// 0.3=>1,-0.3=>-1
					speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);


					if(attr === 'opacity'){
						speed = speed>0 ? 0.05 : -0.05;
					}

					// 动画完成
					if(current === target){
						clearInterval(ele[timerName]);
						current = target - speed;

						timerLen--;

						if(typeof callback === 'function' && timerLen === 0){
							callback();
						}
					}

					ele.style[attr] = current + speed + unit;
				},30)
			}
		},

		/**
		 * [获取cookie]
		 * @param  {String} name [cookie名]
		 * @return {String}      [cookie名对应的值]
		 */
		cookieGet:function(name){
			var res = '';
			var cookies = document.cookie;
			if(cookies.length>0){
				cookies = cookies.split('; ');
				cookies.forEach(function(cookie){
					var temp = cookie.split('=');
					if(temp[0] === name){
						res = temp[1];
					}
				})
			}
			return res;
		},
		
		/**
		 * [设置cookie]
		 * @param {String} name  [cookie名]
		 * @param {String} value [cookie值]
		 * @param {[Object]} opt   [cookie参数：exipres,path,domain]
		 */
		cookieSet:function(name,value,opt){
			var cookieStr = name + '=' + value;
			if(opt !== undefined){
				for(var attr in opt){
					cookieStr += ';'+attr + '=' + opt[attr]
				}
			}

			document.cookie = cookieStr;
		},

		// 删除cookie
		cookieRemove:function(name){
			var date = new Date();
			date.setDate(date.getDate()-10);
			// document.cookie = name + '=x;expires=' + date.toUTCString();
			this.set(name,'x',{expires:date.toUTCString()});
		}
	}
})
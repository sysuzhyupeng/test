import jQuery from 'jquery'

/**
 * jQuery分頁切換插件
 *
 * @author liming <treerootboy@gmail.com>
 * @bugfix 修復沒有分頁控制條時，無法自動播放 2012/12/20
 * @change 增加scrollright橫向滾動
 **/

(function($) {
	$.slide = {version: 'TR Slide 1.0b', slides:{}};
	$.fn.slide = function(option){
		//初始化		
		var newApi = new api(this, option);

		var $this = $(this);		
		if( !newApi ){
			return $this;
		}
		var now = new Date().getTime().toString();
		$.slide.slides[now] = newApi;
		$this.attr('slideApi', now);
		return $this;
	}
	//API
	var api = function(target, option){
		var dop = this.defaultOption,
			size = 0;
		this.option = $.extend({}, dop, option || {});
		this.container = $(target);
		size = this.container.find(this.option.content).length;
		if( size<=this.option.split || this.option.slideType&&size<=this.option.showNum ){
			return null;
		}
		this.init();
		return this;
	};
	api.prototype = {
		defaultOption : {
			delay : 		2000,				//延時
			effect: 		'normal',			//效果: null 無; fade 淡入; animate 自定義動畫
			easing:			'swing',
			pageEvent:		'click',
			autoPlay: 		false,
			animate: 		function(o, n, callback){},
			slideType: null,                      //1:一次滾動一個，到達第一個或最後一個時停止滾動        
			showNum: null,                       //與slideType搭配使用，頁面加載完成后內容里實際看得到的元素個數
			currentClass: 	'active', 			//當前內容
			content: 		'.slideContent',	//內容容器
			pager: 			'.slidePager',		//頁碼
			hasArrow: 		false,				//是否有上下頁按鈕
			nextButtonHtml: '<a href="javascript:void(\'下一頁\');" class="slide_btn_next" title="下一頁"></a>',
			prevButtonHtml: '<a href="javascript:void(\'上一頁\');" class="slide_btn_prev" title="上一頁"></a>',
			buttonStyle:		'\
				.slide_btn_next, .slide_btn_prev{\
					border-style: solid;\
					border-width: 8px 16px;\
					border-color: transparent transparent transparent #FFF;\
					height: 0px;\
					width: 0px;\
					overflow: hidden;\
					font-size: 0;\
					line-height: 0;\
					margin-right: 0;\
					display: inline-block;\
					*zoom: 1;\
					vertical-align: middle;\
					_border-style: dashed dashed dashed solid;\
				}\
				.slide_btn_prev{border-color: transparent #FFF transparent transparent;_border-style: dashed solid dashed dashed;}\
				.slide_btn_prev:hover{border-color: transparent #2facff transparent transparent;}\
				.slide_btn_next:hover{border-color: transparent transparent transparent #2facff;}\
			',
			split: 			1,					//切換數量
			rowsType:		1,
			pageActiveCss: {			
				backgroundColor: '#FC8948',
				color: '#FFF'
			},
			pageCss: {
				padding: '1px 5px',
				backgroundColor: '#FEB940',
				color: '#333',
				textDecoration: 'none'
			},
			onTabChange: function(){},
			onTabChangeComplete: function(){},
			onPageClick: function(){},
			onInitComplete: function(){},
			onInitBack: function(){}
		},
		container: window,  //這裡的this是指容器
		currentPage: 1,
		totalPage: 1,
		nextPage: 0,
		prevPage: 0,
		action: {            
            isOnEffect: false,
			normal: function(o, n, callback){
				var $this = this;
				$(o).hide();
				$(n).show();				
				setTimeout(function(){
					if(callback)callback(o, n);
					$this.isOnEffect = false;
				}, 100);
			},
			fade: function(o, n, callback){
				var $this = this;
				$(o).hide();
				$(n).fadeIn(1000, function(){					
					if(callback)callback(o, n);
					$this.isOnEffect = false;
				});
			},
			scrollup: function(o, n, callback){
				var $this = this;
				$this.container.css('position', 'relative');
				var c = $(o).parent();
				c.css('position', 'absolute').animate({
					top: -(n.get(0).offsetTop),
					left: 0
				}, 500, this.option.easing, function(){
					if(callback)callback(o, n);
					$this.isOnEffect = false;
				});
			},
            scrollright: function(o, n, callback){
                var $this = this;
                $this.container.css('position', 'relative');
                var c = $(o).parent();
                c.css('position', 'absolute').animate({
                    top: 0,
                    left: (1-$this.currentPage)*(n.outerWidth(true)*$this.option.split)
                }, 500, $this.option.easing, function(){
                    if(callback)callback(o, n);
                    $this.isOnEffect = false;
                });
            },
			animate: function(o, n, callback){
				var $this = this;
				this.op.animate(o, n, function(){
					if(callback)callback(o, n);
					$this.isOnEffect = false;
				});
			}
		},
		go: function(page){
			page = Number(page);
			if ( isNaN(page) ||  this.currentPage == page || this.isOnEffect) return;
			var op = this.option;
			var container = this.container;	
			var cs = $(op.content, container),
				slideNum = cs.length%op.showNum,
				pages = parseInt(cs.length/op.showNum);
			// console.log(cs);
			this.currentPage = page;
			//改變頁碼
			$(op.pager, container).find('ul li a.pageNum')
				.removeClass('pageActive').css(op.pageCss)
				.eq(page-1).addClass('pageActive').css(op.pageActiveCss);

			//執行動作開始事件
			op.onTabChange();
			if (this.action[op.effect]){
				this.isOnEffect = true;
				var o = cs.filter('.'+op.currentClass);
				var n = $(op.content+'[data-page="'+page+'"]', container);					
				this.action[op.effect].call(this, o, n, op.onTabChangeComplete );
				o.removeClass(op.currentClass);
				n.addClass(op.currentClass);
			}
			if(!op.autoPlay&&op.slideType&&page==1){
				$(op.pager,container).find('a:first').not('a.pageNum').css('cursor','not-allowed');
			}else if(!op.autoPlay&&op.slideType&&((slideNum!=0&&pages<2&&page>slideNum)||(slideNum==0&&cs.length-page==op.showNum-1)||slideNum!=0&&pages>=2&&page > (pages-1)*op.showNum+slideNum)){
				$(op.pager,container).find('a:last').not('a.pageNum').css('cursor','not-allowed');
			}
		},
		next: function(){
			var op = this.option;
			var container = this.container,
				pages = parseInt(this.totalPage/op.showNum),
				slideNum = this.totalPage%op.showNum;
			if (this.currentPage<0)
				this.nextIndex = 1;
			else if(this.currentPage<this.totalPage){
				if(op.slideType){
					$(op.pager,container).find('a:first').not('a.pageNum').css('cursor','');
					if(pages==1&&this.currentPage <= slideNum || (slideNum==0&&this.currentPage <= (pages-1)*op.showNum) || pages>=2&&slideNum!=0&&this.currentPage <= (pages-1)*op.showNum+slideNum){
						this.nextIndex = this.currentPage+1;
					}else{
						op.autoPlay?this.nextIndex = 1:this.nextIndex = this.nextIndex;
					}
				}else{
					this.nextIndex = this.currentPage+1;
				}
			}	
			else{
				this.nextIndex = this.option.slideType ? this.currentPage : 1;
			}
			this.go(this.nextIndex);
		},
		prev: function(){
			var op = this.option,
				container = this.container,
				pages = parseInt(this.totalPage/op.showNum),
				slideNum = this.totalPage%op.showNum;
			if (this.currentPage<0)
				this.prevIndex = 1;
			else if(this.currentPage>1){
				this.prevIndex = this.currentPage-1;
				$(op.pager,container).find('a:last').not('a.pageNum').css('cursor','');
			}	
			else{
				if(!op.autoPlay||!op.slideType){
					this.prevIndex = op.slideType ? 1 : this.totalPage;
				}else if(op.slideType&&op.autoPlay){
					if(pages<2){
						this.prevIndex = slideNum+1;
					}else if(pages>=2&&slideNum!=
						0){
						this.prevIndex = this.totalPage-op.showNum+1;
					}else{
						this.prevIndex = (pages-1)*op.showNum+1;
					}
				}
			}
			this.go(this.prevIndex);
		},
		play: function(){
			var api = this;
			this.stop();
			if ( api.isOnEffect ){				
				this.timer = setTimeout(function(){
					api.play();
				}, 100);
			}else{
				var delay = Number($(api.option.content+'[data-page="'+api.currentPage+'"]', api.container).attr('data-delay'));				
				this.timer = setTimeout(function(){
					api.next();
					api.play();
				}, delay*1000 || api.option.delay);
			}
		},
		stop: function(){
			clearTimeout( this.timer );
			this.timer = undefined;
		},
		makePager: function(){
			var op = this.option;
			var container = this.container;
			if ( $(op.pager, container).find('ul li a').length<0 ) return;				
			var cs = $(this.option.content, container);
			var _html = '';
			if ( this.totalPage>0 )
			{
				if( op.hasArrow && (op.prevButtonHtml || op.nextButtonHtml) ){
					_html += '<style>'+op.buttonStyle+'</style>';
				}
				if( op.hasArrow && op.prevButtonHtml ) _html += op.prevButtonHtml;
				
				_html += op.noneStyle ? '<ul>' : '<ul style="margin:0px 10px; display:inline-block; *display: inline: *zoom: 1; *vertical-align:bottom;">';				
				for (var i=0;i<this.totalPage;i++)
				{
					_html += (op.noneStyle ? '<li>' : '<li style="display:inline-block; *display:inline; *zoom:1; margin: 0 5px; padding:0; font-size: 9pt; color: #444;">') + '<a class="pageNum" href="javascript:void(\'1\')">'+(i+1)+'</a></li>'
				}
				_html += '</ul>';
				
				if( op.hasArrow && op.nextButtonHtml ) _html += op.nextButtonHtml;
			}
			$(op.pager,container).html(_html);
			if(op.slideType&&!op.autoPlay){
				$(op.pager,container).find('a:first').not('a.pageNum').css('cursor','not-allowed');
			}
			var $this = this;
			var pagerLink = $(op.pager,container).find('ul li a.pageNum').bind('click', function(){				
				$this.option.onPageClick();				
				if( $this.autoPlay ){
					$this.stop();
					$this.go($(this).text());
					$this.play();
				}else{
					$this.go($(this).text());
				}
				$(this).blur();
			});
			if( op.pageEvent!=='click' ){
				pagerLink.bind(op.pageEvent, function(){
					$(this).trigger('click');
                    return false;
				});
			}
			if( op.hasArrow && op.prevButtonHtml ){
				$(op.pager,this.container)
					.children('a:first')
					.click(function(){
						$this.prev();
                        return false;
					});
			}
			if( op.hasArrow && op.nextButtonHtml ){
				$(op.pager,this.container)
					.children('a:last')
					.click(function(){
						$this.next();
                        return false;
					});
			}
		},
		init: function(){
			var api = this;
			var op = api.option;
			op.onInitBack();	//每切换一次执行回调
			var content = $(op.content, api.container);
			api.totalPage = Math.ceil(content.length / api.option.split / op.rowsType);
			if( $(op.pager).length>0 ) api.makePager();
			$(op.pager, api.container).find('ul li a.pageNum').css(op.pageCss).eq(0).addClass('pageActive').css(op.pageActiveCss);
			//IE CSS HACK
			if( !-[1,] ){
				$(op.pager, api.container).find('ul').css('display', 'inline');
			}
			
			var i = 1, c = 1;
			content.each(function(){
				$(this).attr('data-page', i);
				if(c%op.split===0&&(c!==1||op.split===1))i++;
				c++;
			});
			
			switch(op.effect){
                case 'fade':
				    content.removeClass(op.currentClass).hide();
                    break;
                case 'scrollright':
                    content
                        .removeClass(op.currentClass).show()
                        .parent().width(content.outerWidth(true)*content.length).wrap('<div style="position: relative; overflow:hidden; height: 100%;"></div>');
                    break;
			}

			content.filter('[data-page="1"]').addClass(op.currentClass).show();
			
			op.onInitComplete(content);
			if ( op.autoPlay )
			{
				$(api.container).hover(function(){
					api.stop();
				}, function(){
					api.play();
				});
				api.play();
			}
		}
	};	
})(jQuery);

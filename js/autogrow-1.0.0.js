/* 
 * Auto Grow for <textarea> (v1.0.0)
 * by TJ Park (http://junneee.wordpress.com/)
 * eghost79@gmail.com
 *
 * MIT License
 * Copyright (c) <2013> <eghost79@gmail.com>
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * [MIT License]- MIT 라이선스 내용
 * 1. 이 소프트웨어를 누구라도 무상으로 제한없이 취급해도 좋다. 단, 저작권 표시 및 이 허가 표시를 소프트웨어의 모든 복제물 또는 중요한 부분에 기재해야 한다.
 * 2. 저자 또는 저작권자는 소프트웨어에 관해서 아무런 책임을 지지 않는다.
 *
 * NOTE: This script requires jQuery to work.  Download jQuery at www.jquery.com
 * 노트: 아래 스크립트는 jQuery library에 종속적이도록 작업을 하였다. 즉, jQuery Plugin으로 제작 되었다. jQuery는 www.jquery.com에서 자세히 확인할 수 있다. 
 *
 */

(function($){

//.auotgrow의 실 구현제
var AutogrowForm = function(el, options){
	var that = this;

	that.el = el;
	that.opt = options;
	that.dummy = null;
	that.isInterval = false;
	that.timer = null;
	that.findClassName = 'autogrow_v01';
	
	that.init(el, options);
}

AutogrowForm.prototype = {
	constructor: AutogrowForm,
	init : function(){
		this.bind();
	},
	//this.el event binding
	bind : function() {
		var that = this;
		//포커스가 발생되면 autogrow를 시작한다.
		$(that.el).on(that.opt.start, $.proxy(that.start, that));
		//포커스가 아웃되면 autogrow를 종료한다.
		$(that.el).on(that.opt.end, $.proxy(that.end, that));
	},
	//this.el focusin event bind
	start : function(event) {
		this.createDummy(event.target);
		this.isInterval = true;
		this.watchInterval();
	},
	//this.el focusout event bind
	end : function(event) {
		this.isInterval = false;
		this.removeDummy();
	},
	//this.el의 font 속성을 상속 받은 DIV를 생성한다.
	createDummy : function(el, msg) {
		//돌다리도 두드려 보자!
		this.removeDummy();
		
		var $el = $(el);
		var dummy = document.createElement('DIV');
		
		//text length따라서 height의 값이 늘어나는 CSS 속성
		dummy.style.position = 'absolute';
		dummy.style.overflow = 'auto';
		dummy.style.width = $el.width() + 'px';
		
		/*
		* event.target Element의 주요 Style속성을 상속 받는다.
		* this.el의 font 속성을 상속하는 부분
		* 누락되었거나 필요한 부분은 추가하여 준다.
		*/
		dummy.style.wordBreak = 'break-all';
		dummy.style.wordWrap = 'break-word';
		dummy.style.fontFamily = $el.css('font-family');
		dummy.style.fontSize = $el.css('font-size');
		dummy.style.lineHeight = $el.css('line-height');
		
		//테스트 가시성을 위해 임시 스타일 적용
		//dummy.style.border = '1px solid red';
		//window의 화면에서 랜더링 되지 않기 위해 -값으로 포지셔닝
		dummy.style.left = '-10000px';
		dummy.style.top = '-10000px';
		dummy.style.display = 'none';
		
		//쉽게 DOM을 찾기 위해 class name을 선언
		dummy.className = this.findClassName;
		
		//scope 변수
		this.dummy = dummy;
		
		//예제를 위한 소스코드 불필요시 삭제
		//$('#cloneArea').append(dummy);
		$(document.body).append(dummy);
	},
	//생성된 dummy를 삭제
	removeDummy : function() {
		$('.' + this.findClassName).remove();
		this.dummy = null;
	},
	/**
	 * interval을 동작하며 dummy의 높이값을 this.el에 적용하는 부분
	 * 재귀함수로 동작하며 that.isInterval값에 따라 동작한다.
	 */
	watchInterval : function() {
		var that = this;
		//that.isInterval은 함수를 실행할것인지를 선언한 변수
		if(!that.isInterval) {
			clearTimeout(that.timer);
			return;
		}
		//this.el의 value에 suffix를 추가하여 dummy에 적용
		$(that.dummy).html($(that.el).val().replace(/ /g, '&nbsp;') + that.opt.suffix);
		//dummy의 높이를 this.el의 높이에 적용
		//필요한 node에 높이를 적용하도록 변경한다.
		$(that.el).height($(that.dummy).height() + 'px').parent().height($(that.dummy).height() + 'px');
		//재귀함수 설정
		//that.timer는 that.isInterval값이 변경되었을 경우 clear하기 위해 설정하여 둔다.
		that.timer = setTimeout($.proxy(that.watchInterval, that), that.opt.duration);
	}
}

/*
* jQuery Plugin Bind
* 실제 구현체는 AutogrowForm
*/

$.fn.autogrow = function(options){
	//default option과 사용자 option merge
	var options = $.extend(true, {} , $.fn.autogrow.defaults, options );
	//실제 구현체 인스턴스 리턴
	var newInstance = new AutogrowForm(this, options);
	return newInstance;
}

//jQuery plugin constructor와 실 구현제 constructor 연결
$.fn.autogrow.constructor = AutogrowForm;

//jQuery plugin default options
$.fn.autogrow.defaults = {
	start : 'focusin',					//autogrow을 시작하는 이벤트 타이밍
	end : 'focusout',					//autogrow을 종료하는 이벤트 타이밍
	growForm : 'input, textarea',		//v0.1 버전에는 textarea만 적용되어 있음
	checkTiming : 'interval',			//v0.1 버전에는 interval로만 동작되어 있음. 추후 이벤트에 맞춰 autogrow체크를 설정할 수 있도록 준비할것임.
	suffix : '가',						//value의 값에 붙는 접미사
	duration : 10 						//checkTiming의 interval 시간
}

//data-autogrow="true" 속성이 있는 element를 autogrow로 bind
$(window).on('load', function(){
	$('[data-autogrow="true"]').each(function(){
		$(this).autogrow();
	});
});

})(window.jQuery || window.Zepto);

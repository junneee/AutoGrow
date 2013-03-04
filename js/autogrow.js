(function($){

var AutogrowForm = function(el, options){
	var that = this;

	that.el = el;
	that.opt = options;
	that.dummy = null;
	that.isInterval = false;
	that.timer = null;
	
	that.init(el, options);
}

AutogrowForm.prototype = {
	constructor: AutogrowForm,
	init : function(){
		
		this.bind();
	},
	bind : function() {
		var that = this;
		$(that.el).on(that.opt.start, $.proxy(that.start, that));
		$(that.el).on(that.opt.end, $.proxy(that.end, that));
	},
	start : function(event) {
		this.createDummy(event.target);
		this.isInterval = true;
		this.watchInterval();
	},
	end : function(event) {
		this.isInterval = false;
		this.removeDummy();
	},
	createDummy : function(el, msg) {
		this.removeDummy();
		var $el = $(el);
		var dummy = document.createElement('DIV');
		dummy.style.position = 'absolute';
		dummy.style.display = 'block';
		dummy.style.overflow = 'auto';
		//event.target Element의 주요 Style속성을 상속 받는다.
		dummy.style.wordBreak = 'break-all';
		dummy.style.wordWrap = 'break-word';
		dummy.style.width = $el.width() + 'px';
		dummy.style.fontFamily = $el.css('font-family');
		dummy.style.fontSize = $el.css('font-size');
		dummy.style.lineHeight = $el.css('line-height');
		//테스트 가시성을 위해 임시 스타일 적용
		dummy.style.border = '1px solid red';
		this.dummy = dummy;
		$('#cloneArea').append(dummy);
		
	},
	removeDummy : function(msg) {
		$('#cloneArea').children().remove();
		this.dummy = null;
	},
	watchInterval : function() {
		var that = this;
		if(!that.isInterval) {
			clearTimeout(that.timer);
			return;
		}

		$(that.dummy).html($(that.el).val().replace(/ /g, '&nbsp;') + that.opt.behindPrefix);
		$(that.el).height($(that.dummy).height() + 'px').parent().height($(that.dummy).height() + 'px');

		that.timer = setTimeout($.proxy(that.watchInterval, that), that.opt.duration);
		console.log('watchInterval')
	}
}


$.fn.autogrow = function(options){

	var options = $.extend(true, {} , $.fn.autogrow.defaults, options );
	var newInstance = new AutogrowForm(this, options);

	return newInstance;

}

$.fn.autogrow.constructor = AutogrowForm;

$.fn.autogrow.defaults = {
	autogrow : true,
	start : 'focusin',
	end : 'focusout',
	growForm : 'input, textarea',
	checkTiming : 'interval',		//interval or key events
	behindPrefix : '가',
	duration : 10
}


$(window).on('load', function(){
	$('[data-autogrow="true"]').each(function(){
		$(this).autogrow();
	});
});

})(window.jQuery || window.Zepto);
/*
	https://learn.jquery.com/events/event-extensions/
	http://benalman.com/news/2010/03/jquery-special-events/#api-setup
	https://github.com/benmajor/jQuery-Touch-Events#7-utility-functions
	https://github.com/benmajor/jQuery-Touch-Events/blob/master/src/jquery.mobile-events.js
*/
 (function($){
	function GetSlideAngle(dx, dy) {
	    return Math.atan2(dy, dx) * 180 / Math.PI;
	}

	//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
	function GetSlideDirection(startX, startY, endX, endY) {
	    var dy = startY - endY;
	    var dx = endX - startX;
	    var result = 0;
	 
	    //如果滑动距离太短
	    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
	        return result;
	    }
	 	
	    var angle = GetSlideAngle(dx, dy);
	    if (angle >= -45 && angle < 45) {
	        result = 4;
	    } else if (angle >= 45 && angle < 135) {
	        result = 1;
	    } else if (angle >= -135 && angle < -45) {
	        result = 2;
	    }
	    else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
	        result = 3;
	    }
	 
	    return result;
	};
	var touchCapable = ('ontouchstart' in window);
	var settings = {
	    startevent:  (touchCapable) ? 'touchstart' : 'mousedown',
	    endevent:    (touchCapable) ? 'touchend' : 'mouseup',
	    moveevent:   (touchCapable) ? 'touchmove' : 'mousemove',
	    tapevent:    (touchCapable) ? 'tap' : 'click',
		scrollevent: (touchCapable) ? 'touchmove' : 'scroll'
	};

	$.event.special.swipe={
		setup:function(){
			var originalCoord = {
			                    x: 0,
			                    y: 0
			};
			var finalCoord = {
                    x: 0,
                    y: 0
			};
			$(this).on(settings.startevent, function (e) {
				e.preventDefault();
			    originalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
				originalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
			});
			$(this).on(settings.endevent, function (e) {
				e.preventDefault();
				$this = $(e.currentTarget);
			    finalCoord.x = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageX : e.pageX;
				finalCoord.y = (e.originalEvent.targetTouches) ? e.originalEvent.targetTouches[0].pageY : e.pageY;
			    var direction = GetSlideDirection(originalCoord.x, originalCoord.y, finalCoord.x, finalCoord.y);
			    switch (direction) {
				        case 0:
				            //alert("没滑动");
				            break;
				        case 1:
				            //alert("向上");
				            $this.trigger("swipeup");
				            break;
				        case 2:
				            //alert("向下");
				            $this.trigger("swipedown");
				            break;
				        case 3:
				        	//alert("向左");
				        	$this.trigger("swipeleft");
				            break;
				        case 4:
				            $this.trigger("swiperight");
				            //alert("向右");
				            break;
				        default:
				        	console.log("direction",direction);
				}
			});

		},
		teardown:function(){
			$(this).off(settings.startevent).off(settings.endevent);
		},
		remove:function(){
			$(this).off(settings.startevent).off(settings.endevent);
		}
	};

	$.each({
	        scrollend: 'scrollstart',
	        swipeup: 'swipe',
	        swiperight: 'swipe',
	        swipedown: 'swipe',
	        swipeleft: 'swipe',
	        swipeend: 'swipe',
	        tap2: 'tap'
	    }, function (e, srcE) {
	        $.event.special[e] = {
	            setup: function () {
	                $(this).on(srcE, $.noop);
	            }
	        };
	});
	 
})(jQuery);

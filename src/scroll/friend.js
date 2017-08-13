var refreshTop = pangu.mobile.rem2px(1.2);

var list = {
	el: $('.m-list'),
	limit: 20,
	offset: 0,
	myScroll: null,
	isMore: true,
	isFetching: false,

	init: function() {

		var _this = this;
		// _this.clearList();
		var $refresh = $('.refresh');
        var pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;//表示获取元素自身的高度
		console.log(pullDownOffset);
		var nowDate = new Date();
		var nowTime = _checkTime(nowDate.getHours()) + ':' + _checkTime(nowDate.getMinutes());
		$refresh.find('.last-date').text('最后更新：' + nowTime);
		var touchEndPosY = 0;
		this.myScroll = new IScroll('.g-wrap', {
			mouseWheel: true,
			probeType: 3,
			click: true,
			topOffset: pullDownOffset
		});
		this.myScroll.on('scrollEnd', function() {
		    // if (this.y <= this.maxScrollY) {
			// 	if (!_this.isFetching) {
			// 		_this.getList();
			// 	}
		    // }
		});
		$(window).bind('touchend', function() {
			touchEndPosY = _this.myScroll.y;
		});
		this.myScroll.on('scrollEnd', function() {
		    // if ( touchEndPosY >= refreshTop + 15){
			// 	// window.location.reload();
		    // }
		});

		this.myScroll.on('scroll', function(e) {
			// if (typeof(InnerJSHelper) != 'undefined') {
            //     if (InnerJSHelper.onScroll != 'undefined') {
            //         InnerJSHelper.onScroll(this.y);
            //     }
			// }
			//
            // if (typeof(CommonJSHelper) != 'undefined') {
            //     if (CommonJSHelper.onScroll != 'undefined') {
            //         CommonJSHelper.onScroll(this.y)
            //     }
			// }
		});

		// this.el.on('click', '.comment__info', function() {
		// 	var id = $(this).data('id');
		// 	var host = window.location.host;
		// 	var protocol= window.location.protocol;
		// 	var url = protocol + '//' + host + '/yubashuo/topic?topicId=' + id;
		// 	if (typeof(CommonJSHelper) != 'undefined') {
		// 		if (CommonJSHelper.showUrlInNewpage) {
		// 			CommonJSHelper.showUrlInNewpage(url);
		// 		}
		// 	}
		// });
        //
		// this.el.on('click', '.user__bar', function() {
		// 	var gbId = $(this).data('gbId');
		// 	if (gbId) {
		// 		if (typeof(CommonJSHelper) != 'undefined') {
		// 			if (CommonJSHelper.showPersonalPage) {
		// 				CommonJSHelper.showPersonalPage(gbId);
		// 			}
		// 		}
		// 	} else {
		// 		new Toast("暂时无法查看Ta的个人空间！");
		// 	}
		// });
        //
		// this.el.on('click', '.icon-zan', function(e) {
		// 	var zan = $(this).data('zan');
		// 	var id = zan.commentId;
		// 	//type: 0 - 取消赞； 1 - 点赞
		// 	var type = zan.hasZan === 1 ? 0 : 1;
		// 	var count = zan.count;
		// 	var $icon = $(e.currentTarget);
        //
		// 	_this.zan(id, type).then(function (msg) {
		// 		if (msg.resCode == 11) {
		// 			common.login();
		// 			return;
		// 		}
        //
		// 		if (msg.resCode != 0) {
		// 			new Toast(msg.resReason);
		// 			return;
		// 		}
        //
		// 		if (type === 0) {
		// 			count--;
		// 			$icon.removeClass('actived');
		// 			$icon.data('zan', { commentId: id, hasZan: type, count: count });
		// 			$icon.prev().text('(' + count + ')');
		// 		} else {
		// 			count++;
		// 			$icon.addClass('actived');
		// 			$icon.data('zan', { commentId: id, hasZan: type, count: count });
		// 			$icon.prev().text('(' + count + ')');
		// 		}
        //
		// 	}, function () {
		// 		new Toast("网络不可用，请稍后再试！");
		// 	});
		// });
        //
		// this.getList();
	},

	getList: function() {
		var _this = this;
		_this.isFetching = true;

		_this.getFriendCommentList(this.offset, this.limit).then(function (msg) {
			if (msg.resCode == 11) {
				if (typeof(CommonJSHelper) != 'undefined') {
					common.login();
				}
				return;
			}

			if(msg.resCode != 0){
				new Toast('唉，网络不给力！请检查网络后再试试？');
				_this.isFetching = false;
				return;
			}
			if (msg.data.length === 0) {
				_this.isMore = false;

				if (_this.offset === 0) {
					_this.clearList();
				} else {
					new Toast('╮(╯▽╰)╭  没有更多内容了');
				}
				_this.isFetching = false;

				return;
			} else {
				var commentId = msg.data[0].commentId + '';
				if (typeof(CommonJSHelper) != 'undefined') {
					if (CommonJSHelper.sendValue) {
						CommonJSHelper.sendValue(commentId);
					}
				}
			}


			for (var i = 0; i < msg.data.length; i++) {
				var tempItem = _this.createItem(msg.data[i]);
				_this.el.append(tempItem);
			}
			_this.myScroll.refresh();
			_this.offset = _this.offset + msg.data.length;
			_this.isFetching = false;
		}, function (error) {
			new Toast("网络不可用，请稍后再试！");
		});
	},

	zan: function (id, type) {
		var tycredidential = common.getQueryString("tycredidential");

		return $.ajax({
		    url:'/yubashuo/zan-comment',
		    type:'POST',
		    data:{
		        commentId: id,
		        type: type,
		        tycredidential: tycredidential
		    },
		    dataType:'json'
		});
	},

	getFriendCommentList: function (offset, limit) {
		var tycredidential = common.getQueryString("tycredidential");

		return $.ajax({
			url: '/yubashuo/getFriendCommentList',
			type: 'GET',
			data: {
				offset: offset,
				limit: limit,
				tycredidential: tycredidential
			}
		});
	},

	clearList: function() {
		var $container = $('.container');
		$container.empty();
		$container.append('<div class="no-data"></div>');
		$container.append('<p class="no-list">暂时还没有好友动态哦~</p>');
	},

	createItem: function(data) {
		var $item = $(ItemTemplate);
		$item.data('item', data);
		$item.find('.user__bar').data('gbId', data.gbId);
		$item.find('.user__bar--headImg').attr('src', data.headImgKey);
		$item.find('.nickname').text(data.nickName);
		$item.find('.user__bar--time').text(_formatDate(data.time));
		$item.find('.player-name').text(data.playerName);
		$item.find('.server-name').text(data.serverName);
		$item.find('.school-name').text(data.schoolName);
		$item.find('.comment__info').data('id', data.topicId);
		$item.find('.comment__info--content').text(data.content);
		$item.find('.topic-pic').attr('src', data.picUrl);
		$item.find('.topic-title').text(data.title);
		if (data.hasZan === 1) {
			$item.find('.icon-zan').addClass('actived');
		}
		$item.find('.zan-count').text('(' + data.zan + ')');
		$item.find('.icon-zan').data('zan', { commentId: data.commentId, hasZan: data.hasZan, count: data.zan });
		return $item;
	}
}

function _formatDate(timestamp) {
	var date = new Date(timestamp);
	var now = new Date();
	var dateStr = '';
	var dateHours = _checkTime(date.getHours());
	var dateMinutes = _checkTime(date.getMinutes());
	if (date.getFullYear() != now.getFullYear()) {
		dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '  ' + dateHours + ':' + dateMinutes;
	} else {
		if ((date.getMonth() == now.getMonth()) && (date.getDate() == now.getDate())) {
			dateStr = dateHours + ':' + dateMinutes;
		} else {
			dateStr = (date.getMonth() + 1) + '-' + date.getDate() + '  ' + dateHours + ':' + dateMinutes;
		}
	}
	return dateStr;
}

function _checkTime(i) {
	if (i < 10) {
		i = '0' + i;
	}
	return i
}

var ItemTemplate = '<li class="box"> \
	<div class="user__bar f-cb"> \
		<span class="user__bar--time"></span> \
		<img class="user__bar--headImg f-fl"></img> \
		<div class="user__bar--info f-fl"> \
			<div class="nickname"></div> \
			<div class="player-info f-cb"> \
				<span class="player-name f-fl"></span> \
				<i class="split-line f-fl"></i> \
				<span class="server-name f-fl"></span> \
				<i class="split-line f-fl"></i> \
				<span class="school-name f-fl"></span> \
			</div> \
		</div> \
	</div> \
	<div class="comment__info"> \
		<p class="comment__info--content overflow-hide"></p> \
		<div class="comment__info--topic f-cb"> \
			<img class="topic-pic f-fl"></img> \
			<p class="topic-title overflow-hide"></p> \
		</div> \
	</div> \
	<div class="comment__zan f-cb"> \
		<span class="zan-count f-fr">(20)</span> \
		<i class="icon-zan f-fr"></i> \
	</div> \
</li>';

list.init();

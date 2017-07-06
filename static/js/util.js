
Date.prototype.format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

Number.prototype.toFixed = function(d) {  
    var s = this + ''; 
    if(!d) d = 0; 
    if(s.indexOf('.') == -1) s += '.'; 
    s += new Array(d + 1).join("0"); 
    if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)) {
        var s = '0' + RegExp.$2,
            pm = RegExp.$1,
            a = RegExp.$3.length,
            b = true;
        if(a == d + 2) {
            a = s.match(/\d/g); 
            if(parseInt(a[a.length-1])>4) {
                for(var i = a.length-2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if(a[i] == 10){
                        a[i] = 0;
                        b = i != 1;
                    } else {
                    	break;
                    }
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");
        }
        if(b){
        	s = s.substr(1); 
        }
        return (pm + s).replace(/\.$/, '');
    }
    return this + '';
};



/* ------------------------------------------------------------- */
/** 下列提供通用以及项目定制相关的共用方法
 * @author jie.zhang 
 * @date 20160930 ver.1.0
 */

/*
 * 常用工具类
 */
var NameSpace = {
	//judge if string is empty  
	isNull : function(obj) {
		if (!obj || obj.length ==0) {
		    return true;
		}
		return false;
	},
	isEmptyObj: function(obj){
		return $.isEmptyObject(obj);
	},
	//type of js object
	typeOf : function(obj) {
		var _toString = Object.prototype.toString;
		var _type = {
			'undefined' : 'undefined',
			'number' : 'number',
			'boolean' : 'boolean',
			'string' : 'string',
			'[object Function]' : 'function',
			'[object RegExp]' : 'regexp',
			'[object Array]' : 'array',
			'[object Date]' : 'date',
			'[object Error]' : 'error'
		};
		return _type[typeof obj] || _type[_toString.call(obj)]
				|| (obj ? 'object' : 'null');
	},
	//judge if type of number 
	isNumber : function(obj) {
		 var reg = new RegExp("^\\d+(\\.\\d+)?$"); 
		 return reg.test(obj) ? true : false;
	},
	isAllNumber : function(obj){
		return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(obj);
	},
	//convert string to number
	toNum : function(obj) {
		if (this.isNull(obj)) return obj;
		return isNaN(parseInt(obj)) ? obj.toString() : parseInt(obj);
	},
	//remove blank space in string such as change ' a bc d ' to 'abcd'
	allTrim : function(str) {
		return str == null ? '' : str.replace(/\ /g, '');
	},
	//remove blank space in string such as change ' a bc d ' to 'a bc d'
	lrtrim : function(str) {  
        return str.replace(/(^\s*)|(\s*$)/g, '');  
    },
    lTrim : function(str) {  
        return str.replace(/(^\s*)/g, '');  
    },
    rTrim : function(str) {  
        return str.replace(/(\s*$)/g, '');  
    },
    //judge if string end with specified string or char 
    isEndswith : function(wholestr, charobj) {
    	var dis = wholestr.length - charobj.length;
    	return dis >= 0 && wholestr.lastIndexOf(charobj) == dis;
    },
	//ellipsis too long string
	longStrOmit : function(str, maxLength) {
		if (!this.isNumber(maxLength)) return;
		return maxLength > str.length ? str : str.slice(0, maxLength) + '...';
	},
	//format null value to ''
	toEmpty : function(obj){
        var noneList = [ 'null', 'undefined', '' ];
        return this.isNull(obj) || this.array.contains(noneList, obj) ? '' : obj;
    },
	array : {
		contains : function(arr, val) {
			var key = 0, 
			    retnReslt = false, 
			    len = arr.length;
			for (;;) {
				if (val == arr[key]) {
					retnReslt = true;
					break;
				}
				if (++key == len) {
					break;
				}
			}
			return retnReslt;
		},
		//remove one element in array
		removeElement : function(arr, element) {
			var thisElementIdx = arr.indexOf(element);
			if (thisElementIdx != -1) {
				arr.splice(thisElementIdx, 1);
			}
			return arr;
		},
		//remove one element in specified index
		removeIdx : function(arr, index) {
			if (isNaN(index) || index >= arr.length) {
				return false;
			}
			arr.splice(index, 1);
			return arr;
		},
		hasRepeatedElement: function(arr){
		    return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f"+arr.join("\x0f\x0f") +"\x0f");
		},
		//if not the same element exists in array
		hasNoRepeatedElement: function(arr) {
			return $.unique(arr).length != 1 ? true : false;
		}
	},
	DateTime2Date : function(obj) {
		return this.dateFormat(obj);
	},
	DateTime2Day : function(obj) {
		return this.dateFormat(obj, 'yyyy-MM-dd');
	},
	formatDate : function(obj) {
		return obj ? (new Date(obj)).format("yyyy-MM-dd hh:mm:ss") : obj;
	},
	//reformat date such as 'yyyy_MM_dd hh:mm:ss:SS 星期w 第q季度'
	dateFormat : function(date, formatrule) {  
	    var date = this.isNull(date) ? new Date() : 
	    	  (this.typeOf(date) == 'date' ? date : new Date(date)),
	        formatrule = formatrule || 'yyyy-MM-dd hh:mm:ss',
	        week = [ '日', '一', '二', '三', '四', '五', '六' ];  
	    var obj = {  
	        "y+" : date.getYear(), 
	        "M+" : date.getMonth() + 1,
	        "d+" : date.getDate(), 
	        "h+" : date.getHours(),
	        "H+" : date.getHours(), 
	        "m+" : date.getMinutes(), 
	        "s+" : date.getSeconds(),
	        "q+" : Math.floor((date.getMonth() + 3) / 3), 
	        "S" : date.getMilliseconds(),
	        "w" : week[date.getDay()]  
	    }  
	    if (/(y+)/.test(formatrule)) {  
	        formatrule = formatrule.replace(RegExp.$1, 
	        		(date.getFullYear() + "").substr(4 - RegExp.$1.length));  
	    }  
	    for (var k in obj) {  
	        if (new RegExp("(" + k + ")").test(formatrule)) {  
	            formatrule = formatrule.replace(RegExp.$1, 
	            		RegExp.$1.length == 1 ? obj[k] : ("00" + obj[k]).substr(("" + obj[k]).length));  
	        }  
	    }  
	    return formatrule;  
	},
	fetch: function(obj){
		var reg = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(obj);
		if(!reg) return '';
		return {
			year: RegExp.$1,
			month: RegExp.$2,
			day: RegExp.$3
		}
	},
	//add tip field for validation use
	appendWarnTip : function() {
		var $lbl = $("body").find(".form-group");
		$lbl.each(function(){
		    $(this).append('<label class="col-md-2 warntip" style="width:100px; color:red"></label>');
		});
	},
	getMonth : function(datestr) {
		if (this.isNull(datestr)) return '';
		var datearr = datestr.split('-');
		var month = datearr[1];
		return month;
	},
	//in case of escape
	escape : function(obj) {
		var comparelist = {
	        '\\' :  '&#92;',
	        '&'  :  '&amp;',
	        '<'  :  '&lt;',
	        '>'  :  '&gt;',
	        '"'  :  '&quot;',
	        "'"  :  '&#39;',
	        "/"  :  '&#47;'
	    };
		
		return obj.replace(/[&<>"'\/\\]/g, function (match) {
	        return comparelist[match];
	    });
	},
	//several decimal add
	add : function(firstParam, secParam, decimalnum) {
		var decimalnum = decimalnum || 2;
		if (!this.isAllNumber(firstParam) || !this.isAllNumber(secParam)) return;
		return (firstParam + secParam).toFixed(decimalnum);
	},
	//clear attribute of js object  
	emptyObjAttrVal : function(obj){
		if(this.isNull(obj)) return '';
		for(var attr in obj) {
			obj[attr] = '';
		}
		return obj;
	},
	//ajax post request
	jsonPostInvoke : function(url, data, callback, async) {
		var datalist = this.isNull(data) ? {} : data,
			async = async || false;
		
		$.ajax({
		 	url : getPath + url,
		 	async : async,
		 	cache : false,
		 	type : 'post', 
		 	data: datalist,
		 	dataType : 'json',
		 	success : function(data) {
		 		if(callback && typeof callback == 'function') callback(data);
		    }
	    });
	},
	//prevent duplicate submit
	time_queue : {},
	preventDuplicateSubmit : function(id, fn, waittime) {
		if(!waittime) waittime = 400;
		if(this.time_queue[id]) {
			console.log('event has been duplicate clicked!');
	        clearTimeout(this.time_queue[id]);
		    delete this.time_queue[id];
		}
		var that = this;
		return this.time_queue[id] = setTimeout(function() {
			if(fn && typeof fn == 'function') fn();
			delete that.time_queue[id];
		}, waittime);
	},
	//colorful content of console log
	colorConsolelog : function(desc, color) {
		var color = color || 'red';
		console.log('%c' + desc, 'color:' + color);
	},
	obj: {
		isNull: function(obj){
	        return NameSpace.isNull.call(this, obj);
		},
		allNotNull: function(){
	        var arglen = arguments.length, count = 0;
			if(arglen == 0) return false;
			for(var i = 0; i < arglen; i++){
			    var arg = arguments[i];
			    !this.isNull(arg) && count++;
			}
			return count == arglen ? true : false;
	    },
	    //get key by value or get value by key from object
		getValue: function(object, key){
		    if(this.allNotNull(object, key) && object.hasOwnProperty(key)){
		        return object[key];
		    }
		    return null;
		},
		getKey: function(object, value){
		    if(this.allNotNull(object, value)){
		        for(var key in object){
		            if(value == object[key]){
		               return key;
		            }
		        }
		    }
		    return null;
		}
	}
};

NameSpace.amt = {
	/* 金额数目格式化 eg:'10000元'为'10,000元' */
	formatLongAmt : function(obj) {
		if (!this.isNumber(obj)) {
			return obj;
		}
		return (obj + '').split('').reverse().join('').replace(
				/(\d{3})(?=\d)/g, '$1,').split('').reverse().join('');
	},
	/* 金额格式化转回数字类型   */
	formatCCY2Num : function(obj) {
		if(NameSpace.isNull(obj)) return;
		if (typeof obj == 'number') {
            obj = obj.toString();
        }
		return parseFloat(obj.replace(/[^\d\.-]/g, ""));
	}
}

$.extend(NameSpace, NameSpace.amt);

$.fn.extend({
	// 在光标处插入指定文字，$(el).insertAtCursor('some text')
	insertAtCursor : function(myValue) {
		var $t = $(this)[0];
		if (document.selection) {
			this.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
		} else if ($t.selectionStart || $t.selectionStart == '0') {
			var startPos = $t.selectionStart;
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			if(NameSpace.isEndswith(myValue, '}') || NameSpace.isEndswith(myValue, ')')){
				// 如果是以}、)等结尾的在光标在它们前面一格
				$t.selectionStart = startPos + myValue.length-1;
				$t.selectionEnd = startPos + myValue.length-1;
			}else {
				$t.selectionStart = startPos + myValue.length;
				$t.selectionEnd = startPos + myValue.length;
			}
			$t.scrollTop = scrollTop;
		} else {
			this.value += myValue;
			this.focus();
		}
	}
});

/* 
 * 事件监听 
 */
var evt = {
	addEvent : function(type, domId, callback) {
		switch(type) {
		case 'change': this.onchangeEvt(domId, callback); break;
		case 'blur': this.onblurEvt(domId, callback); break;
		//以下为针对select2事件监听
		case 'clear': this.onSelect2ClearingEvt(domId, callback); break;
		case 'select2change': this.onSelect2ChangeEvt(domId, callback); break;
		default: break;
		}
	},
	onchangeEvt : function(domId, callback) {
		$("#"+domId).on("change", function() {
			(callback && typeof callback == 'function') && callback(this);
		});
	}, 
	onblurEvt : function(domId, callback) {
		$("#"+domId).on("blur", function() {
			(callback && typeof callback == 'function') && callback(this);
		});
	},
	//获得焦点,就立刻失去焦点,阻止用户自己填写
	//example:日期datepicker控件
	noFocus : function(domId) {
		$("#"+domId).focus(function() {
		    $(this).blur();
		});
	},
	//add by zhangmz 2016-11-15 清空选项之后(仅限select2控件使用) begin
	onSelect2ClearingEvt : function(domId, callback) {
		$("#"+domId).on("select2-clearing", function() {
			(callback && typeof callback == 'function') && callback();
		});
	},
	//add by zhangmz 2016-11-15 清空选项之后(仅限select2控件使用) end
	onSelect2ChangeEvt : function(domId, callback) {
		$('#'+domId).on('select2-selecting', function(el) {
			(callback && typeof callback == 'function') && callback(el);
		});
		return this;
	}
}


/* 
 * select2提示框包装   
 */
var poptip = {
	//定制
	succSaved: function(){
		var colorPointTip = '<label style="font-weight:bold;color:#41D78B">成功</label>';
		return this.alert('保存'+colorPointTip+', 将跳转列表..', 6);
	},
	failSaved: function(){
		var colorPointTip = '<label style="font-weight:bold;color:#E75445">失败</label>';
		return this.alert('保存'+colorPointTip+'! 将跳转列表..', 2, '警告');
	},
	//通用包装
	alert : function(desc, iconcode, title) {
		//iconcode 1:对号  2:叉号   6:微笑提示  7:感叹号
		var title = title || '提示',
		    iconcode = iconcode || 1;
		return layer.alert(desc, {
	    	title: title,
	        icon: iconcode,
	        skin: 'layer-ext-moon'
	    });
	},
	warn : function(domId, warninstrs) {
		return layer.tips(warninstrs, '#'+domId, {
            tips: [1, '#FF7777'],
            time: 4000
        });
	},
	//自定义对页面select2的校验提示
	warntip : function(domid, objvalue, tip, count) {
		if (objvalue == '') {
			poptip.warn(domid, tip);
			count++;
		}
		return count;
	}
}

/**
 * 包装layer插件
 */
var layerUI = {
    //打开弹窗
	openLayerDialog: function(func, modalId, title, firstBtnDesc) {
	    firstBtnDesc = firstBtnDesc || '保存';
	    title = title || '信息';
			
		layer.open({
		    type : 1,
		    title : title,
			shade : [ 0.8, '#393D49' ],
			area : [ '750px', '300px' ],
			fix : false, 
			maxmin : true,
			btn : [ firstBtnDesc, '关闭' ], 
			yes : function(index, layero) {
			    if(func && typeof func == 'function') {
				    func();
				}
				layer.close(index);
			},
			other : function(index, layero) {
				layer.close(index);
			},
			cancel : function(index, layero) {
				layer.close(index);
			},
			content : $('#'+modalId)
		});
	},
	popInitParam: function(url, title, endcallbackfn, type, maxmin) {
		title = title || '信息';
		type = type || 2;
		maxmin = maxmin || true;
		
		return {
		    type: type,
		    title : title,
		    shade: [ 0.8, '#393D49' ],
		    maxmin: maxmin,
		    content: getPath + url,
		    end: function () { 
			    if(endcallbackfn && typeof endcallbackfn == 'function') {
			    	endcallbackfn();
			    } else {
			        location.reload(); 
			    }
	        }
		}
	}
}

/*
 * 项目定制化页面处理
 * 前端页面枚举
 */
var enums = {
    //行项目'发票种类'枚举
    invoicetype: {"1" : '增值税专用发票'},
    getInvoicetypeCode: function(value) {
        return NameSpace.obj.getKey(this.invoicetype, value);
    },
	getInvoicetypeValue: function(key) {
		return NameSpace.obj.getValue(this.invoicetype, key);
    }
}


/**
 * 项目定制工具类
 */
var SPECI_NS = {
	//单据状态显示加色
	addColor : function(status) {
		return { 
			'未审核' : '#009FCC', 
			'待过账' : '#00aa88',
			'已冻结' : '#E63F00',
			'已过账' : 'green',
			'待付款' : '#CD853F',
			'待收款' : '#CD853F',
			'已付款' : '#8B4513',
			'已收款' : '#8B4513',
			'已核销' : '#4B0082',
			'记账中' : 'olive', 
			'记账失败' : '#DC143C',
			'1' : '#009FCC', 
			'2' : '#00aa88',
			'3' : '#E63F00',
			'4' : 'green',
			'5' : '#CD853F',
			'6' : '#8B4513',
			'7' : '#4B0082',
			'8' : 'olive', 
			'9' : '#DC143C'
	    }[status] || '#666666';
	},
	isShowVoucherInfoStatus: function(status){
		var statusList = ['已过账','4','待付款','5','待收款','已付款','6','已收款','已核销','7'];
		return NameSpace.array.contains(statusList, status) ? true : false;
	}
}

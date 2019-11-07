/*
 * lCalendar日期控件
 */
const icalendar_timeData = ['不清楚时辰','00:00 ~ 00:59','01:00 ~ 01:59','02:00 ~ 02:59','03:00 ~ 03:59','04:00 ~ 04:59','05:00 ~ 05:59','06:00 ~ 06:59','07:00 ~ 07:59','08:00 ~ 08:59','09:00 ~ 09:59','10:00 ~ 10:59','11:00 ~ 11:59','12:00 ~ 12:59','13:00 ~ 13:59','14:00 ~ 14:59','15:00 ~ 15:59','16:00 ~ 16:59','17:00 ~ 17:59','18:00 ~ 18:59','19:00 ~ 19:59','20:00 ~ 20:59','21:00 ~ 21:59','22:00 ~ 22:59','23:00 ~ 23:59'],
myMonths=[3,0,7,0,0,6,0,0,4,0,0,2,0,7,0,0,5,0,0,3,0,8,0,0,6,0,0,4,0,0,3,0,7,0,0,5,0,0,4,0,8,0,0,6,0,0,4,0,10,0,0,6,0,0,5,0,0,3,0,8,0,0,5,0,0,4,0,0,2,0,7,0,0,5,0,0,4,0,9,0,0,6,0,0,4,0,0,2,0,6,0,0,5,0,0,3],
lunarInfo = [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42416, 83315, 21168, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46752, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448, 84835];
// 月份计算
function monthDays(a, c) {
	return lunarInfo[a - 1900] & 65536 >> c ? 30 : 29
}

window.lCalendar = (function(e) {
		var MobileCalendar = function() {
			this.gearDate;
			this.minY = 1900;
			this.minM = 1,
				this.minD = 1,
				this.maxY = 2099,
				this.maxM = 12,
				this.maxD = 31
		}

	MobileCalendar.prototype = {
		init: function(params) {
			window.icalendar_type = params.icalendar_type;
			this.type = params.type;
			this.trigger = document.querySelector(params.trigger);
			if (this.trigger.getAttribute("data-lcalendar") != null) {
				var arr = this.trigger.getAttribute("data-lcalendar").split(',');
				var minArr = arr[0].split('-');
				this.minY = ~~minArr[0];
				this.minM = ~~minArr[1];
				this.minD = ~~minArr[2];
				var maxArr = arr[1].split('-');
				this.maxY = ~~maxArr[0];
				this.maxM = ~~maxArr[1];
				this.maxD = ~~maxArr[2];
			}
			this.bindEvent(this.type);
		},
		bindEvent: function(type) {
			var _self = this;
			//呼出日期+时间插件
			function popupDateTime(e) {
				_self.gearDate = document.createElement("div");
				_self.gearDate.className = "gearDatetime";
				_self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
					'<div class="date_roll_mask">' +
					'<div class="datetime_roll">' +
					'<div>' +
					'<div class="gear date_yy" data-datetype="date_yy"></div>' +
					'<div class="date_grid">' +
					'<div>年</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear date_mm" data-datetype="date_mm"></div>' +
					'<div class="date_grid">' +
					'<div>月</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear date_dd" data-datetype="date_dd"></div>' +
					'<div class="date_grid">' +
					'<div>日</div>' +
					'</div>' +
					'</div>' +
					'<div>' +
					'<div class="gear time_hh" data-datetype="time_hh"></div>' +
					'<div class="date_grid">' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
				document.querySelector('.dashi-content-mid-data').appendChild(_self.gearDate);
				dateTimeCtrlInit();
				$('.answer-content, .dashi-content').off("click").on('click','.lcalendar_finish',finishMobileDateTime)
				var date_yy = _self.gearDate.querySelector(".date_yy");
				var date_mm = _self.gearDate.querySelector(".date_mm");
				var date_dd = _self.gearDate.querySelector(".date_dd");
				var time_hh = _self.gearDate.querySelector(".time_hh");
				date_yy.addEventListener('touchstart', gearTouchStart);
				date_mm.addEventListener('touchstart', gearTouchStart);
				date_dd.addEventListener('touchstart', gearTouchStart);
				time_hh.addEventListener('touchstart', gearTouchStart);
				date_yy.addEventListener('touchmove', gearTouchMove);
				date_mm.addEventListener('touchmove', gearTouchMove);
				date_dd.addEventListener('touchmove', gearTouchMove);
				time_hh.addEventListener('touchmove', gearTouchMove);
				date_yy.addEventListener('touchend', gearTouchEnd);
				date_mm.addEventListener('touchend', gearTouchEnd);
				date_dd.addEventListener('touchend', gearTouchEnd);
				time_hh.addEventListener('touchend', gearTouchEnd);
			}
			//初始化年月日时分插件默认值
			function dateTimeCtrlInit() {
				var date = new Date();
				// var dateArr = {
				// 	yy: date.getYear(),
				// 	mm: date.getMonth(),
				// 	dd: date.getDate() - 1,
				// 	hh: date.getHours()
				// };
				var dateArr = {
					yy: 90,
					mm: 0,
					dd: 0,
					hh: 0
				};
				// console.log(dateArr.yy)
				// console.log(dateArr.mm)
				// console.log( dateArr.dd )
				// console.log( dateArr.hh)
				// icalendarM = date.getMonth()
				icalendarM = 0;
				if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}$/.test(_self.trigger.value)) {
					rs = _self.trigger.value.match(/(^|-|\s|:)\d{1,4}/g);
					dateArr.yy = rs[0] - _self.minY;
					dateArr.mm = rs[1].replace(/-/g, "") - 1;
					dateArr.dd = rs[2].replace(/-/g, "") - 1;
					dateArr.hh = parseInt(rs[3].replace(/\s0?/g, ""))
				} else {
					dateArr.yy = dateArr.yy + 1900 - _self.minY;
				}
				_self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
				_self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
				_self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
				setDateGearTooth();
				_self.gearDate.querySelector(".time_hh").setAttribute("val", dateArr.hh);
				setTimeGearTooth();
			}
			//重置日期节点个数
			function setDateGearTooth() {
				var passY = _self.maxY - _self.minY + 1;
				var date_yy = _self.gearDate.querySelector(".date_yy");
				var itemStr = "";
				if (date_yy && date_yy.getAttribute("val")) {
					//得到年份的值
					var yyVal = parseInt(date_yy.getAttribute("val"));
					//p 当前节点前后需要展示的节点个数
					if(icalendar_type == 1){
						for (var p = 0; p <= passY - 1; p++) {
							itemStr += "<div class='tooth'>" + (_self.minY + p) + "</div>";
						}
						date_yy.innerHTML = itemStr;
					}else if(icalendar_type == 0){
						for(let p = _self.minY;p <= _self.maxY;p++){
							itemStr += "<div class='tooth'>" +  p + "</div>";
						}
						date_yy.innerHTML = itemStr;
					}

					var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
					if (!isNaN(top)) {
						top % 2 == 0 ? (top = top) : (top = top + 1);
						top > 10 && (top = 10);
						var minTop = 10 - (passY - 1) * 2;
						top < minTop && (top = minTop);
						date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
						date_yy.setAttribute('top', top + 'em');
						yyVal = Math.abs(top - 10) / 2;
						date_yy.setAttribute("val", yyVal);
					} else {
						date_yy.style["-webkit-transform"] = 'translate3d(0,' + (10 - yyVal * 2) + 'em,0)';
						date_yy.setAttribute('top', 10 - yyVal * 2 + 'em');
					}
				} else {
					return;
				}
				var date_mm = _self.gearDate.querySelector(".date_mm");
				if (date_mm && date_mm.getAttribute("val")) {
					itemStr = "";
					// if(icalendar_type == 1){
						//得到月份的值
						var mmVal = parseInt(date_mm.getAttribute("val"));
						var maxM = 11;
						var minM = 0;
					// }else if(icalendar_type == 2){
					// 	//得到月份的值
					// 	var mmVal = document.querySelectorAll('.date_mm div').length - 1;
					// 	var maxM = document.querySelectorAll('.date_mm div').length - 1;
					// 	var minM = 0;
					// }

					//当年份到达最大值
					if (yyVal == passY - 1) {
						maxM = _self.maxM - 1;
					}
					//当年份到达最小值
					if (yyVal == 0) {
						minM = _self.minM - 1;
					}
          //p 当前节点前后需要展示的节点个数
					if(icalendar_type == 1){
						for (var p = 0; p < maxM - minM + 1; p++) {
							itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
						}
						date_mm.innerHTML = itemStr;
					}else if(icalendar_type == 0){
						for(let p = 0;p < 12; p ++){
							itemStr += "<div class='tooth'>" + Number(p+1)+ "</div>";
							if(myMonths[yyVal] != 0 && myMonths[yyVal]-1 == p)
								  itemStr += "<div class='tooth'>" + '闰'+ Number(p+1)  + "</div>";
						}
						date_mm.innerHTML = itemStr;
					}

					if (mmVal > maxM) {
						mmVal = maxM;
						date_mm.setAttribute("val", mmVal);
					} else if (mmVal < minM) {
						mmVal = maxM;
						date_mm.setAttribute("val", mmVal);
					}

					date_mm.style["-webkit-transform"] = 'translate3d(0,' + (10 - (mmVal - minM) * 2) + 'em,0)';
					date_mm.setAttribute('top', 10 - (mmVal - minM) * 2 + 'em');
				} else {
					return;
				}
				var date_dd = _self.gearDate.querySelector(".date_dd");
				if (date_dd && date_dd.getAttribute("val")) {
					itemStr = "";
          // if(icalendar_type == 1){
						//得到日期的值
						var ddVal = parseInt(date_dd.getAttribute("val"));
						//返回月份的天数
						var maxMonthDays = calcDays(yyVal, mmVal);
						//p 当前节点前后需要展示的节点个数
						var maxD = maxMonthDays - 1;
						var minD = 0;
					// }else if(icalendar_type == 2){
					// 	//得到日期的值
					// 	var ddVal = document.querySelectorAll(".date_dd div").length - 1;
					// 	//返回月份的天数
					// 	var maxMonthDays = calcDays(yyVal, mmVal);
					// 	//p 当前节点前后需要展示的节点个数
					// 	var maxD = document.querySelectorAll(".date_dd div").length - 1;
					// 	var minD = 0;
					// }

					//当年份月份到达最大值
					if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
						maxD = _self.maxD - 1;
					}
					//当年、月到达最小值
					if (yyVal == 0 && _self.minM == mmVal + 1) {
						minD = _self.minD - 1;
					}

					if(icalendar_type == 1){
						for (var p = 0; p < maxD - minD + 1; p++) {
							itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
						}
						date_dd.innerHTML = itemStr;
					}else if(icalendar_type == 0){
						let _yyVal = document.querySelectorAll('.date_yy .tooth')[yyVal].innerHTML;
						let l = monthDays(Number(_yyVal),mmVal+1);
						for(let p = 1;p < l + 1;p++){
							itemStr += "<div class='tooth'>" + p + "</div>";
						}
						date_dd.innerHTML = itemStr;
					}

					if (ddVal > maxD) {
						ddVal = maxD;
						date_dd.setAttribute("val", ddVal);
					} else if (ddVal < minD) {
						ddVal = minD;
						date_dd.setAttribute("val", ddVal);
					}
					date_dd.style["-webkit-transform"] = 'translate3d(0,' + (10 - (ddVal - minD) * 2) + 'em,0)';
					date_dd.setAttribute('top', 10 - (ddVal - minD) * 2 + 'em');
				} else {
					return;
				}
			}
			//重置时间节点个数
			function setTimeGearTooth() {
				var time_hh = _self.gearDate.querySelector(".time_hh");
				if (time_hh && time_hh.getAttribute("val")) {
					var i = "";
					var hhVal = parseInt(time_hh.getAttribute("val"));
					for (var g = 0; g <= 24; g++) {
						i += "<div class='tooth'>" + icalendar_timeData[g] + "</div>";
					}
					time_hh.innerHTML = i;
					time_hh.style["-webkit-transform"] = 'translate3d(0,' + (10 - hhVal * 2) + 'em,0)';
					time_hh.setAttribute('top', 10 - hhVal * 2 + 'em');
				} else {
					return
				}
				var time_mm = _self.gearDate.querySelector(".time_mm");
				if (time_mm && time_mm.getAttribute("val")) {
					var i = "";
					var mmVal = parseInt(time_mm.getAttribute("val"));
					for (var g = 0; g <= 59; g++) {
						i += "<div class='tooth'>" + g + "</div>";
					}
					time_mm.innerHTML = i;
					time_mm.style["-webkit-transform"] = 'translate3d(0,' + (10 - mmVal * 2) + 'em,0)';
					time_mm.setAttribute('top', 10 - mmVal * 2 + 'em');
				} else {
					return
				}

				var time_ss = _self.gearDate.querySelector(".time_ss");
				if (time_ss && time_ss.getAttribute("val")) {
					var i = "";
					var mmVal = parseInt(time_ss.getAttribute("val"));
					for (var g = 0; g <= 59; g++) {
						i += "<div class='tooth'>" + g + "</div>";
					}
					time_ss.innerHTML = i;
					time_ss.style["-webkit-transform"] = 'translate3d(0,' + (10 - mmVal * 2) + 'em,0)';
					time_ss.setAttribute('top', 10 - mmVal * 2 + 'em');
				} else {
					return
				}
			}
			//求月份最大天数
			function calcDays(year, month) {
				if (month == 1) {
					year += _self.minY;
					if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
						return 29;
					} else {
						return 28;
					}
				} else {
					if (month == 3 || month == 5 || month == 8 || month == 10) {
						return 30;
					} else {
						return 31;
					}
				}
			}
			//触摸开始
			function gearTouchStart(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break
					}
				}
				clearInterval(target["int_" + target.id]);
				target["old_" + target.id] = e.targetTouches[0].screenY;
				target["o_t_" + target.id] = (new Date()).getTime();
				var top = target.getAttribute('top');
				if (top) {
					target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
				} else {
					target["o_d_" + target.id] = 0;
				}
			}
			//手指移动
			function gearTouchMove(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break
					}
				}
				target["new_" + target.id] = e.targetTouches[0].screenY;
				target["n_t_" + target.id] = (new Date()).getTime();
				var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / 370;
				target["pos_" + target.id] = target["o_d_" + target.id] + f;
				target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
				target.setAttribute('top', target["pos_" + target.id] + 'em');
			}
			//离开屏幕
			function gearTouchEnd(e) {
				e.preventDefault();
				var target = e.target;
				while (true) {
					if (!target.classList.contains("gear")) {
						target = target.parentElement;
					} else {
						break;
					}
				}
				var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
				if (Math.abs(flag) <= 0.2) {
					target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
				} else {
					if (Math.abs(flag) <= 0.5) {
						target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
					} else {
						target["spd_" + target.id] = flag / 2;
					}
				}
				if (!target["pos_" + target.id]) {
					target["pos_" + target.id] = 0;
				}
				rollGear(target);
			}
			//缓动效果
			function rollGear(target) {
				var d = 0;
				var stopGear = false;
				var passY = _self.maxY - _self.minY + 1;
				clearInterval(target["int_" + target.id]);
				target["int_" + target.id] = setInterval(function() {
					var pos = target["pos_" + target.id];
					var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
					pos += speed;
					if (Math.abs(speed) > 0.1) {} else {
						speed = 0.1;
						var b = Math.round(pos / 2) * 2;
						if (Math.abs(pos - b) < 0.02) {
							stopGear = true;
						} else {
							if (pos > b) {
								pos -= speed
							} else {
								pos += speed
							}
						}
					}
					if (pos > 10) {
						pos = 10;
						stopGear = true;
					}
					switch (target.dataset.datetype) {
						case "date_yy":
							var minTop = 10 - (passY - 1) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 10) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "date_mm":
							var date_yy = _self.gearDate.querySelector(".date_yy");
							//得到年份的值
							var yyVal = parseInt(date_yy.getAttribute("val"));
							var maxM = document.querySelectorAll('.date_mm div').length - 1;
							var minM = 0;
							//当年份到达最大值
							if (yyVal == passY - 1) {
								maxM = _self.maxM - 1;
							}
							//当年份到达最小值
							if (yyVal == 0) {
								minM = _self.minM - 1;
							}
							var minTop = 10 - (maxM - minM) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 10) / 2 + minM;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "date_dd":
							var date_yy = _self.gearDate.querySelector(".date_yy");
							var date_mm = _self.gearDate.querySelector(".date_mm");
							//得到年份的值
							var yyVal = parseInt(date_yy.getAttribute("val"));
							//得到月份的值
							let mmVal = document.querySelectorAll('.date_yy .tooth')[yyVal].innerHTML;
							//返回月份的天数
							var maxMonthDays = calcDays(yyVal, mmVal);
							var  maxD = document.querySelectorAll(".date_dd div").length - 1;
							var minD = 0;
							//当年份月份到达最大值
							if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
								maxD = _self.maxD - 1;
							}
							//当年、月到达最小值
							if (yyVal == 0 && _self.minM == mmVal + 1) {
								minD = _self.minD - 1;
							}
							var minTop = 10 - (maxD - minD) * 2;
							if (pos < minTop) {
								pos = minTop;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 10) / 2 + minD;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						case "time_hh":
							if (pos < -38) {
								pos = -38;
								stopGear = true;
							}
							if (stopGear) {
								var gearVal = Math.abs(pos - 10) / 2;
								setGear(target, gearVal);
								clearInterval(target["int_" + target.id]);
							}
							break;
						default:
					}
					target["pos_" + target.id] = pos;
					target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
					target.setAttribute('top', pos + 'em');
					d++;
				}, 30);
			}
			//控制插件滚动后停留的值
			function setGear(target, val) {
				val = Math.round(val);
				target.setAttribute("val", val);
				if(target.dataset.datetype == 'date_mm'){
					icalendarM = val
				}
				if(target.dataset.datetype == 'date_yy' || target.dataset.datetype == 'date_mm'){
					setDateGearTooth();
				}

			}
			//取消
			function closeMobileCalendar(e) {
				e.preventDefault();
				var evt = new CustomEvent('input');
				_self.trigger.dispatchEvent(evt);
				
			}
			//日期时间确认
			function finishMobileDateTime(e) {
				// animation($(this).parent().parent(), $(this).parent().parent().offset().top);
				// // 判断是否置灰
				// if ($(this).css('color') == 'rgb(170, 174, 181)') {
				// 	a--;
				// 	num--;
				// 	$(this).removeClass('dashi-content-foot-sendHui').siblings().removeClass('dashi-content-foot-sendHui')
				// 	$('.dashi-content-mid').last().remove();
				// } else {
				// 	a++;
				// 	num++;
				// 	$(this).addClass('dashi-content-foot-sendHui').siblings().addClass('dashi-content-foot-sendHui')
				// 	pushData(a, num)
				// }
				var passY = _self.maxY - _self.minY + 1;
				var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
				var date_mm = document.querySelectorAll('.date_mm div')[icalendarM].innerHTML;
				date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
				var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
				date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
				var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
				_self.trigger.value = (date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd + " " + (time_hh.length < 2 ? "0" : "") + icalendar_timeData[time_hh];

				config_birthday = _self.trigger.value
				$(document).trigger('SELECT-BITRTH')
				_hmt.push(['_trackEvent', 'button', 'sendBirth', config_birthday]);
				closeMobileCalendar(e);
			}
			// 自动调起
      popupDateTime()
			_self.trigger.addEventListener('click', {
				"datetime": popupDateTime,
			}[type]);
		}
	}
	return MobileCalendar;
})()

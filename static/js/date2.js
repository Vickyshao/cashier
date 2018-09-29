;$(function(){
    $.fn.extend({
        "dateChoose": function (options) {
            var defaults = {
                dateClass:"",
                startClass:"",
                startDate: "", //今天日期之后可选
                endDate:"",
                callback: ""  //日期选中之后的callback
            };
            var options = $.extend(true, defaults, options);
            return this.each(function () {
                var weekDefine;
                weekDefine = ["日", "一", "二", "三", "四", "五", "六"];
                var thisDate = new Date(),
                    thisYear = thisDate.getFullYear(),  //获取本年
                    thisMonth = thisDate.getMonth() + 1, //获取本月
                    thisDay = thisDate.getDate();  //获取本日
                var startDate = $(options.startClass).attr('data-time');
                var nowDate = new Date(startDate.split('-')[0], startDate.split('-')[1]-1, startDate.split('-')[2]),
                    nowYear = nowDate.getFullYear(),  //获取本年
                    nowMonth = nowDate.getMonth()+1, //获取本月
                    nowDay = nowDate.getDate();  //获取本日
                var nowFirst = new Date(nowYear, nowMonth - 1, 1),
                    nowFirstWeek = nowFirst.getDay(),
                    nextFirst = new Date(nowYear, nowMonth, 1),
                    nextYear = nextFirst.getFullYear(),
                    nextMonth = nextFirst.getMonth() + 1,
                    nextFirstWeek = nextFirst.getDay(),
                    nowLast = new Date(nextFirst.getTime() - 1000 * 60 * 60 * 24),
                    nowLastData = nowLast.getDate();
                var selectDate=$(options.startClass).attr("data-time");
                $(".date_con").empty().show();
                var html = '<div class="month_change"> ' +
                    '<a href="javascript:" class="iconfont icon-shangyiye prev icon-prev"></a> ' +
                    '<a href="javascript:" class="iconfont icon-xiayiye next icon-next"></a> ';

                    html += '<h3> <span>' + $(options.startClass).attr("data-time").substr(0, 4) +
                        '</span>年<span>' + $(options.startClass).attr("data-time").substr(5, 2) +
                        '</span>月 </h3> ' +
                        '</div>';
                html+="<ul class='week'>";
                for (var i = 0; i < weekDefine.length; i++) {
                    html += '<li>' + weekDefine[i] + "</li>";
                }
                html+="</ul>";
                $(".date_con").append(html);
            
                var flag = 0;
                var S = {
                    init: function () {
                        $(options.dateClass).stop(true, true).animate({ left: "0%" }, 500);
                        this.createDate(nowYear, nowMonth, nowFirstWeek, nowLastData, nextYear, nextMonth, nextFirstWeek);
                        this.prevMonth();
                        this.nextMonth();
                        this.daysDisabled(options.startDate);
                        this.enterClick();
                         //选择日期：点击头部返回按钮
                         $(options.dateClass).find(".h5_header_back").on('click', function () {
                            flag = 0;
                            $(options.dateClass).stop().animate({ left: "200%" }, 500);
                        });
                    },
                    dateFormat: function (date) {
                        var dateS = date.split('-');
                        return new Date(dateS[0], dateS[1], dateS[2]);
                    },
                    createDate: function (thisYear, thisMonth, thisFirstWeek, thisLastData, nextYear, nextMonth) {
                        $(".date_list").remove();
                        var data = '<div class="date_list fix">';
                        for (var i = 1; i <= thisLastData; i++) {
                            if (i < 10) {
                                if (thisMonth < 10) {
                                    data += "<a trq='" + thisYear + "-0" + thisMonth + "-0" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "'>" + i + "</a>";
                                }
                                else {
                                    data += "<a trq='" + thisYear + "-" + thisMonth + "-0" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "'>" + i + "</a>";
                                }
                            }
                            else if (i == thisLastData) {
                                if (thisMonth < 10) {
                                    nextMonth < 10 ?
                                        (data += "<a trq='" + thisYear + "-0" + thisMonth + "-" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "' trqn='" + nextYear + "-0" + nextMonth + "-01'" + ">" + i + "</a>") :
                                        (data += "<a trq='" + thisYear + "-0" + thisMonth + "-" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "' trqn='" + nextYear + "-" + nextMonth + "-01'" + ">" + i + "</a>");
                                }
                                else {
                                    nextMonth < 10 ?
                                        (data += "<a trq='" + thisYear + "-" + thisMonth + "-" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "' trqn='" + nextYear + "-0" + nextMonth + "-01'" + ">" + i + "</a>") :
                                        (data += "<a trq='" + thisYear + "-" + thisMonth + "-" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "' trqn='" + nextYear + "-" + nextMonth + "-01'" + ">" + i + "</a>");
                                }
                            }
                            else {
                                if (thisMonth < 10) {
                                    data += "<a trq='" + thisYear + "-0" + thisMonth + "-" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "'>" + i + "</a>";
                                }
                                else {
                                    data += "<a trq='" + thisYear + "-" + thisMonth + "-" + i + "' txq='" + weekDefine[(thisFirstWeek + i - 1) % 7] + "'>" + i + "</a>";
                                }
                            }
                        }
                        data += "</div>";
                       $(".date_con").append(data);
                        for (var i = 0; i < weekDefine.length; i++) {
                            if ($(".date_list a").attr("txq") == weekDefine[i]) {
                                var j = i;
                            }
                        }
                        for (var k = 0; k < j; k++) {
                            $(".date_list").prepend("<a class='before'></a>");
                        }

                            $('.month_change h3 span').eq(0).text(nowYear);
                            $('.month_change h3 span').eq(1).text(nowMonth < 10 ? "0" + nowMonth : nowMonth);
                            $('.month_change h3 span').eq(1).html(nowMonth < 10 ? "0" + nowMonth : nowMonth)
                   

                    },
                    changeYear: function (num) {
                        nowYear = nowYear + num;
                        nowFirst = new Date(nowYear, nowMonth - 1, 1); //获取本月第一天
                        nextFirst = new Date(nowYear, nowMonth, 1); //获取下月中的第一天
                        nextYear = nextFirst.getFullYear();//获取当前下月年份
                        nextMonth = nextFirst.getMonth() + 1;//获取下月月份
                        nowLast = new Date(nextFirst.getTime() - 1000 * 60 * 60 * 24);//获取本月最后一天
                        nowFirstWeek = nowFirst.getDay();//当月第一天是星期几
                        nextFirstWeek = nextFirst.getDay();//下月第一天是星期几
                        nowLastData = nowLast.getDate();//获取本月最后一天几号
                    },
                    changeMonth: function (num) {

                        nowMonth = nowMonth + num;
                        if (nowMonth < 1) {
                            nowMonth = 12;
                            this.changeYear(-1);
                        }
                        else if (nowMonth > 12) {
                            nowMonth = 1;
                            this.changeYear(1);
                        }
                        nowFirst = new Date(nowYear, nowMonth - 1, 1); //获取本月第一天
                        nextFirst = new Date(nowYear, nowMonth, 1); //获取下月中的第一天
                        nextYear = nextFirst.getFullYear();//获取当前下月年份
                        nextMonth = nextFirst.getMonth() + 1;//获取下月月份
                        nowLast = new Date(nextFirst.getTime() - 1000 * 60 * 60 * 24);//获取本月最后一天
                        nowFirstWeek = nowFirst.getDay();//当月第一天是星期几
                        nextFirstWeek = nextFirst.getDay();//下月第一天是星期几
                        nowLastData = nowLast.getDate();//获取本月最后一天几号
                        this.createDate(nowYear, nowMonth, nowFirstWeek, nowLastData, nextYear, nextMonth, nextFirstWeek);
                    },
                    isPC:function(){
                        var userAgentInfo = navigator.userAgent;
                        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
                        var flag = true;
                        for (var v = 0; v < Agents.length; v++) {
                            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
                        }
                        return flag;
                    },
                    prevMonth: function () {
                        if(!this.isPC()){
                            
                            $(".date_con .prev").on('touchstart',function(){
                                $(this).addClass('cur');
                            }).on('touchend',function(){
                                $(this).removeClass('cur');
                                S.changeMonth(-1);
                                S.daysDisabled(options.startDate);
                            });
                        }
                        else{
                            $(".date_con .prev").on('mousedown',function(){
                                $(this).addClass('cur');
                            }).on('mouseup',function(){
                                $(this).removeClass('cur');
                                S.changeMonth(-1);
                                S.daysDisabled(options.startDate);
                            });
                        }

                    },
                    nextMonth: function () {
                        if(!this.isPC()){
                            
                            $(".date_con .next").on('touchstart',function(){
                                $(this).addClass('cur');
                            }).on('touchend',function(){
                                $(this).removeClass('cur');
                                S.changeMonth(1);
                                S.daysDisabled(options.startDate);
                            });
                        }
                        else{
                            $(".date_con .next").on('mousedown',function(){
                                $(this).addClass('cur');
                            }).on('mouseup',function(){
                                $(this).removeClass('cur');
                                S.changeMonth(1);
                                S.daysDisabled(options.startDate);
                            });
                        }

                    },
                    enterClick: function () {
                        $(".date_con").off().on('click','.date_list a',function(){
                            var _this=$(this);
                            if(!_this.hasClass('disabled')&&!_this.hasClass('before')){
                                _this.addClass('cur').siblings().removeClass('cur');
                                $(options.startClass).attr("data-time",_this.attr('trq')).text(_this.attr('trq'));        
                                $(options.dateClass).stop().animate({ left: "200%" }, 500);
                                if (options.callback != '') {
                                    options.callback();
                                }
                            }
                        });
                    },
                    daysDisabled: function () {
                        var startD=S.dateFormat(options.startDate).getTime(),
                            endD=S.dateFormat(options.endDate).getTime();
                        $('.date_con .date_list a').each(function(){
                            var _this=$(this);
                            if(!_this.hasClass('before')){
                                var trqD=S.dateFormat(_this.attr('trq'));
                                if(trqD<startD||trqD>endD){
                                    _this.addClass('disabled');
                                }
                            }
                        });
                    }
                  
                }
                S.init();
            });
        }
    })
});
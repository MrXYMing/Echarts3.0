//命名空间
var $S = {
    /**刷新计时器对象  IsOpen: 是否开启刷新；timeSlot：刷新间隔时间，1000 = 1秒;*/
    setTimeObj: { IsOpen: true, setTime: null, setFun: "", timeSlot: 5000000 },
    /**时间计时器 */
    startTime: function () { },
    /**日期补0函数 */
    checkTime: function () { },
    /**获取当前是星期几 */
    GetDay: function () { },
    /**设置左上角的下拉框选项 */
    //SetLegend: function () { },
    /**设置筛选条件 */
    SetFilterData: function () { },
    /**处理左上角下拉框中的选项 */
    legend: {},
    /**鼠标离开左上角下拉框后触发的函数 */
    legendOnblur: function (event) {
        this.legend.hide();
    },
    /**设置全国地图option */
    SetOption: function () { },
    /**设置全国地图Series */
    SetSeries: function () { },
    /**进入省级地图时，初始化函数 */
    SetSecondInit: function () { },
    /**设置省级仓库中的城市地图option */
    SetCityOption: function () { },
    /**设置省级仓库中的城市地图Series */
    SetCitySeries: function () { },
    /**处理数据生成Series，全国和省级Series公用 */
    GetSeries: function () { },
    /**设置省级仓库中的全国地图option */
    SetChina: function () { },
    /**订单框的出现消失动画 */
    Animate: function () { },
    /**设置运单清单框函数 */
    ShowWaybill: function () { },
    /**关闭运单清单 */
    CloseWaybill: function () { },
    /**设置运单详情框函数 */
    ShowDetails: function () { },
    /**根据用户选择得到对应省仓干线 */
    GetTrunk: function () { },
    /**根据用户选择得到对应市仓干线 */
    GetTrunk2: function () { },
    /**翻译unix时间戳 函数*/
    UnixToDate: function () { },
    /**封装ajax异步获取数据 */
    Action: function () { },
    /**解决某些浏览器new Date()不能直接设置参数的兼容性问题 */
    NewDate: function () { },
    /**用户所选省份 */
    selectedProvince: "",
    /**用户选择的干线 */
    SeriesName: "全国",
    /**全国地图 以及省仓地图中的城市地图 (公用) */
    myChart: null,
    /**全国总仓坐标 */
    provinces: null,
    /**全国总仓干线 */
    myProvincesTrunk: null,
    /**全省城市坐标 */
    citys: null,
    /**全省干线 */
    citysTrunk: null,
    /**全国缩略图 */
    myChinaChart: null,
    /** 筛选条件数据*/
    FilterData: function (data) {
        data = data || {};
        /** 中心仓库*/
        this.CenterWarehouse = data.CenterWarehouse || [];
        /** 省仓*/
        this.ProvinceWarehouse = data.ProvinceWarehouse || [];
        /** 运输类型*/
        this.TransportType = data.TransportType || [];
        /** 单据类型*/
        this.OrderType = data.OrderType || [];
        /** 品牌类型*/
        this.BrandType = data.BrandType || [];
        /** 商品编号*/
        this.Material = data.Material || [];
        /** 是否超时*/
        this.TimeOut = data.TimeOut || 0;
    },
    /**中心仓库 色值 */
    centralWarehouse: {},
    /**获取记录信息 */
    GetRecords: function () { },
    /**设置记录区域 */
    SetRecords: function () { },
    /**终点订单数是否显示 */
    IsShow: true,
    /**天气是否显示 */
    IsShowWeather: true,
    /**城市天气描述：天气icon图标 */
    weather: {
        "晴": "00",
        "多云": "01",
        "阴": "02",
        "阵雨": "03",
        "雷阵雨": "04",
        "雷阵雨并伴有冰雹": "05",
        "雨夹雪": "06",
        "小雨": "07",
        "中雨": "08",
        "大雨": "09",
        "暴雨": "10",
        "大暴雨": "11",
        "特大暴雨": "12",
        "阵雪": "13",
        "小雪": "14",
        "中雪": "15",
        "大雪": "16",
        "暴雪": "17",
        "雾": "18",
        "冻雨": "19",
        "沙尘暴": "20",
        "小雨-中雨": "21",
        "中雨-大雨": "22",
        "大雨-暴雨": "23",
        "暴雨-大暴雨": "24",
        "大暴雨-特大暴雨": "25",
        "小雪-中雪": "26",
        "中雪-大雪": "27",
        "大雪-暴雪": "28",
        "浮尘": "29",
        "扬沙": "30",
        "强沙尘暴": "31",
        "飑": "32",
        "龙卷风": "33",
        "弱高吹雪": "34",
        "轻雾": "35",
        "霾": "53",
    },
    /**城市：天气 */
    weatherCitys: {},
};
$(function () {
    //响应浏览器窗口大小变化
    $(".box").css({ width: $(window).width(), height: $(window).height() });
    $(window).resize(function () {
        $(".box").css({ width: $(window).width(), height: $(window).height() });
        $S.myChart.resize();
    });
    //定义滚动条组件
    $(".content").mCustomScrollbar();

    //设置全国总仓option
    $S.SetOption("全国");
    setInterval("$S.startTime()", 500);
    if ($S.setTimeObj.IsOpen) {
        $S.setTimeObj.setFun = "$S.GetProvincesTrunk()";
        $S.setTimeObj.setTime = setInterval($S.setTimeObj.setFun, $S.setTimeObj.timeSlot);
    }
});


/**时间计时器 */
$S.startTime = function () {
    var today = new Date();
    var y = today.getFullYear();
    var mo = $S.checkTime(today.getMonth() + 1);
    var d = $S.checkTime(today.getDate());
    var h = $S.checkTime(today.getHours());
    var m = $S.checkTime(today.getMinutes());
    var s = $S.checkTime(today.getSeconds());
    var _html = y + "/" + mo + "/" + d + " " + $S.GetDay(today.getDay()) + " " + h + ":" + m + ":" + s;
    $('.showtime').html(_html);
}
//日期补0
$S.checkTime = function (i) {
    if (i < 10)
    { i = "0" + i }
    return i
}
//翻译星期数
$S.GetDay = function (_day) {
    var weekday = new Array(7)
    weekday[0] = "星期天";
    weekday[1] = "星期一";
    weekday[2] = "星期二";
    weekday[3] = "星期三";
    weekday[4] = "星期四";
    weekday[5] = "星期五";
    weekday[6] = "星期六";
    return weekday[_day];
}

//生成左上角的legend
/*$S.SetLegend = function (_trunkList) {
    var html = "";
    for (var x in _trunkList) {
        html += "<li>" + _trunkList[x] + "</li>"
    }
    $(".legendbox").css("display", "inline-block");
    $(".legendbox #legend").html(html);
    $(".legendbox #legend li").each(function () {
        if ($(this).text() == $S.SeriesName) {
            $(".legendbox .styled-select").html($(this).text());
            $(this).addClass("legendActive");
        }
    });
}*/
/**设置左上角的下拉框选项 */
/*$S.legend = {
    show: function () {
        $(".legendbox .ulbox").addClass("show");
        $(".legendbox .styled-select").css("background-image", "url(./Src/x1.png)");
    },
    hide: function () {
        $(".legendbox .styled-select").css("background-image", "url(./Src/x2.png)");
        $(".legendbox .ulbox").removeClass("show");
    }
};*/
/**左上角的下拉框选项的点击事件 */
/*$(".box").on("click", ".styled-select", function () {
    if (!$(".ulbox").hasClass("show")) {
        $S.legend.show();
    } else {
        $S.legend.hide();
    }
});*/
//控制查询界面显示/隐藏
$(".togglefilter").click(function () {
    if ($(".filterdata").css("display") == "none") {
        //$(".filterdatabox").css("height", "441px");
        $(".filterdata").css("display", "block");
        //$(".filterdata").css("height", "412px");
        $(".filterdata").animate({ height: "412px" }, 1000);
        $(".filterdatabox").animate({ height: "441px" }, 1000);
    } else {
        //$(".filterdatabox").css("height", "31px");
        //$(".filterdata").css("height", "0px");
        $(".filterdata").animate({ height: "0px" }, 1000);
        $(".filterdatabox").animate({ height: "31px" }, 1000, function () {
            $(".filterdata").css("display", "none");
        });

    }
});
//设置查询界面
$S.SetFilterData = function (province) {
    var _province = province || "全国";
    $S.GetFilterData(_province, function (data) {
        var filterData = new $S.FilterData(data);
        for (var i in filterData) {
            $S.SetFilterHtml(filterData[i], i);
        }
    });

}
//获取查询条件数据
$S.GetFilterData = function () {
    var cache = {};

    return function (province, fn) {
        if (cache[province]) {
            fn && fn(cache[province]);
        } else {
            var action = new $S.Action();
            action.ActionData = JSON.stringify({ province: province });
            action.ActionUrl = "http://localhost:17463/service.asmx/GetFilterData";
            action.Done = function (res) {
                var result = res.d;
                cache[province] = result;
                fn && fn(result);
            }
            action.Fail = function (err) {
                alert(err.responseJSON.Message);
            }
            action.PostAction();
        }
    }
}();
//生成查询UI
$S.SetFilterHtml = function (data, dom) {
    if (dom === "TimeOut") {
        if (data == 0) {
            $("#TimeOut [name = 'timeout']:checkbox").attr("checked", true);
        } else {
            $("#TimeOut [name = 'timeout'][value=" + data + "]").attr("checked", true);
        }
    } else {
        var data_multiple = $("#" + dom).data("multiple")
        var _IsMultiple = typeof data_multiple == "undefined" ? true : data_multiple;
        var html = "<select class='selectpicker show-tick' ";
        if (_IsMultiple == true) {
            html += "multiple";
        }
        html += " data-none-selected-text='暂无选择' title='暂无选择' data-live-search='true' data-select-all-text='全选' data-deselect-all-text='全不选' data-live-search-placeholder='Search' data-actions-box='true'>";
        data.forEach(function (item, i) {
            html += "<option>" + item + "</option>";
        });
        html += "</select>";
        $("#" + dom).html(html);

        //更新内容刷新到相应的位置
        $("#" + dom).find("select").selectpicker('refresh');
    }

}
//查询按钮
$(".box").on("click", ".searchBtn", function () {
    $S.GetProvincesTrunk($S.GetSearchData());
});
//获取用户选择的查询条件
$S.GetSearchData = function () {
    var data = new $S.FilterData();
    var selectDom = $(".filterdata select");
    selectDom.each(function (i, item) {
        var _id = $(item).parent().parent().attr("id");
        data[_id] = $(item).selectpicker("val");
    });
    //data.Material = $("#Material").find("input").val();
    var timeout = 0;
    $("#TimeOut input[name='timeout']:checked").each(function () {
        timeout += Number($(this).val());
    });
    if (timeout > 2) {
        timeout = 0;
    }
    data.TimeOut = timeout;
    //alert(JSON.stringify(data));
    return data;
}
//legend的change事件，重新渲染视图
$(".box").on("click", "#legend li", function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    $S.SeriesName = $(this).text();
    $(this).siblings().removeClass("legendActive").end().addClass("legendActive");
    $S.legend.hide();
    $(".legendbox .styled-select").html($S.SeriesName);
    $S.SetSeries($S.SeriesName);
    //$S.SetOption("全国");
});
//字符串去除前后空格
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//设置全国总仓option
$S.SetOption = function (_seriesName) {
    $S.myChart = echarts.init(document.getElementById('main'));
    //loading动画文字
    $S.myChart.showLoading({ text: "数据加载中......", maskColor: "rgba(0, 0, 0, 0.4)", textColor: "#fff" });
    option = {
        backgroundColor: '#404a59',
        title: {
            text: 'LIS系统在途信息展示',
            subtext: '测试数据',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            //设置坐标点上的显示信息的显示规则,具体显示需求可查阅api 【http://echarts.baidu.com/option.html#tooltip.formatter】
            //目前我们规定是series中data里的 name+":"+value 来做显示，可根据需求自行定义显示规则
            formatter: function (param) {
                if (param.value) {
                    if (typeof param.value === "string") {
                        return param.name + ":" + param.value;
                    } else {
                        return param.name + ":" + param.value[2];
                    }
                } else {
                    return param.name;
                }
            }
        },
        legend: {
            show: false,
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data: [_seriesName],
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        //地理坐标系组件，详情见api【http://echarts.baidu.com/option.html#geo】
        geo: {
            map: 'china',
            label: {
                normal: {
                    show: true
                },
                emphasis: {
                    show: true
                }
            },
            roam: true,
            zoom: 1.2,
            selectedMode: 'single',
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                /*emphasis: {
                    areaColor: '#2a333d'
                }*/
            }
        },
        series: []
    };
    //全国地图线上的点击事件
    $S.myChart.on('click', function (params) {
        if (params.componentType === 'series') {
            if (params.seriesType === 'lines') {
                //console.log("点到了线,从 " + params.data.fromName + "至 " + params.data.toName);
                var _selectline = params.data.fromName + ">" + params.data.toName;
                //设置订单清单
                $S.ShowWaybill(_selectline);
            } else if (params.seriesType === 'effectScatter') {
                //console.log("点到了点：" + params.data.name);
            }
        }

    });
    //全国地图省份模块的点击事件
    $S.myChart.on('geoselectchanged', function (params) {
        if (params.batch[0].name && params.batch[0].name !== "undefined") {
            $(".waybillList table tbody").html("<tr><td colspan='3'>获取运单清单中，请稍后...</td></tr>");
            // $(".details").html("获取清单详情中，请稍后...");
            $(".legend").html("<option value='--'>--</option>");
            //清除刷新计时器
            clearInterval($S.setTimeObj.setTime);
            //清除全国总仓视图
            $S.myChart.clear();
            //重新渲染全省总仓视图
            $S.SetSecondInit(params.batch[0].name);
        }

    });
    $S.myChart.setOption(option);

    //获取全国总仓坐标
    var action = new $S.Action();
    action.ActionUrl = "http://localhost:17463/service.asmx/GetContryWarehouse";
    action.Done = function (res) {
        var data = res.d;
        var result = {};
        for (x in data) {
            //处理后台传来的数据，生成{name:[lot,lat]} 格式
            result[data[x].name] = [data[x].lot, data[x].lat];
            if (data[x].color !== "") {
                $S.centralWarehouse[data[x].name] = data[x].color;
            }
            if (data[x].weather !== "") {
                $S.weatherCitys[data[x].name] = data[x].weather;
            }
        }
        //全国总仓坐标
        $S.provinces = result;
        //用户选择的干线
        $S.SeriesName = _seriesName;

        //设置筛选条件
        $S.SetFilterData("全国");
        //获取全国总仓干线
        $S.GetProvincesTrunk();
        //取消loading动画
        $S.myChart.hideLoading();
    }
    action.Fail = function (err) {
        alert("链接服务器失败，请刷新后重新获取全国仓库坐标");
    }
    action.PostAction();
}
//获取全国总仓干线函数，同时用于计数器刷新数据
$S.GetProvincesTrunk = function (data) {
    //清除订单信息框
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();

    $S.GetRecords();

    data = data || new $S.FilterData();
    var action = new $S.Action();
    action.ActionData = JSON.stringify({ param: data });
    action.ActionUrl = "http://localhost:17463/service.asmx/GetContryMainTransport";
    action.Done = function (res) {
        //全国总仓干线
        $S.myProvincesTrunk = res.d;
        //左上角下拉框选项数组
        var trunkList = ["全国"];
        for (var x in $S.myProvincesTrunk) {
            trunkList.push($S.myProvincesTrunk[x].name);
        }
        //设置左上角的下拉框选项
        // $S.SetLegend(trunkList);
        //初始化设置option中的series
        $S.SetSeries($S.SeriesName);

    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();

}

$S.GetRecords = function (data) {
    data = data || "全国";
    //清除订单信息框
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();

    var action = new $S.Action();
    action.ActionData = JSON.stringify({ province: data });
    action.ActionUrl = "http://localhost:17463/service.asmx/GetRecords";
    action.Done = function (res) {
        $S.SetRecords(res.d);
    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();
}
$S.SetRecords = function (data) {
    var html = "";
    for (var i in data) {
        html += "<p style='color:" + data[i].Color + "'>" + data[i].Message + "</p>"
    }
    $(".recordsbox .records").html(html);
}

//初始化设置option中的series
$S.SetSeries = function (_seriesName) {
    //根据用户选择得到对应市仓干线
    var _provinces = $S.GetTrunk(_seriesName);
    //获取series -- $S.GetSeries（“用户选择的干线名称”，“对应的干线数据”，“全国省仓坐标”）；

    var series = $S.GetSeries(_seriesName, _provinces, $S.provinces);


    //重置option
    var _option = $S.myChart.getOption();

    $S.myChart.clear();
    _option.legend = {
        show: false,
        orient: 'vertical',
        x: 'left',
        // data: [_seriesName],
        selectedMode: 'single',
        textStyle: {
            color: '#fff'
        }
    };
    /*if ($S.dataRangeMax > 0) {
        //设置最大值域
        _option.dataRange = {
            show: true,
            min: 0,
            //指定的最大值，eg: 100，默认无，必须参数，唯有指定了splitList时可缺省max
            max: $S.dataRangeMax,
            //是否启用值域漫游，启用后无视splitNumber和splitList，值域显示为线性渐变 
            calculable: true,
            //值域颜色标识，颜色数组长度必须>=2，颜色代表从数值高到低的变化，即颜色数组低位代表数值高的颜色标识 ，支持Alpha通道上的变化（rgba）
            //color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
            color: ['#ffffff', '#ffff00'],
            //默认只设定了值域控件文字颜色
            textStyle: {
                color: '#fff'
            }
        };
    }*/

    var timeout = 0;
    $("#TimeOut input[name='timeout']:checked").each(function () {
        timeout += Number($(this).val());
    });
    if (timeout == 2) {
        series = [{
            //路线的阴影
            name: _seriesName,
            type: 'lines',
            zlevel: 1,
            //阴影
            effect: {
                show: false,
            },
            //路线
            lineStyle: {
                normal: {
                    show:false,
                }
            },
            data: []
        }];
    }

    _option.series = series;
    $S.myChart.setOption(_option, true);
}
//转化数据，设置series，公用  (干线名称，干线数据，全国省仓)
$S.GetSeries = function (_seriesName, data, _geoCoordMap) {
    //实线数据
    var lineData = [];
    var lineDatas = [];
    //{fromName:[[{name:fromName},{name:toName,value:count}],...]}
    var centralLineData = { };
    //虚线数据
    var dotLineData = [];
    var dotLineDatas = [];
    //将返回的series
    var series = [];
    //重置最大值域=0
    $S.dataRangeMax = 0;

    var formCitys = [];

    var desValues = {};

    //处理接口得来的干线数据
    //循环干线数据
    for (var x in data) {
        //循环干线实线数据
        for (var y in data[x].solid) {
            //将数据push进lineData数组 [[{name:起点名},{name:终点名,value:数值}],...]
            var _solidfrom = data[x].solid[y].from;
            var _solidto = data[x].solid[y].to;
            var _count = data[x].solid[y].count;
            if ($S.centralWarehouse[_solidfrom] !== "" && $S.centralWarehouse[_solidfrom]) {
                centralLineData[_solidfrom] = centralLineData[_solidfrom] ? centralLineData[_solidfrom] : [];
                centralLineData[_solidfrom].push([{ name: _solidfrom }, { name: _solidto, value: _count }]);
            } else {
                var IsNewLine = true;
                for (var index in lineDatas) {
                    if (lineDatas[index][0] == _solidfrom) {
                        lineDatas[index][1].push([{ name: _solidfrom }, { name: _solidto, value: _count }]);
                        IsNewLine = false;
                        break;
                    }
                }
                if (IsNewLine) {
                    lineDatas[lineDatas.length] = [_solidfrom, [[{ name: _solidfrom }, { name: _solidto, value: _count }]]];
                }
                // lineData.push([{ name: _solidfrom }, { name: _solidto, value: _count }]);
            }

            if (desValues[_solidto]) {
                desValues[_solidto] = Number(desValues[_solidto]) + Number(_count);
            } else {
                desValues[_solidto] = Number(_count);
            }
            //取得当前最大数值作为值域最大值$S.dataRangeMax
            if (parseFloat(_count) > parseFloat($S.dataRangeMax)) {
                $S.dataRangeMax = parseFloat(_count);
            }
            if ($.inArray(_solidfrom, formCitys) == -1) {
                formCitys.push(_solidfrom);
            }

        }
        //循环干线虚线数据
        for (var z in data[x].dot) {
            //dotLineData [[{name:起点名},{name:终点名}],...]
            dotLineData.push([{ name: data[x].dot[z].from }, { name: data[x].dot[z].to }]);
        }
    }

    //lineDatas = [[_seriesName, lineData]];
    dotLineDatas = [['虚线', dotLineData]];
    //全国省仓坐标
    var geoCoordMap = _geoCoordMap;
    //小飞机（已弃用）
    var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

    //用来处理返回各条线的数据
    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            //每条线的各项数据
            var dataItem = data[i];
            //起点坐标
            var fromCoord = geoCoordMap[dataItem[0].name];
            //终点坐标
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                //此处echarts3.0将根据option中tooltip中formatter设置的规则来显示文字，具体显示需求可查阅api 【http://echarts.baidu.com/option.html#tooltip.formatter】
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    name: dataItem[0].name + " > " + dataItem[1].name,
                    coords: [fromCoord, toCoord],
                    value: dataItem[1].value

                });
            }
        }
        return res;
    };
    //  var color = ['#a6c84c', '#ffa022', '#46bee9'];
    var series = [];

    for (var i in centralLineData) {
        //series相关配置可查询api 【http://echarts.baidu.com/option.html#series】
        series.push({
            //路线的阴影
            name: i,
            type: 'lines',
            zlevel: 1,
            //阴影
            effect: {
                show: false,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3,
                animation: false
            },
            //路线
            lineStyle: {
                normal: {
                    color: $S.centralWarehouse[i],
                    width: 0,
                    curveness: 0.2
                }
            },
            data: convertData(centralLineData[i])
        },
            {
                //路线以及路线动画
                name: i,
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                //动画
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: 'circle',
                    symbolSize: 1
                },
                //路线
                lineStyle: {
                    normal: {
                        color: $S.centralWarehouse[i],
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: convertData(centralLineData[i])
            },

            {
                //终点标注
                name: "weather",
                // type: 'effectScatter',
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },

                tooltip: {
                    position: "right",
                    formatter: function (param) {
                        if (param.value) {
                            if (typeof param.value === "string") {
                                return param.name + " " + param.value + " 台";
                            } else {
                                return param.name + " " + param.value[2] + " 台";
                            }
                        } else {
                            return param.name;
                        }
                    }
                },
                label: {
                    normal: {
                        show: $S.IsShow,
                        position: 'right',
                        //formatter: '{b}'
                        formatter: function (param) {
                            if (param.value) {
                                if (typeof param.value === "string") {
                                    return param.name + " " + param.value + " 台";
                                } else {
                                    return param.name + " " + param.value[2] + " 台";
                                }
                            } else {
                                return param.name;
                            }
                        }
                    }
                },
                symbolSize: 1,
                /*symbolSize: function (val) {
                    return 10;
                },*/
                itemStyle: {
                    normal: {
                        color: "#fff",
                    }
                },
                data: centralLineData[i].map(function (dataItem) {
                    var _imgurl = "",
                        _symbolSize = 1;;
                    if ($S.IsShowWeather) {
                        _imgurl = "image://./Src/images/" + $S.weather[$S.weatherCitys[dataItem[1].name]] + ".png";
                        _symbolSize = 30;
                    }
                    return {
                        symbol: _imgurl,
                        symbolSize: _symbolSize,
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([desValues[dataItem[1].name]]),
                    };
                })
            }
        );
    }

    lineDatas.forEach(function (item, i) {
        //当出现多条起点和终点一致的干线时，将干线的数值累加，用作终点文字显示
        /*if(item[1].length<=0){
            return;
        }*/
        /*var desValues = {};
        item[1].forEach(function (di, i) {
            if (desValues[di[1].name]) {
                desValues[di[1].name] = Number(desValues[di[1].name]) + Number(di[1].value);
            } else {
                desValues[di[1].name] = Number(di[1].value);
            }
        });*/
        //series相关配置可查询api 【http://echarts.baidu.com/option.html#series】
        series.push({
            //路线的阴影
            name: item[0],
            type: 'lines',
            zlevel: 1,
            //阴影
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3,
                animation: false
            },
            //路线
            lineStyle: {
                normal: {
                    //  color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },
            data: convertData(item[1])
        },
            {
                //路线以及路线动画
                name: item[0],
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                //动画
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: 'circle',
                    symbolSize: 1
                    /* show: true,
                     scaleSize: 1,
                     period: 6,
                     color: '#fff',
                     shadowBlur: 10*/
                },
                //路线
                lineStyle: {
                    normal: {
                        //  color: color[i],
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },

            {
                //终点标注
                name: "weather",
                // type: 'effectScatter',
                type: 'scatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                tooltip: {
                    position: "right",
                    formatter: function (param) {
                        if (param.value) {
                            if (typeof param.value === "string") {
                                return param.name + " " + param.value + " 台";
                            } else {
                                return param.name + " " + param.value[2] + " 台";
                            }
                        } else {
                            return param.name;
                        }
                    }
                },
                label: {
                    normal: {
                        show: $S.IsShow,
                        position: 'right',
                        //formatter: '{b}'
                        formatter: function (param) {
                            if (param.value) {
                                if (typeof param.value === "string") {
                                    return param.name + " " + param.value + " 台";
                                } else {
                                    return param.name + " " + param.value[2] + " 台";
                                }
                            } else {
                                return param.name;
                            }
                        }
                    }
                },
                symbolSize: 1,
                /*symbolSize: function (val) {
                    return 10;
                },*/
                itemStyle: {
                    normal: {
                        color: "#fff",
                    }
                },
                data: item[1].map(function (dataItem) {
                    var _imgurl = "",
                        _symbolSize = 1;
                    if ($S.IsShowWeather) {
                        _imgurl = "image://./Src/images/" + $S.weather[$S.weatherCitys[dataItem[1].name]] + ".png";
                        _symbolSize = 30
                    }
                    return {
                        symbol: _imgurl,
                        symbolSize: _symbolSize,
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([desValues[dataItem[1].name]]),
                    };
                })
            }
        );
    });
    //发出仓库Home图标
    formCitys.forEach(function (item) {
        series.push({
            name: "Warehouse",
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 3,
            markPoint: {
                data: [{
                    symbol: "image://./Src/images/home.png",
                    symbolSize: 25,
                    symbolOffset: ['-70%', 0],
                    //symbolOffset: [2, 2],
                    name: item,
                    coord: geoCoordMap[item],
                }],
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        formatter: '{b}',
                        color: "#fff"
                    }
                },
                itemStyle: {
                    normal: {
                        color: "#fff"
                    }
                },
            },
        });
    });



    //设置虚线
    dotLineDatas.forEach(function (item, i) {
        series.push({
            name: _seriesName,
            type: 'lines',
            hoverable: true,
            zlevel: 2,
            symbol: ['none', 'emptyCircle'],
            symbolSize: 2,
            lineStyle: {
                normal: {
                    type: 'dashed',
                    color: 'rgba(30,144,255,0.5)',
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.2
                }
            },
            data: convertData(item[1])
        });
    });

    return series
}
//控制城市的天气是否显示
$(".box").on("click", ".showWeather", function () {
    var _IsShowWeather = !$S.IsShowWeather;
    $S.IsShowWeather = _IsShowWeather;
    var _text = "隐藏天气";
    var _option = $S.myChart.getOption();
    _series = _option.series;
    _series.forEach(function (item, i) {
        if (item.name === "weather") {
            _series[i].data.forEach(function (ele, j) {
                if (_IsShowWeather) {
                    _series[i].data[j].symbol = "image://./Src/images/" + $S.weather[$S.weatherCitys[_series[i].data[j].name]] + ".png";
                    _series[i].data[j].symbolSize = 30;
                } else {
                    _series[i].data[j].symbol = "";
                    _series[i].data[j].symbolSize = 1;
                    // _series[i].itemStyle.normal.opacity = 1;
                    _text = "显示天气";
                }
            });

        }
    });
    _option.series = _series;
    $S.myChart.setOption(_option);

    $(this).text(_text);
});

//控制终点的订单数是否显示
$(".toolbox").on("click", ".showLabel", function () {
    var _IsShow = !$S.IsShow;
    $S.IsShow = _IsShow;
    var _option = $S.myChart.getOption();
    _series = _option.series;
    _series.forEach(function (item, i) {
        if (item.name === "weather") {
            _series[i].label.normal.show = _IsShow;
        }
    });
    _option.series = _series;
    $S.myChart.setOption(_option);
    if (_IsShow) {
        $(this).text("隐藏数量");
    } else {
        $(this).text("显示数量");
    }
});

//设置第二次初始化
$S.SetSecondInit = function (_selectedProvince) {
    //隐藏订单框
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();

    //显示返回按钮
    $("#minor").css("display", "block");
    $(".back").addClass("showback");

    //隐藏查询条件
    if ($(".filterdata").css("display") == "block") {
        /*$(".filterdatabox").css("height", "31px");
        $(".filterdata").css("display", "none");
        $(".filterdata").css("height", "0px");*/
        $(".filterdata").animate({ height: "0px" }, 1000);
        $(".filterdatabox").animate({ height: "31px" }, 1000, function () {
            $(".filterdata").css("display", "none");
        });
    }
    //设置全国缩略图
    $S.SetChina(_selectedProvince);
    //设置城市地图
    $S.SetCityOption(_selectedProvince);

    //设置定时刷新器
    if ($S.setTimeObj.IsOpen) {
        clearInterval($S.setTimeObj.setFun);
        $S.setTimeObj.setFun = "$S.GetProvinceTransport()";
        $S.setTimeObj.setTime = setInterval($S.setTimeObj.setFun, $S.setTimeObj.timeSlot);
    }
    // $S.setTime = setInterval("$S.GetProvinceTransport()", 5000);
}

//获取市仓支线数据，并设置series和legend
$S.GetProvinceTransport = function (data) {
    data = data || new $S.FilterData();
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    //根据用户选择省份获取全部市仓支线数据
    $S.citysTrunk = [];
    var action = new $S.Action();
    action.ActionData = JSON.stringify({ province: $S.selectedProvince, param: data });
    action.ActionUrl = "http://localhost:17463/service.asmx/GetProvinceTransport";
    action.Done = function (res) {

        $S.citysTrunk = res.d;
        //根据省份和干线名称设置城市地图的series
        $S.SetCitySeries($S.selectedProvince, $S.SeriesName);

        //生成左上角的下拉框
        var cityTrunkList = ["全省"];
        for (var x in $S.citysTrunk) {
            cityTrunkList.push($S.citysTrunk[x].name);
        }
        //$S.SetLegend(cityTrunkList);
    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();
}

//初始化省仓支线中的省份地图的option
$S.SetCityOption = function (_selectedProvince) {
    $S.myChart.showLoading({ text: "数据加载中......", maskColor: "rgba(0, 0, 0, 0.4)", textColor: "#fff" });

    option = {
        backgroundColor: '#1b1b1b',
        title: {
            text: 'LIS系统在途信息展示',
            subtext: '省仓测试数据',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (param) {
                if (param.value) {
                    if (typeof param.value === "string") {
                        return param.name + ":" + param.value;
                    } else {
                        return param.name + ":" + param.value[2];
                    }
                } else {
                    return param.name;
                }
            }
        },
        legend: {
            x: 'right',
            data: []
        },
        series: [],
    };

    $S.myChart.off('click');
    $S.myChart.on('click', function (params) {
        if (params.componentType === 'geo') {
            //console.log("点到了省：" + params.name);
        }
        else if (params.componentType === 'series') {
            if (params.seriesType === 'lines') {
                //console.log("点到了线,从 " + params.data.fromName + "至 " + params.data.toName);
                var _selectline = params.data.fromName + ">" + params.data.toName;
                $S.ShowWaybill(_selectline);
            } else if (params.seriesType === 'effectScatter') {
                // console.log("点到了点：" + params.data.name);
            }
        }
    });

    $S.myChart.setOption(option, true);

    var action = new $S.Action();
    action.ActionData = JSON.stringify({ province: _selectedProvince });
    action.ActionUrl = "http://localhost:17463/service.asmx/GetProvinceWarehouse";
    action.Done = function (res) {
        //  console.log(res);
        var data = res.d;
        var result = {};
        for (x in data) {
            result[data[x].name] = [data[x].lot, data[x].lat];
        }
        //全省城市坐标
        $S.citys = result;

        $S.citysTrunk = [];
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ province: _selectedProvince, param: new $S.FilterData() });
        action.ActionUrl = "http://localhost:17463/service.asmx/GetProvinceTransport";
        action.Done = function (res) {
            //console.log(res);
            $S.citysTrunk = res.d;

            $S.SeriesName = "全省";
            $S.SetCitySeries(_selectedProvince, $S.SeriesName);


            var cityTrunkList = ["全省"];
            for (var x in $S.citysTrunk) {
                cityTrunkList.push($S.citysTrunk[x].name);
            }

            //设置筛选条件
            $S.SetFilterData(_selectedProvince);
            //$S.SetLegend(cityTrunkList);
            //注销全国省仓中左上角下拉框的点击事件，并重新绑定点击事件
            $S.selectedProvince = _selectedProvince;



            $(".box").off("click", ".searchBtn");
            $(".box").on("click", ".searchBtn", function () {
                $S.GetProvinceTransport($S.GetSearchData());
            });
            /*$(".box").off("click", "#legend li");
            $(".box").on("click", "#legend li", function () {
                var animate = new $S.Animate();
                animate.ClearWaybillbox();
                animate.ClearDetailsbox();
                $S.SeriesName = $(this).text();
                $(this).siblings().removeClass("legendActive").end().addClass("legendActive");
                $S.legend.hide();
                $(".legendbox .styled-select").html($S.SeriesName);
                $S.SetCitySeries($S.selectedProvince, $S.SeriesName);
            });*/

            $S.myChart.hideLoading();

        }
        action.Fail = function (err) {
            alert(err.responseJSON.Message);
        }
        action.PostAction();


    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();
}
//初始化省仓支线中的省份地图option的series
$S.SetCitySeries = function (_selectedProvince, _selectedCity) {
    //根据用户选择的省份和支线名称，获取对应的市仓支线数据
    var _provinces = $S.GetTrunk2(_selectedCity);
    //获取series [省份，支线名称，城市坐标]
    var series = $S.GetSeries(_selectedCity, _provinces, $S.citys);
    //   return series;

    var _option = $S.myChart.getOption();
    _option.series = series;
    if ($S.dataRangeMax > 0) {
        _option.dataRange = {
            show: true,
            min: 0,
            //指定的最大值，eg: 100，默认无，必须参数，唯有指定了splitList时可缺省max
            max: $S.dataRangeMax,
            //是否启用值域漫游，启用后无视splitNumber和splitList，值域显示为线性渐变 
            calculable: true,
            //值域颜色标识，颜色数组长度必须>=2，颜色代表从数值高到低的变化，即颜色数组低位代表数值高的颜色标识 ，支持Alpha通道上的变化（rgba）
            color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
            //默认只设定了值域控件文字颜色
            textStyle: {
                color: '#fff'
            }
        };
    }

    _option.geo = {
        map: _selectedProvince,
        zoom: 1.2,
        label: {
            normal: {
                show: true
            },
            emphasis: {
                show: true
            }
        },
        roam: true,
        itemStyle: {
            normal: {
                areaColor: '#323c48',
                borderColor: '#404a59'
            },
            emphasis: {
                areaColor: '#2a333d'
            }
        }
    };
    $S.myChart.clear();
    $S.myChart.setOption(_option, true);

}
//生成省仓支线图中的全国地图
$S.SetChina = function (_selectedProvince) {
    //全国省份
    var data = [
        { name: '北京', selected: false },
        { name: '天津', selected: false },
        { name: '上海', selected: false },
        { name: '重庆', selected: false },
        { name: '河北', selected: false },
        { name: '河南', selected: false },
        { name: '云南', selected: false },
        { name: '辽宁', selected: false },
        { name: '黑龙江', selected: false },
        { name: '湖南', selected: false },
        { name: '安徽', selected: false },
        { name: '山东', selected: false },
        { name: '新疆', selected: false },
        { name: '江苏', selected: false },
        { name: '浙江', selected: false },
        { name: '江西', selected: false },
        { name: '湖北', selected: false },
        { name: '广西', selected: false },
        { name: '甘肃', selected: false },
        { name: '山西', selected: false },
        { name: '内蒙古', selected: false },
        { name: '陕西', selected: false },
        { name: '吉林', selected: false },
        { name: '福建', selected: false },
        { name: '贵州', selected: false },
        { name: '广东', selected: false },
        { name: '青海', selected: false },
        { name: '西藏', selected: false },
        { name: '四川', selected: false },
        { name: '宁夏', selected: false },
        { name: '海南', selected: false },
        { name: '台湾', selected: false },
        { name: '香港', selected: false },
        { name: '澳门', selected: false }
    ];
    //高亮标记用户选择的省份
    for (var x in data) {
        if (data[x].name === _selectedProvince) {
            data[x].selected = true;
            break;
        }
    }
    // 基于准备好的dom，初始化echarts图表
    $S.myChinaChart = echarts.init(document.getElementById('minor'));
    //   $S.myChinaChart.showLoading({ text: "数据加载中......" });
    option = {
        series: [
            {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}'
                },
                zoom: 1.2,
                name: '中国',
                type: 'map',
                // roam: 'scale',
                map: 'china',
                mapLocation: {
                    x: 'left',
                    y: 'top'
                },
                roam: false,
                selectedMode: 'single',
                itemStyle: {
                    //normal:{label:{show:true}},
                    emphasis: { label: { show: true } }
                },
                data: data
            }
        ],
        animation: false
    };
    //选择省份的点击事件
    $S.myChinaChart.on("mapselectchanged", function (param) {

        // $S.myChart.clear();
        $S.myChart.showLoading({ text: "数据加载中......", maskColor: "rgba(0, 0, 0, 0.4)", textColor: "#fff" });
        var animate = new $S.Animate();
        animate.ClearWaybillbox();
        animate.ClearDetailsbox();
        //更新所选省份
        if (param.batch[0].name && param.batch[0].name !== "undefined") {
            $S.selectedProvince = param.batch[0].name;
        }


        //console.log($S.selectedProvince);
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ province: $S.selectedProvince });
        action.ActionUrl = "http://localhost:17463/service.asmx/GetProvinceWarehouse";
        action.Done = function (res) {
            //console.log(res);
            var data = res.d;
            var result = {};
            for (x in data) {
                result[data[x].name] = [data[x].lot, data[x].lat];
            }
            //全省城市坐标
            $S.citys = result;

            $S.SeriesName = "全省";

            //设置筛选条件
            $S.SetFilterData($S.selectedProvince);
            //获取市仓支线数据，并设置series和legend
            $S.GetProvinceTransport();
            $S.myChart.hideLoading();
        }
        action.Fail = function (err) {
            alert(err.responseJSON.Message);
        }
        action.PostAction();

    });
    $S.myChinaChart.setOption(option);

}
//返回按钮
$(".box").on("click", ".back", function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    //销毁全国缩略图
    $S.myChinaChart.dispose();
    //销毁城市地图
    $S.myChart.dispose();
    $S.SeriesName = "全国";

    clearInterval($S.setTimeObj.setTime);

    //隐藏返回按钮
    $("#minor").css("display", "none");
    $(".back").removeClass("showback");
    //重新渲染全省总仓视图
    $S.SetOption("全国");

    var trunkList = ["全国"];
    for (var x in $S.myProvincesTrunk) {
        trunkList.push($S.myProvincesTrunk[x].name);
    }

    $(".box").off("click", ".searchBtn");
    $(".box").on("click", ".searchBtn", function () {
        $S.GetProvincesTrunk($S.GetSearchData());
    });
    //$S.SetLegend(trunkList);
    //重新绑定左上角下拉框事件
    /*$(".box").off("click", "#legend li");
    $(".box").on("click", "#legend li", function () {
        var animate = new $S.Animate();
        animate.ClearWaybillbox();
        animate.ClearDetailsbox();
        $S.SeriesName = $(this).text();
        $(this).siblings().removeClass("legendActive").end().addClass("legendActive");
        $S.legend.hide();
        $(".legendbox .styled-select").html($S.SeriesName);
        $S.SetSeries($S.SeriesName);
    });*/


    if ($S.setTimeObj.IsOpen) {
        clearInterval($S.setTimeObj.setFun);
        $S.setTimeObj.setFun = "$S.GetProvincesTrunk()";
        $S.setTimeObj.setTime = setInterval($S.setTimeObj.setFun, $S.setTimeObj.timeSlot);
    }
    //$S.setTime = setInterval("$S.GetProvincesTrunk()", 5000);

});
//订单框动画
$S.Animate = function () { };
$S.Animate.prototype = {
    //清除订单清单
    ClearWaybillbox: function () {
        //$(".waybillList").hide(1000);
        $(".waybillList").animate({ right: "-634px" }, 1000);
        $(".tbodybox").animate({ height: "0" }, 1000);
    },
    //初始化订单清单
    InitWaybillbox: function (callback) {
        //$(".waybillList").show(1000);
        $(".waybillList").animate({ right: "0" }, 1000);
        $(".tbodybox").animate({ height: "16px" }, callback);
    },
    //显示订单清单
    ShowTbodybox: function (callback) {
        $(".tbodybox").animate({ height: "300px" }, 1000);
        $(".detailsbox").animate({ height: "604px", width: "698px" }, callback);
    },
    //清除订单详情
    ClearDetailsbox: function () {
        $(".detailsbox").animate({ left: "-698px" }, 1000);
        var _height = $(".details").height();
        if (_height > 604) {
            _height = 604;
        }
        _height = -_height;
        // $(".detailsbox .table").animate({ top: _height + "px" }, 1000);
    },
    //初始化订单详情
    InitDetailsbox: function (callback) {
        var boxleft = $(".detailsbox").css("left");
        if (boxleft === "0px") {
            var _height = $(".details").height();
            if (_height > 604) {
                _height = 604;
            }
            _height = -_height;
            $(".detailsbox .table").animate({ top: _height + "px" }, 500, callback);
        } else {
            callback && callback();
            $(".detailsbox").animate({ left: "0" }, 1000);
            //callback && callback();
        }

    },
    //显示订单详情
    ShowDetails: function () {
        $(".detailsbox .table").animate({ top: "0px" }, 1000);
    },
    /*//清除订单详情
    ClearDetailsbox: function () {
        $(".detailsbox").animate({ height: "0", width: "0" }, 1000);
        $(".detailsbox").hide(1000);
        $(".detailsbox .table").animate({ height: "0" }, 1000);
    },
    //初始化订单详情
    InitDetailsbox: function (callback) {
        $(".detailsbox").show();
        $(".detailsbox .table").animate({ height: "16px" }, 1000, callback);
    },
    //显示订单详情
    ShowDetails: function () {
        var _height = $(".details").height();
        if (_height > 604) {
            _height = 604;
        }
        $(".detailsbox .table").animate({ height: _height + "px" }, 1000);
    },*/
}
//显示运单清单 _name用户选择的线路
$S.ShowWaybill = function (_name) {

    var names = _name.split(">");
    //获取起点和终点
    var _firstStation = names[0].Trim(),
        _Terminus = names[1].Trim();
    var _title = "<span class='Highlight'>" + _firstStation + "</span><span class='leftdot'>●</span><span class='dot centerdot'>●</span><span class='rightdot'>●</span> " + "<span class='Highlight'>" + _Terminus + "</span>";
    $(".waybillList .waybilltitle .statetitle").html(_title);
    $(".waybillList .table .tbody").html("<div><span>获取运单清单中，请稍后...</span></div>");
    var animate = new $S.Animate();
    animate.ClearDetailsbox();
    animate.InitWaybillbox(function () {
        //根据线路获取订单清单
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ path: _name });
        action.ActionUrl = "http://localhost:17463/service.asmx/GetTransportOrders";
        action.Done = function (res) {
            // console.log(res);
            var result = {};
            result["IsExist"] = true;

            result["waybill"] = res.d;

            if (result["waybill"].length <= 0) {
                result.IsExist = false;
                result["message"] = "该线路暂无订单";
            }

            var waybill = [];
            var List = result.waybill;
            for (var x in List) {
                //UnixToDate(,true)
                var _datetime = $S.UnixToDate(List[x].DeliveryDate.split("/Date(")[1].split(")/")[0], true);
                var _date = _datetime.date;
                var _time = _datetime.time;

                var isNewdate = true;
                for (var y in waybill) {
                    if (waybill[y].date === _date) {
                        isNewdate = false;
                        waybill[y].subWaybill.push({ "type": List[x].type, "NO": List[x].NO, "count": List[x].count, "PlanHours": List[x].PlanHours, "UsedHours": List[x].UsedHours });
                        break;
                    }
                }
                if (isNewdate) {
                    waybill.push({ "date": _date, "subWaybill": [{ "type": List[x].type, "NO": List[x].NO, "count": List[x].count, "PlanHours": List[x].PlanHours, "UsedHours": List[x].UsedHours }] });
                }
            }

            var html = "";
            if (result.IsExist) {
                for (var x in waybill) {
                    html += "<div class=\"btnclick clearfloat\" onclick=\"$S.ShowDetails('" + waybill[x].subWaybill[0].NO + "')\">";
                    html += "<label title='" + waybill[x].date + "'>" + waybill[x].date + "</label>";
                    html += "<label><image src='Src/images/" + waybill[x].subWaybill[0].type + ".png'></span></label>";
                    html += "<label title='" + waybill[x].subWaybill[0].NO + "'>" + waybill[x].subWaybill[0].NO + "</label>";
                    html += "<label title='" + waybill[x].subWaybill[0].count + "'>" + waybill[x].subWaybill[0].count + "</label>";
                    html += "<label title='" + waybill[x].subWaybill[0].PlanHoursNO + "'>" + waybill[x].subWaybill[0].PlanHours + "</label>";
                    html += "<label title='" + waybill[x].subWaybill[0].UsedHours + "'>" + waybill[x].subWaybill[0].UsedHours + "</label>";
                    html += "</div>";

                    var length = waybill[x].subWaybill.length;
                    if (length > 1) {
                        for (var i = 1; i < length; i += 1) {
                            html += "<div class='btnclick subitem clearfloat";

                            if (waybill[x].subWaybill[i].UsedHours > waybill[x].subWaybill[i].PlanHours) {
                                html += " timeOut";
                            }
                            html += "' onclick=\"$S.ShowDetails('" + waybill[x].subWaybill[i].NO + "')\">";
                            html += "<label>&nbsp;</label>";
                            html += "<label><image src='Src/images/" + waybill[x].subWaybill[i].type + ".png'></span></label>";
                            html += "<label title='" + waybill[x].subWaybill[i].NO + "'>" + waybill[x].subWaybill[i].NO + "</label>";
                            html += "<label title='" + waybill[x].subWaybill[i].count + "'>" + waybill[x].subWaybill[i].count + "</label>";
                            html += "<label title='" + waybill[x].subWaybill[i].PlanHours + "'>" + waybill[x].subWaybill[i].PlanHours + "</label>";
                            html += "<label title='" + waybill[x].subWaybill[i].UsedHours + "'>" + waybill[x].subWaybill[i].UsedHours + "</label>";
                            html += "</div>";
                        }
                    }
                }
            } else {
                html = "<div><span>" + result.message + "</span></div>";
            }
            //显示html
            $('.waybillList .table .tbody').html(html);
            animate.ShowTbodybox();
        }
        action.Fail = function (err) {
            alert(err.responseJSON.Message);
        }
        action.PostAction();

    });

}
//清单清单关闭按钮事件
$(".waybillList").on("click", ".btnclick", function () {
    $(this).siblings().removeClass("select");
    $(this).addClass("select");
});
//关闭运单清单
$S.CloseWaybill = function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    //$(".detailsbox").hide(1000);
}
//显示运单详情 _WaybillNo：运单号
$S.ShowDetails = function (_WaybillNo) {
    // $(".details").html("获取清单详情中，请稍后...");
    var animate = new $S.Animate();
    animate.InitDetailsbox(function () {
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ order: _WaybillNo });
        action.ActionUrl = "http://localhost:17463/service.asmx/GetTransportOrderInfor";
        action.Done = function (res) {
            var data = res.d;
            //订单信息
            var orderInfo = {
                OrderNO: data.OrderNO || "",
                ERPNO: data.ERPNO || ""
            };
            for (var i in orderInfo) {
                $("." + i).text(orderInfo[i]);
            }
            //订单过程
            var _OrderProcess = data.OrderProcess || [];
            var prolength = _OrderProcess.length - 1;
            var process = [];
            var processdot = "<div class='dot clearfloat'>";
            processdot += "<span>●</span>";
            processdot += "<span>●</span>";
            processdot += "<span>●</span>";
            processdot += "</div>";

            _OrderProcess.forEach(function (item, i) {
                var _process = "";
                var _datetime = item.datetime.split("/Date(")[1].split(")/")[0];
                if (_datetime === "-62135596800000") {
                    _datetime = { "date": "", "time": "" };
                } else {
                    _datetime = $S.UnixToDate(_datetime, true);
                }
                //var _datetime = $S.UnixToDate(item.datetime.split("/Date(")[1].split(")/")[0], true);
                _process += "<div class='process clearfloat";
                if (item.complete) {
                    _process += " complete ";
                }
                _process += "'>";
                _process += "  <span class='col-lg-12'>";
                _process += "      <img src='Src/images/" + item.name;
                if (item.complete) {
                    _process += "2";
                }
                _process += ".png'  onerror=\"javascript:this.src='Src/images/jieshou.png';\" />";
                _process += "  </span>";
                _process += "  <span class='col-lg-12'>" + item.event + "</span>";
                _process += "  <span class='col-lg-12'>" + _datetime.date + "</span>";
                _process += "  <span class='col-lg-12'>" + _datetime.time + "</span>";
                _process += "</div>"
                process.push(_process);
                if (i < prolength) {
                    process.push(processdot);
                }
            });

            $(".OrderProcess").html(process.join(""));
            //订单详情-》订单信息
            var _OrderDetail = data.OrderDetail || {};
            for (var j in _OrderDetail) {
                //转化时间
                if (j === "CreateDateTime") {
                    var _datetime = $S.UnixToDate(_OrderDetail[j].split("/Date(")[1].split(")/")[0], true);
                    _OrderDetail[j] = _datetime.date + " " + _datetime.time;
                }
                _OrderDetail[j] = _OrderDetail[j] || "--";
                $("." + j).text(_OrderDetail[j]);
            }
            //订单详情-》商品信息
            var _Commodities = data.Commodities || [];
            var CommoditiesHtml = "";
            _Commodities.forEach(function (item, i) {
                CommoditiesHtml += "<span class='col-lg-2'>" + i + "</span>";
                CommoditiesHtml += "<span class='col-lg-6'>" + item.Name + "</span>";
                CommoditiesHtml += "<span class='col-lg-2'>" + item.Weight + "</span>";
                CommoditiesHtml += "<span class='col-lg-2'>" + item.Count + "</span>";
            });
            $(".CommoditiesList").html(CommoditiesHtml);
            //收货人详情
            var _ReciveInfo = data.ReciveInfo || {};
            for (var k in _ReciveInfo) {
                _ReciveInfo[k] = _ReciveInfo[k] || "--";
                $("." + k).text(_ReciveInfo[k]);
            }
            //在途信息
            var List = data.TransportInfo || [];
            var _TransportInfo = [];
            for (var x in List) {
                var _datetime = $S.UnixToDate(List[x].datetime.split("/Date(")[1].split(")/")[0], true);
                var _date = _datetime.date;
                var _time = _datetime.time;

                var isNewdate = true;
                for (var y in _TransportInfo) {
                    if (_TransportInfo[y].date === _date) {
                        isNewdate = false;
                        _TransportInfo[y].subItem.push({ "time": _time, "event": List[x].event });
                        break;
                    }
                }
                if (isNewdate) {
                    _TransportInfo.push({ "date": _date, "subItem": [{ "time": _time, "event": List[x].event }] });
                }
            }
            var TransportInfoHtml = "";
            if (_TransportInfo.length > 0) {
                for (var x in _TransportInfo) {
                    TransportInfoHtml += "<div class=\"item clearfloat\">";
                    TransportInfoHtml += "<label title='" + _TransportInfo[x].date + "'>&nbsp;&nbsp;" + _TransportInfo[x].date + "</label><span>" + _TransportInfo[x].subItem[0].time + "</span><span clas='event'>" + _TransportInfo[x].subItem[0].event + "</span><label><span></span></label></div>";
                    var length = _TransportInfo[x].subItem.length;
                    if (length > 1) {
                        for (var i = 1; i < length; i += 1) {
                            TransportInfoHtml += "<div class=\"subitem clearfloat\"><span>" + _TransportInfo[x].subItem[i].time + "</span><span clas='event'>" + _TransportInfo[x].subItem[i].event + "</span></div>";

                        }

                    }
                }
            } else {
                TransportInfoHtml = "<span class='col-lg-12'>暂无物流信息</span>";
            }

            $(".TransportInfoList").html(TransportInfoHtml);
            /* var _TransportInfo = data.TransportInfo || [];
             var TransportInfoHtml = "";
             _TransportInfo.forEach(function (item, i) {
                 var _datetime = $S.UnixToDate(item.datetime.split("/Date(")[1].split(")/")[0], true);
                 var _date = _datetime.date;
                 var _time = _datetime.time;
                 TransportInfoHtml += "<span class='col-lg-2'>" + _date + "</span>";
                 TransportInfoHtml += "<span class='col-lg-2'>" + _time + "</span>";
                 TransportInfoHtml += "<span class='col-lg-8'>" + item.event + "</span>";
             });
             $(".TransportInfoList").html(TransportInfoHtml);*/
            animate.ShowDetails();
        }
        action.Fail = function (err) {
            alert(err.responseJSON.Message);
        }
        action.PostAction();

    });
}
$(".box").on("click", ".order .nav-tabs li", function () {
    var img = $(this).find("img");
    if (img.attr("src").indexOf("2.png") == -1) {
        img.attr("src", img.attr("src").replace(".png", "2.png"));
        var ontherimgurl = $(this).siblings().find("img");
        ontherimgurl.attr("src", ontherimgurl.attr("src").replace("2.png", ".png"));
    }

});
//关闭运单详情
$S.CloseDetails = function () {
    var animate = new $S.Animate();
    animate.ClearDetailsbox();
}
//获取省仓支线
$S.GetTrunk = function (_name) {
    //根据用户选择的省仓支线名称，返回对应的支线数据
    var trunk = [];
    if (_name === "全国") {
        trunk = $S.myProvincesTrunk;
    } else {
        for (var x in $S.myProvincesTrunk) {
            if ($S.myProvincesTrunk[x].name === _name) {
                trunk.push($S.myProvincesTrunk[x]);
                break;
            }
        }
    }
    return trunk;
}
//获取市仓支线
$S.GetTrunk2 = function (_name) {
    //根据用户选择的市仓支线名称，返回对应的支线数据
    var trunk = [];
    if (_name === "全省") {
        trunk = $S.citysTrunk;
    } else {
        for (var x in $S.citysTrunk) {
            if ($S.citysTrunk[x].name === _name) {
                trunk.push($S.citysTrunk[x]);
                break;
            }
        }
    }
    return trunk;
}
/**解决某些浏览器new Date()不能直接设置参数的兼容性问题 */
$S.NewDate = function (str) {
    str = str.split('-');
    var date = new Date();
    date.setUTCFullYear(str[0], str[1] - 1, str[2]);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
//翻译unix时间戳
$S.UnixToDate = function (unixTime, isFull) {
    var time = new Date(Number(unixTime));
    var ymdhis = {};
    var _date = "";
    _date += time.getFullYear() + "-";
    _date += (time.getMonth() + 1) + "-";
    _date += time.getDate();
    ymdhis.date = _date;
    if (isFull === true) {
        var _time = ""
        _time += " " + $S.checkTime(time.getHours()) + ":";
        _time += $S.checkTime(time.getMinutes()) + ":";
        _time += $S.checkTime(time.getSeconds());
        ymdhis.time = _time;
    }
    return ymdhis;
}

//封装ajax异步获取数据
$S.Action = function () {
    //公有属性
    this.ActionData = null;//传送的数据
    this.ActionUrl = '';//地址
    this.Done = null;//ajax链接成功后的方法
    this.Fail = null;//ajax连接失败后的方法
    this.Anyway = null;//ajax连接的方法

    var me = this
    //私有属性
    //ajax连接成功后内部的方法
    var done = function (res) {
        always();
        me.Done(res);
    }
    //ajax连接失败后内部的方法
    var fail = function (res) {
        always();
        //调用用户制定的链接失败后的方法
        me.Fail(res);
    }
    var always = function () {
    }
    //PostAction
    this.PostAction = function () {
        var urlex = this.ActionUrl;
        var request = $.ajax({
            url: urlex,
            method: "POST",
            async: true,
            data: this.ActionData,
            //timeout: 10000,
            error: function (htq, msg) {
                if (msg == 'timeout') {
                    alert("请求服务器超时,请稍后重试")
                } else {
                    // location.reload();
                    alert(JSON.stringify(htq));
                }
            },
            //contents: [{ "body": this.ActionData }],
            contentType: "application/json;charset=utf-8"
        });
        //成功
        request.done(done);
        //失败
        request.fail(fail);
    }
}

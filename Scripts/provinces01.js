/*//全国总仓地图
var myChart;
//全省总仓地图
//var myCityChart;
//全国缩略图
var $S.myChinaChart;
//全国总仓坐标
var $S.provinces;
//全国总仓干线
var $S.myProvincesTrunk;
//全国城市坐标
var citys;
//全省干线
var citysTrunk;
//所选省份
var selectedProvince;
//值域最大值
var dataRangeMax = 0;*/
//命名空间
var $S = {
    /**
     * 刷新计时器对象  IsOpen: 是否开启刷新；timeSlot：刷新间隔时间，1000 = 1秒;
     */
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
    /** 筛选条件数据 -- 中心仓库,省仓,运输类型,单据类型,品牌类型,商品编号,是否超时*/
    FilterData: function (data) {
        if (!data) {
            return;
        }
        this.CenterWarehouse = data.CenterWarehouse || [];
        this.ProvinceWarehouse = data.ProvinceWarehouse || [];
        this.TransportType = data.TransportType || [];
        this.OrderType = data.OrderType || [];
        this.BrandType = data.BrandType || [];
        this.Material = data.Material || "";
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
    $S.setTimeObj.setFun = "$S.GetProvincesTrunk()";
    if ($S.setTimeObj.IsOpen) {
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
$(".togglefilterbtn").click(function () {
    if ($(".filterdata").css("display") == "none") {
        $(".filterdata").css("display", "block");
    }else{
        $(".filterdata").css("display", "none");
    }
});
$S.SetFilterData = function (province) {
    var _province = province || "全国";
    $S.GetFilterData(_province, function (data) {
        var filterData = new $S.FilterData(data);
        console.log(JSON.stringify(filterData));

        for (var i in filterData) {
            $S.SetFilterHtml(filterData[i], i);
        }


    });

}
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

$S.SetFilterHtml = function (data, dom) {
    if (dom === "Material") {
        return;
    } else if (dom === "TimeOut") {
        if (data == 0) {
            $(".TimeOut [name = timeout]:checkbox").attr("checked", true);
        } else {
            $(".TimeOut [name = timeout][value=" + data + "]").attr("checked", true);
        }
    } else {
        var html = "<select class='selectpicker' multiple data-none-selected-text='暂无选择' data-live-search='true' data-select-all-text='全选' data-deselect-all-text='全不选' data-live-search-placeholder='Search' data-actions-box='true'>";
        data.forEach(function (item, i) {
            html += "<option>" + item + "</option>";
        });
        html += "</select>";
        $("." + dom).html(html);

        //更新内容刷新到相应的位置
        $("." + dom).find("select").selectpicker('refresh');
    }

}
$(".searchBtn").click(function () {
    var data = $(".CenterWarehouse select").selectpicker("val");
    alert(data);
});
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
            $(".details").html("获取清单详情中，请稍后...");
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
        }
        //全国总仓坐标
        $S.provinces = result;
        //用户选择的干线
        $S.SeriesName = _seriesName;
        //获取全国总仓干线
        $S.GetProvincesTrunk();
        //取消loading动画
        $S.myChart.hideLoading();
    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();
}
//获取全国总仓干线函数，同时用于计数器刷新数据
$S.GetProvincesTrunk = function () {
    //清除订单信息框
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();

    $S.GetRecords();

    var action = new $S.Action();
    action.ActionData = JSON.stringify({ param: new $S.FilterData() });
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
        //设置筛选条件
        $S.SetFilterData("全国");
        //初始化设置option中的series
        $S.SetSeries($S.SeriesName);

    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();

}

$S.GetRecords = function () {
    //清除订单信息框
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();

    var action = new $S.Action();
    action.ActionData = JSON.stringify({ province: "全国" });
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
    _option.series = series;
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

    $S.myChart.clear();
    $S.myChart.setOption(_option, true);
}
//转化数据，设置series，公用  (干线名称，干线数据，全国省仓)
$S.GetSeries = function (_seriesName, data, _geoCoordMap) {
    //实线数据
    var lineData = [];
    var lineDatas = [];

    var centralLineData = { _seriesName: [] };
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
                lineData.push([{ name: _solidfrom }, { name: _solidto, value: _count }]);
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
    lineDatas = [[_seriesName, lineData]];
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
            name: _seriesName,
            type: 'lines',
            zlevel: 11,
            //阴影
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
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
                name: _seriesName,
                type: 'lines',
                zlevel: 12,
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
                name: _seriesName,
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 12,
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
                symbolSize: function (val) {
                    return 10;
                },
                itemStyle: {
                    normal: {
                        color: "#fff",
                    }
                },
                data: centralLineData[i].map(function (dataItem) {
                    return {
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
            name: _seriesName,
            type: 'lines',
            zlevel: 1,
            //阴影
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
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
                name: _seriesName,
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
                name: _seriesName,
                type: 'effectScatter',
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
                symbolSize: function (val) {
                    return 10;
                },
                itemStyle: {
                    normal: {
                        color: "#fff"
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
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
            name: "Weather",
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 7,
            markPoint: {
                data: [{
                    symbol: "image://./Src/g.png",
                    symbolSize: 25,
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

//控制终点的订单数是否显示
$(".toolbox").on("click", ".showLabel", function () {
    var _IsShow = !$S.IsShow;
    $S.IsShow = _IsShow;
    var _option = $S.myChart.getOption();
    _series = _option.series;
    _series.forEach(function (item, i) {
        if (item.type === "effectScatter") {
            _series[i].label.normal.show = _IsShow;
        }
    });
    _option.series = _series;
    $S.myChart.setOption(_option);
    if (_IsShow) {
        $(this).text("隐藏");
    } else {
        $(this).text("显示");
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
    $(".back").addClass("show");
    //设置全国缩略图
    $S.SetChina(_selectedProvince);
    //设置城市地图
    $S.SetCityOption(_selectedProvince);

    //设置定时刷新器
    $S.setTimeObj.setFun = "$S.GetProvinceTransport()";
    if ($S.setTimeObj.IsOpen) {
        $S.setTimeObj.setTime = setInterval($S.setTimeObj.setFun, $S.setTimeObj.timeSlot);
    }
    // $S.setTime = setInterval("$S.GetProvinceTransport()", 5000);
}

//获取市仓支线数据，并设置series和legend
$S.GetProvinceTransport = function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    //根据用户选择省份获取全部市仓支线数据
    $S.citysTrunk = [];
    var action = new $S.Action();
    action.ActionData = JSON.stringify({ province: $S.selectedProvince, param: new $S.FilterData() });
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
        //设置筛选条件
        $S.SetFilterData($S.selectedProvince);
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
            //$S.SetLegend(cityTrunkList);
            //设置筛选条件
            $S.SetFilterData(_selectedProvince);
            //注销全国省仓中左上角下拉框的点击事件，并重新绑定点击事件
            $S.selectedProvince = _selectedProvince;
            $(".box").off("click", "#legend li");
            $(".box").on("click", "#legend li", function () {
                var animate = new $S.Animate();
                animate.ClearWaybillbox();
                animate.ClearDetailsbox();
                $S.SeriesName = $(this).text();
                $(this).siblings().removeClass("legendActive").end().addClass("legendActive");
                $S.legend.hide();
                $(".legendbox .styled-select").html($S.SeriesName);
                $S.SetCitySeries($S.selectedProvince, $S.SeriesName);
            });

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
    $(".back").removeClass("show");
    //重新渲染全省总仓视图
    $S.SetOption("全国");

    var trunkList = ["全国"];
    for (var x in $S.myProvincesTrunk) {
        trunkList.push($S.myProvincesTrunk[x].name);
    }
    //$S.SetLegend(trunkList);
    //设置筛选条件
    $S.SetFilterData("全国");
    //重新绑定左上角下拉框事件
    $(".box").off("click", "#legend li");
    $(".box").on("click", "#legend li", function () {
        var animate = new $S.Animate();
        animate.ClearWaybillbox();
        animate.ClearDetailsbox();
        $S.SeriesName = $(this).text();
        $(this).siblings().removeClass("legendActive").end().addClass("legendActive");
        $S.legend.hide();
        $(".legendbox .styled-select").html($S.SeriesName);
        $S.SetSeries($S.SeriesName);
    });


    $S.setTimeObj.setFun = "$S.GetProvincesTrunk()";
    if ($S.setTimeObj.IsOpen) {
        $S.setTimeObj.setTime = setInterval($S.setTimeObj.setFun, $S.setTimeObj.timeSlot);
    }
    //$S.setTime = setInterval("$S.GetProvincesTrunk()", 5000);

});
//订单框动画
$S.Animate = function () { };
$S.Animate.prototype = {
    //清除订单清单
    ClearWaybillbox: function () {
        $(".waybillList").hide(1000);
        $(".tbodybox").animate({ height: "0" }, 1000);
    },
    //初始化订单清单
    InitWaybillbox: function (callback) {
        $(".waybillList").show(1000);
        $(".tbodybox").animate({ height: "16px" }, callback);
    },
    //显示订单清单
    ShowTbodybox: function (callback) {
        $(".tbodybox").animate({ height: "130px" }, 1000);
        $(".detailsbox").animate({ height: "230px", width: "350px" }, callback);
    },
    //清除订单详情
    ClearDetailsbox: function () {
        $(".detailsbox").animate({ height: "0", width: "0" }, 1000);
        $(".detailsbox").hide(1000);
        $(".detailsbox .table").animate({ height: "0" }, 1000);
    },
    //初始化订单详情
    InitDetailsbox: function (callback) {
        //  $(".detailsbox").animate({ height: "314px" });
        $(".detailsbox").show();
        $(".detailsbox .table").animate({ height: "16px" }, 1000, callback);
    },
    //显示订单详情
    ShowDetails: function () {
        //$(".detailsbox .table").css('height')
        // $(".detailsbox").animate({ height: "314px" }, 1000);
        var _height = $(".details").height();
        if (_height > 228) {
            _height = 228;
        }
        $(".detailsbox .table").animate({ height: _height + "px" }, 1000);
    },
}
//显示运单清单 _name用户选择的线路
$S.ShowWaybill = function (_name) {

    var names = _name.split(">");
    //获取起点和终点
    var _firstStation = names[0].Trim(),
        _Terminus = names[1].Trim();
    var _title = "<span class='Highlight'>" + _firstStation + "</span> 至 " + "<span class='Highlight'>" + _Terminus + "</span>";
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

            var html = "";
            if (result.IsExist) {
                var List = result.waybill;
                //将订单清单相关数据嵌入html中
                for (var x in List) {
                    var _date = $S.UnixToDate(List[x].DeliveryDate.split("/Date(")[1].split(")/")[0], true).date;
                    html += "<div class='btnclick clearfloat";
                    if (List[x].UsedHours > List[x].PlanHours) {
                        html += " timeOut";
                    }
                    html += "' onclick=\"$S.ShowDetails('" + List[x].NO + "')\"><label>" + List[x].type + "</label><label title='" + _date + "'>" + _date + "</label><label title='" + List[x].mailNO + "'>" + List[x].mailNO + "</label><label title='" + List[x].count + "'>" + List[x].count + "</label><label title='" + List[x].PlanHours + "'>" + List[x].PlanHours + "</label><label title='" + List[x].UsedHours + "'>" + List[x].UsedHours + "</label><label title='" + List[x].MaterialDesc + "'>" + List[x].MaterialDesc + "</label></div>";
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
    $(".details").html("获取清单详情中，请稍后...");
    var animate = new $S.Animate();
    animate.InitDetailsbox(function () {
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ order: _WaybillNo });
        action.ActionUrl = "http://localhost:17463/service.asmx/GetTransportOrderInfor";
        action.Done = function (res) {
            // console.log(res);
            var data = res.d;
            var details = [];
            //循环所有详情数据
            for (var x in data) {
                //UnixToDate(,true)
                //将运单详情中的unix时间戳转化为正常时间
                var _datetime = $S.UnixToDate(data[x].datetime.split("/Date(")[1].split(")/")[0], true);
                var _date = _datetime.date;
                var _time = _datetime.time;
                //是否是新日期
                var isNewdate = true;
                //循环详情列表，将同一天的数据放进同一个详情数据行details的子详情行subDetails中
                for (var y in details) {
                    if (details[y].date === _date) {
                        isNewdate = false;
                        details[y].subDetails.push({ "address": data[x].address, "time": _time, "message": data[x].event });
                        break;
                    }
                }
                //如果是新日期，则在details详情列表中新增一个详情数据行
                if (isNewdate) {
                    details.push({ "date": _date, "days": $S.GetDay($S.NewDate(_date).getDay()), "subDetails": [{ "address": data[x].address, "time": _time, "message": data[x].event }] });
                }
            }
            var result = {};
            result["details"] = details;
            result["IsExist"] = true;
            if (result["details"].length <= 0) {
                result.IsExist = false;
                result["message"] = "该订单暂无订单详情";
            }


            var html = "";
            if (result.IsExist) {
                var _List = result.details;
                //console.log(_List);
                //循环详情数据，生成对应的html
                for (var x in _List) {
                    html += "<div class=\"item clearfloat\">";
                    html += "<label title='" + _List[x].date + "'>" + _List[x].date + "/" + _List[x].days + "</label><label title='" + _List[x].subDetails[0].time + "'>" + _List[x].subDetails[0].time + "</label><label title='" + _List[x].subDetails[0].message + "'>[" + _List[x].subDetails[0].address + "]" + _List[x].subDetails[0].message + "</label><label><span></span></label></div>";
                    //html += "<div class=\"subitem\">";
                    var length = _List[x].subDetails.length;
                    if (length > 1) {
                        for (var i = 1; i < length; i += 1) {
                            html += "<div class=\"subitem clearfloat\"><label title='" + _List[x].subDetails[i].time + "'>" + _List[x].subDetails[i].time + "</label><label title='" + _List[x].subDetails[i].message + "'>[" + _List[x].subDetails[i].address + "]" + _List[x].subDetails[i].message + "</label></div>";
                        }
                    }
                }
            } else {
                html = result.message;
            }

            $('.details').html(html);
            animate.ShowDetails();
        }
        action.Fail = function (err) {
            alert(err.responseJSON.Message);
        }
        action.PostAction();

    });
}
/**解决某些浏览器new Date()不能直接设置参数的兼容性问题 */
$S.NewDate = function (str) {
    str = str.split('-');
    var date = new Date();
    date.setUTCFullYear(str[0], str[1] - 1, str[2]);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
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

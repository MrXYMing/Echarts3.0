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
    // IsOpen: 是否开启刷新；timeSlot：刷新间隔时间，1000 = 1秒;
    setTimeObj: { IsOpen: true, setTime: null, setFun: "", timeSlot:5000},
    legendOnblur: function (event) {
        this.legend.hide();
    },
    startTime: function () { },
    checkTime: function () { },
    GetDay: function () { },
    SetLegend: function () { },
    legend: {},
    SetOption: function () { },
    SetSeries: function () { },
    GetSeries: function () { },
    SetSecondInit: function () { },
    SetCityOption: function () { },
    SetCitySeries: function () { },
    SetChina: function () { },
    Animate: function () { },
    ShowWaybill: function () { },
    CloseWaybill: function () { },
    ShowDetails: function () { },
    GetTrunk: function () { },
    GetTrunk2: function () { },
    UnixToDate: function () { },
    Action: function () { },
    NewDate: function () { },
    SeriesName: "全国"
};
$(function () {
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

/*$(".settime").on("click", function () {
    $S.setTimeObj.IsOpen = !$S.setTimeObj.IsOpen;
    if ($S.setTimeObj.IsOpen) {
        $(this).text("关闭刷新");
        $S.setTimeObj.setTime = setInterval($S.setTimeObj.setFun, $S.setTimeObj.timeSlot);
    } else {
        $(this).text("开启刷新");
        clearInterval($S.setTimeObj.setTime);
    }
});*/
//计时器
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

//legend的change事件，重新渲染视图
/*$(".box").on("change", "#legend", function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    var _seriesName = $(this).val();

    $S.SetSeries(_seriesName);
});*/
//生成左上角的legend
$S.SetLegend = function (_trunkList) {
    var html = "";
    for (var x in _trunkList) {
        html += "<li>" + _trunkList[x] + "</li>"
    }
    //$(".legendbox .styled-select").html(_trunkList[0]);
    $(".legendbox").css("display", "inline-block");
    $(".legendbox #legend").html(html);
    //console.log($(".legendbox #legend:first-child"));
    $(".legendbox #legend li").each(function () {
        if ($(this).text() == $S.SeriesName) {
            $(".legendbox .styled-select").html($(this).text());
            $(this).addClass("legendActive");
        }
    });
    //$(".legendbox #legend li:first-child").addClass("legendActive");
}
$S.legend = {
    show: function () {
        $(".legendbox .ulbox").addClass("show");
        $(".legendbox .styled-select").css("background-image", "url(./Src/x1.png)");
        //$(".legend").focus();
    },
    hide: function () {
        $(".legendbox .styled-select").css("background-image", "url(./Src/x2.png)");
        $(".legendbox .ulbox").removeClass("show");
    }
};
$(".box").on("click", ".styled-select", function () {
    if (!$(".ulbox").hasClass("show")) {
        $S.legend.show();
    } else {
        $S.legend.hide();
    }
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
});
//字符串去除前后空格
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//设置全国总仓option
$S.SetOption = function (_seriesName) {
    $S.myChart = echarts.init(document.getElementById('main'));
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

    $S.myChart.on('click', function (params) {
        /*if (params.componentType === 'geo') {
        }
        else */
        if (params.componentType === 'series') {
            if (params.seriesType === 'lines') {
                console.log("点到了线,从 " + params.data.fromName + "至 " + params.data.toName);
                var _selectline = params.data.fromName + ">" + params.data.toName;
                $S.ShowWaybill(_selectline);
            } else if (params.seriesType === 'effectScatter') {
                console.log("点到了点：" + params.data.name);
            }
        }

    });
    $S.myChart.on('geoselectchanged', function (params) {
        if (params.batch[0].name && params.batch[0].name !== "undefined") {
            $(".waybillList table tbody").html("<tr><td colspan='3'>获取运单清单中，请稍后...</td></tr>");
            $(".details").html("获取清单详情中，请稍后...");
            $(".legend").html("<option value='--'>--</option>");


            clearInterval($S.setTimeObj.setTime);
            //清除全国总仓视图
            $S.myChart.clear();
            //重新渲染全省总仓视图
            $S.SetSecondInit(params.batch[0].name);
        }

    });
    /* myChart.on('mapselectchanged', function (params) {
         if (params.batch[0].name && params.batch[0].name !== "undefined") {
             $(".waybillList table tbody").html("<tr><td colspan='3'>获取运单清单中，请稍后...</td></tr>");
             $(".details").html("获取清单详情中，请稍后...");
             $(".legend").html("<option value='--'>--</option>");
             //清除全国总仓视图
             myChart.clear();
             //重新渲染全省总仓视图
             SetSecondInit(params.batch[0].name);
         }
 
     });*/
    $S.myChart.setOption(option);
    var action = new $S.Action();
    action.ActionUrl = "./service.asmx/GetContryWarehouse";
    action.Done = function (res) {
        var data = res.d;
        var result = {};
        for (x in data) {
            result[data[x].name] = [data[x].lot, data[x].lat];
        }
        //全国总仓坐标
        $S.provinces = result;
        $S.SeriesName = _seriesName;
        $S.GetProvincesTrunk();

        $S.myChart.hideLoading();
    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();
}

$S.GetProvincesTrunk = function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();

    var action = new $S.Action();
    action.ActionUrl = "./service.asmx/GetContryMainTransport";
    action.Done = function (res) {
        //全国总仓干线
        $S.myProvincesTrunk = res.d;

        var trunkList = ["全国"];
        for (var x in $S.myProvincesTrunk) {
            trunkList.push($S.myProvincesTrunk[x].name);
        }
        $S.SetLegend(trunkList);

        $S.SetSeries($S.SeriesName);

    }
    action.Fail = function (err) {
        alert(err.responseJSON.Message);
    }
    action.PostAction();

}
//初始化设置option中的series
$S.SetSeries = function (_seriesName) {
    //各干线数据
    // var markLineData = [];

    var _provinces = $S.GetTrunk(_seriesName);
    var series = $S.GetSeries(_seriesName, _provinces, $S.provinces);
    var _option = $S.myChart.getOption();
    _option.series = series;
    _option.legend = {
        show: false,
        orient: 'vertical',
        x: 'left',
        data: [_seriesName],
        selectedMode: 'single',
        textStyle: {
            color: '#fff'
        }
    };
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

    $S.myChart.clear();
    $S.myChart.setOption(_option, true);
}
//转化数据，设置series，公用
$S.GetSeries = function (_seriesName, data, _geoCoordMap) {
    var lineData = [];
    var lineDatas = [];
    var dotLineData = [];
    var dotLineDatas = [];
    var series = [];
    $S.dataRangeMax = 0;

    for (var x in data) {
        for (y in data[x].solid) {
            lineData.push([{ name: data[x].solid[y].from }, { name: data[x].solid[y].to, value: data[x].solid[y].count }]);
            if (parseFloat(data[x].solid[y].count) > parseFloat($S.dataRangeMax)) {
                $S.dataRangeMax = parseFloat(data[x].solid[y].count);
            }
        }
        for (var z in data[x].dot) {
            dotLineData.push([{ name: data[x].dot[z].from }, { name: data[x].dot[z].to }]);
        }
    }
    lineDatas = [[_seriesName, lineData]];
    dotLineDatas = [['虚线', dotLineData]];

    var geoCoordMap = _geoCoordMap;

    var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';

    var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
            var dataItem = data[i];
            var fromCoord = geoCoordMap[dataItem[0].name];
            var toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
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

    var color = ['#a6c84c', '#ffa022', '#46bee9'];
    var series = [];
    lineDatas.forEach(function (item, i) {
        var desValues = {};
        item[1].forEach(function (di, i) {
            if (desValues[di[1].name]) {
                desValues[di[1].name] = Number(desValues[di[1].name]) + Number(di[1].value);
            } else {
                desValues[di[1].name] = Number(di[1].value);
            }
        });
        series.push({
            name: _seriesName,
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: color[i],
                    width: 0,
                    curveness: 0.2
                }
            },
            data: convertData(item[1])
        },
            {
                name: _seriesName,
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
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
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: _seriesName,
                type: 'effectScatter',
                coordinateSystem: 'geo',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return 10;
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([desValues[dataItem[1].name]]),
                    };
                })
            });
    });

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

//设置第二次初始化
$S.SetSecondInit = function (_selectedProvince) {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    $("#minor").css("display", "block");
    $(".back").addClass("show");
    $S.SetChina(_selectedProvince);
    $S.SetCityOption(_selectedProvince);

    $S.setTimeObj.setFun = "$S.GetProvinceTransport()";
    if ($S.setTimeObj.IsOpen) {
        $S.setTimeObj.setTime = setInterval($S.setTimeObj.setFun, $S.setTimeObj.timeSlot);
    }
    // $S.setTime = setInterval("$S.GetProvinceTransport()", 5000);
}

$S.GetProvinceTransport = function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();

    $S.citysTrunk = [];
    var action = new $S.Action();
    action.ActionData = JSON.stringify({ province: $S.selectedProvince });
    action.ActionUrl = "./service.asmx/GetProvinceTransport";
    action.Done = function (res) {
        $S.citysTrunk = res.d;


        $S.SetCitySeries($S.selectedProvince, $S.SeriesName);


        var cityTrunkList = ["全省"];
        for (var x in $S.citysTrunk) {
            cityTrunkList.push($S.citysTrunk[x].name);
        }
        $S.SetLegend(cityTrunkList);

        /* $S.selectedProvince = _selectedProvince;
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
 
         */

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
        /*    dataRange: {
                //显示策略
                show: true,
                //指定的最小值，eg: 0，默认无，必须参数，唯有指定了splitList时可缺省min。
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
            }*/
    };

    $S.myChart.off('click');
    $S.myChart.on('click', function (params) {
        if (params.componentType === 'geo') {
            console.log("点到了省：" + params.name);
        }
        else if (params.componentType === 'series') {
            if (params.seriesType === 'lines') {
                console.log("点到了线,从 " + params.data.fromName + "至 " + params.data.toName);
                var _selectline = params.data.fromName + ">" + params.data.toName;
                $S.ShowWaybill(_selectline);
            } else if (params.seriesType === 'effectScatter') {
                console.log("点到了点：" + params.data.name);
            }
        }
    });

    $S.myChart.setOption(option, true);

    var action = new $S.Action();
    action.ActionData = JSON.stringify({ province: _selectedProvince });
    action.ActionUrl = "./service.asmx/GetProvinceWarehouse";
    action.Done = function (res) {
        console.log(res);
        var data = res.d;
        var result = {};
        for (x in data) {
            result[data[x].name] = [data[x].lot, data[x].lat];
        }
        //全省城市坐标
        $S.citys = result;

        $S.citysTrunk = [];
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ province: _selectedProvince });
        action.ActionUrl = "./service.asmx/GetProvinceTransport";
        action.Done = function (res) {
            console.log(res);
            $S.citysTrunk = res.d;

            $S.SeriesName = "全省";
            $S.SetCitySeries(_selectedProvince, $S.SeriesName);


            var cityTrunkList = ["全省"];
            for (var x in $S.citysTrunk) {
                cityTrunkList.push($S.citysTrunk[x].name);
            }
            $S.SetLegend(cityTrunkList);

            /* selectedProvince = _selectedProvince;
             $(".box").off("change", "#legend");
             $(".box").on("change", "#legend", function () {
                 var animate = new Animate();
                 animate.ClearWaybillbox();
                 animate.ClearDetailsbox();
                 var _seriesName = $(this).val();
                 SetCitySeries(selectedProvince, _seriesName);
             });*/

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
    var _provinces = $S.GetTrunk2(_selectedCity);
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
    $S.myChinaChart.on("mapselectchanged", function (param) {

        // $S.myChart.clear();
        $S.myChart.showLoading({ text: "数据加载中......", maskColor: "rgba(0, 0, 0, 0.4)", textColor: "#fff" });
        var animate = new $S.Animate();
        animate.ClearWaybillbox();
        animate.ClearDetailsbox();

        if (param.batch[0].name && param.batch[0].name !== "undefined") {
            $S.selectedProvince = param.batch[0].name;
        }


        console.log($S.selectedProvince);
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ province: $S.selectedProvince });
        action.ActionUrl = "./service.asmx/GetProvinceWarehouse";
        action.Done = function (res) {
            console.log(res);
            var data = res.d;
            var result = {};
            for (x in data) {
                result[data[x].name] = [data[x].lot, data[x].lat];
            }
            //全省城市坐标
            $S.citys = result;

            $S.citysTrunk = [];
            var action = new $S.Action();
            action.ActionData = JSON.stringify({ province: $S.selectedProvince });
            action.ActionUrl = "./service.asmx/GetProvinceTransport";
            action.Done = function (res) {
                console.log(res);
                $S.citysTrunk = res.d;

                $S.SeriesName = "全省";
                $S.SetCitySeries($S.selectedProvince, $S.SeriesName);


                var cityTrunkList = ["全省"];
                for (var x in $S.citysTrunk) {
                    cityTrunkList.push($S.citysTrunk[x].name);
                }
                $S.SetLegend(cityTrunkList);

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

    });
    $S.myChinaChart.setOption(option);

}
//返回按钮
$(".box").on("click", ".back", function () {
    var animate = new $S.Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    //销毁全国总仓视图
    $S.myChinaChart.dispose();
    $S.myChart.dispose();
    $S.SeriesName = "全国";

    clearInterval($S.setTimeObj.setTime);


    $("#minor").css("display", "none");
    $(".back").removeClass("show");
    //重新渲染全省总仓视图
    $S.SetOption("全国");

    var trunkList = ["全国"];
    for (var x in $S.myProvincesTrunk) {
        trunkList.push($S.myProvincesTrunk[x].name);
    }
    $S.SetLegend(trunkList);

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
    ClearWaybillbox: function () {
        $(".waybillList").hide(1000);
        $(".tbodybox").animate({ height: "0" }, 1000);
    },
    InitWaybillbox: function (callback) {
        $(".waybillList").show(1000);
        $(".tbodybox").animate({ height: "16px" }, callback);
    },
    ShowTbodybox: function (callback) {
        $(".tbodybox").animate({ height: "130px" }, 1000);
        $(".detailsbox").animate({ height: "230px", width: "350px" }, callback);
    },
    ClearDetailsbox: function () {
        $(".detailsbox").animate({ height: "0", width: "0" }, 1000);
        $(".detailsbox").hide(1000);
        $(".detailsbox .table").animate({ height: "0" }, 1000);
    },
    InitDetailsbox: function (callback) {
        //  $(".detailsbox").animate({ height: "314px" });
        $(".detailsbox").show();
        $(".detailsbox .table").animate({ height: "16px" }, 1000, callback);
    },
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
//显示运单清单
$S.ShowWaybill = function (_name) {
    var names = _name.split(">");
    var _firstStation = names[0].Trim(),
        _Terminus = names[1].Trim();
    var _title = "<span class='Highlight'>" + _firstStation + "</span> 至 " + "<span class='Highlight'>" + _Terminus + "</span>";
    $(".waybillList .waybilltitle .statetitle").html(_title);
    $(".waybillList .table .tbody").html("<div><span>获取运单清单中，请稍后...</span></div>");
    var animate = new $S.Animate();
    animate.ClearDetailsbox();
    animate.InitWaybillbox(function () {

        var action = new $S.Action();
        action.ActionData = JSON.stringify({ path: _name });
        action.ActionUrl = "./service.asmx/GetTransportOrders";
        action.Done = function (res) {
            console.log(res);
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
                for (var x in List) {
                    html += "<div class='btnclick clearfloat' onclick=\"$S.ShowDetails('" + List[x].NO + "')\"><label title='" + List[x].NO + "'>" + List[x].NO + "</label><label title='" + List[x].mailNO + "'>" + List[x].mailNO + "</label><label title='" + List[x].count + "'>" + List[x].count + "</label><label title='" + List[x].type + "'>" + List[x].type + "</label></div>";
                }
            } else {
                html = "<div><span>" + result.message + "</span></div>";
            }

            $('.waybillList .table .tbody').html(html);
            animate.ShowTbodybox();

        }
        action.Fail = function (err) {
            alert(err.responseJSON.Message);
        }
        action.PostAction();

    });

}
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
//显示运单详情
$S.ShowDetails = function (_WaybillNo) {
    $(".details").html("获取清单详情中，请稍后...");
    var animate = new $S.Animate();
    animate.InitDetailsbox(function () {
        var action = new $S.Action();
        action.ActionData = JSON.stringify({ order: _WaybillNo });
        action.ActionUrl = "./service.asmx/GetTransportOrderInfor";
        action.Done = function (res) {
            console.log(res);
            var data = res.d;
            var details = [];
            for (var x in data) {
                //UnixToDate(,true)
                var _datetime = $S.UnixToDate(data[x].datetime.split("/Date(")[1].split(")/")[0], true);
                var _date = _datetime.date;
                var _time = _datetime.time;

                var isNewdate = true;
                for (var y in details) {
                    if (details[y].date === _date) {
                        isNewdate = false;
                        details[y].subDetails.push({ "address": data[x].address, "time": _time, "message": data[x].event });
                        break;
                    }
                }

                if (isNewdate) {
                    console.log("/////////////////");

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
                console.log(_List);
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





    /*var t = setTimeout(show, 1000);
    function show() {
        $('.details').html(html);
        // $(".details").hide();
        // $(".details").show(1000);
        animate.ShowDetails();
        clearTimeout(t);
    }*/

}

$S.NewDate = function (str) {
    str = str.split('-');
    var date = new Date();
    date.setUTCFullYear(str[0], str[1] - 1, str[2]);
    date.setUTCHours(0, 0, 0, 0);
    return date;
}
//关闭运单详情
$S.CloseDetails = function () {
    // $(".details").hide(1000);
    // $(".detailsbox").hide(1000);
    var animate = new $S.Animate();
    animate.ClearDetailsbox();
}
//获取省仓支线
$S.GetTrunk = function (_name) {
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
                    console.log(JSON.stringify(htq));
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

//全国总仓地图
var myChart;
//全省总仓地图
//var myCityChart;
//全国缩略图
var myChinaChart;
//全国总仓坐标
var provinces;
//全国总仓干线
var provincesTrunk;
//全国城市坐标
var citys;
//全省干线
var citysTrunk;
//所选省份
var selectedProvince;
//值域最大值
var dataRangeMax = 0;

$(function () {
    $(".box").css({ width: $(window).width(), height: $(window).height() });
    $(window).resize(function () {
        $(".box").css({ width: $(window).width(), height: $(window).height() });

        myChart.resize();
    });
    //定义滚动条组件
    $(".content").mCustomScrollbar();

    //设置全国总仓option
    SetOption("全国");
    setInterval("startTime()", 500);
});
//计时器
function startTime() {
    var today = new Date();
    var y = today.getFullYear();
    var mo = checkTime(today.getMonth() + 1);
    var d = checkTime(today.getDate());
    var h = checkTime(today.getHours());
    var m = checkTime(today.getMinutes());
    var s = checkTime(today.getSeconds());
    var _html = y + "/" + mo + "/" + d + " " + GetDay(today.getDay()) + " " + h + ":" + m + ":" + s;
    $('.showtime').html(_html);
}
//日期补0
function checkTime(i) {
    if (i < 10)
    { i = "0" + i }
    return i
}
//翻译星期数
function GetDay(_day) {
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
function SetLegend(_trunkList) {
    var html = "";
    for (var x in _trunkList) {
        //  html += "<div class='legendItem clearfloat' onclick=\"ClickLegend('" + _trunkList[x] + "')\"><span class='label'></span><span class='title'>" + _trunkList[x] + "</span></div>"
        html += "<option value='" + _trunkList[x] + "'>" + _trunkList[x] + "</option>"
    }
    $(".legendbox").addClass("show");
    $(".legend").html(html);
}
//legend的change事件，重新渲染视图
$(".box").on("change", "#legend", function () {
    var animate = new Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    var _seriesName = $(this).val();

    SetSeries(_seriesName);
    /*var _option = myChart.getOption();
    _option.series = SetSeries(_seriesName);
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
    myChart.clear();
    myChart.setOption(_option, true);*/
});
//字符串去除前后空格
String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//设置全国总仓option
function SetOption(_seriesName) {
    myChart = echarts.init(document.getElementById('main'));
    myChart.showLoading({ text: "数据加载中......" });
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

    myChart.on('click', function (params) {
        if (params.componentType === 'geo') {
        }
        else if (params.componentType === 'series') {
            if (params.seriesType === 'lines') {
                console.log("点到了线,从 " + params.data.fromName + "至 " + params.data.toName);
                var _selectline = params.data.fromName + ">" + params.data.toName;
                ShowWaybill(_selectline);
            } else if (params.seriesType === 'effectScatter') {
                console.log("点到了点：" + params.data.name);
            }
        }

    });
    myChart.on('geoselectchanged', function (params) {
        if (params.batch[0].name && params.batch[0].name !== "undefined") {
            $(".waybillList table tbody").html("<tr><td colspan='3'>获取运单清单中，请稍后...</td></tr>");
            $(".details").html("获取清单详情中，请稍后...");
            $(".legend").html("<option value='--'>--</option>");
            //清除全国总仓视图
            myChart.clear();
            //重新渲染全省总仓视图
            SetSecondInit(params.batch[0].name);
        }

    });
    myChart.setOption(option);
    var action = new Action();
    action.ActionUrl = "/echartService.asmx/GetContryWarehouse";
    action.Done = function (res) {
        var data = res.d;
        var result = {};
        for (x in data) {
            result[data[x].name] = [data[x].lot, data[x].lat];
        }
        //全国总仓坐标
        provinces = result;


        var action = new Action();
        action.ActionUrl = "/echartService.asmx/GetContryMainTransport";
        action.Done = function (res) {
            //全国总仓干线
            provincesTrunk = res.d;

            var trunkList = ["全国"];
            for (var x in provincesTrunk) {
                trunkList.push(provincesTrunk[x].name);
            }
            SetLegend(trunkList);

            SetSeries(_seriesName);

            myChart.hideLoading();
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

//初始化设置option中的series
function SetSeries(_seriesName) {
    //各干线数据
    // var markLineData = [];
    var lineData = [];
    var lineDatas = [];
    var dotLineData = [];
    var dotLineDatas = [];
    var series = [];
    dataRangeMax = 0;
    var _provinces = GetTrunk(_seriesName);
    for (var x in _provinces) {
        for (y in _provinces[x].solid) {
            lineData.push([{ name: _provinces[x].solid[y].from }, { name: _provinces[x].solid[y].to, value: _provinces[x].solid[y].count }]);
            if (parseFloat(_provinces[x].solid[y].count) > parseFloat(dataRangeMax)) {
                dataRangeMax = parseFloat(_provinces[x].solid[y].count);
            }
        }
        for (var z in _provinces[x].dot) {
            dotLineData.push([{ name: _provinces[x].dot[z].from }, { name: _provinces[x].dot[z].to }]);
        }
    }
    lineDatas = [[_seriesName, lineData]];
    dotLineDatas = [['虚线', dotLineData]];

    var geoCoordMap = provinces;

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
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
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


    var _option = myChart.getOption();
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
    if (dataRangeMax > 0) {
        _option.dataRange = {
            show: true,
            min: 0,
            //指定的最大值，eg: 100，默认无，必须参数，唯有指定了splitList时可缺省max
            max: dataRangeMax,
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

    myChart.clear();
    myChart.setOption(_option, true);
}

//设置第二次初始化
function SetSecondInit(_selectedProvince) {
    var animate = new Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    $("#minor").css("display", "block");
    $(".back").addClass("show");
    SetChina(_selectedProvince);
    SetCityOption(_selectedProvince);
}
//初始化省仓支线中的省份地图的option
function SetCityOption(_selectedProvince) {
    myChart.showLoading({ text: "数据加载中......" });

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
                max: dataRangeMax,
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

    myChart.off('click');
    myChart.on('click', function (params) {
        if (params.componentType === 'geo') {
            console.log("点到了省：" + params.name);
        }
        else if (params.componentType === 'series') {
            if (params.seriesType === 'lines') {
                console.log("点到了线,从 " + params.data.fromName + "至 " + params.data.toName);
                var _selectline = params.data.fromName + ">" + params.data.toName;
                ShowWaybill(_selectline);
            } else if (params.seriesType === 'effectScatter') {
                console.log("点到了点：" + params.data.name);
            }
        }
    });

    myChart.setOption(option, true);

    var action = new Action();
    action.ActionData = JSON.stringify({ province: _selectedProvince });
    action.ActionUrl = "/echartService.asmx/GetProvinceWarehouse";
    action.Done = function (res) {
        console.log(res);
        var data = res.d;
        var result = {};
        for (x in data) {
            result[data[x].name] = [data[x].lot, data[x].lat];
        }
        //全省城市坐标
        citys = result;

        citysTrunk = [];
        var action = new Action();
        action.ActionData = JSON.stringify({ province: _selectedProvince });
        action.ActionUrl = "/echartService.asmx/GetProvinceTransport";
        action.Done = function (res) {
            console.log(res);
            citysTrunk = res.d;


            SetCitySeries(_selectedProvince, "全省");


            var cityTrunkList = ["全省"];
            for (var x in citysTrunk) {
                cityTrunkList.push(citysTrunk[x].name);
            }
            SetLegend(cityTrunkList);

            selectedProvince = _selectedProvince;
            $(".box").off("change", "#legend");
            $(".box").on("change", "#legend", function () {
                var animate = new Animate();
                animate.ClearWaybillbox();
                animate.ClearDetailsbox();
                var _seriesName = $(this).val();

                SetCitySeries(selectedProvince, _seriesName);

            });

            myChart.hideLoading();

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
function SetCitySeries(_selectedProvince, _selectedCity) {

    var lineData = [];
    var lineDatas = [];
    var dotLineData = [];
    var dotLineDatas = [];
    var series = [];
    dataRangeMax = 0;
    var _provinces = GetTrunk2(_selectedCity);
    for (var x in _provinces) {
        for (y in _provinces[x].solid) {
            lineData.push([{ name: _provinces[x].solid[y].from }, { name: _provinces[x].solid[y].to, value: _provinces[x].solid[y].count }]);
            if (parseFloat(_provinces[x].solid[y].count) > parseFloat(dataRangeMax)) {
                dataRangeMax = parseFloat(_provinces[x].solid[y].count);
            }
        }
        for (var z in _provinces[x].dot) {
            dotLineData.push([{ name: _provinces[x].dot[z].from }, { name: _provinces[x].dot[z].to }]);
        }
    }
    lineDatas = [[_selectedCity, lineData]];
    dotLineDatas = [['虚线', dotLineData]];

    var geoCoordMap = citys;

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
    lineDatas.forEach(function (item, i) {
        series.push({
            name: item[0],
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
                name: item[0],
                type: 'lines',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    /*show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: planePath,
                    symbolSize: 15*/
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: 'circle',
                    symbolSize: 1
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
                name: item[0],
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
                itemStyle: {
                    normal: {
                        color: color[i]
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
    });
    dotLineDatas.forEach(function (item, i) {
        series.push({
            name: item[0],
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

    //   return series;

    var _option = myChart.getOption();
    _option.series = series;
    if (dataRangeMax > 0) {
        _option.dataRange = {
            show: true,
            min: 0,
            //指定的最大值，eg: 100，默认无，必须参数，唯有指定了splitList时可缺省max
            max: dataRangeMax,
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
    myChart.clear();
    myChart.setOption(_option, true);

}
//生成省仓支线图中的全国地图
function SetChina(_selectedProvince) {
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
    myChinaChart = echarts.init(document.getElementById('minor'));
    //   myChinaChart.showLoading({ text: "数据加载中......" });
    option = {
        series: [
            {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}'
                },
                name: '中国',
                type: 'map',
                roam: 'scale',
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
    myChinaChart.on("mapselectchanged", function (param) {
        myChart.showLoading({ text: "数据加载中......" });
        var animate = new Animate();
        animate.ClearWaybillbox();
        animate.ClearDetailsbox();

        if (param.batch[0].name && param.batch[0].name !== "undefined") {
            selectedProvince = param.batch[0].name;
        }


        console.log(selectedProvince);
        var action = new Action();
        action.ActionData = JSON.stringify({ province: selectedProvince });
        action.ActionUrl = "/echartService.asmx/GetProvinceWarehouse";
        action.Done = function (res) {
            console.log(res);
            var data = res.d;
            var result = {};
            for (x in data) {
                result[data[x].name] = [data[x].lot, data[x].lat];
            }
            //全省城市坐标
            citys = result;

            citysTrunk = [];
            var action = new Action();
            action.ActionData = JSON.stringify({ province: selectedProvince });
            action.ActionUrl = "/echartService.asmx/GetProvinceTransport";
            action.Done = function (res) {
                console.log(res);
                citysTrunk = res.d;


                SetCitySeries(selectedProvince, "全省");


                var cityTrunkList = ["全省"];
                for (var x in citysTrunk) {
                    cityTrunkList.push(citysTrunk[x].name);
                }
                SetLegend(cityTrunkList);

                myChart.hideLoading();

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
    myChinaChart.setOption(option);

}
//返回按钮
$(".box").on("click", ".back", function () {
    var animate = new Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    //销毁全国总仓视图
    myChinaChart.dispose();
    myChart.dispose();
    $("#minor").css("display", "none");
    $(".back").removeClass("show");
    //重新渲染全省总仓视图
    SetOption("全国");

    var trunkList = ["全国"];
    for (var x in provincesTrunk) {
        trunkList.push(provincesTrunk[x].name);
    }
    SetLegend(trunkList);

    $(".box").off("change", "#legend");
    $(".box").on("change", "#legend", function () {
        var animate = new Animate();
        animate.ClearWaybillbox();
        animate.ClearDetailsbox();
        var _seriesName = $(this).val();
        var _option = myChart.getOption();
        _option.series = SetSeries(_seriesName);
        /*        _option.legend = {
                    show: false,
                    orient: 'vertical',
                    x: 'left',
                    data: [_seriesName],
                    selectedMode: 'single',
                    textStyle: {
                        color: '#fff'
                    }
                };*/
        myChart.clear();
        myChart.setOption(_option, true);
    });

});
//订单框动画
var Animate = function () { };
Animate.prototype = {
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
function ShowWaybill(_name) {
    var names = _name.split(">");
    var _firstStation = names[0].Trim(),
        _Terminus = names[1].Trim();
    var _title = "<span class='Highlight'>" + _firstStation + "</span> 至 " + "<span class='Highlight'>" + _Terminus + "</span>";
    $(".waybillList .waybilltitle .statetitle").html(_title);
    $(".waybillList .table .tbody").html("<div><span>获取运单清单中，请稍后...</span></div>");
    var animate = new Animate();
    animate.ClearDetailsbox();
    animate.InitWaybillbox(function () {

        var action = new Action();
        action.ActionData = JSON.stringify({ path: _name });
        action.ActionUrl = "/echartService.asmx/GetTransportOrders";
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
                    html += "<div class='btnclick clearfloat' onclick=\"ShowDetails('" + List[x].NO + "')\"><label title='" + List[x].NO + "'>" + List[x].NO + "</label><label title='" + List[x].mailNO + "'>" + List[x].mailNO + "</label><label title='" + List[x].count + "'>" + List[x].count + "</label><label title='" + List[x].type + "'>" + List[x].type + "</label></div>";
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
CloseWaybill = function () {
    var animate = new Animate();
    animate.ClearWaybillbox();
    animate.ClearDetailsbox();
    //$(".detailsbox").hide(1000);
}
//显示运单详情
ShowDetails = function (_WaybillNo) {
    $(".details").html("获取清单详情中，请稍后...");
    var animate = new Animate();
    animate.InitDetailsbox(function () {
        var action = new Action();
        action.ActionData = JSON.stringify({ order: _WaybillNo });
        action.ActionUrl = "/echartService.asmx/GetTransportOrderInfor";
        action.Done = function (res) {
            console.log(res);
            var data = res.d;
            var details = [];
            for (var x in data) {
                //UnixToDate(,true)
                var _datetime = UnixToDate(data[x].datetime.split("/Date(")[1].split(")/")[0], true);
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
                    details.push({ "date": _date, "days": GetDay(new Date(_date).getDay()), "subDetails": [{ "address": data[x].address, "time": _time, "message": data[x].event }] });
                }
            }
            var result = {};
            result["IsExist"] = false;
            result["details"] = details;
            result.IsExist = true;
            if (!result["details"]) {
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
//关闭运单详情
CloseDetails = function () {
    // $(".details").hide(1000);
    // $(".detailsbox").hide(1000);
    var animate = new Animate();
    animate.ClearDetailsbox();
}
//获取省仓支线
function GetTrunk(_name) {
    var trunk = [];
    if (_name === "全国") {
        trunk = provincesTrunk;
    } else {
        for (var x in provincesTrunk) {
            if (provincesTrunk[x].name === _name) {
                trunk.push(provincesTrunk[x]);
                break;
            }
        }
    }
    return trunk;
}
//获取市仓支线
function GetTrunk2(_name) {
    var trunk = [];
    if (_name === "全省") {
        trunk = citysTrunk;
    } else {
        for (var x in citysTrunk) {
            if (citysTrunk[x].name === _name) {
                trunk.push(citysTrunk[x]);
                break;
            }
        }
    }
    return trunk;
}
//翻译unix时间戳
function UnixToDate(unixTime, isFull) {
    var time = new Date(Number(unixTime));
    var ymdhis = {};
    var _date = "";
    _date += time.getUTCFullYear() + "-";
    _date += (time.getUTCMonth() + 1) + "-";
    _date += time.getUTCDate();
    ymdhis.date = _date;
    if (isFull === true) {
        var _time = ""
        _time += " " + checkTime(time.getUTCHours()) + ":";
        _time += checkTime(time.getUTCMinutes()) + ":";
        _time += checkTime(time.getUTCSeconds());
        ymdhis.time = _time;
    }
    return ymdhis;
}

//封装ajax用户登陆
function Action() {
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

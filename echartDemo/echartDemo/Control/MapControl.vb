Public Class MapControl
    Implements IMapControl

    Private sessionid As String = ""

    ''' <summary>
    ''' 获取全国干线运输信息
    ''' </summary>
    ''' <returns>运输线列表,实线，虚线</returns>
    Public Function GetContryMainTransport(param As FilterData) As Tuple(Of List(Of TransportLine), List(Of TransportLine)) Implements IMapControl.GetContryMainTransport
        Dim result As New Tuple(Of List(Of TransportLine), List(Of TransportLine))(New List(Of TransportLine), New List(Of TransportLine))

        '实线部分
        result.Item1.Add(New TransportLine() With {.from = "北京", .to = "天津", .count = 3000})


        result.Item1.Add(New TransportLine() With {.from = "北京", .to = "天津1", .count = 3000})

        '虚线部分
        result.Item2.Add(New TransportLine() With {.from = "北京", .to = "上海1", .count = 20000})

        '实线部分
        result.Item1.Add(New TransportLine() With {.from = "天津", .to = "上海1", .count = 100})
        result.Item1.Add(New TransportLine() With {.from = "天津", .to = "上海1", .count = 1000})

        result.Item1.Add(New TransportLine() With {.from = "北京", .to = "上海1", .count = 4000})

        '虚线部分
        result.Item2.Add(New TransportLine() With {.from = "天津", .to = "北京", .count = 20000})

        '实线部分
        result.Item1.Add(New TransportLine() With {.from = "上海1", .to = "北京", .count = 2000})

        '虚线部分
        result.Item2.Add(New TransportLine() With {.from = "上海1", .to = "天津", .count = 20000})

        Return result
    End Function

    ''' <summary>
    ''' 获取全国省市仓信息
    ''' </summary>
    ''' <returns>省市仓列表，包括名字，经度和纬度</returns>
    Public Function GetContryWarehouse() As List(Of MapPoint) Implements IMapControl.GetContryWarehouse
        Dim result As New List(Of MapPoint)

        Dim point1 As New MapPoint() With {.name = "上海1", .lot = 121.4648, .lat = 31.3891, .color = "green", .weather = "晴"}
        result.Add(point1)

        Dim point2 As New MapPoint() With {.name = "北京", .lot = 116.4551, .lat = 40.2539, .color = "#000", .weather = "雷阵雨"}
        result.Add(point2)

        Dim point3 As New MapPoint() With {.name = "天津", .lot = 117.4219, .lat = 39.418, .weather = "雨夹雪"}
        result.Add(point3)

        Dim point4 As New MapPoint() With {.name = "天津1", .lot = 117.4219, .lat = 34.418, .weather = "阴"}
        result.Add(point4)

        Return result
    End Function

    Public Function GetFilterData(province As String) As FilterData Implements IMapControl.GetFilterData
        Dim result As New FilterData With {
            .CenterWarehouse = New List(Of String)({"上海1", "北京", "天津"}),
            .ProvinceWarehouse = New List(Of String)({"上海", "北京1", "天津1"}),
            .TransportType = New List(Of String)({"航空", "陆运"}),
            .OrderType = New List(Of String)({"单据一", "单据二", "单据三"}),
            .BrandType = New List(Of String)({"品牌一", "品牌二", "品牌三"}),
            .Material = New List(Of String)({"品牌一", "品牌二", "品牌三"})
        }

        Return result
    End Function

    ''' <summary>
    ''' 获取全省支线运输信息
    ''' </summary>
    ''' <param name="province">省</param>
    ''' <returns>运输线列表，实线，虚线</returns>
    Public Function GetProvinceTransport(province As String, param As FilterData) As Tuple(Of List(Of TransportLine), List(Of TransportLine)) Implements IMapControl.GetProvinceTransport
        Dim result As New Tuple(Of List(Of TransportLine), List(Of TransportLine))(New List(Of TransportLine), New List(Of TransportLine))
        Select Case province
            Case "湖南"
                '实线部分
                result.Item1.Add(New TransportLine() With {.from = "长沙市", .to = "岳阳市", .count = 1000})

                '虚线部分
                result.Item2.Add(New TransportLine() With {.from = "长沙市", .to = "益阳市", .count = 2000})

                '实线部分
                result.Item1.Add(New TransportLine() With {.from = "岳阳市", .to = "益阳市", .count = 300})

                '虚线部分
                result.Item2.Add(New TransportLine() With {.from = "岳阳市", .to = "长沙市", .count = 350})

                '实线部分
                result.Item1.Add(New TransportLine() With {.from = "益阳市", .to = "长沙市", .count = 600})

                '虚线部分
                result.Item2.Add(New TransportLine() With {.from = "益阳市", .to = "岳阳市", .count = 20})
                Exit Select
            Case "湖北"
                '实线部分
                result.Item1.Add(New TransportLine() With {.from = "武汉市", .to = "十堰市", .count = 30})

                '虚线部分
                result.Item2.Add(New TransportLine() With {.from = "武汉市", .to = "襄樊市", .count = 20})

                '实线部分
                result.Item1.Add(New TransportLine() With {.from = "十堰市", .to = "武汉市", .count = 60})

                '虚线部分
                result.Item2.Add(New TransportLine() With {.from = "十堰市", .to = "襄樊市", .count = 20})

                Exit Select
            Case "贵州"
                '实线部分
                result.Item1.Add(New TransportLine() With {.from = "贵阳市", .to = "遵义市", .count = 30})

                '虚线部分
                result.Item2.Add(New TransportLine() With {.from = "贵阳市", .to = "铜仁地区", .count = 20})
                Exit Select
        End Select

        Return result
    End Function

    ''' <summary>
    ''' 获取省里面的仓库和销售点
    ''' </summary>
    ''' <param name="province">省</param>
    ''' <returns>该省所有的地图点</returns>
    Public Function GetProvinceWarehouse(province As String) As List(Of MapPoint) Implements IMapControl.GetProvinceWarehouse
        Dim result As New List(Of MapPoint)
        Select Case province
            Case "湖南"
                Dim point1 As New MapPoint() With {.name = "长沙市", .lot = 113.0823, .lat = 28.2568}
                result.Add(point1)

                Dim point2 As New MapPoint() With {.name = "岳阳市", .lot = 113.2361, .lat = 29.1357}
                result.Add(point2)

                Dim point3 As New MapPoint() With {.name = "益阳市", .lot = 111.731, .lat = 28.3832}
                result.Add(point3)
                Exit Select
            Case "湖北"
                Dim point1 As New MapPoint() With {.name = "武汉市", .lot = 114.3896, .lat = 30.6628}
                result.Add(point1)

                Dim point2 As New MapPoint() With {.name = "十堰市", .lot = 110.5115, .lat = 32.3877}
                result.Add(point2)

                Dim point3 As New MapPoint() With {.name = "襄樊市", .lot = 111.9397, .lat = 31.9263}
                result.Add(point3)
                Exit Select
            Case "贵州"
                Dim point1 As New MapPoint() With {.name = "贵阳市", .lot = 106.6992, .lat = 26.7682}
                result.Add(point1)

                Dim point2 As New MapPoint() With {.name = "遵义市", .lot = 106.908, .lat = 28.1744}
                result.Add(point2)

                Dim point3 As New MapPoint() With {.name = "铜仁地区", .lot = 108.6218, .lat = 28.0096}
                result.Add(point3)
                Exit Select
        End Select

        Return result
        'Throw New NotImplementedException()
    End Function

    Public Function GetRecords(province As String) As List(Of Record) Implements IMapControl.GetRecords
        Dim result As New List(Of Record)
        result.Add(New Record() With {
            .Color = "#CCC",
            .Message = "中心仓12个"
        })
        result.Add(New Record() With {
            .Color = "#CCC",
            .Message = "省仓33个"
        })
        result.Add(New Record() With {
            .Color = "#C3C",
            .Message = "物流运代312家"
        })
        result.Add(New Record() With {
            .Color = "#C3C",
            .Message = "日均航班44趟"
        })

        Return result
    End Function

    ''' <summary>
    ''' 获取运输单的详细信息
    ''' </summary>
    ''' <param name="orderNO">运输单号</param>
    ''' <returns>时间节点信息</returns>
    Public Function GetTransportOrderInfor(orderNO As String) As OrderInfo Implements IMapControl.GetTransportOrderInfor
        Dim result As New OrderInfo
        Select Case orderNO
            Case "no11010101"
                '订单信息
                result.OrderNO = "no11010101"
                result.ERPNO = "as123123123333"
                result.SaleNO = "12123123"

                '订单过程
                result.OrderProcess.Add((New TimeLine() With {.datetime = New DateTime(2017, 5, 12, 9, 12, 12), .event = "接收订单", .complete = True, .name = "jieshou"}))
                result.OrderProcess.Add((New TimeLine() With {.datetime = New DateTime(2017, 5, 13, 9, 12, 12), .event = "分拣", .complete = True, .name = "fenjian"}))
                result.OrderProcess.Add((New TimeLine() With {.datetime = New DateTime(2017, 5, 13, 9, 12, 12), .event = "包装", .complete = True, .name = "baozhuang"}))
                result.OrderProcess.Add((New TimeLine() With {.datetime = New DateTime(2017, 5, 14, 9, 12, 12), .event = "已出库", .complete = True, .name = "yichuku"}))
                result.OrderProcess.Add((New TimeLine() With {.datetime = Nothing, .event = "签收", .complete = False, .name = "qianshou"}))

                '订单详情-》订单信息
                result.OrderDetail = New OrderDetail() With {
                    .SendWarehouse = "成都D仓",
                    .CreateDateTime = New DateTime(2017, 5, 12, 9, 12, 12),
                    .ERPOrder = "",
                    .ProductGroup = "PPP",
                    .CustomName = "中国移动xxxx",
                    .DestName = "",
                    .Weight = "3.9",
                    .Volume = "0.022",
                    .note = ""
                }

                '订单详情->商品信息
                result.Commodities.Add(New CommodityInfo() With {
                    .Name = "苹果 牛XXX",
                    .Count = "10.0",
                    .Weight = "3.9",
                    .Volume = "0.022"
                })

                '收货人详情
                result.ReciveInfo = New ConsigneeInfo() With {
                    .SendArea = "黑龙江",
                    .GetArea = "",
                    .SendAddress = "哈尔滨师范大学xxxx",
                    .GetAddress = "",
                    .ReciveMan = "谢耀明",
                    .GetMan = "谢xx",
                    .ReciveNum = "13712345678",
                    .GetNum = "",
                    .ServiceType = "标准",
                    .TransportType = "客户自取",
                    .SignType = "本人签收+盖章/非本人签收+身份证号+盖章"
                }

                '在途信息
                result.TransportInfo.Add(New TimeLine() With {.datetime = New DateTime(2017, 5, 12, 9, 12, 12), .address = "北京市三里屯张嘎子家", .event = "接收订单"})
                result.TransportInfo.Add(New TimeLine() With {.datetime = New DateTime(2017, 5, 12, 9, 13, 12), .address = "北京市三里屯张嘎子家", .event = "开始拣货"})
                result.TransportInfo.Add(New TimeLine() With {.datetime = New DateTime(2017, 5, 13, 9, 13, 12), .address = "北京市三里屯张嘎子家", .event = "已发货"})
                result.TransportInfo.Add(New TimeLine() With {.datetime = New DateTime(2017, 5, 14, 9, 13, 12), .address = "北京市三里屯", .event = "收到货物"})
                result.TransportInfo.Add(New TimeLine() With {.datetime = New DateTime(2017, 5, 15, 9, 13, 12), .address = "北京市三里屯张嘎子家", .event = "开始拣货"})
                result.TransportInfo.Add(New TimeLine() With {.datetime = New DateTime(2017, 5, 16, 9, 13, 12), .address = "北京市三里屯张嘎子家", .event = "开始拣货"})
                Exit Select
        End Select
        Return result
    End Function

    ''' <summary>
    ''' 获取一条运输线的全部运输订单
    ''' </summary>
    ''' <param name="[from]">出发地</param>
    ''' <param name="[to]">目的地</param>
    ''' <returns>运输单列表</returns>
    Public Function GetTransportOrders(from As String, [to] As String) As List(Of TransportOrder) Implements IMapControl.GetTransportOrders
        Dim result As New List(Of TransportOrder)
        Select Case from
            Case "北京"
                Select Case [to]
                    Case "天津"
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010101", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "air", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 15, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010102", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "car", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 12, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010103", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "air", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 13, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010104", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "kuaidi", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 10, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        Exit Select
                    Case "上海1"
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010101", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "air", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 13, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010101", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "car", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 10, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        Exit Select
                    Case Else

                End Select
                Exit Select
            Case "长沙市"
                Select Case [to]
                    Case "岳阳市"
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010101", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "kuaidi", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 15, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010102", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "air", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 10, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010103", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "car", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 12, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010104", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "air", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 13, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        Exit Select
                    Case "益阳市"
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010105", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "kuaidi", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 13, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        result.Add(New TransportOrder() With {.warehouse = "130", .NO = "no11010106", .mailNO = "hkahauaia1988djd", .count = 3000, .type = "car", .DeliveryDate = New DateTime(2017, 5, 12, 9, 12, 12), .PlanHours = 10, .UsedHours = 12, .MaterialDesc = "商品描述"})
                        Exit Select
                    Case Else

                End Select
                Exit Select

        End Select

        Return result
    End Function
End Class

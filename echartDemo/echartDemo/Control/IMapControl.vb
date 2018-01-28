''' <summary>
''' 地图接口
''' </summary>
Public Interface IMapControl
    ''' <summary>
    ''' 获取全国省市仓信息
    ''' </summary>
    ''' <returns>省市仓列表，包括名字，经度和纬度</returns>
    Function GetContryWarehouse() As List(Of MapPoint)

    ''' <summary>
    ''' 获取省里面的仓库和销售点
    ''' </summary>
    ''' <param name="province">省</param>
    ''' <returns>该省所有的地图点</returns>
    Function GetProvinceWarehouse(province As String) As List(Of MapPoint)

    ''' <summary>
    ''' 获取全国干线运输信息
    ''' </summary>
    ''' <returns>运输线列表,实线，虚线</returns>
    Function GetContryMainTransport(param As FilterData) As Tuple(Of List(Of TransportLine), List(Of TransportLine))

    ''' <summary>
    ''' 获取全省支线运输信息
    ''' </summary>
    ''' <param name="province">省</param>
    ''' <returns>运输线列表，实线，虚线</returns>
    Function GetProvinceTransport(province As String, param As FilterData) As Tuple(Of List(Of TransportLine), List(Of TransportLine))

    ''' <summary>
    ''' 获取一条运输线的全部运输订单
    ''' </summary>
    ''' <param name="[from]">出发地</param>
    ''' <param name="[to]">目的地</param>
    ''' <returns>运输单列表</returns>
    Function GetTransportOrders([from] As String, [to] As String) As List(Of TransportOrder)

    ''' <summary>
    ''' 获取运输单的详细信息
    ''' </summary>
    ''' <param name="orderNO">运输单号</param>
    ''' <returns>时间节点信息</returns>
    Function GetTransportOrderInfor(orderNO As String) As OrderInfo

    ''' <summary>
    ''' 获取筛选调整
    ''' </summary>
    ''' <param name="province">省，需要全国的时候，传入“全国”</param>
    ''' <returns></returns>
    Function GetFilterData(province As String) As FilterData

    ''' <summary>
    ''' 获取记录
    ''' </summary>
    ''' <returns></returns>
    Function GetRecords(province As String) As List(Of Record)
End Interface

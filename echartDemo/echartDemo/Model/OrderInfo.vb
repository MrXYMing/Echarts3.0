Imports Microsoft.VisualBasic

''' <summary>
''' 订单详细
''' </summary>
Public Class OrderInfo

    ''' <summary>
    ''' 订单编号
    ''' </summary>
    Public OrderNO As String = ""

    ''' <summary>
    ''' ERP单号
    ''' </summary>
    Public ERPNO As String = ""

    ''' <summary>
    ''' 销售单号
    ''' </summary>
    Public SaleNO As String = ""

    ''' <summary>
    ''' 订单过程
    ''' </summary>
    Public OrderProcess As New List(Of TimeLine)

    ''' <summary>
    ''' 订单详情
    ''' </summary>
    Public OrderDetail As OrderDetail

    ''' <summary>
    ''' 商品信息
    ''' </summary>
    Public Commodities As New List(Of CommodityInfo)

    ''' <summary>
    ''' 收货人详细
    ''' </summary>
    Public ReciveInfo As ConsigneeInfo

    ''' <summary>
    ''' 在途详情
    ''' </summary>
    Public TransportInfo As New List(Of TimeLine)
End Class

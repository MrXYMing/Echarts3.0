Imports Microsoft.VisualBasic

''' <summary>
''' 订单详细
''' </summary>
Public Class OrderDetail
    ''' <summary>
    ''' 发货仓库
    ''' </summary>
    Public SendWarehouse As String = ""

    ''' <summary>
    ''' 创建时间
    ''' </summary>
    Public CreateDateTime As DateTime

    ''' <summary>
    ''' ERP订单号
    ''' </summary>
    Public ERPOrder As String = ""

    ''' <summary>
    ''' 产品组
    ''' </summary>
    Public ProductGroup As String = ""

    ''' <summary>
    ''' 客户名称
    ''' </summary>
    Public CustomName As String = ""

    ''' <summary>
    ''' 送达方名称
    ''' </summary>
    Public DestName As String = ""

    ''' <summary>
    ''' 总重量
    ''' </summary>
    Public Weight As String = ""

    ''' <summary>
    ''' 总体积
    ''' </summary>
    Public Volume As String = ""

    ''' <summary>
    ''' 备注
    ''' </summary>
    Public note As String = ""
End Class

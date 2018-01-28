Imports Microsoft.VisualBasic

''' <summary>
''' 筛选条件数据
''' 商品代码、时效为输入的类型，不由后面提供
''' </summary>
Public Class FilterData
    ''' <summary>
    ''' 中心仓库
    ''' </summary>
    Public CenterWarehouse As List(Of String) = New List(Of String)()

    ''' <summary>
    ''' 省仓
    ''' </summary>
    Public ProvinceWarehouse As List(Of String) = New List(Of String)()

    ''' <summary>
    ''' 运输类型
    ''' 运输类型如果固定为航运和陆运，这个属性忽略
    ''' </summary>
    Public TransportType As List(Of String) = New List(Of String)()

    ''' <summary>
    ''' 单据类型
    ''' </summary>
    Public OrderType As List(Of String) = New List(Of String)()

    ''' <summary>
    ''' 品牌类型
    ''' </summary>
    Public BrandType As List(Of String) = New List(Of String)()

    ''' <summary>
    ''' 商品编号
    ''' </summary>
    Public Material As List(Of String) = New List(Of String)()

    ''' <summary>
    ''' 是否超时,0:全部、1：超时、2：未超时
    ''' </summary>
    Public TimeOut As Integer = 0
End Class

''' <summary>
''' 运单
''' </summary>
Public Class TransportOrder

    ''' <summary>
    ''' 仓库号
    ''' </summary>
    Public warehouse As String

    ''' <summary>
    ''' 运单编号
    ''' </summary>
    Public NO As String

    ''' <summary>
    ''' 快递单号
    ''' </summary>
    Public mailNO As String

    ''' <summary>
    ''' 数量
    ''' </summary>
    Public count As Integer

    ''' <summary>
    ''' 运输方式
    ''' </summary>
    Public type As String

    ''' <summary>
    ''' 发货时间
    ''' </summary>
    Public DeliveryDate As Date

    ''' <summary>
    ''' 计划用时（小时），承诺用时
    ''' </summary>
    Public PlanHours As Integer

    ''' <summary>
    ''' 当前用时
    ''' </summary>
    Public UsedHours As Integer

    ''' <summary>
    ''' 商品描述
    ''' </summary>
    Public MaterialDesc As String
End Class

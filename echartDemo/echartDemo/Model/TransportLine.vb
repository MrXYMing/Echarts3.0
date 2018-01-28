''' <summary>
''' 运输线
''' </summary>
Public Class TransportLine
    ''' <summary>
    ''' 起点
    ''' </summary>
    Public [from] As String

    ''' <summary>
    ''' 终点
    ''' </summary>
    Public [to] As String

    ''' <summary>
    ''' 数量
    ''' </summary>
    Public count As String
End Class

''' <summary>
''' 运输线
''' </summary>
Public Class TransportLineEx
    ''' <summary>
    ''' 起点
    ''' </summary>
    Public name As String

    Public solid As New List(Of TransportLine)

    Public dot As New List(Of TransportLine)
End Class

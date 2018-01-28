''' <summary>
''' 仓库
''' </summary>
Public Class MapPoint

    ''' <summary>
    ''' 仓库名称
    ''' </summary>
    Public name As String

    ''' <summary>
    ''' 经度
    ''' </summary>
    Public lot As Double

    ''' <summary>
    ''' 维度
    ''' </summary>
    Public lat As Double

    ''' <summary>
    ''' 中心仓指定的显示颜色
    ''' 颜色为空标识为：非中心仓库
    ''' </summary>
    Public color As String = ""
    ''' <summary>
    ''' 天气描述
    ''' </summary>
    Public weather As String = ""

End Class

Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports System.ComponentModel
Imports Newtonsoft.Json

' 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消注释以下行。
<System.Web.Script.Services.ScriptService()>
<System.Web.Services.WebService(Namespace:="http://tempuri.org/")> _
<System.Web.Services.WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<ToolboxItem(False)> _
Public Class echartService
    Inherits System.Web.Services.WebService

    Private Sub WriteResult(data As Object)
        Context.Response.Charset = System.Text.Encoding.UTF8.EncodingName
        Context.Response.ContentEncoding = System.Text.Encoding.UTF8
        Context.Response.Write(JsonConvert.SerializeObject(data))
        Context.Response.End()
    End Sub

    <WebMethod()>
    Public Function GetContryWarehouse() As List(Of MapPoint)
        Dim control As New MapControl()
        'WriteResult(control.GetContryWarehouse())
        Return control.GetContryWarehouse()
    End Function

    <WebMethod()>
    Public Function GetContryMainTransport(param As FilterData) As List(Of TransportLineEx)
        Dim control As New MapControl()
        Dim lines = control.GetContryMainTransport(param)
        Dim dic As New Dictionary(Of String, Tuple(Of List(Of TransportLine), List(Of TransportLine)))
        For Each line In lines.Item1
            Dim key As String = line.from.Trim()
            If dic.ContainsKey(key) Then
                dic(key).Item1.Add(line)
            Else
                dic.Add(key, New Tuple(Of List(Of TransportLine), List(Of TransportLine))(New List(Of TransportLine)(), New List(Of TransportLine)()))
                dic(key).Item1.Add(line)
            End If
        Next

        For Each line In lines.Item2
            Dim key As String = line.from.Trim()
            If dic.ContainsKey(key) Then
                dic(key).Item2.Add(line)
            Else
                dic.Add(key, New Tuple(Of List(Of TransportLine), List(Of TransportLine))(New List(Of TransportLine)(), New List(Of TransportLine)()))
                dic(key).Item2.Add(line)
            End If
        Next

        Dim result As New List(Of TransportLineEx)

        For Each name As String In dic.Keys
            Dim line As New TransportLineEx() With {.name = name}
            For Each sline In dic(name).Item1
                line.solid.Add(sline)
            Next

            For Each dline In dic(name).Item2
                line.dot.Add(dline)
            Next
            result.Add(line)
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function GetProvinceWarehouse(province As String) As List(Of MapPoint)
        Dim control As New MapControl()
        'WriteResult(control.GetProvinceWarehouse(province))
        Return control.GetProvinceWarehouse(province)
    End Function

    <WebMethod()>
    Public Function GetProvinceTransport(province As String, param As FilterData) As List(Of TransportLineEx)
        Dim control As New MapControl()
        Dim lines = control.GetProvinceTransport(province, param)
        Dim dic As New Dictionary(Of String, Tuple(Of List(Of TransportLine), List(Of TransportLine)))
        For Each line In lines.Item1
            Dim key As String = line.from.Trim()
            If dic.ContainsKey(key) Then
                dic(key).Item1.Add(line)
            Else
                dic.Add(key, New Tuple(Of List(Of TransportLine), List(Of TransportLine))(New List(Of TransportLine)(), New List(Of TransportLine)()))
                dic(key).Item1.Add(line)
            End If
        Next

        For Each line In lines.Item2
            Dim key As String = line.from.Trim()
            If dic.ContainsKey(key) Then
                dic(key).Item2.Add(line)
            Else
                dic.Add(key, New Tuple(Of List(Of TransportLine), List(Of TransportLine))(New List(Of TransportLine)(), New List(Of TransportLine)()))
                dic(key).Item2.Add(line)
            End If
        Next

        Dim result As New List(Of TransportLineEx)

        For Each name As String In dic.Keys
            Dim line As New TransportLineEx() With {.name = name}
            For Each sline In dic(name).Item1
                line.solid.Add(sline)
            Next

            For Each dline In dic(name).Item2
                line.dot.Add(dline)
            Next
            result.Add(line)
        Next

        Return result
    End Function

    <WebMethod()>
    Public Function GetTransportOrders(path As String) As List(Of TransportOrder)
        Dim ps = path.Split(">")
        Dim from As String = ps(0).Trim()
        Dim [to] As String = ps(1).Trim()

        Dim control As New MapControl()
        'WriteResult(control.GetTransportOrders(from, [to]))
        Return control.GetTransportOrders(from, [to])
    End Function

    <WebMethod()>
    Public Function GetTransportOrderInfor(order As String) As OrderInfo
        Dim control As New MapControl()
        'WriteResult(control.GetTransportOrderInfor(order))
        Return control.GetTransportOrderInfor(order)
    End Function

    <WebMethod()>
    Public Function GetRecords(province As String) As List(Of Record)
        Dim control As New MapControl()
        Return control.GetRecords(province)
    End Function

    <WebMethod()>
    Public Function GetFilterData(province As String) As FilterData
        Dim control As New MapControl()
        Return control.GetFilterData(province)
    End Function
End Class
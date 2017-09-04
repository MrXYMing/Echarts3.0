 /** 订单详细*/
    OrderInfo: function (data) {
        data = data || {};
        /** 订单信息*/
        this.OrderInfo = {
            /**订单编号 */
            OrderNO: data.OrderNO || "",
            /**ERP单号 */
            ERPNO: data.ERPNO || "",
            /**销售单号 */
            SaleNO: data.SaleNO || ""
        };
        //var _OrderProcess = data.OrderProcess || {};
        /** 订单过程*/
        this.OrderProcess = {
            /**时间 */
            datetime: null,
            /**地址 */
            address: "",
            /**事件 */
            event: "",
            /**是否完成 */
            complete: null
        };
        var _OrderDetail = data.OrderDetail || {};
        /** 订单详情*/
        this.OrderDetail = {
            /**发货仓库 */
            SendWarehouse: _OrderDetail.SendWarehouse || "",
            /**创建时间 */
            CreateDateTime: _OrderDetail.CreateDateTime || null,
            /**ERP订单号 */
            ERPOrder: _OrderDetail.ERPOrder || "",
            /**产品组 */
            ProductGroup: _OrderDetail.ProductGroup || "",
            /**客户名称 */
            CustomName: _OrderDetail.CustomName || "",
            /**送达方名称 */
            DestName: _OrderDetail.DestName || null,
            /**总重量 */
            Weight: _OrderDetail.Weight || "",
            /**总体积 */
            Volume: _OrderDetail.Volume || "",
            /**备注 */
            note: _OrderDetail.note || ""
        };
        //var _Commodities = data.Commodities || {};
        /** 商品信息*/
        this.Commodities = {
            /**商品名称 */
            Name: "",
            /**数量 */
            Count: "",
            /**重量 */
            Weight: "",
            /**体积 */
            Volume: "",
        };
        var _ReciveInfo = data.ReciveInfo || {};
        /** 收货人详细*/
        this.ReciveInfo = {
            /**送达省市区 */
            SendArea: _OrderDetail.SendArea || "",
            /**提货省市区 */
            GetArea: _OrderDetail.GetArea || "",
            /**送达地址 */
            SendAddress: _OrderDetail.SendAddress || "",
            /**提货地址 */
            GetAddress: _OrderDetail.GetAddress || "",
            /**收货联系人 */
            ReciveMan: _OrderDetail.ReciveMan || "",
            /**提货联系人 */
            GetMan: _OrderDetail.GetMan || null,
            /**收货人电话 */
            ReciveNum: _OrderDetail.ReciveNum || "",
            /**提货人电话 */
            GetNum: _OrderDetail.GetNum || "",
            /**服务级别 */
            ServiceType: _OrderDetail.ServiceType || "",
            /**运输方式 */
            TransportType: _OrderDetail.TransportType || "",
            /**签收标准 */
            SignType: _OrderDetail.SignType || null
        };
        //var _TransportInfo = data.TransportInfo || {};
        /** 在途详情*/
        this.TransportInfo = {
            /**时间 */
            datetime: null,
            /**地址 */
            address: "",
            /**事件 */
            event: "",
            /**是否完成 */
            complete: null
        };
    },
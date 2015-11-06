/**
 * Created by zhaozl on 2015/11/4.
 */
var fixTable = (function() {

    // 初始化
    // padding:表示浏览器窗口减去表格高度后的空余高度
    var initFixTable = function(tableObj, padding) {

        // 渲染新表头
        var headerObj = _initNewHeader(tableObj);

        // 根据浏览器窗口调整表格高度(必须先设置高度再计算表头宽度，因为可能出现的滚动条会影响宽度的计算)
        _setHeight(tableObj, padding);

        // 计算表头宽度
        recalculateHeader(tableObj);

        $(window).resize(function() {
            setTimeout(function() {

                // 根据浏览器窗口调整表格高度
                _setHeight(tableObj, padding);

                // 计算表头宽度
                recalculateHeader(tableObj);
            }, 200);
        });
    };

    // 初始化新表头
    var _initNewHeader = function(tableObj) {

        // 通过第一行的td设置最小宽度
        var tds = tableObj.contents().find("tr").eq(1).children("td");

        // 创建新表头
        var headerWrapper = document.createElement("div");
        headerWrapper.className = "ft-th-wrapper clearfix";

        // 最小总宽度
        var totalWidth = 0;

        // 原始表头
        var oriThs = tableObj.contents().find("tr").eq(0).children("th");

        // 根据原始表头的信息生成新表头
        for (var i = 0; i < oriThs.length; i++) {

            // 复制原始表头的信息
            var newTh = document.createElement("div");
            $(newTh).html($(oriThs[i]).html());
            $(headerWrapper).append(newTh);

            // 根据原始表头配置的min-width配置表格的最小宽度
            var tmpWidth = $(oriThs[i]).attr("min-width");
            tds.eq(i).css("min-width", tmpWidth);

            // 累计计算min-width得出表格的最小宽度
            totalWidth += parseInt(tmpWidth.slice(0, -2));
        }

        // 渲染新表头
        tableObj.before(headerWrapper);

        // 删除原始表头
        oriThs.eq(0).closest("tr").remove();

        // 创建滚动div
        var scrollObj = document.createElement("div");
        scrollObj.className = "ft-table-wrapper";
        $(scrollObj).html(tableObj[0]);

        // 设置滚动区域最小总宽度为min-width总和 + 50
        $(scrollObj).css("min-width", totalWidth + 50 + "px");

        // 渲染滚动div
        $(headerWrapper).after(scrollObj);

        return $(headerWrapper);
    };

    // 根据浏览器窗口调整表格高度
    var _setHeight = function(tableObj, padding) {
        var height = $(window).height() - padding;
        if (height < 100) {
            height = 100;
        }

        tableObj.parent().css("height", height + "px");
    };

    // 计算表头宽度
    var recalculateHeader = function(tableObj) {
        var ths = tableObj.parent().prev().children("div");
        var tds = tableObj.contents().find("tr").eq(0).children("td");

        var offset = 0;
        for (var i = 0; i < tds.length; i++) {
            if (i > 0) {
                ths.eq(i).css("left", offset + "px");
            }
            var tmpWidth = tds.eq(i).width() + 16 + 2;
            ths.eq(i).css("width", tmpWidth + "px");
            offset += tmpWidth;
        }
    };

    return {
        initFixTable: initFixTable,
        renderHeader: recalculateHeader
    };
})();
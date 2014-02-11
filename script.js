var element = null;
var output = null;
var loadText = null;
var conTitle = null;
var conHead = null;
 
var rows = 0;
var cols = 1;
 
$(document).ready(function() {
        element = $("#editor");
        output = $("#output");
        loadText = $("#loadText");
        conTitle = $("#tableTitle");
        conHead = document.getElementById("tableHead");
       
        $("#btnClear").click(clear);
        $("#btnLoad").click(load);
        $("#rowAdd").click(addRow);
        $("#rowDel").click(delRow);
        $("#colAdd").click(addCol);
        $("#colDel").click(delCol);
        $("#outputSelect").click(function() { $("#output").focus().select(); });
        $(document).keyup(update);
        $("#tableHead").click(update);
        addRow();
});
 
function addRow() {
        ++rows;
        var text = "<tr id='row_" + rows + "'>";
        for (var i = 1; i <= cols; ++i) {
                text += "<td class='cell' id='cell_" + rows + "_" + i + "'><textarea id='in_" + rows + "_" + i + "'></textarea></td>";
        }
        text += "</tr>";
        element.append(text);
        update();
}
 
function delRow() {
        $("#row_" + rows).remove();
        --rows;
        update();
}
 
function addCol() {
        ++cols;
        for (var i = 1; i <= rows; ++i) {
                $("#row_" + i).append("<td class='cell' id='cell_" + i + "_" + cols + "'><textarea type='text' id='in_" + i + "_" + cols + "'></textarea></td>");
        }
        update();
}
 
function delCol() {
        for (var i = 1; i <= rows; ++i) {
                $("#cell_" + i + "_" + cols).remove();
        }
        --cols;
        update();
}
 
function clear() {
        for (var x = 1; x <= rows; x++) {
                for (var y = 1; y <= cols; y++) {
                        $("#in_" + x + "_" + y).val("");
                }
        }
        conTitle.val("");
        conHead.checked = false;
        element.empty();
        rows = 0;
        cols = 0;
        update();
}
 
function load() {
        element.empty();
        rows = 0;
        cols = 0;
        var data = loadText.val();
        data = data.replace(/\[\/table\]/gi, "");
        var header = data.replace(/\[table=([0-9]+,.+,[01])\].+/gi, "$1");
        data = data.replace(/\[table=[0-9]+,.+,[01]\]/gi, "");
       
        var headerTokens = header.split(",");
        var dataTokens = data.split("[c]");
        conTitle.val(headerTokens[1]);
        conHead.checked = (headerTokens[2] == "1" ? true : false);
        var tempCols = headerTokens[0];
        var tempRows = dataTokens.length / tempCols;
       
        for (var i = 0; i < tempRows; ++i) {
                addRow();
        }
       
        for (var i = 0; i < tempCols; ++i) {
                addCol();
        }
       
        var x = 1;
        var y = 1;
        for (var i = 0; i < dataTokens.length; ++i) {
                $("#in_" + y + "_" + x).val(dataTokens[i]);
                x++;
                if (x == (cols + 1)) {
                        x = 1;
                        y++;
                }
        }
        loadText.val("");
        update();
}
 
function update() {
        output.val(bbcode());
}
 
function bbcode() {
        var text = "[table=" + cols + "," + conTitle.val() + "," + (conHead.checked ? 1 : 0) + "]";
        for (var x = 1; x <= rows; x++) {
                for (var y = 1; y <= cols; y++) {
                        text += $("#in_" + x + "_" + y).val();
                        if (x != rows || y != cols) {
                                text += "[c]";
                        }
                }
        }
        text += "[/table]";
        return text;
}
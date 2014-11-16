/**
 * Created by wl on 14-3-31.
 */
document.write("<script src='js/HTGeodesic.js'></script>");      //调用其他js文件件

var root = null;    //保存树的根
var root1 = null;    //保存树1的根
var root2 = null;    //保存树2的根
var view_root = null; //保存预览的根

var RADIUS = 8;
var HIGH_RADIUS = 8;

function HTModelNode(node) {
    this.ze = new HTCoordE();        //当前的欧几里得坐标
    this.oldZe = new HTCoordE();     //上次变换结束后的欧几里得坐标
    this.sZe = new HTCoordE();       //最初的欧几里得坐标
    this.zs = new HTCoordS();        //屏幕坐标
    this.weight = 1.0;               //每个节点权重为1
    this.globalWeight = 0;           //该节点的总权重（包括子节点）
    this.parent = null;              //HTModelNode父节点
    this.node = node;                //HTNode
    this.isLeaf = false;             //是否为叶节点
    this.children = new Array();     //子节点数组
    this.radius = RADIUS;
    this.text = null;           //节点对应的那段文字
    this.label = null;          //节点的标签 NNP等
    this.highlight = 0;          //节点是否高亮显示,1为高亮节点显示为红色，2为与其相邻节点显示为粉色


    if(root1 == null && arguments[3] != 'view') {
//        alert(this.node.text.split(" ").length);
        this.sMax = arguments[1];
        this.sOrigin = arguments[2];
        root1 = this;
        this.text = new Array();
//        var words = this.node.text.split(" ");
//        for(var i = 0; i < words.length; i++) {
//            this.text[i] = new Array();
//            this.text[i][0] = words[i];
//            this.text[i][1] = 'unfocus';
//        }
    } else if(node.isRoot() && (root2 == null) && arguments[3] != 'view') {
//        alert(this.node.text.split(" ").length);
        this.sMax = arguments[1];
        this.sOrigin = arguments[2];
        root2 = this;
        this.text = new Array();
//        var words = this.node.text.split(" ");
//        for(var i = 0; i < words.length; i++) {
//            this.text[i] = new Array();
//            this.text[i][0] = words[i];
//            this.text[i][1] = 'unfocus';
//        }
    } else if(arguments[3] == 'view') {
        this.sMax = arguments[1];
        this.sOrigin = arguments[2];
        view_root = this;
    } else {
        if(view_root != null) {
            this.sMax = view_root.sMax;
            this.sOrigin = view_root.sOrigin;
        } else {
            this.sMax = root1.sMax;
            this.sOrigin = root1.sOrigin;
        }

    }

    if(this.node.children.length == 0) {
        if(root2 == null) {
            root1.text[this.node.order] = new Array();
            root1.text[this.node.order][0] = this.node.name;
            root1.text[this.node.order][1] = 'unfocus';
        } else {
            root2.text[this.node.order] = new Array();
            root2.text[this.node.order][0] = this.node.name;
            root2.text[this.node.order][1] = 'unfocus';
        }
//        root.text[this.node.order][2] = 'error';
//        root.text[this.node.order][3] = '0';
    }

//    if(this.node.error == 1 && view_root == null) {  //标记句子中出错的单词
//        root.text[this.node.order-1][2] = 'error';
//    }

    var childNode = null;
    var child = null;
    var count = this.node.children.length;  //HTNode节点的子节点个数
//    console.log(this.node.children);
    for (var i = 0; i < count; i++) {
        childNode = node.children[i];
        if (childNode.isLeaf()) {
            child = new HTModelNode(childNode);
            child.setParent(this);
            child.isLeaf = true;
        } else {
            child = new HTModelNode(childNode);
            child.isLeaf = false;
            child.setParent(this);
        }
        this.children.push(child);
    }

    this.computeWeight = function() {
        var child = null;
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            child = this.children[i];
            this.globalWeight += child.getWeight();
        }
        if (this.globalWeight != 0.0) {
            this.weight += Math.log(this.globalWeight);
        }
    }

    // here the down of the tree is built, so we can compute the weight
    this.computeWeight();       //计算该节点的权重

    this.findNode = function(/*HTCoordS*/ zs, isfind) {
        if(this.parent == null) {
            root = this;
        }
        if(this.zs.getDistance(zs) <= this.radius) {
            root.clearFocus();
            root.clearHighlight();
            this.focus(root);    //上面的句子中高亮显示
            this.highLight();//节点高亮显示
            root.drawText(textDiv);
            isfind.flag = true;
        } else {
            for (var i = 0; i < count; i++) {
                var childNode = this.children[i];
                childNode.findNode(zs, isfind);
            }
        }
    }


    this.highLight = function() {
        this.highlight = 1;
//        root.text[this.node.order-1][3] = '1';
//        if(this.parent != null) {
//            this.parent.highlight = 2;
//            root.text[this.parent.node.order-1][3] = '2';
//        }
//        var nc = this.children.length;
//        for(var i = 0; i < nc; i++) {
//            var childNode = this.children[i];
//            childNode.highlight = 2;
//            root.text[childNode.node.order-1][3] = '2';
//        }
    }

    this.clearHighlight = function() {
        this.highlight = 0;
        var nc = this.children.length;
        for(var i = 0; i < nc; i++) {
            var childNode = this.children[i];
            childNode.clearHighlight();
        }
    }

    this.focus = function(root) {
        var nc = this.children.length;
        if(nc == 0) {
            root.text[this.node.order][1] = 'focus';
        } else {
            for(var i = 0; i < nc; i++) {
                var childNode = this.children[i];
                childNode.focus(root);
            }
        }
    }

    this.clearFocus = function() {
        for(var i = 0; i < this.text.length; i++) {
            if(this.text[i] != null) {
                this.text[i][1] = 'unfocus';
            }
        }
    }


    this.drawText = function(textDiv) {
//        console.log(root.text);
        var text = '';
        for(var i = 0; i < this.text.length; i++) {
            if(this.text[i] != undefined) {
                var isFocus = this.text[i][1] == 'focus';
//            var isError = root.text[i][2] == 'error';
//            var isHighlight = root.text[i][3];
                var style = "";
                if(isFocus) {
                    style += "font-weight: bold;";
                    style += "color: red;";
                }
//            if(isError) {
//                style += "font-size: 28px;";
//            }
//            if(isHighlight == 1) {
//                style += "color: red;";
//            } else if(isHighlight == 2) {
//                style += "color: pink;";
//            }
//            if(style == '') {
//                style = "color: black;font-weight: normal";
//            }
                text += '<span style="'+style+'">'+this.text[i][0]+'</span> ';
            }
        }
        textDiv.innerHTML = text;

    }

    this.restoreLayout = function() {
        this.ze.copy(this.sZe);
        this.zs.projectionEtoS(this.ze, this.sOrigin, this.sMax);
        this.oldZe.copy(this.sZe);
        if(this.isLeaf)
            return;
        var child = null;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.restoreLayout();
        }
    }

    this.restore = function() {
        this.restoreLayout();
        this.init_translate();
    }

    this.init_translate = function() {
        var zs = new HTCoordE(); // starting point of dragging
        var ze   = new HTCoordE(); // ending point of dragging
        zs.x = 0.02;   //越小越往右移动
        zs.y = -0.3;
        ze.x = 0;
        ze.y = 0.1;     //偏移初始布局
        var zo = new HTCoordE();
        zo.setE(this.oldZe.x, this.oldZe.y);
        zo.x = -zo.x;
        zo.y = -zo.y;
        var zs2 = new HTCoordE();
//            zs2.setE(zs.x, zs.y);
        zs2.copy(zs);
        zs2.translate(zo);

        var t = new HTCoordE();
        var de = ze.d2();
        var ds = zs2.d2();
        var dd = 1.0 - de * ds;
        t.x = (ze.x * (1.0 - ds) - zs2.x * (1.0 - de)) / dd;
        t.y = (ze.y * (1.0 - ds) - zs2.y * (1.0 - de)) / dd;

        if (t.isValid()) {
            var to = new HTTransformation();
            to.composition(zo, t);

            this.transform(to);
//            this.drawTree(cxt, 0);
        }
        this.endTranslation();
    }

    this.translate = function(/*HTCoordE*/ zs, /*HTCoordE*/ ze, cxt) {
        var zo = new HTCoordE();
        zo.setE(this.oldZe.x, this.oldZe.y);
        zo.x = -zo.x;
        zo.y = -zo.y;
        var zs2 = new HTCoordE();
//            zs2.setE(zs.x, zs.y);
        zs2.copy(zs);
        zs2.translate(zo);

        var t = new HTCoordE();
        var de = ze.d2();
        var ds = zs2.d2();
        var dd = 1.0 - de * ds;
        t.x = (ze.x * (1.0 - ds) - zs2.x * (1.0 - de)) / dd;
        t.y = (ze.y * (1.0 - ds) - zs2.y * (1.0 - de)) / dd;

        if (t.isValid()) {
            var to = new HTTransformation();
            to.composition(zo, t);

            this.transform(to);
            this.drawTree(cxt, 0);
        }
    }

    this.endTranslation = function() {  //拖拽结束后记录最终坐标
        this.oldZe.copy(this.ze);
        if(this.isLeaf)
            return;
        var child = null;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.endTranslation();
        }
    }

    this.transform = function(t) {
        this.ze.copy(this.oldZe);
        this.ze.transform(t);
        this.zs.projectionEtoS(this.ze, this.sOrigin, this.sMax);
        if(this.isLeaf)
            return;
        var child = null;
        for (var i = 0; i < this.children.length; i++) {
            child = this.children[i];
            child.transform(t);
        }
    }

    this.drawLine = function(cxt) {
        //先画线
        var count = this.children.length;
        for(var i = 0; i < count; i++) {
            var child = this.children[i];

            var g = new HTGeodesic(this.ze, child.ze);
//            if(child.node.error == 1) {
//                g.error = true;         //出错，error为true
//            }
            g.refreshScreenCoordinates(this.sOrigin, this.sMax);
            cxt.strokeStyle = "black";
            g.draw(cxt);
            child.drawLine(cxt);
        }
    }

    this.drawTree = function(cxt, n) {    //d3.js
        if(n == 0) {    //先画线，避免线显示在节点上面
            this.drawLine(cxt);
        }

        //下面是清除节点处的弧线
        cxt.beginPath();
        cxt.fillStyle = "#f0f8ff";
        cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
        cxt.closePath();
        cxt.fill();

        //再画点
//        cxt.fillStyle = "black";
        cxt.fillStyle = "rgb(50,50,50)";
        this.radius = RADIUS;
//        if(this.node.error == 1) {
//            cxt.fillStyle = "blue";
//            this.radius = 6;
//        }
        if(this.highlight == 1) {
            cxt.fillStyle = "red";
            this.radius = HIGH_RADIUS;
            cxt.beginPath();
            cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
            cxt.closePath();
            cxt.fill();
            cxt.fillText(this.node.name, this.zs.x + 12, this.zs.y);
            cxt.fillStyle = "white";
            this.drawIndex(cxt);
        } else {
            cxt.fillText(this.node.name, this.zs.x + 12, this.zs.y);
            this.drawIndex(cxt);
        }
        cxt.strokeStyle = "black";
        cxt.beginPath();
        cxt.arc(this.zs.x, this.zs.y, this.radius, 0, 2 * Math.PI, true);
        cxt.closePath();
        cxt.stroke();
        cxt.fillStyle = "black";
        var count = this.children.length;
        for(var i = 0; i < count; i++) {
            var child = this.children[i];
            n++;
            child.drawTree(cxt, n);
        }
    }

    this.drawIndex = function(cxt) {
        if(this.node.order > 9) {   //两位数
            cxt.fillText(this.node.order, this.zs.x-6, this.zs.y+4);
        } else {    //一位数
            cxt.fillText(this.node.order, this.zs.x-3, this.zs.y+4);
        }

    }

    this.layoutHyperbolicTree = function() {
//        this.layout(0.0, Math.PI, model.getLength());
//        this.layout(0.0, Math.PI, 0.3);
        this.layout(-Math.PI / 2, Math.PI / 2, 0.3);
        this.init_translate();
    }

    this.layout = function(angle, width, length) {
        this.ze.x = 0;
        this.ze.y = 0;
        // Nothing to do for the root node
        if (this.parent != null) {  //不是根节点
            var zp = this.parent.getCoordinates();

            // We first start as if the parent was the origin.
            // We still are in the hyperbolic space.
            this.ze.x = length * Math.cos(angle);
            this.ze.y = length * Math.sin(angle);

            // Then translate by parent's coordinates
            this.ze.translate(zp);

            if(this.parent.parent == root1) {
                var u1, u2, v1, v2, A, B;
                u1 = zp.x;
                u2 = zp.y;
                v1 = this.ze.x;
                v2 = this.ze.y;
                A = (u2*(Math.pow(v1,2)+Math.pow(v2,2))-v2*(Math.pow(u1,2)+Math.pow(u2,2))+u2-v2)/(u1*v2-u2*v1);
                B = (v1*(Math.pow(u1,2)+Math.pow(u2,2))-u1*(Math.pow(v1,2)+Math.pow(v2,2))+v1-u1)/(u1*v2-u2*v1);
                var O1 = -A/2;
                var O2 = -B/2;
                var x1 = u1 - O1;
                var y1 = u2 - O2;
                var x2 = v1 - O1;
                var y2 = v2 - O1;
                var arg1 = (x1*x2+y1*y2)/(Math.sqrt(Math.pow(x1,2)+Math.pow(y1,2))*Math.sqrt(Math.pow(x2,2)+Math.pow(y2,2)));
                var arg = Math.acos(arg1);
                var r = Math.sqrt(Math.pow(A,2)+Math.pow(B,2)-4) / 2;
                var len = arg * r;
            }
        }
        this.zs.projectionEtoS(this.ze, this.sOrigin, this.sMax);
        this.oldZe.copy(this.ze);
        this.sZe.copy(this.ze);

        if(!this.isLeaf) {  //不是叶节点
            if (this.parent != null) {  //不是根节点
                // Compute the new starting angle
                // e(i a) = T(z)oT(zp) (e(i angle))
                var a = new HTCoordE();
                a.setE(Math.cos(angle), Math.sin(angle));
                var nz = new HTCoordE();
                nz.setE(- this.ze.x, - this.ze.y);
                a.translate(this.parent.getCoordinates());
                a.translate(nz);
                angle = a.arg();

                // Compute the new width
                // e(i w) = T(-length) (e(i width))
                // decomposed to do it faster :-)
                var c = Math.cos(width);
                var A = 1 + length * length;
                var B = 2 * length;
                width = Math.acos((A * c - B) / (A - B * c));
            }

            var child = null;
            var nbrChild = this.children.length;
//            var l1 = (0.95 - model.getLength());
            var l1 = (0.95 - 0.3);
            var l2 = Math.cos((20.0 * Math.PI) / (2.0 * nbrChild + 38.0));
//           length = model.getLength() + (l1 * l2);
            length = 0.3 + (l1 * l2);
//            length = 0.5;

            var startAngle = angle - width;

            for (var i = 0; i < nbrChild; i++) {
                child = this.children[i];

                var percent = child.getWeight() / this.globalWeight;
                var childWidth = width * percent;
                var childAngle = startAngle + childWidth;
                child.layout(childAngle, childWidth, length);
                startAngle += 2.0 * childWidth;
            }
        }
    }

    this.setParent = function(parent) {
        this.parent = parent;
    }

    this.getParent = function() {
        return this.parent;
    }

    this.getNode = function() {
        return this.node;
    }

    this.getName = function() {
        return this.node.name;
    }

    this.getWeight = function() {
        return this.weight;
    }

    this.getCoordinates = function() {
        return this.ze;
    }
}

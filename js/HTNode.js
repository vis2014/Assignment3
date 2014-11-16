/**
 * Created by wl on 14-3-31.
 */
function HTNode(json) {
    this.name = json.name;

    this.order = json.order;
 //   this.error = json.error;
    this.text = null;
    if(json.text != null) {
        this.text = json.text;
    }
    this.children = new Array();

    var len = json.children.length;
    for(var i = 0; i < len; i++) {
        var child = new HTNode(json.children[i]);
//        alert(child.name);
        this.children.push(child);
    }

//    console.log(this.children.length);

    this.isLeaf = function() {
        return (this.children.length == 0);
    }

    this.isRoot = function() {
        return (this.order == 1);
    }
}

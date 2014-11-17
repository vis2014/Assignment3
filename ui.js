/*****Created by gjy on 2014/11/1.*****/
var $current=$("#outerBlock_04");
var $window=$(window);
var $btnPrev=$("#btnPrev");
var $btnNext=$("#btnNext");
var $allBlocks=$(".picBlock");
var $busy=false;
var funNotBusy=function(){
    $busy=false;
};

$window.load(function () {
    $current.addClass("current");
    $current.next().addClass("nearCurrent");
    $current.prev().addClass("nearCurrent");
});
var funScrollBackward=function () {
    //$(".picBlock").animate({left:"-=11.11%"},"fast","swing");
    if($busy){
        return;
    }
    $busy=true;
    $allBlocks.animate({left:"+=14.2857%"},100,"linear",funNotBusy);
    $current=$current.prev();
    if($btnNext.attr("disabled")){
        $btnNext.removeAttr("disabled");
    }
    if($current.prev().hasClass("edge")){
        $btnPrev.attr("disabled","disabled");
    }
    $current.removeClass("nearCurrent").addClass("current");
    $current.next().removeClass("current").addClass("nearCurrent").next().removeClass("nearCurrent");
    $current.prev().addClass("nearCurrent");
};
var funScrollForward=function () {
    if($busy){
        return;
    }
    $busy=true;
    $allBlocks.animate({left:"-=14.2857%"},100,"linear",funNotBusy);
    $current=$current.next();
    if($btnPrev.attr("disabled")){
        $btnPrev.removeAttr("disabled");
    }
    if($current.next().hasClass("edge")){
        $btnNext.attr("disabled","disabled");
    }
    $current.removeClass("nearCurrent").addClass("current");
    $current.prev().removeClass("current").addClass("nearCurrent").prev().removeClass("nearCurrent");;
    $current.next().addClass("nearCurrent");
};


$window.on("mousewheel", function (event) {
    if($busy) {
        return;
    }
    if(event.deltaY>0 && !($btnPrev.attr("disabled"))){
        funScrollBackward();
    }
    else if(event.deltaY<0 && !($btnNext.attr("disabled"))){
        funScrollForward();
    }
});
$btnPrev.click(funScrollBackward);
$btnNext.click(funScrollForward);


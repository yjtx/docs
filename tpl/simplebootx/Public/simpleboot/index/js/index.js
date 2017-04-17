/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function toolsIcon()
{
    $(".tools-transparent").hide();
    $(".tools-icon").hover(function()
    {
        $(".tools-transparent",this).slideToggle(150);
    });
}

function homeSlider()
{
    var demo1 = $("#homeslider").slippry({
        transition: 'fade',
        useCSS: true,
        captions: false,
        speed: 1000,
        pause: 3000,
        auto: true,
        preload: 'visible'
    });
    $("#homeslider").show();
}

function bbsOnload()
{
    var array_li=$("#bbslist").find("dl");
    var html_list="";
    for(var i=0;i<array_li.length;i++)
    {
        var item=$(array_li[i]);
        item_author=item.find("dt").find("em").find("a").html();
        item_author_url=item.find("dt").find("em").find("a").attr("href");
        item_title=item.find("dt").find("em").next().html().substr(0,30);
        item_url=item.find("dt").find("em").next().attr("href");
        item_des=item.find("dd").html().substr(0,12);
        html_list+='<dl><dt><a href="http://bbs.egret.com" class="radius-container">论坛</a><span class="list-text"><a href="'+item_url+'" target="_blank" >'+item_title+'</a></span></dt><dd><span class="list-text-des">作者：'+item_author+'，'+item_des.substr(0,15)+'...</span</dd></dl>'
    }
    $("#bbslist").html("");
    $("#bbscontent").html(html_list);
    $("#bbscontent").show();
}

$(document).ready(function(){
    homeSlider();
    toolsIcon();
    bbsOnload();
});

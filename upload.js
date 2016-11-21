/* 
* @Author: Marte
* @Date:   2016-10-21 18:12:30
* @Last Modified by:   Marte
* @Last Modified time: 2016-11-21 15:06:09
*/
//客户端上传
var loader = document.querySelector('.load-img');
var wrapper = document.querySelector('.img-lists');
loader.addEventListener('change',function () {
    var exists = wrapper.querySelectorAll('li').length;
    var len = this.files.length;
    if((len+exists)>5){
        $(".more_length").removeClass("display-none");
        $(".faq_yes").addClass("display-none");
        $(".faq_no").addClass("display-none");
        return;
    }
    for(var i=0; i<len; i++){
        var reader = new FileReader();
        var type = this.files[i].type;
        var name=this.files[i].name.substr(this.files[i].name.indexOf(".")),
            PICreg = /^(.JPEG|.jpeg|.JPG|.jpg|.PNG|.png|.SVG|.svg)$/;
        if(PICreg.test(name)){
            $(".faq_yes").removeClass('display-none');
            $(".faq_no").addClass('display-none')
        }else{
            $(".faq_yes").addClass('display-none')
            $(".faq_no").removeClass('display-none')
            setTimeout(function(){
                $(".faq_no").addClass('display-none')
            },2000)
            return;
        }
        reader.readAsDataURL(this.files[i]);
        reader.onload=function () {
            var image = new Image();
            image.src = this.result;
            image.onload=function () {
                var cdata = compress(this,0.3);
                //ajax提交后台
               // upload(cdata);
                //预览
                var li = document.createElement('li');
                li.innerHTML = '<img src="'+cdata+'" alt=""><span class="delete"></span>';
                wrapper.appendChild(li);
            };
        };
    }
    function compress(target,scale) {
        var canvas = document.createElement('canvas');
        canvas.className = 'cvs';
        var cvs = canvas.getContext('2d');
        canvas.width = target.width;
        canvas.height = target.height;
        cvs.drawImage(target,0,0,target.width,target.height);
        return canvas.toDataURL(type, scale);
    }
    function upload(imgdata) {
       /* $.post({
            url:'',
            data: imgdata,
            success:function (data) {
                console.log(data)
            },
            error:function (e) {
                console.log(e)
            }
        });*/
         $.ajaxFileUpload({  
            url:'../likes/uploadImg', 
            secureuri:false,  
            fileElementId:"picFile",  //文件选择框的name
            dataType:'json',     
            data:imgdata,//img的 src
            success:function(data,status){ 
                if(status=="success"){
                    alert(data.msg);
                    $(".faqsubmit").val("SUBMIT");
                    $("#textarea-txt").val("");
                    $(".text").removeAttr("disabled");
                    $("textarea").removeAttr("disabled");
                    $(".img-lists>li").remove();//之前的图片清空
                    //添加一个  可上传按钮
                    var upload_input='<div class="load-dom">'+
                                        '<label class="fake-loader" for="load-img"></label>'+
                                        '<input id="load-img" type="file" multiple class="load-img">'+
                                    '</div>';
                    $(".upload").insertAfter(upload_input)
                }
            },
            error:function(data,status,e){     
                $('#attach').html('添加失败');  //待查看
            }  
        }); 
    }
});
$(document).on('click','.delete',function () {
    $(this).parents('li').remove();
    console.log($(".img-lists>li").length)
    if($(".img-lists>li").length<=5){
        $(".more_length").addClass("display-none");
    }
    //告诉后台删除的图片
    $.post({
        url:'',
        data:$(this).prev().attr('src'),//删除的img的 src
        success:function () {

        }
    })
})

$(".faqsubmit").on("click",function(){
			ajaxFileUpload(1);
		})
function ajaxFileUpload(index){
	var  instagramId = $("#txt1").val();
	var email = $("#txt2").val();
	var content = $("#textarea-txt").val();
	var InsID=$("#txt1").val(),//Instagram ID
    Eml=$("#txt2").val(),//Email
    HowHelp=$("#textarea-txt").val().length;//How can we help you的字数
        user_regular=/^[a-zA-Z0-9_\.]+$/g;
        var InsID=$("#txt1").val();//Instagram ID
        if(user_regular.test(InsID)){//ID正确
            $("#txt1").removeClass("dialogtxt-red");
            $(".Inswarn").removeClass("display-block");
        }else{//失败
            $("#txt1").addClass("dialogtxt-red");
            $(".Inswarn").addClass("display-block");
        }
        var filter= /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            Eml=$("#txt2").val();//Email
        if(InsID!="" && filter.test(Eml)){
                //邮箱正确
            $(".faqsubmit").css("background","#f96d09");
            $("#txt2").removeClass("dialogtxt-red");
            $(".emailwarn").removeClass("display-block");
            $(".faqsubmit").val("Loading...");
            $(".faqsubmit").attr("disabled",true);
        }else{
             $(".submit").css("background","#d5d4d4")
             $("#txt2").addClass("dialogtxt-red");
            $(".emailwarn").addClass("display-block");
            return false;
        }
        $(".textarea_input>p>span").text(HowHelp);
        if(HowHelp>1000){
            $(".textarea_input>p>span").css("color","red")
        }
       if($(".faqsubmit").val()=="Loading..."){
          $(".text").attr("disabled",true);
          $("textarea").attr("disabled",true);
          $('.load-dom').remove()//添加图片按钮被移除
          $(".delete").remove()//删除图片按钮被移除
        }else{
          $(".text").removeAttr("disabled");
          $("textarea").removeAttr("disabled");
          
        } 
}  


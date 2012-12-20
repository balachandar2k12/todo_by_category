var group;
var item_group;
var item_array;

function forEach(obj,action)
{
  for (var i = 0; i < obj.length; i++) {
   action(obj[i]);
  };
}



//display individual task
function show_task(task_id)
{
   var task_data=JSON.parse(localStorage.getItem(task_id));
   console.log(task_data.data,task_data.category,task_data.done);
   display_task(task_data.category,task_id,task_data.task,task_data.done)

}

//show all the tasks in category vise when the page is rendering
function display_allTasks()
{
   var obj=group_byCategory();
    var key;
    console.log(obj);
  for (key in obj)
  {
    create_category(key);
    forEach(obj[key],function(value){
        console.log("inside display_allTasks"+value);
       show_task(value);
    });
  }

} 
//Delete A Entire Category
function delete_category(category)
{
  for (var key in localStorage)
  {
    var tmp_ar = JSON.parse(localStorage.getItem(key));
    if(tmp_ar["category"]==category){
         console.log("deleted :"+key+"->"+tmp_ar["data"]);       
        localStorage.removeItem(key);
    }
      
  }

}



// display the tasks in todo list
function display_task(category,task_id,msg,status)
{
  var checked = (status=="1")? "checked='true'" : "";
  var style = (status=="1")? "line-through" : "none";
  var task_html="<div id='"+task_id+"'><input type='checkbox' "+checked+" class='item_delete'><span style='text-decoration:"+style+"'>"+msg+"</span><button>Delete</button>";
  $("#"+category+"_items").append(task_html);

}


function task_exists(msg)
{
  for (key in localStorage)
  {
    var tmp_ar = JSON.parse(localStorage.getItem(key));
    if(tmp_ar["task"]==msg)
      return true;
  }
  return false;
}

//remove the task from local storage
function remove_task(task_id)
{
  localStorage.removeItem(task_id);
}

//check the category exists or not
function check_category(category)
{
   for (var key in localStorage)
  {
    var tmp_ar = JSON.parse(localStorage.getItem(key));
    if(tmp_ar["category"]==category)
      return true;
  }
  return false;

}

//remove the entire category of items

function remove_category(cat)
{ 
  //console.log("category detected"+cat);
  for ( var key in localStorage)
  {
    
    var tmp_ar = JSON.parse(localStorage.getItem(key));
    if(tmp_ar["category"]==cat)
      localStorage.removeItem(key);
  }

}

//Grouping the items by category 
function group_byCategory()
{
  var group={};
  for (key in localStorage)
  {
    var tmp_ar = JSON.parse(localStorage.getItem(key));
    var cat=tmp_ar["category"];
      if(cat in group)
      {
        group[cat].push(key);
      }
      else
      {
       group[cat]=[];
      group[cat].push(key); 
      }
      
  }

return group;
}

//update the task in local storage
function update_task(task_id,task_status)
{
  var task = JSON.parse(localStorage.getItem(task_id));
  task.done = task_status;
  localStorage.setItem(task_id,JSON.stringify(task));

}

//add the task in local storage
function add_task(task_id,data)
{
  var task=JSON.stringify(data);
  localStorage.setItem(task_id,task);
}

//update the status in page
function update_status()
{
  var obj=group_byCategory();
  var count,cat_count=0;
   for(var key in obj)
   {
    //individual tatus of todo list
    cat_count++;
    count=$("#"+key).find("input:checkbox:checked").length; 
    console.log("selected id"+key+"-count"+count);
    $("#"+key+"count").html(obj[key].length);
    $("#"+key+"finished").html(count);
   }
// entire status of todo list
  $("#cat_count").html(cat_count);
  $("#itemcount").html(localStorage.length);
  $("#itemchecked").html($("input:checkbox:checked").length);
}

//create a new category template
function create_category(category)
{
var category_list=$("#todolist").html();
$('#tasks').append(_.template(category_list,{cat:category}));
} 

//finding the completed tasks by particular category 
function find_doneItems(category)
{
  var obj=group_byCategory();
  var key;
  var result=[];
   if(obj[category])
   {
     forEach(obj[category],function(task_id){
      
      var task_data=JSON.parse(localStorage.getItem(task_id));
      if(task_data["done"]==1)
      {
          result.push(task_id);
      }
     });
   }
   return result;
}


$(document).ready(function(){

  if(localStorage.length>0)
  {
     display_allTasks();
     update_status();
  }
    
  $("#item").keyup(function(e){
     //if enter key pressed 
    if(e.keyCode== 13)
    { 
      var msg=$(this).val().split("@");
     
      if(msg.length==2)
      {
        if(!task_exists(msg))
        {
          var data={};
          task_id = new Date().getTime()
          data["task"]=msg[0];
          data["category"]=msg[1];
          data["done"]=0;
          if(check_category(msg[1]))
           {
              //display the item in existing category
           }
           else
           {
            //create a new category list and display the item 
            create_category(msg[1]);
           }
           item_group=group_byCategory();
           console.log(item_group);
           add_task(task_id,data);

          $("#item").val("");
          display_task(msg[1],task_id,data['task'],data["done"]);
          update_status();
          //alert(count);
        }
      }
      else{  $("#item").val("");

        alert("Invalid Input");
        
    }
    }  
  });



  $("input:checkbox").live('click', function(){ 
    var $task = $(this).closest("div");
    var task_id=$task.attr("id");
    var task_status="0";
    var txt_dec="none";
    if($(this).attr("checked"))
    {
      task_status= "1";
      txt_dec=" line-through";
    } 
    update_task(task_id,task_status);
    $task.find("span").css('text-decoration', txt_dec);
    update_status();
  });  


  $("#clearButton").live('click',function(){
    $("input:checkbox:checked").each(function() { 
        var $task = $(this).closest("div");
        var task_id=$task.attr("id");
        remove_task(task_id);
        $task.remove();
        update_status();
    });
  });


  $("button").live("click",function(){
    var $task = $(this).closest("div");
    var task_id=$task.attr("id");
    remove_task(task_id);
    $task.remove();
    update_status();
  });

  $(".delete_category").live("click",function(){
     var category_id=$(this).attr("id").split("_"); 
     console.log("clicked individual "+category_id[0]+" ");
    remove_category(category_id);
    $("#"+category_id).remove();
    update_status();
  });

    
$(".remove_items").live("click",function(){
 var cat=$(this).attr("id").split("_");
  var done_items =find_doneItems(cat[0]);
   console.log("clicked individual"+cat[0]+"-done-"+done_items);
   for(var i=0;i<=done_items.length;i++)
   {
    remove_task(done_items[i]);
    $("div#"+done_items[i]).remove();
   
   }
   update_status();

});

//drag and drop
$(function() {
        $( ".items" ).sortable();
        $( ".items" ).disableSelection();
    });

});
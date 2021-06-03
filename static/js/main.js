function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

$(document).ready(function () {
  task_id = -1
  latest_sub_id = 0
  id = parseInt($('#id_subtasks-TOTAL_FORMS').val());

  $("#items").keypress(function(e) {
    if (e.which === 13)
    {		
    	if($('.sub-input').val()){
      	e.preventDefault();

        $('#id_subtasks-TOTAL_FORMS').attr("value", id+1);
        
        
        if (task_id == -1){
          $('#items').append(
            '<div class="row"><input type="text" class="sub card mb-2 col-sm-10" value="'+$('.sub-input').val()+'" name="subtasks-'+id+'-name" maxlength="250" class="sub" placeholder="Subtask" id="id_subtasks-'+id+'-name"></input><input type="button" value="delete" class="delete col-sm-2 btn btn-sm" /></div>'
            );
          console.log('new')
        }
        else{
          latest_sub_id++
          $('#items').append(
            '<div class="row"><input type="text" class="sub card mb-2 col-sm-10" value="'+$('.sub-input').val()+'" name="subtasks-'+id+'-name" maxlength="250" class="sub" placeholder="Subtask" id="id_subtasks-'+id+'-name"></input><input type="hidden" name="subtasks-'+id+'-task" value="'+task_id+'" id="id_subtasks-'+id+'-task"><input type="hidden" name="subtasks-'+id+'-id" value="'+latest_sub_id+'" id="id_subtasks-'+id+'-id"><input type="button" value="delete" class="delete col-sm-2 btn btn-sm" /></div>'
            );
            console.log('new updated')
        }
        

				id++
        
        $('.sub-input').val("");
        $('.sub-input').focus();

      }
      e.preventDefault();
        
    }
    
  });
// <input type="hidden" name="subtasks-0-task" value="28" id="id_subtasks-0-task">
  // Delete Subtask
  $("#items").on('click', ".delete",function(e){
    
    e.preventDefault();

    s = $(this).parent().children()[2]

    if ($(s).length){
      sub_id = $(s).attr('value')
      $.ajax({
        type: "POST",
        url: "http://localhost:8000/delete_subtask/",
        data: {
          subtask_id: sub_id,
          csrfmiddlewaretoken: getCookie('csrftoken'),
          action: 'post',
        },
        success: function(json){
          task_id = json.task_id;
          latest_sub_id = json.latest_sub_id;
        },
        error: function (xhr, errmsg, err) {

        },

      });
    }
    
    
    // Remove the div and update ids...
    $(this).parent('div').remove();

    $(".sub").each(function(i){
      $(this).attr({
        name: 'subtasks-'+i+'-name',
        id: 'id_subtasks-'+i+'-name',
      });

      hidden = $(this).next();
      hidden.attr({
        name: 'subtasks-'+i+'-task',
        id: 'id_subtasks-'+i+'-task',
      })

      hidden.next().attr({
        name: 'subtasks-'+i+'-id',
        id: 'id_subtasks-'+i+'-id',
      })
      
    });
    
    id--
    $('#id_subtasks-TOTAL_FORMS').attr("value", id);

  });

});

$(document).ready(function () {
	total_forms = 0;
  sub_id = 0;
  
  $("#items").keypress(function(e) {
    if (e.which === 13)
    {		
    	if($('.sub-input').val()){
      	e.preventDefault();
        $('#id_subtasks-TOTAL_FORMS').attr("value", total_forms+1);
        console.log('add: '+sub_id)
        $('#items').append('<div><input type="text card" value="'+$('.sub-input').val()+'" name="subtasks-'+sub_id+'-name" maxlength="250" class="sub" placeholder="Subtask" id="id_subtasks-'+sub_id+'-name"></input><input type="button" value="delete" class="delete" /></div>');

        total_forms ++
				sub_id++
        
        $('.sub-input').val("");
        $('.sub-input').focus();
      
      }
      e.preventDefault();
        
    }
    
  });

  $("body").on('click', ".delete",function(e){
    $(this).parent('div').remove();
    total_forms--
    $('#id_subtasks-TOTAL_FORMS').attr("value", total_forms);
    $(".sub").each(function(i){
      $(this).attr({
        name: 'subtasks-'+i+'-name',
        id: 'id_subtasks-'+i+'-name',
      });
    });
    sub_id--
    console.log('remove: '+sub_id)
  })

});

// $('#items').append('<div><input type="text card" value="'+$('.sub').val()+'" name="subtasks-'+id+'-name" maxlength="250" class="sub'+id+'" placeholder="Subtask" id="id_subtasks-'+id+'-name"></input><input type="button" value="delete" class="delete" /></div>');

// <input type="text card" value="1" name="subtasks-0-name" maxlength="250" class="sub" placeholder="Subtask" id="id_subtasks-0-name">

// <input type="text card" value="1" name="subtask-0-name" maxlength="250" class="sub" placeholder="Subtask" id="id_subtask-0-name">
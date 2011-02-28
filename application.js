// updates the spans attached to the passed input field to display whether the passed input field content matches the passed regexp value or not
// input: the text input field
// regexp_value: the value of the regexp (String)
function update_result_for(input, regexp_value) {
  var input_value 	= input.val();
  var result_spans	= input.parent().children('span');        
  if(!input_value || !regexp_value) {
    result_spans.hide();
  } else {
    var regexp = new RegExp(regexp_value);
    var result = regexp.exec(input_value);
    if(result) {
      var matched_string = result.shift();
      
      var submatches_list_string = jQuery.map(result, function(submatch, index) {
        return '$' + (index + 1) + ' = ' + submatch;
      }).join('; ');
      
      var regexp_to_highlight_matched_string          = new RegExp('(.*)' + matched_string + '(.*)');
      var regexp_to_highlight_matched_string_result   = regexp_to_highlight_matched_string.exec(input_value);
      var before_matched_string                       = regexp_to_highlight_matched_string_result[1];
      var after_matched_string                        = regexp_to_highlight_matched_string_result[2];
      var input_value_with_matched_string_highlighted	= 'matched: ' + before_matched_string + '<span class="matched">' + matched_string + '</span>' + after_matched_string;
      
      result_spans.filter(".submatches").text(submatches_list_string);
      result_spans.filter(".match").html(input_value_with_matched_string_highlighted);
      result_spans.filter(".ok").show('fast');            
      result_spans.filter(".not_ok").hide();
    } else {
      result_spans.filter(".not_ok").show('fast');
      result_spans.filter(".ok").hide();
    }
  }
}       

// from http://www.scottklarr.com/topic/126/how-to-create-ctrl-key-shortcuts-in-javascript/
var isCtrl = false;
$(document).keyup(function (e) {
	if(e.which === 17) isCtrl=false;
}).keydown(function (e) {
	if(e.which === 17) isCtrl=true;
	if(e.which === 69 && isCtrl) {
    $('#regexp').focus();          
		return false;
	}
});

$(document).ready(function() {
  $('#regexp').focus();
  $('span.result').hide();
  $('input:not(#regexp)').live("keyup", function() {
    update_result_for($(this), $('#regexp').val());
  });        
  $('input#regexp').keyup(function() {
    $('input:not(#regexp)').each(function(i) {
      update_result_for($(this), $('#regexp').val());
    });          
  });
  $('a.add_example').click(function() {
    new_example = $('div#examples p:last').clone();
    new_example.children('input').attr('value', '');
    new_example.children('span').hide();
    new_example.insertBefore($(this));
    new_example.children("input").focus();
  });
});

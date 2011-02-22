function update_input(input) {
  var value = input.val();
  var spans = input.parent().children('span');        
  if(value == '' || $('#regexp').val() == '') {
    spans.hide();
  } else {
    var regexp = new RegExp($('#regexp').val());
    var result = regexp.exec(value);
    if(result) {
      var matched_string = result.shift();
      
      var submatches_list_string = jQuery.map(result, function(submatch, index) {
        return '$' + (index + 1) + ' = ' + submatch;
      }).join('; ');
      
      var regexp_to_highlight_matched_string          = new RegExp('(.*)' + matched_string + '(.*)');
      var regexp_to_highlight_matched_string_result   = regexp_to_highlight_matched_string.exec(value);
      var before_matched_string                       = regexp_to_highlight_matched_string_result[1];
      var after_matched_string                        = regexp_to_highlight_matched_string_result[2];
      var value_with_matched_string_highlighted       = 'matched: ' + before_matched_string + '<span class="matched">' + matched_string + '</span>' + after_matched_string;
      
      spans.filter(".submatches").text(submatches_list_string);
      spans.filter(".match").html(value_with_matched_string_highlighted);
      spans.filter(".ok").show('fast');            
      spans.filter(".not_ok").hide();
    } else {
      spans.filter(".not_ok").show('fast');
      spans.filter(".ok").hide();
    }
  }
}       

// from http://www.scottklarr.com/topic/126/how-to-create-ctrl-key-shortcuts-in-javascript/
var isCtrl = false;
$(document).keyup(function (e) {
	if(e.which == 17) isCtrl=false;
}).keydown(function (e) {
	if(e.which == 17) isCtrl=true;
	if(e.which == 69 && isCtrl == true) {
    $('#regexp').focus();          
		return false;
	}
});

$(document).ready(function() {
  $('#regexp').focus();
  $('span.result').hide();
  $('input:not(#regexp)').live("keyup", function() {
    update_input($(this));
  });        
  $('input#regexp').keyup(function() {
    $('input:not(#regexp)').each(function(i) {
      update_input($(this));
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

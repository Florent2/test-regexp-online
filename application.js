// updates the spans attached to the passed input field to display whether the passed input field content matches the passed regexp value or not
// input: the text input field
// regexpValue: the value of the regexp (String)
function updateResultFor(input, regexpValue) {
  var inputValue 	= input.val();
  var resultSpans	= input.parent().children('span');        
  if(!inputValue || !regexpValue) {
    resultSpans.hide();
		return;
  }
  
	var regexp = new RegExp(regexpValue);
  var result = regexp.exec(inputValue);
  if(!result) {
	  resultSpans.filter(".not_ok").show('fast');
    resultSpans.filter(".ok").hide();
		return;
	} 
  
	var matchedString = result.shift();
  
  var submatchesListString = jQuery.map(result, function(submatch, index) {
    return '$' + (index + 1) + ' = ' + submatch;
  }).join('; ');
  
  var regexpToHighlightMatchedString          = 
		new RegExp('(.*)' + matchedString + '(.*)');
  var regexpToHighlightMatchedStringResult   	= 
		regexpToHighlightMatchedString.exec(inputValue);
  var beforeMatchedString                     = 
		regexpToHighlightMatchedStringResult[1];
  var afterMatchedString                      = 
		regexpToHighlightMatchedStringResult[2];
  var inputValueWithMatchedStringHighlighted	= 
		'matched: ' + 
		beforeMatchedString + 
		'<span class="matched">' + matchedString + '</span>' + 
		afterMatchedString;
  
  resultSpans.filter(".submatches").text(submatchesListString);
  resultSpans.filter(".match").html(inputValueWithMatchedStringHighlighted);
  resultSpans.filter(".ok").show('fast');            
  resultSpans.filter(".not_ok").hide();
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
    updateResultFor($(this), $('#regexp').val());
  });        
  $('input#regexp').keyup(function() {
    $('input:not(#regexp)').each(function(i) {
      updateResultFor($(this), $('#regexp').val());
    });          
  });
  $('a.add_example').click(function() {
    var newExample = $('div#examples p:last').clone();
    newExample.children('input').attr('value', '');
    newExample.children('span').hide();
    newExample.insertBefore($(this));
    newExample.children("input").focus();
  });
});

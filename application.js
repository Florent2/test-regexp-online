// updates the spans attached to the passed input field to display whether 
	// the passed input field content matches the passed regexp value or not
// input: 			the text input field
// regexpValue: the value of the regexp (String)
// regexpFlags: the regexp flags, example: "ig" or "m" or ""
function updateResultFor(input, regexpValue, regexpFlags) {
  var inputValue 	= input.val();
  var resultSpans	= input.parent().children('span');       

  if(!inputValue || !regexpValue) {
    resultSpans.hide();
		return;
  }
  
	var regexp = new RegExp(regexpValue, regexpFlags);
  var result = regexp.exec(inputValue);
  if(!result) {
	  resultSpans.filter(".not_ok").show('fast');
    resultSpans.filter(".ok").hide();
		return;
	} 
  
	var matchedString 			= result.shift();
  var	matchedIndex				= result.index;
	var beforeMatchedString = inputValue.slice(0, matchedIndex);
	var afterMatchedString 	= inputValue.slice(matchedIndex + matchedString.length);
  var inputValueWithMatchedStringHighlighted	= 
		'matched: ' + 
		beforeMatchedString + 
		'<span class="matched">' + matchedString + '</span>' + 
		afterMatchedString;  
  resultSpans.filter(".match").html(inputValueWithMatchedStringHighlighted);
  
  var submatchesListString = jQuery.map(result, function(submatch, index) {
    return '$' + (index + 1) + ' = ' + submatch;
  }).join('; ');
  resultSpans.filter(".submatches").text(submatchesListString);
  
	resultSpans.filter(".ok").show('fast');            
  resultSpans.filter(".not_ok").hide();
}       

function getRegexFlags() {
	var result = "";
	if($('input#i_flag').is(':checked')) result += "i";
	// if($('input#g_flag').is(':checked')) result += "g";
	// if($('input#m_flag').is(':checked')) result += "m";
	return result;
}

function updateAllResults() {
	regexpValue	= $('#regexp').val();
	regexpFlags = getRegexFlags();
	$('input:not(#regexp)').each(function(i) {
    updateResultFor($(this), regexpValue, regexpFlags);
  });          
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
  $('input.example, input.counterexample').live("keyup", function() {
    updateResultFor($(this), $('#regexp').val(), getRegexFlags());
  });        
  $('input#regexp').keyup(updateAllResults);
	$('input.flag').change(updateAllResults);
  $('a.add_example').click(function() {
    var newExample = $('div#examples p:last').clone();
    newExample.children('input').attr('value', '');
    newExample.children('span').hide();
    newExample.insertBefore($(this));
    newExample.children("input").focus();
  });
});

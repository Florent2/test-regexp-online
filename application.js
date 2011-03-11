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

$(function() {
	$('textarea').placeholder();
	$('h1 a').attr('href', document.location.pathname);
	
	$('a#add_example').click(function() { addExampleInput($('div#examples')) } );
	$('a#add_counterexample').click(function() { addExampleInput($('div#counterexamples')) } );

  $('span.result').hide();
  $('p#invalid_regexp').hide();
	fillInInputsFromQueryString();
	updateAllResults();	
  $('#regexp').focus();
	$('textarea#description').autogrow();
	
  $('input.example, input.counterexample').live("keyup", function() {
    updateResultFor($(this), $('#regexp').val(), getRegexFlags());
		updatePermalink();
  });        

  $('input#regexp').keyup(updateAllResults);
	$('input.flag').change(updateAllResults);
  
	$('textarea#description').keyup(updatePermalink);
	$('select#regexp-reference').change(updateReferenceSection);
});


// add a new example or counterexample input field and focus on it
// function called when user clicks the links to add such fields, or when fill in input fields from a permalink
// section: the jQuery div object of the examples or counterexamples div
function addExampleInput(section) {
	var lastExample	= section.children('ol').children('li:last');
	var newExample	= lastExample.clone();
  newExample.children('input').attr('value', '');
  newExample.children('span').hide();
	newExample.insertAfter(lastExample);
  newExample.children("input").focus();		
}

// fills in all input fields from the URL query string
// used when the 'application' is reached through a permalink
function fillInInputsFromQueryString() {
	// from http://stackoverflow.com/questions/901115/get-querystring-values-with-jquery/2880929#2880929
	var params = {}	;
	var e,
	    a = /\+/g,  // Regex for replacing addition symbol with a space
	    r = /([^&=]+)=?([^&]*)/g,
	    d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
	    q = window.location.search.substring(1);
	while (e = r.exec(q)) params[d(e[1])] = d(e[2]);
	
	$('input#regexp').attr('value', params.regexp);
	$('textarea#description').attr('value', params.description);
	if(params.iFlag) $('input#iFlag').attr('checked', 'true');
	
	fillInExampleInputsFromQueryStringParams("example", params);
	fillInExampleInputsFromQueryStringParams("counterexample", params);
}

// fills in example or counterexample input fields from the URL query string
// called by fillInInputsFromQueryString
// example: either 'example' or 'counterexample'
// params: the URL query string params as an hash
function fillInExampleInputsFromQueryStringParams(example, params) {
	var i = 1;
	while(value = params[example + i]) {
		exampleInputSelector 	= 'input.' + example + ':eq(' + (i - 1) + ')';
		var exampleInput			= $(exampleInputSelector);
		if(!exampleInput.length) {
			addExampleInput($('div#' + example + 's'));
			exampleInput = $(exampleInputSelector);		
		}
		exampleInput.attr('value', value);
		i++;
	}	
}

// returns a string listing the checked flags from the corresponding flag checkbox
function getRegexFlags() {
	var result = "";
	if($('input#iFlag').is(':checked')) result += "i";
	// if($('input#g_flag').is(':checked')) result += "g";
	// if($('input#m_flag').is(':checked')) result += "m";
	return result;
}

// updates all the example and counterexamples result spans, depending on the regexp value and flags
// updates also the generated permalink
function updateAllResults() {
	regexpValue	= $('#regexp').val();
	regexpFlags = getRegexFlags();
	$('input:not(#regexp)').each(function(i) {
    updateResultFor($(this), regexpValue, regexpFlags);
  });          
	updatePermalink();
}

// updates the permalink link from the regexp value & flags, and the example & counterexample input fields
function updatePermalink() {
	var queryStringComponents = {};
	if($('#regexp').val()) queryStringComponents.regexp = $('#regexp').val();
	if($('#description').val() && $('#description').val() !== 'Here you can enter an optional description or title for your regexp') queryStringComponents.description = $('#description').val();
	if($('input#iFlag').is(':checked')) queryStringComponents.iFlag = $('input#iFlag').is(':checked');
	$('input.example[value!=""]').each(function(index) { queryStringComponents["example" + (index + 1)] = $(this).val(); });
	$('input.counterexample[value!=""]').each(function(index) { queryStringComponents["counterexample" + (index + 1)] = $(this).val(); });
	queryString = $.param(queryStringComponents);
	
	if(queryString) {
		var permalink		= window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + $.param(queryStringComponents);
		$('a#permalink').html(permalink);
		$('a#permalink').attr('href', permalink);
		$('div#permalink_section').show();				
	} else {
		$('div#permalink_section').hide();
	}
}

// updates the right side reference section, depending on the selected section selected in the dropdown select menu
function updateReferenceSection() {
	selectedReference = $('select#regexp-reference').val();
	if(selectedReference === 'all') {
		$("div#right-side div").show();	
	} else {
		$("div#right-side div").hide();	
		$("div#" + selectedReference).show();
	}
}


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
  
	try {
		var regexp = new RegExp(regexpValue, regexpFlags);
	}
	catch(e) {
		$('p#invalid_regexp').show();
		return;
	}
	$('p#invalid_regexp').hide();	
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


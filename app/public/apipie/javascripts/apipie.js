function inputTemplate(name, inputType) {
  inputType = typeof inputType !== 'undefined' ? inputType : 'text';
  return  '<div class="control-group">' +
            '<label class="control-label" for="input' + name + '">' + name + '</label>' +
            '<div class="controls">' +
              '<input type="' + inputType + '" id="input' + name + '" placeholder="' + name + '">' +
            '</div>' +
          '</div>';
}

$.fn.apisSelector = function() {
  this.each(function(){
    var result = $(this).find(".result");
    $(this).find('select').on('change', function(ev){
      var api = $(ev.currentTarget).val(),
          re = /[\/\=]\:[^\s\/]+/ig,
          match = re.exec(api);
      result.html('');
      while (match != null) {
        var field = match[0].slice(2);
        result.append(inputTemplate(field));
        match = re.exec(api);
      }
    }).trigger('change');
  });
};
$.fn.apiSubmiter = function() {
  // this.each(function(){
  //   $(this).onsubmit = function(ev){
  //     console.log('onsubmit');
  //     return false;
  //   }
  // });
};

$(document).ready(function() {
  if (typeof prettyPrint == 'function') {
    $('pre.ruby').addClass('prettyprint lang-rb');
    prettyPrint();
  }
  $('[role="apis"]').apisSelector();
  $('[role="api-params"]').apiSubmiter();
});

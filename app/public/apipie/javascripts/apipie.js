
function inputTemplate(name, inputType) {
  inputType = typeof inputType !== 'undefined' ? inputType : 'text';
  return  '<div class="control-group">' +
            '<label class="control-label" for="input' + name + '">' + name + '</label>' +
            '<div class="controls">' +
              '<input type="' + inputType + '" name="' + name + '" placeholder="' + name + '">' +
            '</div>' +
          '</div>';
}

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

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
  this.each(function(){
    $(this).on('submit', function(ev){

      var form_apis = $(this).siblings('[role=apis]'),
          api = form_apis.find('select[role=api]').val(),
          n = api.indexOf(" "),
          method = api.substring(0,n),
          url_params = form_apis.serializeObject(),
          data = $(this).serialize();

      api = api.substring(n+1);
      for(var param in url_params) {
        var value = url_params[param];
        api = api.replace(':'+param, value);
      }
      var info = $(this).parent().siblings('[role=info]');
      info.find('[role=url]').html('<strong>' + method + '</strong> ' + location.origin + api);
      info.find('[role=body]').html(data);
      info.find('[role=responce]').html('');
      info.find('[role=responce_body]').html('');
      $.ajax({ type: method, url: api, data: data})
        .complete(function(jqXHR, textStatus){
          info.find('[role=status]').html('<strong>' + jqXHR.status + '</strong> ' + textStatus);
          info.find('[role=responce]').html(jqXHR.responseText);
        });
      return false;
    });
  });
};

$(document).ready(function() {
  if (typeof prettyPrint == 'function') {
    $('pre.ruby').addClass('prettyprint lang-rb');
    prettyPrint();
  }
  $('[role=apis]').apisSelector();
  $('[role=api-params]').apiSubmiter();
});

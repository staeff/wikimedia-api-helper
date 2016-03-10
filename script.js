function getData(url) {
    return $.ajax({
        url: url,
        type: 'GET',
        headers: {
            'Api-User-Agent': 'Website Agent/1.0'
        },
        dataType: 'jsonp'
    });
}

$('#wikimediaform').submit(function(event) {
    var url = $("#mediaurl").val();
    var endpoint = 'https://commons.wikimedia.org/w/api.php';
    if (/https:\/\/[^\/]*\.wikipedia\.org\/.*media\/File:/.test(url)) {
        var filename = /File:.*?$/i.exec(url);
        var options = '?action=query&format=json&prop=imageinfo&' + 
            'iilimit=1&iiprop=url|extmetadata&iiurlwidth=445&' + 
            'titles=' + filename;
        var api_call = endpoint + options;

        getData(api_call).done(function(data) {
            var pages = data.query.pages,
                pagekey;
            // we need the supposedly only key which is not predictable
            for(var key in pages) {
                // hasOwnProperty protects against inherited props &&
                // the key contains just numbers
                if(pages.hasOwnProperty(key) && /[0-9]/.test(key)) {
                    pagekey = key;
                }
            }
                $('#json').JSONView(data);
            var imageinfo = pages[pagekey].imageinfo[0],
                thumburl = imageinfo.thumburl,
                desc_url = imageinfo.descriptionurl,
                output = '<img src="' + thumburl + '"/>';
            $('#content').html(output);
            $('#license').text(imageinfo.extmetadata.License.value);
            $('#licenseshort').text(imageinfo.extmetadata.LicenseShortName.value);
            $('#artist').text(imageinfo.extmetadata.Artist.value);
            $('#credit').text(imageinfo.extmetadata.Credit.value);
            $('#categories').text(imageinfo.extmetadata.Categories.value);
            $('#imagedesc').text(imageinfo.extmetadata.ImageDescription.value);
            $('#objectname').text(imageinfo.extmetadata.ObjectName.value);
        });
    }
  event.preventDefault();
});
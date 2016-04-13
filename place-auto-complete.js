/**
 * 
 * @param {type} inputId Form input field 
 * @param {type} dropdown Where to  show suggested dropdown.
 * @param {type} country IF country name is provide then suggestion will return only places within this specific country
 * @returns NULL
 */
function placeAutoComplete(inputId, dropdown, country) {
    var btn = $("#rcs-customer_pickup_location");
    $("body").on('keyup', inputId, function () {
        var queryString = $(this).val();
        btn = $(this);
        var service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions({input: queryString,
            componentRestrictions: {country: 'us'}}, function (data, status) {
            var htmlSuggestion = '';
            for (var i = 0; i < data.length; i++) {
                //  console.log(data[i]);  
                htmlSuggestion += '<li class="list-group-item">' + data[i]['description'] + '</li>';
            }
            $(dropdown).html(htmlSuggestion);
        })
    })//End of on keyup function
    $("body").on('click', dropdown + " li", function (e) {
        var newPlace = $(this).text();
        $(btn).val(newPlace);
        $(dropdown).empty();
    });
    $(inputId).on('blur', function (e) {
        e.preventDefault();
        if ($(this).val() == "") {
            $(dropdown).empty();
        }
    })
}

app.filter('projectName', function () {
    return function(input) {
        return input.replace(/_/gi, " ");
    }
});


app.filter('view_notify', [ 'dictionary_service' , function (dictionary_service) {
    return function(input) {
        return (dictionary_service && dictionary_service[input])
            ? dictionary_service[input]
            : function(){ console.log("missed in dictionary: " + input); return input}();
    }
}]);

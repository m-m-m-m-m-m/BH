app.service('dictionary_service', [function () {
    var dictionary = function(){
        return  {
            vis: {
                name        : "3D Visualisation View",
                information : [{
                    icon : 'roof',
                    text : 'show with / without roof'
                }, {
                    icon : 'resetVis',
                    text : 'reset view'
                }],
                notify_id : 'vis0'
            },
            plans: {
                name: "Plan View",
                information: [{
                    icon : 'zoom',
                    text : 'enable/disable zooming'
                }],
                notify_id : 'plan0'
            },
            photo: {
                name: "Photo View",
                information: [{
                    icon : 'zoom',
                    text : 'enable/disable zooming'
                }],
                notify_id : 'photo0'
            },
            front: {
                name: "Facade View",
                information: [{
                    icon : 'zoom',
                    text : 'enable/disable zooming'
                }],
                notify_id : 'front0'
            },
            info: {
                name: "Information",
                information: "",
                notify_id : 'info0'
            },
            projects: {
                name: "Project Selection",
                information: "",
                notify_id : 'proj0'
            }
        };
    }();

    return dictionary;
}]);
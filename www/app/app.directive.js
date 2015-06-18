angular.module('app')


.directive('map', function () {
    return {
        restrict: 'E',
        scope: {
            onCreate: '&'
        },
        link: function ($scope, $element, $attr) {
            function initialize() {
                var mapOptions = {
                    center: new google.maps.LatLng(43.07493, -89.381388),
                    zoom: 16,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                var map = new google.maps.Map($element[0], mapOptions);

                // Try HTML5 geolocation
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var pos = new google.maps.LatLng(position.coords.latitude,
                                                         position.coords.longitude);

                        //var infowindow = new google.maps.InfoWindow({
                        //    map: map,
                        //    position: pos,
                        //    content: ''
                        //});
                        map.setCenter(pos);

                        var marker = new google.maps.Marker({
                            position: pos,
                            map: map,
                            title: ''
                        });

                    }, function () {
                        console.log('map error');
                    });
                }



                $scope.onCreate({ map: map });

                // Stop the side bar from dragging when mousedown/tapdown on the map
                google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
                    e.preventDefault();
                    return false;
                });

            }

            if (document.readyState === "complete") {
                initialize();
            } else {
                google.maps.event.addDomListener(window, 'load', initialize);
            }
        }
    }
})

.directive("compareTo", function () {
    return {
        restrict: "A",

        require: "ngModel",

        scope: {
            otherModelValue: "=compareTo"
        },

        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            }
        }
    };
});


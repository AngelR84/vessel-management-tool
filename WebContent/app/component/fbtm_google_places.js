/* Directives */
fibity.manager.app.directive('googlePlaces', function(){
        return {
            restrict:'E',
            replace:true,
            // transclude:true,
            scope: {location:'=',address:'='},
            template: '<input class="form-control" id="google_places_ac" ng-model="address" name="google_places_ac" type="text" class="input-block-level"/>',
            link: function($scope, elm, attrs){
                var autocomplete = new google.maps.places.Autocomplete(jQuery("#google_places_ac")[0], {});
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    var place = autocomplete.getPlace();
                    $scope.location = { "latitude": place.geometry.location.lat(), "longitude": place.geometry.location.lng() };
                    $scope.address = jQuery("#google_places_ac").val();
                    $scope.$apply();
                });
            }
        }
    });
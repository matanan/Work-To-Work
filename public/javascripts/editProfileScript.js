angular.module('editProfile', ['ngFileUpload'])
    .controller('EditController',['$scope', '$http', '$window', 'Upload', '$timeout', function($scope, $http, $window, Upload, $timeout) {
        // Name of Tab
        document.title = "Work-To-Work - editProfile";

        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function() {scrollFunction()};

        function scrollFunction() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                document.getElementById("myBtn").style.display = "block";
            } else {
                document.getElementById("myBtn").style.display = "none";
            }
        }

        // When the user clicks on the button, scroll to the top of the document
        $scope.topFunction = function() {
            $('html, body').animate({scrollTop : 0},800);
        };

        $scope.back = function () {
            window.location.href = "/profile";
        };

        $scope.exit = function () {
            localStorage.clear();
            window.location.href = "/registration";
        };

        // Get the owner's email address
        $scope.owner = localStorage.getItem("owner");
        // Create the fields for the Object "user"
        $scope.userObj = {};
        $scope.userObj.firstname = "";
        $scope.userObj.lastname = "";
        $scope.userObj.phoneNumber = "";
        $scope.userObj.location = "";
        $scope.userObj.businessName = "";
        $scope.userObj.subject = "";
        $scope.userObj.seniority = "";
        $scope.userObj.passnew = "";
        $scope.userObj.repassnew = "";
        $scope.userObj.mail = $scope.owner;
        
        $scope.editProp = function () {
            // Check if all fields are filled in
            if ($scope.userObj.firstname.length <= 0 || $scope.userObj.lastname.length <= 0 || $scope.userObj.location.length <= 0 ||
                $scope.userObj.businessName.length <= 0 || $scope.userObj.subject.length <= 0 || $scope.userObj.seniority.length <= 0 ||
                $scope.userObj.passnew.length <= 0 || $scope.userObj.repassnew.length <= 0 ||
                $scope.userObj.phoneNumber.length <= 0) {
                swal({
                    title: "מלא/י את כל השדות",
                    text: "אנא בדוק/בדקי כי מילאת את כל השדות כראוי",
                    type: "error",
                    confirmButtonText: "OK"
                });
            }
            // Compare the passwords
            else if ($scope.userObj.passnew != $scope.userObj.repassnew) {
                swal({
                    title: "סיסמא שגויה",
                    text: "אנא ודא/י כי הסיסמאות תואמות",
                    type: "error",
                    confirmButtonText: "OK"
                });
                
            }
            else {
                $http.post('/updateUser', $scope.userObj)
                    .success(function (res) {
                        console.log('User updated successfully');
                        swal({
                                title: "משתמש עודכן בהצלחה!",
                                text: "בכדי להכניס את השינויים לתקוף הנך נדרש/ת להכנס מחדש",
                                type: "success",
                                confirmButtonColor: "#8CD4F5",
                                confirmButtonText: "אישור"
                            },
                            function(isConfirm){
                                // If confirmed call exit" function for update changes
                                if (isConfirm) { $scope.exit(); }
                            });
                        // Clear the fields when finished
                        $scope.userObj.firstname = "";
                        $scope.userObj.lastname = "";
                        $scope.userObj.phoneNumber = "";
                        $scope.userObj.location = "";
                        $scope.userObj.subject = "";
                        $scope.userObj.businessName = "";
                        $scope.userObj.seniority = "";
                        $scope.userObj.passnew = "";
                        $scope.userObj.repassnew = "";
                    })
                    .catch(function (err) {
                        console.log('Update user error');
                    })
            }
        };

        // Picture object
        $scope.pictureObj = {};
        $scope.pictureObj.title = "";
        $scope.pictureObj.owner = $scope.owner;

        // Pictures array
        $scope.pictureArray = [];

        $scope.addPicture = function(file, errFiles){
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            $scope.showProgress = true;
        };


        $scope.sendPicture = function(){
           // var inputFile = $('#inputFile');
            console.log($scope.f);
            if ($scope.f)
            {
                alert("Title = " + $scope.pictureObj.title + " Owner = " + $scope.pictureObj.owner );
                $scope.f.upload = Upload.upload ({
                    url: '/uploadPic',
                    data: {file: $scope.f, title: $scope.pictureObj.title, owner: $scope.pictureObj.owner}
                });

                $scope.f.upload.then(function (response) {
                    $timeout(function () {
                        $scope.f.result = response.data;
                        console.log(response);
                        if(response.data == 'no-support')
                            alert('File not supported.');
                        $scope.pictureObj.title = "";
                        $scope.pictureObj.owner = "";
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.f.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
            $scope.loadPictures();
        };

        $scope.loadPictures = function () {
            $http.get('/getPic', $scope.pictureObj)
                .success(function (res) {
                    console.log("owner = " + $scope.pictureObj.owner);
                    console.log("res = " + res.title);
                    $scope.pictureArray.push(res);
                    // for (var i=0; i < res.length; i++){
                    //     if(res[i].owner = $scope.pictureObj.owner)
                    //         $scope.pictureArray.push(res[i].data);
                    //     console.log("res[i] pushed to array " + res[i]);
                    // }
                    console.log($scope.pictureArray.data);
                })
                .catch(function (err) {
                    console.log(err);
                });






        };

        $scope.delObj = function(pic){
            swal({
                    title: "האם את/ה בטוח?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "מחק",
                    cancelButtonText: "ביטול",
                    closeOnConfirm: false
                },
                function(){
                    $scope.delObject= pic;
                    $http.post('/delPicture', $scope.delObject)
                        .success(function(res) {
                            console.log('Picture removed.');
                            swal({
                                title: "התמונה נמחקה",
                                type: "success",
                                showConfirmButton: false,
                                timer: 2000
                            });
                        })
                        .catch(function(err) {
                            console.log('Picture remove error.');
                        });
                });
        };
        
        
        
        
        
        
        
        

        // Setting for Google search API
        var mapOptions = {
            center: new google.maps.LatLng(-33.8688, 151.2195),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        var input = document.getElementById('searchLocation');
        var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map
        });

        google.maps.event.addListener(autocomplete, 'place_changed', function () {
            infowindow.close();
            marker.setVisible(false);
            input.className = '';
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                // Inform the user that the place was not found and return.
                input.className = 'notfound';
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17); // Why 17? Because it looks good.
            }
            marker.setIcon( /** @type {google.maps.Icon} */ ({
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(35, 35)
            }));
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''), (place.address_components[1] && place.address_components[1].short_name || ''), (place.address_components[2] && place.address_components[2].short_name || '')].join(' ');
            }

            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            infowindow.open(map, marker);
        });


    }]);

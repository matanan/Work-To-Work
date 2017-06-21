angular.module('editProfile', ['ngFileUpload'])
    .controller('EditController',['$scope', '$http', '$window', 'Upload', '$timeout', function($scope, $http, $window, Upload, $timeout) {
        // Name of Tab
        //noinspection JSValidateTypes
        document.title = "Work-To-Work - Edit Profile";

        $window.onload = loadPictures();

        //-------------------- Variables Definitions ---------------------
        // Max Pictures for each user
        var MAX_PICS = 2;
        
        // Scroll Availability
        var SCROLL_PX = 20;
        
        // Scroll Speed
        var SCROLL_SPEED = 800;
        
        // Get the owner's email address
        $scope.owner = localStorage.getItem("owner");

        // Count the objects in the array
        $scope.counter = 0;

        //-------------------- Objects Definitions ---------------------
        
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

        // Picture object
        $scope.pictureObj = {};
        $scope.pictureObj.title = "";
        $scope.pictureObj.owner = $scope.owner;
        $scope.pictureObj.data ="";

        // Pictures array
        $scope.pictureArray = [];

        //-------------------- FUNCTIONS ---------------------

        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function() {scrollFunction()};
        function scrollFunction() {
            if (document.body.scrollTop > SCROLL_PX || document.documentElement.scrollTop > SCROLL_PX) {
                document.getElementById("myBtn").style.display = "block";
            } else {
                document.getElementById("myBtn").style.display = "none";
            }
        }

        // When the user clicks on the button, scroll to the top of the document
        $scope.topFunction = function() {
            $('html, body').animate({scrollTop : 0},SCROLL_SPEED);
        };

        // Back function - to previous page
        $scope.back = function () {
            window.location.href = "/profile";
        };

        // Exit to registration page
        $scope.exit = function () {
            localStorage.clear();
            window.location.href = "/registration";
        };

        // Edit the user's properties function
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
            // Compare the passwords (validation check)
            else if ($scope.userObj.passnew !== $scope.userObj.repassnew) {
                swal({
                    title: "סיסמא שגויה",
                    text: "אנא ודא/י כי הסיסמאות תואמות",
                    type: "error",
                    confirmButtonText: "OK"
                });
            }
            // All parameters are OK - call the server function - "updateUser"
            else {
                $http.post('/updateUser', $scope.userObj)
                    .success(function (res) {
                        console.log('User updated successfully');
                        // User updated successfully
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
                        // Clear the fields when finish
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
//------------------------------------------------------------------------------------------------------------------------//
        // Add new picture to the DB
        $scope.addPicture = function(file, errFiles){
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            $scope.showProgress = true;
        };

        // Using the server function to "Post" the picture in the DB
        $scope.uploadPicture = function(){
            document.getElementById("titleText").value = "";
            // The maximum pictures for each user is 3
            if ($scope.counter > MAX_PICS) {
                swal("לא ניתן להעלות תמונות", "ניתן להעלות עד 3 תמונות", "error");
                return;
            }
            // Upload the picture
            if ($scope.f) {
                //alert("Title = " + $scope.pictureObj.title + " Owner = " + $scope.pictureObj.owner );
                $scope.f.upload = Upload.upload ({
                    url: '/uploadPic',
                    data: {file: $scope.f, title: $scope.pictureObj.title, owner: $scope.pictureObj.owner}
                });

                $scope.f.upload.then(function (response) {
                    $timeout(function () {
                        $scope.f.result = response.data;
                        console.log("response-> " + response.data);
                        if(response.data === 'Picture saved.')
                            location.reload();
                    });
                }, function (response) {
                    // if (response.status > 0)
                    //     $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.f.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
        };


        function base64ToArrayBuffer(bin)
        {
            var length = bin.length;
            var buf = new ArrayBuffer(length);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < length; i++) {
                arr[i] = bin.charCodeAt(i);
            }
            console.log("****** Finish decoding *****");
            console.log("buf = " + buf);
            return buf;
        }

        //Function for convert base-64 to arrayBuffer( to insert into blob )
        function fixBase64(binaryData) {
            var binary = atob(binaryData.replace(/\s/g, ''));// decode base64 string, remove space for IE compatibility
            var len = binary.length;         // get binary length
            var buffer = new ArrayBuffer(len);         // create ArrayBuffer with binary length
            var view = new Uint8Array(buffer);         // create 8-bit Array

            // save unicode of binary data into 8-bit Array
            for (var i = 0; i < len; i++)
                view[i] = binary.charCodeAt(i);
            return view;
        }

        // Load the pictures for the owner user from the DB using the server method - "getPic"
        function loadPictures() {
            // Reset the counter
            $scope.counter = 0;
            $http.get('/getPic', $scope.owner)
                .success(function (res) {
                    for (var i=0; i < res.length; i++) {
                       // console.log("i = " + i);
                         if ($scope.owner === res[i].owner){
                             var base64str = res[i].data;
                             var base64Fixed = fixBase64(base64str);//Get uint array to set in blob
                             //Create a blob with base64Fixed and push to the array
                             var blob = new Blob([base64Fixed], { type: "image/png" });
                             var blobUrl = URL.createObjectURL(blob);
                            $scope.pictureObj.title = res[i].title;
                            $scope.pictureObj.owner = res[i].owner;
                            $scope.pictureObj.data = blobUrl;
                            // Push the object to the array
                            $scope.pictureArray.push($scope.pictureObj);
                            $scope.counter ++;
                            console.log("counter = " + $scope.counter);
                             $scope.pictureObj = {};
                             $scope.pictureObj.owner = res[i].owner;

                         }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        }

        // Delete picture from the DB using the server method - "deletePic"
        $scope.deletePic = function(pic){
            console.log(pic);
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
                    $http.post('/deletePic', pic)
                        .success(function(res) {
                            console.log('Picture removed.');
                            swal({
                                title: "התמונה נמחקה",
                                type: "success",
                                showConfirmButton: false,
                                timer: 2000
                            },function () {
                                $.when(location.reload()).done(
                                    $window.location.href="#editPics"
                                );
                            });

                        })
                        .catch(function(err) {
                            console.log('Picture remove error.');
                        });
                });
        };

        //------------------------ Setting for Google search API ------------------------
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

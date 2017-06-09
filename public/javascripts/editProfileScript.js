angular.module('editProfile', ['ngFileUpload'])
    .controller('EditController',['$scope', '$http', '$window', 'Upload', '$timeout', function($scope, $http, $window, Upload, $timeout) {
        // Name of Tab
        //noinspection JSValidateTypes
        document.title = "Work-To-Work - Edit Profile";

        //-------------------- Variables Definitions ---------------------
        // Max Pictures for each user
        var MAX_PICS = 2;
        
        // Scroll Availability
        var SCROLL_PX = 20;
        
        // Scroll Speed
        var SCROLL_SPEED = 800;
        
        // Get the owner's email address
        $scope.owner = localStorage.getItem("owner");

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
            else if ($scope.userObj.passnew != $scope.userObj.repassnew) {
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

        // Add new picture to the DB
        $scope.addPicture = function(file, errFiles){
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            $scope.showProgress = true;
        };

        // Using the server function to "Post" the picture in the DB
        $scope.sendPicture = function(){
            // The maximum pictures for each user is 3
            if ($scope.pictureArray.length > MAX_PICS) {
                swal("לא ניתן להעלות תמונות", "ניתן להעלות עד 3 תמונות", "alert");
            }
            // Upload the picture
            if ($scope.f) {
                $scope.f.data = encode64($scope.f.data);
                //alert("Title = " + $scope.pictureObj.title + " Owner = " + $scope.pictureObj.owner );
                $scope.f.upload = Upload.upload ({
                    url: '/uploadPic',
                    data: {file: $scope.f, title: $scope.pictureObj.title, owner: $scope.pictureObj.owner}
                });

                $scope.f.upload.then(function (response) {
                    $timeout(function () {
                        $scope.f.result = response.data;
                        //console.log(response);
                        if(response.data == 'no-support')
                            alert('File not supported.');
                        $scope.pictureObj.title = "";
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    $scope.f.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
            //$scope.loadPictures();
        };

        $scope.base64ToArrayBuffer = function(bin)
        {
            var length = bin.length;
            var buf = new ArrayBuffer(length);
            var arr = new Uint8Array(buf);
            for (var i = 0; i < length; i++) {
                arr[i] = bin.charCodeAt(i);
            }
            return buf;
        };


        var keyStr = "ABCDEFGHIJKLMNOP" +
            "QRSTUVWXYZabcdef" +
            "ghijklmnopqrstuv" +
            "wxyz0123456789+/" +
            "=";
        function encode64(input) {
            input = escape(input);
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        }
        function decode64(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return unescape(output);
        }

        // Load the pictures for the owner user from the DB using the server method - "getPic"
        $scope.loadPictures = function () {
            $scope.pictureArray = [];
            $http.get('/getPic', $scope.owner)
                .success(function (res) {
                    for (var i=0; i < res.length; i++) {
                        alert("scope.owner = " + $scope.owner + " res.owner = " + res[i].owner);
                       // console.log("i = " + i);
                        if ($scope.owner == res[i].owner){
                            //console.log("res.data = " + res[i].data);
                           // var pic = $scope.base64ToArrayBuffer(res[i].data);
                            //alert("res[i].title = " + res[i].title  + " res[i].owner = " + res[i].owner + " res[i].data = " + res[i].data);
                            $scope.pictureObj.title = res[i].title;
                            //$scope.pictureObj.owner = res[i].owner;
                            var image = decode64(res[i].data);
                            $scope.pictureObj.data = image;
                            // alert("$scope.pictureObj.title = " + $scope.pictureObj.title);
                            console.log("title = " + res[i].title);
                            $scope.pictureArray.push($scope.pictureObj);
                            console.log($scope.pictureObj.data);
                            //console.log("pic = " + pic);

                        }
                        for (var j = 0; j < $scope.pictureArray.length; j++){
                            console.log("title form array = " + $scope.pictureArray[j].title);
                            // $scope.pictureObj.title = $scope.pictureArray[j].title;
                        }
                        document.getElementById("titleText").value = "";
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });

        };

        // Delete picture from the DB using the server method - "deletePic"
        $scope.deletePic = function(pic){
            console.log("pic = " + pic);
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
                    $scope.pictureObj= pic;
                    $http.post('/deletePic', $scope.pictureObj)
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

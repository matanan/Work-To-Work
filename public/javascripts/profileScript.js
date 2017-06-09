angular.module('profile', [])
    .controller('ProfileController',['$scope', '$http', '$window', function($scope, $http, $window) {
        // Name of Tab
        //noinspection JSValidateTypes
        document.title = "Work-To-Work - Profile";
        

        //-------------------- Variables Definitions ---------------------

        var localSAllow = false;
        var contactExist = false;

        // Scroll Availability
        var SCROLL_PX = 20;

        // Scroll Speed
        var SCROLL_SPEED = 800;
        //-------------------- Objects Definitions ---------------------

        // Recommendation Object
        $scope.RecObj = {};
        $scope.RecObj.owner = $scope.owner;
        $scope.RecObj.rank = "";
        $scope.RecObj.description = "";
        $scope.RecObj.name = "";

        // Contact Object
        $scope.ContactObj = {};
        $scope.ContactObj.description = "";
        $scope.ContactObj.mail = $scope.owner;

        // Arrays
        $scope.ContactObject = [];
        $scope.searchObj = [];
        $scope.ownerObj = [];


        // Check if localStorage can be used
        localSAllow = !!window.localStorage;

        //-------------------- FUNCTIONS ---------------------

        // Get the data from LocalStorage
        $scope.titles = function (){
            $scope.owner = localStorage.getItem("owner");
            // Get the owner's data
            $http.get('/getUSer')
                .success (function (res) {
                    for (var i=0; i<res.length; i++ ){
                        if ($scope.owner == res[i].email) {
                            $scope.titleBusinessName = res[i].businessName;
                            $scope.titleName = res[i].sirName;
                            $scope.titleLastName = res[i].familyName;
                            $scope.titleLocation = res[i].location;
                            $scope.titleSubject = res[i].subject;
                            $scope.owner = res[i].email;
                            $scope.phoneNumber = res[i].phoneNumber;
                        }
                    }
                })
        };
        if (localSAllow)
            $scope.titles();
        
        // If exit - clear the LocalStorage
        $scope.clear = function () {
            swal({
                title: "האם את/ה בטוח/ה שברצונך לצאת?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK",
                closeOnConfirm: false
            }, function(){
                localStorage.clear();
                window.location.href = "/registration";
            });
        };


        $scope.search = function () {
            // Clear the array after re-searching
            $scope.searchObj = [];

            // Variable for indicates if user has found or not
            var found = false;

            // Get the inputs
            var name = document.getElementById("searchName").value;
            var subject = document.getElementById("searchSubject").value;
            var email = document.getElementById("searchMail").value;
            var user_location = document.getElementById("searchLocation").value;

            // All fields are empty
            if (name == "" && subject == "" && email == "" && user_location == "") {
                swal("אין נתונים", "מלא/י לפחות את אחד השדות לחיפוש");
                return;
            }

            //Retrieve users from DB
            $http.get('/getUser')
                .success(function (res) {
                    // Check which field was insert and search according this field
                    for(var i = 0; i < res.length; i++) {
                        if(name != "") {
                            if((!res[i].sirName.search(name)) && res[i].email != $scope.owner) {
                                $scope.searchObj.push(res[i]);
                                found = true;
                            }
                        }
                        else if(subject != "") {
                            if ((!res[i].subject.search(subject)) && res[i].email != $scope.owner) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
                                found = true;
                            }
                        }
                        else if(email != "") {
                            if ((!res[i].email.search(email)) && res[i].email != $scope.owner) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
                                found = true;
                            }
                        }
                        else if(user_location != "") {
                            if ((!res[i].location.search(user_location)) && res[i].email != $scope.owner) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
                                found = true;
                            }
                        }
                    }
                    // No results has founded
                    if (!found) {
                        swal("אין תוצאות", "אין תוצאות התואמות את נתוני החיפוש שהוכנסו");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };

        // Clear the search fields function
        $scope.clearSearch = function () {
            $scope.searchObj = [];
            document.getElementById("searchName").value = "";
            document.getElementById("searchSubject").value = "";
            document.getElementById("searchMail").value = "";
            document.getElementById("searchLocation").value = "";
        };

        // Click on user name takes to his home page
        $scope.gotoVisit = function(user) {
            $http.get('/getUser')
                .success(function (res) {
                    // Save the registered user for going back later on
                    localStorage.setItem("backUser", $scope.owner);
                    for(var i = 0; i < res.length; i++) {
                        if (user.email == res[i].email) {
                            localStorage.setItem("titleName", res[i].sirName);
                            localStorage.setItem("titleLastName", res[i].familyName);
                            localStorage.setItem("titleLocation", res[i].location);
                            localStorage.setItem("titleSubject", res[i].subject);
                            localStorage.setItem("owner", res[i].email);
                            localStorage.setItem("titleBusinessName", res[i].businessName);
                            localStorage.setItem("phoneNumber", res[i].phoneNumber);
                            window.location.href = "/visitProfile";
                        }
                    }
                    }).catch(function (err) {
                        console.log(err);
            });
        };


        // Retrieve recommendations from DB
        $scope.getRec = function (){
            $http.get('/getRec')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        //console.log(res[i]);
                        if (res[i].owner == $scope.RecObj.owner) {
                            $scope.ownerObj.push(res[i]);
                            // console.log("owener objects: " + $scope.ownerObj);
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        $scope.getRec();

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

        // // Email validation
        // function validateEmail(email) {
        //     return !!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        // }

        // This function adds a contact of a user to the DB
        $scope.addContact = function () {
            // Call "getContact" to check if record already exists
            $scope.getContact();
            if ($scope.ContactObj.description == "") {
                swal({
                        title: "אין נתונים",
                        type: "warning",
                        text: "מלא את תיבת הטקטס כדי לכתוב כמה מילים על עצמך",
                        confirmButtonColor: "#8CD4F5",
                        confirmButtonText: "אישור"
                    },
                    function(isConfirm){
                        // If confirmed call "exit" function for update changes
                        if (isConfirm) { location.reload(); }
                    });
            }
            else if(contactExist) {
                // The record already exists in the database
                // Use the updateContact function for update one field in this object
                $http.post('/updateContact', $scope.ContactObj)
                    .success (function (res) {
                        $scope.ContactObj.description = "";
                        console.log('Contact updated successfully');
                        swal({
                                title: "התוכן השתנה בהצלחה!",
                                type: "success",
                                confirmButtonColor: "#8CD4F5",
                                confirmButtonText: "אישור"
                            },
                            function(isConfirm){
                                // If confirmed call "exit" function for update changes
                                if (isConfirm) { location.reload(); }
                            });
                    })
                    .catch(function (err) {
                        console.log('Update contact error' + err);
                    })
            }
            else {
                // New record in the database
                $http.post('/addContact', $scope.ContactObj)
                    .success(function (res) {
                        // If succeeded delete all fields
                        $scope.ContactObj.description = "";
                        console.log('Contact added successfully');
                        swal({
                                title: "התוכן השתנה בהצלחה!",
                                type: "success",
                                confirmButtonColor: "#8CD4F5",
                                confirmButtonText: "אישור"
                            },
                            function(isConfirm){
                                // If confirmed call exit" function for update changes
                                if (isConfirm) { location.reload(); }
                            });
                    })
                    .catch(function (err) {
                        console.log('Contact add error' + err);
                    });
            }
        };

        // Retrieve contacts from DB
        $scope.getContact = function (){
            $http.get('/getContact')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        if (res[i].mail == $scope.ContactObj.mail) {
                            contactExist = true;
                            // Add the object to the array
                            $scope.ContactObject.push(res[i]);
                            return;
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        $scope.getContact();
        
        // Go to Edit profile page
        $scope.editProfile = function() {
            window.location.href = "/editProfile";
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
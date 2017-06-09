angular.module('registration', [])
    .controller('RegistrationController',['$scope', '$http', '$window', function($scope, $http, $window){
        // Name of Tab
        //noinspection JSValidateTypes
        document.title = "Work-To-Work";
        // Call the init function on page loading
        window.onload = init;

        //-------------------- Variables Definitions ---------------------

        var formIsFull = false;
        var equalsPass = false;
        var exist = false;
        var mailExist = false;
        var passIncorrect = false;
        var justRegistered = false;
        var TIMEOUT = 1000;

        //-------------------- Objects Definitions ---------------------

        // Create the fields for the Object "userObj"
        $scope.userObj = {};
        $scope.userObj.firstname = "";
        $scope.userObj.lastname = "";
        $scope.userObj.emailnew = "";
        $scope.userObj.phoneNumber = "";
        $scope.userObj.location = "";
        $scope.userObj.businessName = "";
        $scope.userObj.subject = "";
        $scope.userObj.seniority = "";
        $scope.userObj.passnew = "";
        $scope.userObj.repassnew = "";
        $scope.userObj.bDate = "";

        // Create the fields for the Object "loginObj"
        $scope.loginObj = {};
        $scope.loginObj.userName = "";
        $scope.loginObj.password = "";

        // Create the fields for updating the user's password in case password forgotten
        $scope.userObj = {};
        $scope.userObj.passnew = makeRandomPass();
        $scope.userObj.email = "";

        //------------------------ Setting for Google search API ------------------------

        var mapOptions = {
            center: new google.maps.LatLng(-33.8688, 151.2195),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        var input = document.getElementById('searchTextField');
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

        //-------------------- FUNCTIONS ---------------------

        function init() {
            // Clear form
             document.getElementById("pass").value = "";
        }

        // Get method that takes out the wanted information from DB about user when one is logging in
        $scope.enter = function(){
            $http.get('/getUser')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        //User just registered - enter his profile
                        if (justRegistered) {
                            // Save owner's email address in LOCAL-STORAGE for retrieving his data
                            localStorage.setItem("owner", $scope.userObj.emailnew);
                            $window.location.href = "/profile";
                            return;
                        }
                        // User exists but password incorrect
                        if(res[i].email == $scope.loginObj.userName) {
                            if(res[i].pass != $scope.loginObj.password) {
                                swal({
                                    title: "שגיאה!",
                                    text: "סיסמא שגויה!",
                                    type: "error",
                                    confirmButtonText: "OK"
                                });
                                passIncorrect = true;
                                return;
                            }
                            // User exists & password correct
                            else {
                                exist = true;
                                // Get into the profile page
                                $window.location.href = "/profile";
                                // Save data in LocalStorage so I can use it later in the page
                                localStorage.setItem("titleName", res[i].sirName);
                                localStorage.setItem("titleLastName", res[i].familyName);
                                localStorage.setItem("titleLocation", res[i].location);
                                localStorage.setItem("titleSubject", res[i].subject);
                                localStorage.setItem("owner", res[i].email);
                                localStorage.setItem("titleBusinessName", res[i].businessName);
                                localStorage.setItem("phoneNumber", $scope.userObj.phoneNumber);
                            }
                        }
                    }
                    // User does not exist
                    if (exist == false) {
                        swal({
                            title: "שגיאה!",
                            text: "משתמש לא קיים",
                            type: "error",
                            confirmButtonText: "OK"
                        });
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };

        // Function that creates a random password 
        function makeRandomPass()
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }

        // Function that checks if the input is correct email's template
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        // Function that sends a new password to a user only if he exist in the DB
        $scope.forgetPassword = function () {
            var exist;
            swal({
                    title: "שכחת סיסמא?",
                    text: "אנא כתוב את כתובת המייל שלך לצורך איפוס הסיסמא",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    animation: "slide-from-top",
                    inputPlaceholder: "כתובת מייל...",
                    confirmButtonText: "שלח",
                    cancelButtonText: "ביטול"
                },
                // Check the input
                function(inputValue){
                    // Email address invalid
                    if (!validateEmail(inputValue)) {
                        swal.showInputError("כתובת מייל לא תקינה!");
                        return false
                    }
                    // Input is null
                    if (inputValue === "") {
                        swal.showInputError("הכנס כתובת מייל!");
                        return false
                    }
                    // Check if the user exists in the DB
                    $http.get('/getUser')
                            .success(function (res) {
                                for(var i = 0; i < res.length; i++) {
                                    if (inputValue == res[i].email){
                                        exist = true;
                                        break;
                                    }
                                    else exist = false;
                                }
                                // User exists
                                if (exist) {
                                    // Input correct - update password's field in the DB and send an email with new generated password
                                    $scope.userObj.email = inputValue;
                                    $http.post('/updatePassword', $scope.userObj)
                                        .success(function () {
                                            swal("סיסמתך אופסה בהצלחה!", "מייל נשלח לכתובת: " + inputValue, "success");
                                            // Send an email with the new password
                                            emailjs.send("gmail", "forgetpassword", {
                                                email: inputValue,
                                                newPass: $scope.userObj.passnew
                                            });
                                        }).catch(function (err) {
                                        console.log(err);
                                    });
                                  // User does not exist
                                } else swal("שגיאה!", "כתובת המייל: " + inputValue + " לא קיימת בבסיס הנתונים", "error");
                            }).catch(function (err) {
                                console.log(err);
                            });
                });
        };

        // Function that checks that the form is full as expected before adding user to DB
        $scope.checkForm = function(){
            $http.get('/getUser')
                .success(function (res) {
                    for (var i = 0; i < res.length; i++) {
                        //alert("res[i].mail = " + res[i].email + " email new = " + $scope.userObj.emailnew);
                        if (res[i].email == $scope.userObj.emailnew) {
                            //alert("res[i].mail = " + res[i].email + " email new = " + $scope.userObj.emailnew);
                            mailExist = true;
                            break;
                        }
                    }
                }).catch(function (err) {
                console.log(err);
            });
            // Check if all fields are filled in
            if ($scope.userObj.firstname == undefined || $scope.userObj.lastname == undefined || $scope.userObj.emailnew == undefined ||
                $scope.userObj.location == undefined ||$scope.userObj.businessName == undefined || $scope.userObj.subject == undefined ||
                $scope.userObj.seniority == undefined || $scope.userObj.passnew == undefined || $scope.userObj.repassnew == undefined ||
                $scope.userObj.phoneNumber == undefined)
            {
                swal({
                    title: "מלא את כל השדות",
                    text: "אנא בדוק כי מילאת את כל השדות כראוי",
                    type: "error",
                    confirmButtonText: "OK"
                });
            }
            else
                formIsFull = true;
            // Check password's validation
            if (formIsFull && ($scope.userObj.passnew != $scope.userObj.repassnew)){
                equalsPass = false;
                swal({
                    title: "סיסמא שגויה!",
                    text: "אנא ודא/י כי הסיסמאות תואמות",
                    type: "error",
                    confirmButtonText: "OK"
                });
                return;
            }
            else{
                equalsPass = true;
            }
            // User exists in the DB
            if (mailExist) {
                swal({
                    title: "משתמש קיים!",
                    text: "משתמש קיים במערכת עם כתובת מייל זהה",
                    type: "error",
                    confirmButtonText: "OK"
                });
                return;
            }
            // If all good - add the user to the DB
            if (!mailExist && formIsFull && equalsPass) {
                alert("goto adduser()");
                $scope.addUser();
            }
        };

        // This function adds a user to DB
        $scope.addUser = function(){
            $http.post('/addUser', $scope.userObj)
                .success(function() {
                    justRegistered = true;
                    console.log('User added successfully');
                    setTimeout(function() {
                        swal({
                            title: "משתמש נוסף בהצלחה!",
                            text: "הנך מועבר/ת לעמוד הפרופיל האישי",
                            type: "success"
                        }, function() {
                            // User added successfully - Go to home page
                            $scope.enter();
                        });
                    }, TIMEOUT);
                })
                .catch(function(err) {
                    console.log('User add error' + err);
                });
        };
    }]);
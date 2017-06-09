angular.module('visitProfile', [])
    .controller('VisitController',['$scope', '$http', '$window', function($scope, $http, $window) {
        // Name of Tab
        //noinspection JSValidateTypes
        document.title = "Work-To-Work - Visit Profile";

        //-------------------- ON LOAD ---------------------

        // Loading gif until page finish loading
        $(window).load(function() {
            // Animate loader off screen
            $(".se-pre-con").fadeOut("slow");
        });
        // Check if localStorage can be used
        localSAllow = !!window.localStorage;

        // Get the data from LocalStorage
        $scope.titles = function (){
            $scope.titleBusinessName = localStorage.getItem("titleBusinessName");
            $scope.titleName = localStorage.getItem("titleName");
            $scope.titleLastName = localStorage.getItem("titleLastName");
            $scope.titleLocation = localStorage.getItem("titleLocation");
            $scope.titleSubject = localStorage.getItem("titleSubject");
            $scope.owner = localStorage.getItem("owner");
            $scope.phoneNumber = localStorage.getItem("phoneNumber");

        };

        if (localSAllow)
            $scope.titles();

        //-------------------- Variables Definitions ---------------------

        var localSAllow = false;

        // Scroll Availability
        var SCROLL_PX = 20;

        // Scroll Speed
        var SCROLL_SPEED = 800;

        // Timeout duration
        var TIMEOUT = 2000;

        //-------------------- Objects Definitions ---------------------

        // Arrays
        $scope.ownerObj = [];
        $scope.searchObj = [];
        $scope.ContactObject = [];

        // Recommendation Object
        $scope.RecObj = {};
        $scope.RecObj.owner = $scope.owner;
        $scope.RecObj.rank = "";
        $scope.RecObj.description = "";
        $scope.RecObj.name = "";
        $scope.RecObj.email = "";

        // Contact Object
        $scope.ContactObj = {};
        $scope.ContactObj.description = "";
        $scope.ContactObj.mail = $scope.owner;

        //-------------------- FUNCTIONS ---------------------

        //Initialize the Editor
        initEditor();

        // If exit - clear the LocalStorage
        $scope.clear = function () {
            swal({
                    title: "האם את/ה בטוח/ה שברצונך לצאת?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK",
                    closeOnConfirm: false
                },
                function(){
                    localStorage.clear();
                    window.location.href = "/registration";
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

        // This function adds a recommendation to the DB
        $scope.addRec = function () {
            // Get the ranker's email address
            $scope.from = localStorage.getItem("backUser");
            // Get the ranker's name
            $http.get('/getUser')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        if ($scope.from == res[i].email) {
                            $scope.RecObj.email = res[i].email;
                            if (document.getElementById("recCheck").checked == true)
                                $scope.RecObj.name = "אנונימי";
                            else
                                $scope.RecObj.name = res[i].sirName;

                            break;
                        }
                    }
                    var ok = true;
                    // Get the ranking value
                    var rate_value;
                    if (document.getElementById('star-1').checked) {
                        rate_value = document.getElementById('star-1').value;
                    }
                    if (document.getElementById('star-2').checked) {
                        rate_value = document.getElementById('star-2').value;
                    }
                    if (document.getElementById('star-3').checked) {
                        rate_value = document.getElementById('star-3').value;
                    }
                    if (document.getElementById('star-4').checked) {
                        rate_value = document.getElementById('star-4').value;
                    }
                    if (document.getElementById('star-5').checked) {
                        rate_value = document.getElementById('star-5').value;
                    }
                    $scope.RecObj.rank = rate_value;
                    if (rate_value == null)
                    {
                        sweetAlert("שגיאה!", "לא הוכנס דירוג", "error");
                        //alert("Please rank");
                        ok = false;
                    }
                    else if ($scope.RecObj.description == "")
                    {
                        sweetAlert("שגיאה!", "נמק את דירוגך בכמה מילים", "error");
                        //alert("Please write a description");
                        ok = false;
                    }
                    // All fields are full and the recommendation will be saved in the DB
                    else if (ok) {
                        $http.post('/addRec', $scope.RecObj)
                            .success(function (res) {
                                // If succeeded delete all fields
                                $scope.RecObj.rank = "";
                                $scope.RecObj.description = "";
                                // Unit test - print to the log
                                console.log('Recommendation added successfully');
                                swal({
                                        title: "המלצה נוספה בהצלחה!",
                                        type: "success",
                                        confirmButtonText: "אישור"
                                    }, function (isConfirm) {
                                        if (isConfirm) {
                                            // Call the function that retrieve data about recommendations from DB
                                            $scope.getRec();
                                            $.when(location.reload()).done(
                                                $window.location.href="#recommendations"
                                            );
                                        }
                                    });
                            })
                            .catch(function (err) {
                                console.log('Recommendation add error' + err);
                            });
                    }
                }).catch(function (err) {
                console.log(err);
            });
        };

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

        $scope.backToProfile = function () {
            // Save the registered user for back to his home page
            $scope.backTo = localStorage.getItem("backUser");
            $http.get('/getUser')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        if ($scope.backTo == res[i].email) {
                            localStorage.setItem("titleName", res[i].sirName);
                            localStorage.setItem("titleLastName", res[i].familyName);
                            localStorage.setItem("titleLocation", res[i].location);
                            localStorage.setItem("titleSubject", res[i].subject);
                            localStorage.setItem("owner", res[i].email);
                            localStorage.setItem("titleBusinessName", res[i].businessName);
                            localStorage.setItem("phoneNumber", res[i].phoneNumber);
                            window.location.href = "/profile";
                        }
                    }
                }).catch(function (err) {
                console.log(err);
            });
        };

        // Retrieve contacts from DB
        $scope.getContact = function (){
            $http.get('/getContact')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        if (res[i].mail == $scope.ContactObj.mail) {
                            // Push the object to the array
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

        // Send an email from user to user
        $scope.sendEmail = function (to) {
            // Get the sender's mail
            $scope.from = localStorage.getItem("backUser");
            // var myForm = document.getElementById("emailBody");
            var editor_val = CKEDITOR.instances.emailText.document.getBody().getText();
            document.getElementById('emailText').value = CKEDITOR.instances.emailText.document.getBody().getText();
            if (editor_val.length < 2) {
                sweetAlert("שגיאה!", "אנא מלא את גוף ההודעה", "error");
            }
            else {
                swal({
                        title: "האם את/ה בטוח/ה שברצונך לשלוח מייל?",
                        type: "info",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    },
                    function (isConfirm) {
                        setTimeout(function () {
                            if (isConfirm) {
                                emailjs.send("gmail", "test", {
                                    email: to,
                                    from: $scope.from,
                                    text: CKEDITOR.instances.emailText.document.getBody().getText()
                                });
                                swal("המייל נשלח בהצלחה!", "", "success");
                                //Clear text areas when finish
                                CKEDITOR.instances['emailText'].setData("");
                            }
                            else {
                                swal("בוטל", "המייל לא נשלח", "error");
                            }
                        }, TIMEOUT);
                    });
            }
        };

        //Replace the <textarea id="emailText"> with an CKEditor instance.
        function initEditor() {
            CKEDITOR.replace( 'emailText', {
                pluginsLoaded: function( evt )
                {
                    var doc = CKEDITOR.document, ed = evt.editor;
                    if ( !ed.getCommand( 'bold' ) )
                        doc.getById( 'exec-bold' ).hide();
                    if ( !ed.getCommand( 'link' ) )
                        doc.getById( 'exec-link' ).hide();
                }
            })
        }

        $scope.search = function () {
            // Clear the array after re-searching
            $scope.searchObj = [];
            var found = false;
            var name = document.getElementById("searchName").value;
            var subject = document.getElementById("searchSubject").value;
            var email = document.getElementById("searchMail").value;
            var user_location = document.getElementById("searchLocation").value;
            console.log("name = " + name + " subject = " + subject + " email = " + email + " location = " + " user_location");
            // All fields are empty
            if (name == "" && subject == "" && email == "" && user_location == "") {
                swal("אין נתונים", "מלא/י לפחות את אחד השדות לחיפוש");
                return;
            }
            //Retrieve users from DB
            $http.get('/getUser')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        if(name != "") {
                            if((!res[i].sirName.search(name)) && res[i].email != $scope.owner) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
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
                    if (!found)
                    {
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
                    for(var i = 0; i < res.length; i++) {
                        // Save the registered user for going back later on
                        if (user.email == res[i].email) {
                            localStorage.setItem("titleName", res[i].sirName);
                            localStorage.setItem("titleLastName", res[i].familyName);
                            localStorage.setItem("titleLocation", res[i].location);
                            localStorage.setItem("titleSubject", res[i].subject);
                            localStorage.setItem("owner", res[i].email);
                            localStorage.setItem("titleBusinessName", res[i].businessName);
                            localStorage.setItem("phoneNumber", res[i].phoneNumber);
                            // Check if the recommendation is anonymous
                            if (user.name == "אנונימי") {
                                sweetAlert("שגיאה!", "משתמש חסוי", "error");
                                break;
                            }
                            else
                                window.location.href = "/visitProfile";
                        }
                    }
                }).catch(function (err) {
                console.log(err);
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

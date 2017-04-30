angular.module('profile', [])
    .controller('ProfileController',['$scope', '$http', '$window', function($scope, $http, $window) {
        // Name of Tab
        document.title = "Work-To-Work - Profile";
        var localSAllow = false;
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

        // If exit - clear the LocalStorage
        $scope.clear = function () {
            if (confirm('האם אתה בטוח שברצונך לצאת?')) {
                localStorage.clear();
                alert("Local Storage is cleared");
                window.location.href = "/registration";
            } else {
                window.location.href = "/profile";
            }
        };

        $scope.searchObj = [];
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
                alert("Fill at least one field");
                return;
            }
            //Retrieve users from DB
            $http.get('/getUser')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        if(name != "") {
                            if(!res[i].sirName.search(name)) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
                                found = true;
                            }
                        }
                        else if(subject != "") {
                            if (!res[i].subject.search(subject)) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
                                found = true;
                            }
                        }
                        else if(email != "") {
                            if (!res[i].email.search(email)) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
                                found = true;
                            }
                        }
                        else if(user_location != "") {
                            if (!res[i].location.search(user_location)) {
                                $scope.searchObj.push(res[i]);
                                console.log(res[i]);
                                found = true;
                            }
                        }
                    }
                    // No results has founded
                    if (!found)
                    {
                        alert ("No results");
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };

        $scope.clearSearch = function () {
            $scope.searchObj = [];
            document.getElementById("searchName").value = "";
            document.getElementById("searchSubject").value = "";
            document.getElementById("searchMail").value = "";
            document.getElementById("searchLocation").value = "";
        };

        $scope.gotoVisit = function(user) {
            $http.get('/getUser')
                .success(function (res) {
                  //  alert("user email = " + user.email);
                   // alert("owner email = " + $scope.owner);
                    localStorage.setItem("backUser", $scope.owner);
                    for(var i = 0; i < res.length; i++) {
                        //alert("res[i].email = " + res[i].email);
                        if (user.email == res[i].email) {
                            alert("equal");
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

        $scope.ownerObj = [];
        // Retrieve recommendations from DB
        $scope.getRec = function (){
            $http.get('/getRec')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        //console.log(res[i]);
                        if (res[i].owner == $scope.RecObj.owner) {
                            $scope.ownerObj.push(res[i]);
                            console.log("owener objects: " + $scope.ownerObj);
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

        // Email validation
        function validateEmail(email) {
            return !!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        }

        $scope.RecObj = {};
        $scope.RecObj.owner = $scope.owner;
        $scope.RecObj.rank = "";
        $scope.RecObj.description = "";
        $scope.RecObj.mail = "";

        // This function adds a recommendation to the DB
        $scope.addRec = function () {
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
                alert("Please rank");
                ok = false;
            }
            if ($scope.RecObj.description == "")
            {
                alert("Please write a description");
                ok = false;
            }
            if (!validateEmail($scope.RecObj.mail))
            {
                alert("Email is empty or not valid");
                ok = false;
            }
            if (ok) {
                alert("ok = " + ok);
                // All fields are full and the recommendation will be saved in the DB
                $http.post('/addRec', $scope.RecObj)
                    .success(function (res) {
                        // If succeeded delete all fields
                        $scope.RecObj.rank = "";
                        $scope.RecObj.description = "";
                        $scope.RecObj.mail = "";
                        location.reload();
                        // Unit test - print to the log
                        console.log('Recommendation added successfully');
                        alert("Recommendation added successfully");
                        // Call the function that retrieve data about recommendations from DB
                        $scope.getRec();
                    })
                    .catch(function (err) {
                        console.log('Recommendation add error');
                    });
            }
        };

        $scope.ContactObj = {};
        $scope.ContactObj.description = "";
        $scope.ContactObj.mail = $scope.owner;
        // This function adds a contact of a user to the DB
        $scope.addContact = function () {
            if ($scope.ContactObj.description == "") {
                alert ("Emtpy field");
                return;
            }
            else {
                $http.post('/addContact', $scope.ContactObj)
                    .success(function (res) {
                        // If succeeded delete all fields
                        $scope.ContactObj.description = "";
                        console.log('Contact added successfully');
                        alert("Contact added successfully");
                    })
                    .catch(function (err) {
                        console.log('Contact add error');
                    });
            }
            $scope.getContact();
        };

        $scope.ContactObject = [];
        // Retrieve contacts from DB
        $scope.getContact = function (){
            $http.get('/getContact')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        //console.log(res[i]);
                        //alert ("mail address: " + res[i].mail);
                        if (res[i].mail == $scope.ContactObj.mail) {

                            $scope.ContactObject.push(res[i]);
                          //  alert($scope.ContactObject);
                            return;
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
        $scope.getContact();

        $scope.editPic = function () {
          alert("EDIT PICTURES WILL BE IMPLEMENTED HERE");
        };

        $scope.editProfile = function () {
          alert("EDIT PROFILE");
        };
    }]);



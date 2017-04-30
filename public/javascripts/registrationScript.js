angular.module('registration', [])
    .controller('RegistrationController',['$scope', '$http', '$window', function($scope, $http, $window){
        // Name of Tab
        document.title = "Work-To-Work";
        var formIsFull = false;
        var equalsPass = false;
        var exist = false;
        var mailExist = false;
        var passIncorrect = false;
        var justRegistered = false;

        // Create the fields for the Object "user"
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

        $scope.loginObj = {};
        $scope.loginObj.userName = "";
        $scope.loginObj.password = "";

        // Get method that takes out the wanted information from DB about user when one is logging in
        $scope.enter = function(){
            $http.get('/getUser')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++) {
                        //User just registered - enter his profile
                        if (justRegistered) {
                            // Save data in LocalStorage so I can use it later in the page
                            localStorage.setItem("titleName", $scope.userObj.firstname);
                            localStorage.setItem("titleLastName", $scope.userObj.lastname);
                            localStorage.setItem("titleLocation", $scope.userObj.location);
                            localStorage.setItem("titleSubject", $scope.userObj.subject);
                            localStorage.setItem("owner", $scope.userObj.emailnew);
                            localStorage.setItem("titleBusinessName", $scope.userObj.businessName);
                            localStorage.setItem("phoneNumber", $scope.userObj.phoneNumber);
                            $window.location.href = "/profile";
                            return;
                        }
                        // User exists but password incorrect
                        if(res[i].email == $scope.loginObj.userName) {
                            if(res[i].pass != $scope.loginObj.password) {
                                alert('Incorrect password');
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
                        alert('Email Incorrect / User is not exist');
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
            // Function that checks that the form is full as expected before adding user to DB
            $scope.checkForm = function(){
                $http.get('/getUser')
                    .success(function (res) {
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].email == $scope.userObj.emailnew) {
                                //console.log(res[i]);
                                mailExist = true;
                                break;
                            }
                        }
                    }).catch(function (err) {
                    console.log(err);
                });
                // Check if all fields are filled in
                if ($scope.userObj.firstname.length <= 0 || $scope.userObj.lastname.length <= 0 || $scope.userObj.emailnew.length <= 0 ||
                    $scope.userObj.location.length <= 0 ||$scope.userObj.businessName.length <= 0 || $scope.userObj.subject.length <= 0 ||
                    $scope.userObj.seniority.length <= 0 || $scope.userObj.passnew.length <= 0 || $scope.userObj.repassnew.length <= 0 ||
                    $scope.userObj.phoneNumber.length <= 0)
                {
                    alert("Fill all fields");
                    return;
                }
                else
                    formIsFull = true;

                if (formIsFull && ($scope.userObj.passnew != $scope.userObj.repassnew)){
                    equalsPass = false;
                    alert("Passwords are not suit");
                    return;

                }
                else{
                    equalsPass = true;
                }
                if (mailExist)
                    alert("Mail exist");
                // If all good - add the user to the DB
                if (!mailExist && formIsFull && equalsPass)
                    $scope.addUser();
            };
            // This function add the user to DB
            $scope.addUser = function(){
                $http.post('/addUser', $scope.userObj)
                    .success(function(res) {
                            console.log('User added successfully');
                            alert("משתמש נוסף בהצלחה");
                            justRegistered = true;
                            $scope.enter();
                      })
                     .catch(function(err) {
                          console.log('User add error');
                    });
                };
        
    }]);
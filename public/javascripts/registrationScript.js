/**
 * Created by מתן on 15/12/2016.
 */

angular.module('registration', [])
    .controller('RegistrationController',['$scope', '$http', '$window', function($scope, $http, $window){
        // Name of Tab
        document.title = "Work-To-Work";
        var formIsFull = false;
        var equalsPass = false;

        // Create the fields for the Object "user"
        $scope.userObj = {};
        $scope.userObj.firstname = "";
        $scope.userObj.lastname = "";
        $scope.userObj.emailnew = "";
        $scope.userObj.phoneNumber = "";
        $scope.userObj.location = "";
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
            console.log($scope.loginObj);
            $http.get('/getUser')
                .success(function (res) {
                    for(var i = 0; i < res.length; i++)
                    {
                        console.log(res[i]);
                        if(res[i].email == $scope.loginObj.userName)
                        {
                            if(res[i].pass == $scope.loginObj.password) {
                                $window.location.href = "/profile";
                                localStorage.setItem("titleName", res[i].sirName);
                                localStorage.setItem("titleLastName", res[i].familyName);
                                localStorage.setItem("titleLocation", res[i].location);
                                localStorage.setItem("titleSubject", res[i].subject);
                            }
                            else
                                alert('Incorrect password');
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });
        };
            // Function that check that the form is full as expected before adding user to DB
            $scope.checkForm = function(){
                console.log("checkForm function");
                if ($scope.userObj.firstname == null || $scope.userObj.lastname == null || $scope.userObj.emailnew == null ||
                    $scope.userObj.subject == null || $scope.userObj.seniority == null || $scope.userObj.passnew == null ||
                    $scope.userObj.repassnew == null || $scope.userObj.phoneNumber == null)
                {
                    alert("Fill in all fields");
                }
                else
                    formIsFull = true;
                if (formIsFull && ($scope.userObj.passnew != $scope.userObj.repassnew))
                    alert("Password is not suit");
                else
                    equalsPass = true;
                // If all good - add the user to the DB
                if (formIsFull && equalsPass)
                    $scope.addUser();
            };
            // This function add the user to DB
            $scope.addUser = function(){
                $http.post('/addUser', $scope.userObj)
                    .success(function(res) {
                            // If succeeded delete all fields
                            $scope.userObj.firstname = "";
                            $scope.userObj.lastname = "";
                            $scope.userObj.emailnew = "";
                            $scope.userObj.phoneNumber = "";
                            $scope.userObj.location = "";
                            $scope.userObj.subject = "";
                            $scope.userObj.seniority = "";
                            $scope.userObj.passnew = "";
                            $scope.userObj.repassnew = "";
                            $scope.userObj.bDate = "";
                            // Unit test - print to the log
                            console.log('User added successfully');
                      })
                     .catch(function(err) {
                          console.log('User add error');
                    });
                }

        }]);


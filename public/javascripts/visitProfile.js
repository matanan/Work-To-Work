angular.module('visitProfile', [])
    .controller('VisitController',['$scope', '$http', '$window', function($scope, $http, $window) {
        // Name of Tab
        document.title = "Work-To-Work - visitProfile";
        var localSAllow = false;
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

        // Email validation
        function validateEmail(email) {
            return !!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        }

        $scope.ownerObj = [];
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

        $scope.backToProfile = function () {
           // alert("BACK TO");
            $scope.backTo = localStorage.getItem("backUser");
            $http.get('/getUser')
                .success(function (res) {

                    for(var i = 0; i < res.length; i++) {
                       // alert("res[i].email = " + res[i].email);
                        if ($scope.backTo == res[i].email) {
                            alert("equal");
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

        $scope.ContactObject = [];
        $scope.ContactObj = {};
        $scope.ContactObj.description = "";
        $scope.ContactObj.mail = $scope.owner;

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



        $scope.sendEmail = function (to) {
            var myForm = document.getElementById("emailBody");
            alert("Send email to " + to + " from" + "" + " form_id = " + myForm.id + " Text = " + CKEDITOR.instances.emailText.getData());
            document.getElementById('emailText').value = CKEDITOR.instances.emailText.document.getBody().getText();
            emailjs.sendForm("gmail","test",myForm.id);
            // Clear text areas when finish
            CKEDITOR.instances['emailText'].setData("");
            document.getElementById('from').value = "";
            document.getElementById('to').value = "";
            // emailjs.send("gmail","test", {email:to});
        };

        //Initialize the Editor
        initEditor();

        //Replace the <textarea id="emailText"> with an CKEditor instance.
        function initEditor()
        {
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


}]);

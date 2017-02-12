angular.module('profile', [])
    .controller('ProfileController',['$scope', '$http', function($scope, $http) {
        // Name of Tab
        document.title = "Work-To-Work - Profie";
        var localSAllow = false;
        // Check if localStorage can be used
        localSAllow = !!window.localStorage;
        // Get the data from LocalStorage
        $scope.titles = function (){
            $scope.titleName = localStorage.getItem("titleName");
            $scope.titleLastName = localStorage.getItem("titleLastName");
            $scope.titleLocation = localStorage.getItem("titleLocation");
            $scope.titleSubject = localStorage.getItem("titleSubject");
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

        $scope.RecObj = {};
        $scope.RecObj.rank = "";
        $scope.RecObj.description = "";
        $scope.RecObj.mail = "";
        // This function add a recommendation to the DB
        $scope.addRec = function () {
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
          //  alert("stars = " + $scope.RecObj.rank );
            alert("You choose " + rate_value + "stars");
            alert("Description = " + $scope.RecObj.description );
            alert("Mail = " + $scope.RecObj.mail);
            $http.post('/addRec', $scope.RecObj)
                .success(function(res) {
                    // If succeeded delete all fields
                    $scope.RecObj.rank = "";
                    $scope.RecObj.description = "";
                    $scope.RecObj.mail = "";
                    location.reload();

                    // Unit test - print to the log
                    console.log('Recommendation added successfully');
                })
                .catch(function(err) {
                    console.log('Recommendation add error');
                });
        };
    }]);
    
angular.module('mcrrcApp.members').controller('MembersController', ['$scope', '$http', '$modal', 'AuthService', 'MembersService', 'ResultsService', function($scope, $http, $modal, AuthService, MembersService, ResultsService) {

    $scope.user = AuthService.isLoggedIn();

    // var members = Restangular.all('members');

    $scope.membersList = [];


    // =====================================
    // FILTER PARAMS CONFIG ================
    // =====================================
    $scope.paramModel = {};
    $scope.paramModel.sex = '.*';
    $scope.paramModel.category = '.*';
    $scope.paramModel.limit = '';

    // =====================================
    // ADMIN CONFIG ==================
    // =====================================
    $scope.adminDivisCollapsed = true;
    $scope.adminEditMode = false; //edit or add


    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };


    // =====================================
    // ADMIN OPTIONS ====================
    // =====================================

    // select a member after checking it
    $scope.retrieveMemberForEdit = function(member) {
        if (member) {
            var modalInstance = $modal.open({
                templateUrl: 'memberModal.html',
                controller: 'MemberModalInstanceController',
                size: 'lg',
                resolve: {
                    member: function() {
                        return member;
                    }
                }
            });

            modalInstance.result.then(function(member) {
                MembersService.editMember(member);
            }, function() {
                //cancel
            });
        }
    };

    $scope.showAddMemberModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'memberModal.html',
            controller: 'MemberModalInstanceController',
            size: 'lg',
            resolve: {
                member: false
            }
        });

        modalInstance.result.then(function(member) {
            MembersService.createMember(member);
            $scope.membersList.push(member);
        }, function() {
            //cancel
        });
    };

    $scope.removeMember = function(member) {
        MembersService.deleteMember(member).then(function() {
            var index = $scope.membersList.indexOf(member);
            if (index > -1) $scope.membersList.splice(index, 1);
        });
    };


    // set the current member to the display panel
    $scope.setMember = function(member) {
        ResultsService.getResults({
            limit: 10,
            sort: '-racedate',
            member: member
        }).then(function(results) {
            $scope.currentMemberResultList = results;
        });
        $scope.currentMember = member;

    };

    $scope.getMembers = function() {
        var params = {
            "filters[sex]": $scope.paramModel.sex,
            "filters[category]": $scope.paramModel.category,
            limit: $scope.paramModel.limit
        };

        MembersService.getMembers(params).then(function(members) {
            $scope.membersList = members;
        });
    };

    // =====================================
    // MEMBER API CALLS ====================
    // =====================================

    // $scope.user = data.user;
    // when landing on the page, get all members and show them

    // get all members
    var defaultParams = {
        "filters[sex]": $scope.paramModel.sex,
        "filters[category]": $scope.paramModel.category,
        limit: $scope.paramModel.limit
    };

    MembersService.getMembers(defaultParams).then(function(members) {
        $scope.membersList = members;
    });



}]);


angular.module('mcrrcApp.members').controller('MemberModalInstanceController', ['$scope', '$modalInstance', 'member', function($scope, $modalInstance, member) {
    $scope.editmode = false;
    if (member) {
        $scope.formData = member;
        $scope.editmode = true;
    } else {
        $scope.formData = {};
        $scope.editmode = false;
        $scope.formData.dateofbirth = new Date();
    }


    $scope.addMember = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.editMember = function() {
        $modalInstance.close($scope.formData);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    // =====================================
    // DATE PICKER CONFIG ==================
    // =====================================
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

}]);

var modalApp = angular.module('modalApp', ['otModal']);

modalApp.controller('ModalController', function ModalController($scope, otModalService) {
    $scope.params = {
        canClose : true,
        size: "md",
        backdrop: true,
        animation: true
    };
    $scope.openBasic = function () {
        otModalService.showModal("basic").then(function (modal) {
            console.log('success', modal);
        },
                function (modal) {
                    console.log('dismiss', modal);
                });
    }

    $scope.openWithParams = function () {
        otModalService.showModal("basic",$scope.params).then(function (modal) {
            console.log('success', modal);
        },
                function (modal) {
                    console.log('dismiss', modal);
                });
    }

    $scope.openResolve = function () {
        var modalParams = {
            resolve: {
                data: function () {
                    return "Some test data";
                }
            },
        }
        otModalService.showModal("resolve", modalParams).then(function (modal) {
            console.log('success', modal);
        },
                function (modal) {
                    console.log('dismiss', modal);
                });
    }
});
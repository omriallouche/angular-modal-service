'use strict';
var otModal = angular.module('otModal', ["ui.bootstrap"]);

otModal.provider("otModalConfig", [function () {
        var _modalsFolder = null;
        var _locationParam = null;


        this.config = function (config) {
            _modalsFolder = config.modalsFolder;
            _locationParam = config.locationParam;
        };

        this.$get = [function () {
                return {
                    modalsFolder: _modalsFolder,
                    locationParam: _locationParam
                };
            }];
    }]);

otModal.factory("otModalService", function ($location, $uibModal, $window, otModalConfig, $rootScope, $q) {
    var scope = null;

    var currentModal = null;
    var currentModalType = null;

    var modalsConfig = {
        modalsFolder: "templates/modals",
        locationParam: "modal"
    };

    $rootScope.$on("$locationChangeSuccess", function (e, newUrl) {
        var search = $location.search();
        var modalParameter = getParameterByName(modalsConfig.locationParam, newUrl)
        if (search && search[modalsConfig.locationParam]) {
            showModal(search[modalsConfig.locationParam]);
        } else if (modalParameter && modalParameter.length > 0) {
            showModal(modalParameter);
        }
    });

    if (otModalConfig.modalsFolder) {
        modalsConfig.modalsFolder = otModalConfig.modalsFolder;
    }

    if (otModalConfig.locationParam) {
        modalsConfig.locationParam = otModalConfig.locationParam;
    }

    function getParameterByName(name, url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function showModal(modal, modalParams,$scope) {
        var search = $location.search();
        var defer = $q.defer();
        var queryParams = null;
        scope = $scope;
        delete search[otModalConfig.locationParam];

        if (search.canClose) {
            delete search.canClose;
        }
        if (search.modalParams) {
            queryParams = search.modalParams;
            delete search.modalParams;
        }
        $location.search(search);

        openModal($scope, modal, modalParams, queryParams).then(function (success) {
            defer.resolve({modal: success.modal, result: success.result});
        }, function (dismiss) {
            defer.reject({modal: dismiss.modal, result: dismiss.result});
        });

        return defer.promise;
    }

    function getCurrentModal() {
        return currentModal;
    }


    function closeCurrentModal(data) {
        if (currentModal) {
            currentModal.close(data);
            currentModalType = null;
            currentModal = null;
        }
    }

    function openModal($scope, modal, modalParams, queryParams) {
        if (!modal)
            return;
        var scope = $scope;
        var defer = $q.defer();

        var queryModalParams = queryParams;

        var modalBaseName = modal.split('/');
        modalBaseName = modalBaseName[modalBaseName.length - 1];

        var modalOptions = {
            animation: true,
            templateUrl: modalsConfig.modalsFolder + "/" + modal + "-modal.html",
            windowClass: modalBaseName,
            scope: scope,
            resolve: {
                data: function () {
                    return null;
                }
            },
            controller: function ($scope, $uibModalInstance, data) {

                $scope.data = data;
                $scope.$ok = function (successParams) {
                    $uibModalInstance.close(successParams);
                };

                $scope.$cancel = function (cancelParams) {
                    $uibModalInstance.dismiss(cancelParams);
                };

                $scope.openModal = function (path, param) {
                    var search = {modal: path};
                    if (param)
                        search.param = param;
                    $location.search(search);
                    $uibModalInstance.close();
                };

                $scope.openModalWithParams = function (modal, params) {
                    showModal(scope, modal, params);
                    $uibModalInstance.close();
                };

            }
        };

        if (modalParams) {
            if (modalParams.size)
                modalOptions.size = modalParams.size;
            if (modalParams.canClose === false) {
                modalOptions.backdrop = 'static';
                modalOptions.keyboard = false;
            }
            if (modalParams.backdrop === false) {
                modalOptions.backdrop = false;
                modalOptions.windowClass = modalOptions.windowClass + " no-backdrop";
            }
            if (modalParams.animation === false) {
                modalOptions.animation = false;
            }
            if (modalParams.resolve) {
                modalOptions.resolve = modalParams.resolve;
            }
        }

        if (queryParams) {
            try {
                var jsonObj = JSON.parse(queryParams);
                angular.merge(modalOptions, jsonObj);
            } catch (e) {
                //query modal params is not a valid JSON
            }
        }

        if (modalOptions.backdrop == false) {
            modalOptions.windowClass = modalOptions.windowClass + " no-backdrop";
        }

        if (currentModal) {
            currentModal.close();
            currentModalType = null;
            currentModal = null;
        }

        currentModalType = modal;
        currentModal = $uibModal.open(modalOptions);

        currentModal.result.then(function (successResult) {
            currentModal = null;
            currentModalType = null;


            defer.resolve({modal: modal, result: successResult});
        }, function (dismissResult) {
            if (modalParams)
                scope[modalParams] = null;

            currentModal = null;
            currentModalType = null;
            defer.reject({modal: modal, result: dismissResult});
        });

        return defer.promise;
    }

    return {
        showModal: showModal,
        openModal: openModal,
        getCurrentModal: getCurrentModal,
        closeCurrentModal: closeCurrentModal
    }
});
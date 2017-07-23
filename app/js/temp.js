/**=========================================================
 * Module: 打印管理员管理
 * Provides 打印管理员查询、新增、编辑、删除
 =========================================================*/

App.controller('PrinterController', ['$scope', '$http', 'toaster', 'ngDialog', function ($scope, $http, toaster, ngDialog) {
    $scope.pageSize = 10;//列表分页每页数
    $scope.currentPage = 1;
    $scope.printer = {};
    $scope.searchRole={};

    $scope.handleParam = function (value) {
        if (value == undefined || value == null) {
            return '';
        }
        return value;
    };

    $scope.initPrinter = function () {
        $scope.printer = {};
    };

    /**
     * 查询角色列表
     */
    $scope.listPrinters = function () {
        $scope.loading = true;
        //$scope.totalItems = -1;
        $scope.printers = [];
        var listUrl = '/admin/printer/list';
        var pageParam = '&pageSize=' + $scope.pageSize + '&curPage=' + $scope.currentPage
        var listParam = '?time=' + (new Date().getTime())
            + "&userName=" + $scope.handleParam($scope.searchName)
            + "&email=" + $scope.handleParam($scope.searchEmail)
            + "&phoneNo=" + $scope.handleParam($scope.searchPhoneNo)
            + "&roleId=" + $scope.handleParam($scope.searchRole.id);
        console.log(listParam);
        $http.get(listUrl + listParam + pageParam).success(function (data) {
            $scope.loading = false;
            $scope.totalItems = data.totalCount;
            $scope.printers = data.resultList;
            //
            $scope.getAllRole();
        }).error(function (data, status, headers, config) {
            toaster.pop('error', null, data.message);
        });
    };

    //查询
    $scope.listPrinters();
    $scope.pageChanged = function (currentPage) {
        $scope.currentPage = currentPage;
        $scope.listPrinters();
    };

    /**
     * 确认弹出框
     */
    $scope.openConfirm = function (id) {
        $scope.deleteContent = "确认删除吗";
        ngDialog.openConfirm({
            template: 'deleteConfirmDialogId',
            className: 'ngdialog-theme-default',//ngdialog-theme-plain ngdialog-theme-default
            scope: $scope
        }).then(function (value) {
            //删除
            $scope.removePrinter(id);
        });
    };


    /**
     * 新增和修改角色
     */
    $scope.savePrinter = function () {
        var data = {
            id: $scope.printer.id,
            roleId: $scope.role.id,
            userName: $scope.printer.userName,
            email: $scope.printer.email,
            phoneNo: $scope.printer.phoneNo
        };

        var url = $scope.printer.id == undefined ? '/admin/printer/save' : '/admin/printer/update';
        $http
            .post(url, data)
            .success(function (data, status, headers, config) {
                $('#saveOrUpdatePrinterDialog').modal('hide');
                toaster.pop('success', null, data.message);
                $scope.printer = {};
                $scope.listPrinters();
            }).error(function (data, status, headers, config) {
                toaster.pop('error', null, data.message);
            });
    };

    /**
     * 查询打印管理员
     */
    $scope.getPrinter = function (printerId) {
        var listUrl = '/admin/printer/list';
        var listParam = '?time=' + (new Date().getTime()) + "&id=" + printerId;
        $http.get(listUrl + listParam).success(function (data) {
            $scope.printer = data.resultList[0];
            $scope.setRole($scope.printer);
        }).error(function (data, status, headers, config) {
            toaster.pop('error', null, data.message);
        });
    };

    $scope.setRole = function (role) {
        $scope.role = {};
        if (!role) {
            return;
        }
        var len = $scope.roles.length;
        for (var i = 0; i < len; i++) {
            if (role.roleId == $scope.roles[i].id) {
                $scope.role = $scope.roles[i];
                break;
            }
        }
    };

    /**
     * 查询打印管理员
     */
    $scope.getAllRole = function () {
        var listUrl = '/role/findAllRoles';
        $http.get(listUrl).success(function (data) {
            $scope.roles = data;
        }).error(function (data, status, headers, config) {
            toaster.pop('error', null, data.message);
        });
    };


    /**
     * 删除打印管理员
     */
    $scope.removePrinter = function (id) {
        var data = {
            id: id
        };
        $http
            .post('/admin/printer/remove', data)
            .success(function (data, status, headers, config) {
                toaster.pop('success', null, data.message);
                $scope.listPrinters();
            }).error(function (data, status, headers, config) {
                toaster.pop('error', null, data.message);
            });
    };


    /**
     * 启用或禁用打印管理员
     */
    $scope.enOrDisableUser = function (printer) {
        if (printer.status == 0) {
            $scope.deleteContent = "确认禁用该打印管理员吗？";
        } else {
            $scope.deleteContent = "确认启用该打印管理员吗？";
        }

        ngDialog.openConfirm({
            template: 'deleteConfirmDialogId',
            className: 'ngdialog-theme-default',//ngdialog-theme-plain ngdialog-theme-default
            scope: $scope
        }).then(function (value) {
            var data = {
                id: printer.id,
                status: printer.status == 0 ? 1 : 0
            };

            var url = printer.status == 0 ? '/admin/printer/disableUser' : '/admin/printer/enableUser';
            $http
                .post(url, data)
                .success(function (data, status, headers, config) {
                    toaster.pop('success', null, data.message);
                    $scope.listPrinters();
                }).error(function (data, status, headers, config) {
                    toaster.pop('error', null, data.message);
                });
        });
    };

    /**
     * 重置密码
     */
    $scope.resetPassword = function (id) {

        $scope.deleteContent = "确认重置密码吗？";

        ngDialog.openConfirm({
            template: 'deleteConfirmDialogId',
            className: 'ngdialog-theme-default',//ngdialog-theme-plain ngdialog-theme-default
            scope: $scope
        }).then(function (value) {
            var data = {
                id: id
            };

            var url = '/admin/printer/resetPassword';
            $http
                .post(url, data)
                .success(function (data, status, headers, config) {
                    toaster.pop('success', null, data.message);
                    $scope.listPrinters();
                }).error(function (data, status, headers, config) {
                    toaster.pop('error', null, data.message);
                });
        });
    };

}]);
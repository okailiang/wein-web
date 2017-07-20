/**=========================================================
 * Module: 反馈管理
 * Provides 反馈查询、详情
 =========================================================*/

App.controller('FeedbackController', ['$scope', '$http', 'toaster', 'ngDialog', function ($scope, $http, toaster, ngDialog) {
    $scope.pageSize = 20;//列表分页每页数
    $scope.currentPage = 1;
    $scope.feedback = {};

    $scope.handleParam = function (value) {
        if (value == undefined || value == null) {
            return '';
        }
        return value;
    };

    $scope.initFeedback = function () {
        $scope.feedback = {};
    };

    /**
     * 查询反馈列表
     */
    $scope.listFeedbacks = function () {
        $scope.loading = true;
        $scope.feedbacks = [];
        var listUrl = '/admin/feedback/listWithPage';
        var pageParam = '&pageSize=' + $scope.pageSize + '&curPage=' + $scope.currentPage
        var listParam = '?time=' + (new Date().getTime())
            + "&id=" + $scope.handleParam($scope.searchFeedbackId)
            + "&userName=" + $scope.handleParam($scope.searchUserName)
            + "&status=" + $scope.handleParam($scope.searchStatus)
            + "&type=" + $scope.handleParam($scope.searchType);
        $http.get(listUrl + listParam + pageParam).success(function (data) {
            $scope.loading = false;
            $scope.totalItems = data.totalCount;
            $scope.feedbacks = data.resultList;
        }).error(function (data, status, headers, config) {
            toaster.pop('error', null, data.message);
        });
    };

    //查询
    $scope.listFeedbacks();
    $scope.pageChanged = function (currentPage) {
        $scope.currentPage = currentPage;
        $scope.listFeedbacks();
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
            $scope.removeFeedback(id);
        });
    };

    /**
     * 修改反馈
     */
    $scope.saveFeedback = function () {
        var data = $scope.feedback;

        var url = $scope.feedback.id == undefined ? '/admin/feedback/save' : '/admin/feedback/update';
        $http
            .post(url, data)
            .success(function (data, status, headers, config) {
                $('#saveOrUpdateFeedbackDialog').modal('hide');
                toaster.pop('success', null, data.message);
                $scope.feedback = {};
                $scope.listFeedbacks();
            }).error(function (data, status, headers, config) {
                toaster.pop('error', null, data.message);
            });
    };

    /**
     * 详情
     */
    $scope.getFeedback = function (id, type) {
        var url = '/common/feedback/getById?id=' + id;
        $http.get(url).success(function (data) {
            $scope.feedback = data;
        }).error(function (data, status, headers, config) {
            toaster.pop('error', null, data.message);
        });
    }

}]);
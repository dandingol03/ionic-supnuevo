angular.module('app')
  .controller('theFifthController',function($scope,$state,$ionicLoading,$http,$cordovaProgress,$ionicModal) {
    $scope.barCodes = new Array();
    $scope.goods={};
    //初始化模态框
    $ionicModal.fromTemplateUrl('codeNum.html', {
           scope: $scope,
           animation: 'slide-in-up'
       }).then(function(modal) {
         $scope.barcodeModal = modal;
       });




    $scope.queryGoodsCode=function()
    {  var code=$scope.goods.codeNum;
      if(code!==null&&code.length==4) {
        $scope.barCodes = [];
        var o = {value: '', label: ''};
        o.label = 1;
        o.value = '00000000';
        $scope.barCodes.push(o);
        o.label = 2;
        o.value = '01010101';
        $scope.barCodes.push(o);
        $scope.barcodeModal.show();
      }
    }


    $scope.$on('$destroy', function() {
      $scope.barcodeModal.remove();
    });

  })


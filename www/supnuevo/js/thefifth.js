angular.module('app')
  .controller('theFifthController',function($scope,$state,$ionicLoading,$http,$cordovaProgress,$ionicModal) {
    $scope.barCodes = new Array();
    $scope.selectedCode = {codeNum:''};
    $scope.goods={};
    $scope.products={"campus1":{"college11":["major111","major112","major113"],"college12":["major121","major122","major123"]},
                     "campus2":{"college21":["major211","major212","major213"],"college22":["major221","major222","major223"]}
    }
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
    $scope.func=function(codeNum){
      $scope.selectedCode.codeNum=codeNum;
      $scope.barcodeModal.hide();
    };

  })








/**
 * Created by yiming on 16/10/26.
 */
angular.module('app')
  .controller('changeRelatedPriceController',function($scope,$state,$http,$ionicPlatform,locals,rmiPath){

    $scope.price=20000;
    $scope.selectedGood={code:0000,name:'搜到的商品'};
    $scope.groupGoods=[
      {code:'0001',name:'商品1',checked:true},{code:'0002',name:'商品2',checked:true},
      {code:'0003',name:'商品3',checked:true},{code:'0004',name:'商品4',checked:true}
      ];

    $scope.good_check = function(item){
      if(item.checked==true)
        item.checked=false;
      else
        item.checked=true;
    }

    $scope.changePriceRelated = function(){


    }



  })

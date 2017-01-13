/**
 * Created by yiming on 16/10/26.
 */
angular.module('app')
  .controller('changeRelatedPriceController',function($scope,$state,$http,$ionicPlatform,locals,
                                                      rmiPath,$stateParams,$rootScope,$location){

    $scope.relatedGoods=[];//从服务器传来的相关产品列表

    $scope.item=$stateParams.selectedCodeinfo;
   // alert('$scope.item'+$scope.item);

    if(Object.prototype.toString.call($scope.item)=='[object String]')
      $scope.item=JSON.parse($scope.item);

    //获取同组商品列表
    $http({
      method:"post",
      params:{
        priceId:$scope.item.priceId,
        merchantId:$rootScope.supnuevoMerchantId
      },
      url:rmiPath+"/supnuevo/supnuevoGetSupnuevoBuyerCommodityPriceFormListOfGroupMobile.do?",
    }).success(function(response){
      $scope.relatedGoods = response.array;
      $scope.relatedGoods.map(function(good,i) {
        if (good.priceId == $scope.item.priceId) {
          good.checked = true;
        }
        if(good.sizeValue!=undefined&&good.sizeValue!=null
          &&good.sizeUnit!=undefined&&good.sizeUnit!=null)
        {
          good.goodName=good.nombre+','+
            good.sizeValue+','+good.sizeUnit;
        }else{
          good.goodName=good.nombre;
        }

      })

    }).error(function(err){
      alert(err);
    })


    $scope.good_check = function(item){
      if(item.checked==true)
        item.checked=false;
      else
        item.checked=true;
    }

    $scope.selectAll = function(){
      $scope.relatedGoods.map(function(good,i) {
          good.checked = true;
      })
    }

    $scope.selectNo = function(){
      $scope.relatedGoods.map(function(good,i) {
        good.checked = false;
      })
    }

    $scope.goto=function(url){
      $location.path(url);
    };

    $scope.changePriceRelated = function(){

      var selectedRelativePriceIds=[];
      $scope.relatedGoods.map(function(good,i) {
        if(good.checked==true){
          selectedRelativePriceIds.push(good.priceId);
        }
      })

     // alert('$scope.item.printType'+$scope.item.printType);
      $http({
        method:"post",
        params:{
          priceShow:$scope.item.priceShow,
          priceIds:selectedRelativePriceIds.toString(),
          merchantId:$rootScope.supnuevoMerchantId,
          printType:$scope.item.printType,
          price:$scope.item.price,
        },
        url:rmiPath+"/supnuevo/supnuevoUpdateSupnuevoBuyerCommodityPriceGroupMobile.do?",
      }).success(function(response){

        alert('改价成功');

        $state.go('query');


      }).error(function(err){
        alert(err);
      })


    }



  })

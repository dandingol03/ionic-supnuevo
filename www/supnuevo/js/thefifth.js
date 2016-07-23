angular.module('app')
  .controller('theFifthController',function($scope,$state,$ionicLoading,$http,$cordovaProgress,$ionicModal) {
    $scope.catalogArrFirsts="";
    $scope.catalogArrSeconds="";
    $scope.catalogArrThirds="";
    $scope.catalogFirst="";
    $scope.catalogSecond="";
    $scope.catalogThird="";
    $scope.taxArrFirsts="";
    $scope.taxArrSeconds="";
    $scope.taxFirst="";
    $scope.taxSecond="";
    $scope.sizeUnitArrs="";


    $http.get("/proxy/supnuevo/supnuevoSupnuevoCommonCommodityModifyInitMobile.do?parentId=''")
      .success(function(response) {
        if (response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !== "") {
          var catalogArr = response.catalogArr;
          for (var i = 0; i < catalogArr.length; i++) {
            var o = {value: '', label: ''};
            o.label = catalogArr[i].label;
            o.value = catalogArr[i].value;
            $scope.catalogArrFirsts.push(o);
          }
        };
        if(response.taxArr!==undefined||response.taxArr!==null||response.taxArr!==""){
          var taxArr=response.taxArr;
          for (var i=0;i<taxArr.length;i++){
            var o={value:'',label:''};
            o.label=taxArr[i].label;
            o.value=taxArr[i].value;
            $scope.taxArrFirsts.push(o);
          }

        };
        if(response.sizeUnitArr!==undefined||response.sizeUnitArr!==null||response.sizeUnitArr!==""){
          var sizeUnitArr=response.sizeUnitArr;
          for(i=0;i<sizeUnitArr.length;i++){
           var o={value:'',label:''};
            o.label=sizeUnitArr[i].label;
            o.value=sizeUnitArr[i].value;
            $scope.sizeUnitArrs.push(o);
          }
        }
      })
      .error(function(){
        alert("error");
      });
    $scope.barCodes = new Array();
    $scope.selectedCode = {codeNum:''};
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
    $scope.getcatalogSecondInfo=function()
    {
      $http({
        method:"post",
        params:{
          parentId:$scope.catalogFirst
        },
        url:"/proxy/supnuevo/supnuevoGetSupnuevoCommonCommodityCataLogInfoListMobile.do",
        error:function(err){

        },
      }).success(function(response){


        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){
          $cordovaProgress.hide();
          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !==""){
            var catalogArr = new Array();
            for(var i = 0 ; i < array.length;i++){
              var o = {value:'',label:''};
              o.label = array[i].label;
              o.value = array[i].value;
              $scope.catalogArrSeconds.push(o);
            }
            $cordovaProgress.hide();
          }else{
            alert(response.message);
            $cordovaProgress.hide();
          }
        }
      }).error(function(err){
        alert(err.toSource());
        $cordovaProgress.show({
          template:'connect the server timeout',
          duration:'2000'
        });
      })
    }
    $scope.gecatalogThirdInfo=function()
    {
      $http({
        method:"post",
        params:{
          parentId:$scope.catalogSecond
        },
        url:"/proxy/supnuevo/supnuevoGetSupnuevoCommonCommodityCataLogInfoListMobile.do",
        error:function(err){

        },
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){
          $cordovaProgress.hide();
          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !==""){
            var catalogArr = new Array();
            for(var i = 0 ; i < array.length;i++){
              var o = {value:'',label:''};
              o.label = array[i].label;
              o.value = array[i].value;
              $scope.catalogArrThirds.push(o);
            }
            $cordovaProgress.hide();
          }else{
            alert(response.message);
            $cordovaProgress.hide();
          }
        }
      }).error(function(err){
        alert(err.toSource());
        $cordovaProgress.show({
          template:'connect the server timeout',
          duration:'2000'
        });
      })
    }



    $scope.$on('$destroy', function() {
      $scope.barcodeModal.remove();
    });
    $scope.func=function(codeNum){
      $scope.selectedCode.codeNum=codeNum;
      $scope.barcodeModal.hide();
    };

  });








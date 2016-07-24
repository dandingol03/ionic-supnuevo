angular.module('app')
  .controller('theFifthController',function($scope,$state,$ionicLoading,$http,$cordovaProgress,$ionicModal) {
    $scope.catalogArrFirsts=new Array;
    $scope.catalogArrSeconds=new Array;
    $scope.catalogArrThirds=new Array;
    $scope.catalogFirst={};
    $scope.catalogSecond="";
    $scope.catalogThird="";
    $scope.sizeValueArray =new Array;
    $scope.sizeValue="";
    $scope.sizeUnitArray=new Array;
    $scope.sizeUnit="";
    $scope.taxArrs=new Array;
    $scope.tax="";


    $scope.selected={};


    $scope.model = [{
      id: 10001,
      mainCategory: '男',
      productName: '水洗T恤',
      productColor: '白'
    }, {
      id: 10002,
      mainCategory: '女',
      productName: '圆领短袖',
      productColor: '黑'
    }, {
      id: 10003,
      mainCategory: '女',
      productName: '短袖短袖',
      productColor: '黃'
    }];

    $scope.getSelected=function(){
      console.log('....'+$scope.selected.product);
      console.log('..');
    }

    //$http.get("/proxy/supnuevo/supnuevoSupnuevoCommonCommodityModifyInitMobile.do?parentId=''")
    //  .success(function(response) {
    //    if (response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !== "") {
    //      var catalogArr = response.catalogArr;
    //      for (var i = 0; i < catalogArr.length; i++) {
    //        var o =new Object();
    //        o.label = catalogArr[i].label;
    //        o.value = catalogArr[i].value;
    //        $scope.catalogArrFirsts.push(o);
    //      }
    //    };
    //    if(response.taxArr!==undefined||response.taxArr!==null||response.taxArr!==""){
    //      var taxArr=response.taxArr;
    //      for (var i=0;i<taxArr.length;i++){
    //        var o={value:'',label:''};
    //        o.label=taxArr[i].label;
    //        o.value=taxArr[i].value;
    //        $scope.taxArrs.push(o);
    //      }
    //
    //    };
    //    if(response.sizeUnitArr!==undefined||response.sizeUnitArr!==null||response.sizeUnitArr!==""){
    //      var sizeUnitArr=response.sizeUnitArr;
    //      for(i=0;i<sizeUnitArr.length;i++){
    //       var o={value:'',label:''};
    //        o.label=sizeUnitArr[i].label;
    //        o.value=sizeUnitArr[i].value;
    //        $scope.sizeUnitArrs.push(o);
    //      }
    //    }
    //  })
    //  .error(function(){
    //    alert("error");
    //  });
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


    $scope.selectChange=function(){
      var fi=$scope.catalogFirst;
      console.log('fi=' + fi);
    }

    $scope.getcatalogSecondInfo=function()
    {
      console.log('id of ob='+ob.id);
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








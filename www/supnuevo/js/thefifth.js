angular.module('app')
  .controller('theFifthController',function($scope,$state,$ionicLoading,$http,$ionicModal,locals) {
    $scope.user = {username:locals.get('username',''),supnuevoMerchantId:locals.get('supnuevoMerchantId','')};
    $scope.catalogArrFirsts=new Array;
    $scope.catalogArrSeconds=[];
    $scope.catalogArrThirds=new Array;
    $scope.sizeUnitArray=new Array;
    $scope.scaleArray =new Array;
    $scope.taxArray=new Array;
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

    $http.get("/proxy/supnuevo/supnuevoSupnuevoCommonCommodityModifyInitMobile.do?parentId=''")
      .success(function(response) {
        if (response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !== "") {
          var catalogArr = response.catalogArr;
          for (var i = 0; i < catalogArr.length; i++) {
            var o =new Object();
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
            $scope.taxArray.push(o);
          }
        };
        if(response.sizeUnitArr!==undefined||response.sizeUnitArr!==null||response.sizeUnitArr!==""){
          var sizeUnitArr=response.sizeUnitArr;
          for(i=0;i<sizeUnitArr.length;i++){
            var o={value:'',label:''};
            o.label=sizeUnitArr[i].label;
            o.value=sizeUnitArr[i].value;
            $scope.sizeUnitArray.push(o);
          }
        }
      })
      .error(function(){
        alert("error");
      });
    $scope.barCodes = new Array();
    $scope.selectedCode = {codeNum:'',commodityId:''};
    $scope.goods={};

    $scope.modalClose=function(id){
      $scope[id].hide();
    }



    //初始化模态框
    $ionicModal.fromTemplateUrl('codeNum.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.barcodeModal = modal;
    });

    $ionicModal.fromTemplateUrl('additional.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.additionModal = modal;
    });

    $scope.editCommodity=function(a,b,c){
      //$scope.editModal.show();
      $scope.additionModal.show();
      if(a!==null&&a!==undefined){
        if(b!==null&&b!==undefined){
          $scope.category= a.label+"--"+ b.label;
          $scope.parentId= b.value;
        }else{
          $scope.category= a.label;
          $scope.parentId= a.value;
        }
      }else{
        $scope.category=""
        $scope.parentId=null;
      };
      $scope.beforeModify=c;

    }



    $scope.queryGoodsCode=function() {
      var code = $scope.goods.codeNum;
      if (code !== null && code.length == 4) {
        $scope.barCodes = [];
        $http({
          method: "post",
          params: {
            input: $scope.goods.codeNum
          },
          url: "/proxy/supnuevo/getQueryDataListByInputStringIonic.do",
          error: function (err) {
          },
        }).success(function (response) {
          if (response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== "") {

            alert(response.errorMessage);
            $state.go("login");
          } else {
            if (response.tmplist !== undefined || response.tmplist !== null || response.tmplist !== "") {
              var list = response.tmplist;
              for (var i = 0; i < list.length; i++) {
                var o = {commodityId: '', codigo: ''};
                o.commodityId = list[i].commodityId;
                o.codigo = list[i].codigo;
                $scope.barCodes.push(o);
              }
              $scope.barcodeModal.show();
            } else {
              alert(response.message);

            }
          }
        }).error(function (err) {
          alert(err.toSource());

        })
      }
    }
    $scope.selectChange=function(){
      var fi=$scope.catalogFirst;
      console.log('fi=' + fi);
    }

    $scope.getcatalogSecondInfo=function()
    {
      //  console.log('id of ob='+ob.id);
      $http({
        method:"post",
        params:{
          parentId:$scope.selected.catalogFirst.value
        },
        url:"/proxy/supnuevo/supnuevoGetSupnuevoCommonCommodityCataLogInfoListMobile.do"
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){

          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !==""){
            var arr = response.catalogArr;
            for(var i = 0 ; i < arr.length;i++){
              var o = {value:'',label:''};
              o.label = arr[i].label;
              o.value = arr[i].value;
              $scope.catalogArrSeconds.push(o);
            }

          }else{
            alert(response.message);

          }
        }
      }).error(function(err){
        alert(err.toSource());

      })
    }



    $scope.getcatalogThirdInfo=function()
    {
      $http({
        method:"post",
        params:{
          parentId:$scope.selected.catalogSecond.value
        },
        url:"/proxy/supnuevo/supnuevoGetSupnuevoCommonCommodityCataLogInfoListMobile.do",
        error:function(err){

        },
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){

          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !==""){
            var catalogArr = response.catalogArr;
            for(var i = 0 ; i < catalogArr.length;i++){
              var o = catalogArr[i];
              $scope.catalogArrThirds.push(o);
            }

          }else{
            alert(response.message);

          }
        }
      }).error(function(err){
        alert(err.toSource());

      })
    }
    $scope.getScaleValueArrs=function(){

      $http({
        method:"post",
        params:{
          sizeUnit:$scope.selected.sizeUnit.value
        },
        url:"/proxy/supnuevo/supnuevoGetSupnuevoScaleInfoListMobile.do",
        error:function(err){

        },
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){
          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.scaleArr !== undefined || response.scaleArr !== null || response.scaleArr !==""){
            var scaleArr = response.scaleArr;
            for(var i = 0 ; i < scaleArr.length;i++){
              var o = scaleArr[i];
              $scope.scaleArray.push(o);
            }
          }else{
            alert(response.message);
          }
        }
      }).error(function(err){
        alert(err.toSource());
      })
    }


    $scope.$on('$destroy', function() {
      $scope.barcodeModal.remove();
      $scope.editModal.remove();
    });

    $scope.fuck=function()
    {
      console.log('fuck.....');
    };
    $scope.addCommodity=function(commodity_name){
      $http({
        method:"post",
        params:{
          parentId:$scope.parentId,
          catalogName:commodity_name

        },
        url:"/proxy/supnuevo/supnuevoCommodityAddNewSupnuevoCommonCommodityCatalogMobile.do",

      }).success(function(response){
          alert(response.message);
          $scope.additionModal.hide();
        }
      ).error(function(err){
          alert(err.toSource());
        });
    };
    $scope.modifyCommodity=function(commodity_name){
      $http({
        method:"post",
        params:{
          catalogId:$scope.beforeModify,
          catalogName:commodity_name,
          supnuevoMerchantId:$scope.user.supnuevoMerchantId
        },
        url:"/proxy/supnuevo/supnuevoCommodityModifySupnuevoCommonCommodityCatalogMobile.do",

      }).success(function(response){
          alert(response.message);
          $scope.additionModal.hide();
        }
      ).error(function(err){
          alert(err.toSource());
        });
    };
    $scope.func=function(codeNum){

      $scope.barcodeModal.hide();
      $http({
        method: "post",
        params: {
          commodityId: codeNum
        },
        url: "/proxy/supnuevo/supnuevoGetSupnuevoCommonCommodityByCommodityIdMobile.do"
      }).success(function (response) {
        if (response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== "") {
          alert(response.errorMessage);
          $state.go("login");
        } else {
          if (response.object !== undefined || response.object !== null || response.object !== "") {
            if(response.marcaCatalogArr!==undefined&&response.marcaCatalogArr!==null)
                $scope.catalogArrSeconds=response.marcaCatalogArr;
            $scope.catalogArrThirds=response.presentacionCatalogArr;
            if(response.scaleUnitArr!==undefined&&response.scaleUnitArr!==null){
              $scope.scaleArray=response.scaleUnitArr;
            }else{
              $scope.scaleArray=[];
            }

            $scope.selected.catalogFirst=response.rubro;
            $scope.selected.catalogSecond=response.marca;
            $scope.selected.catalogThird=response.presentacion;
            $scope.nombre=response.nombre;
            $scope.sizeValue=response.sizeValue;
            var sizeu=response.sizeUnit;
            var scaleu=response.scaleUnit;
            var taxId=response.taxId;
            $scope.sizeUnitArray.map(function(item,i){
              if(item.value==sizeu){
                $scope.selected.sizeUnit=item;
              }
            });
            $scope.scaleArray.map(function(item,i){
              if(item.value==sizeu){
                $scope.selected.scaleArray=item;
              }
            });
            $scope.taxArray.map(function(item,i){
              if(item.value==sizeu){
                $scope.selected.tax=item;
              }
            });

          }
        }
      }).error(function (err) {
        alert("error");
      })
    }


  });








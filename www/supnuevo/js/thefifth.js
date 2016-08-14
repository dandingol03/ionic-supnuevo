angular.module('app')
  .controller('theFifthController',function($scope,$state,$ionicLoading,$http,$ionicModal,locals,rmiPath) {
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

    $http.get(rmiPath+"/supnuevo/supnuevoSupnuevoCommonCommodityModifyInitMobile.do?parentId=''")
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
    $scope.code={codigo:'',commodityId:''};

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
          $scope.flag=3;
        }else{
          $scope.category= a.label;
          $scope.parentId= a.value;
          $scope.flag=2;
        }
      }else{
        $scope.category=""
        $scope.parentId=null;
        $scope.flag=1;
      };
      $scope.beforeModify=c;

    }



    $scope.queryGoodsCode=function() {
      var code = $scope.code.codigo;
      if (code !== null && code.length == 4) {
        $scope.barCodes = [];
        $http({
          method: "post",
          params: {
            input: code
          },
          url:rmiPath+ "/supnuevo/getQueryDataListByInputStringIonic.do",
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
        url:rmiPath+"/supnuevo/supnuevoGetSupnuevoCommonCommodityCataLogInfoListMobile.do"
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){

          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !==""){
            var arr = response.catalogArr;
            $scope.catalogArrSeconds=new Array;
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
    $scope.getcatalogFirstInfo=function()
    {
      //  console.log('id of ob='+ob.id);
      $http({
        method:"post",
        url:rmiPath+"/supnuevo/supnuevoSupnuevoCommonCommodityModifyInitMobile.do?parentId=''"
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){

          alert(response.errorMessage);
          $state.go("login");
        }else{
          if (response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !== "") {
            var catalogArr = response.catalogArr;
            $scope.catalogArrFirsts=new Array;
            for (var i = 0; i < catalogArr.length; i++) {
              var o =new Object();
              o.label = catalogArr[i].label;
              o.value = catalogArr[i].value;
              $scope.catalogArrFirsts.push(o);
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
        url:rmiPath+"/supnuevo/supnuevoGetSupnuevoCommonCommodityCataLogInfoListMobile.do",
        error:function(err){

        },
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){

          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.catalogArr !== undefined || response.catalogArr !== null || response.catalogArr !==""){
            var catalogArr = response.catalogArr;
            $scope.catalogArrThirds=new Array;
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
        url:rmiPath+"/supnuevo/supnuevoGetSupnuevoScaleInfoListMobile.do",
        error:function(err){

        },
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){
          alert(response.errorMessage);
          $state.go("login");
        }else{
          if(response.scaleArr !== undefined || response.scaleArr !== null || response.scaleArr !==""){
            var scaleArr = response.scaleArr;
            $scope.scaleArray=new Array;
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
        url:rmiPath+"/supnuevo/supnuevoCommodityAddNewSupnuevoCommonCommodityCatalogMobile.do",

      }).success(function(response){
          alert(response.message);
          $scope.additionModal.hide();
          var flag=$scope.flag;
          if(flag==1){
            $scope.getcatalogFirstInfo();
          }else if(flag==2){
            $scope.getcatalogSecondInfo();
          }else if(flag==3){
            $scope.getcatalogThirdInfo();
          }
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
        url:rmiPath+"/supnuevo/supnuevoCommodityModifySupnuevoCommonCommodityCatalogMobile.do",

      }).success(function(response){
          alert(response.message);
          $scope.additionModal.hide();
          var flag=$scope.flag;
          if(flag==1){
            $scope.getcatalogFirstInfo();
          }else if(flag==2){
            $scope.getcatalogSecondInfo();
          }else if(flag==3){
            $scope.getcatalogThirdInfo();
          }
        }
      ).error(function(err){
          alert(err.toSource());
        });
    };
    $scope.getNombre=function(){
      var rubro= $scope.selected.catalogFirst.label;
      var marcar=$scope.selected.catalogSecond.label;
      var presen=$scope.selected.catalogThird.label;
      $scope.nombre=rubro.substring(0,3)+"-"+marcar.substring(0,3)+"-"+presen.substring(0,9);
    };
    $scope.saveCommondity=function(){
      $http({
        method: "post",
        params: {
          supnuevoMerchantId: $scope.user.supnuevoMerchantId,
          commodityId:$scope.code.commodityId,
          presentacionId:$scope.selected.catalogThird.value,
          taxId:$scope.selected.tax.value,
          nombre:$scope.nombre,
          sizeValue:$scope.sizeValue,
          sizeUnit:$scope.selected.sizeUnit.value,
          scaleUnit:$scope.selected.sizeValue.value
        },
        url: rmiPath+"/supnuevo/supnuevoUpdateSupnuevoCommonCommodityMobile.do"
      }).success(function(response){
          alert(response.message);
      }).error(function(){
        alert(err.toSource());
      })
    };
    $scope.cancel=function(){
      $state.go("login");
    };
    $scope.func=function(code){
      $scope.code=code;
      $scope.barcodeModal.hide();
      $http({
        method: "post",
        params: {
          commodityId: code.commodityId
        },
        url: rmiPath+"/supnuevo/supnuevoGetSupnuevoCommonCommodityByCommodityIdMobile.do"
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
            var scale=response.scaleUnit;
            var taxId=response.taxId;
            $scope.sizeUnitArray.map(function(item,i){
              if(item.value==sizeu){
                $scope.selected.sizeUnit=item;
              }
            });
            $scope.scaleArray.map(function(item,i){
              if(item.value==scale){
                $scope.selected.scaleArray=item;
              }
            });
            $scope.taxArray.map(function(item,i){
              if(item.value==taxId){
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








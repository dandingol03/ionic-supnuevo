/**
 * Created by yiming on 16/11/9.
 */
angular.module('app')
  .controller('addOrUpdateGoodsController',function($scope,$state,locals,$http,$stateParams,rmiPath,$ionicModal){

    $scope.commodity = {
      username:locals.get('username',''),
      codigo :'',
      nombre : '',
      sizeValue:'',
      sizeUnited:'',
      scaleUnited:'',
      taxId:'',
    }
    $scope.commodityTax = new Array();
    $scope.sizeUnit = new Array();
    $scope.scaleUnit = new Array();


    $scope.select={
    };
    $scope.selectChanged=function () {
      var item=$scope.select.item;
      alert('item');
    }

    $scope.optData = [{
      id: 10001,
      MainCategory: '男',
      ProductName: '水洗T恤',
      ProductColor: '白'
    },{
      id: 10002,
      MainCategory: '女',
      ProductName: '圓領短袖',
      ProductColor: '黃'
    },{
      id: 10003,
      MainCategory: '女',
      ProductName: '圓領短袖',
      ProductColor: '黃'
    }];


    if($stateParams.info!==undefined&&$stateParams.info!==null)
    {
      $scope.info=$stateParams.info;
      if(Object.prototype.toString.call($stateParams.info)=='[object String]')
        $scope.info=JSON.parse($scope.info);
    }

    if($scope.info.selectedCodeInfo!==undefined&&$scope.info.selectedCodeInfo!=null){
      $scope.selectedCodeInfo=$scope.info.selectedCodeInfo;
      if($scope.selectedCodeInfo.setSizeValue!=undefined&&$scope.selectedCodeInfo.setSizeValue!=null
        &&$scope.selectedCodeInfo.sizeUnit!=undefined&&$scope.selectedCodeInfo.sizeUnit!=null)
      {
        $scope.selectedCodeInfo.goodName=$scope.selectedCodeInfo.nombre+','+
          $scope.selectedCodeInfo.setSizeValue+','+$scope.selectedCodeInfo.sizeUnit;
      }else{
        $scope.selectedCodeInfo.goodName=$scope.selectedCodeInfo.nombre;
      }

    }

    if($scope.info.taxName!==undefined&&$scope.info.taxName!=null) {
      $scope.tax = $scope.info.taxName;

      if ($scope.info.sizeArr !== undefined && $scope.info.sizeArr != null) {
        $scope.sizeArr = $scope.info.sizeArr;
      }

      var tax = $scope.tax;
      var sizeArrJSON = $scope.sizeArr;
      for (var i = 0; i < tax.length; i++) {
        $scope.commodityTax.push(tax[i]);
      }
      for (var i = 0; i < sizeArrJSON.length; i++) {
        $scope.sizeUnit.push(sizeArrJSON[i]);
      }
    }

    $scope.goBack = function(){
      $state.go("query");
    }

    /*** select sizeUnit modal ***/
    $ionicModal.fromTemplateUrl('supnuevo/html/sizeUnit_modal.html',{
      scope:  $scope,
      animation: 'animated '+'bounceInUp',
      hideDelay:920
    }).then(function(modal) {
      $scope.sizeUnit_modal = modal;
    });

    $scope.open_sizeUnitModal= function(){
      $scope.sizeUnit_modal.show();
    };

    $scope.close_sizeUnitModal= function() {
      $scope.sizeUnit_modal.hide();
    };
    /*** select sizeUnit modal ***/


    $scope.changeSizeUnit = function(){
      $scope.scaleUnit = [];
      var val = $scope.commodity.sizeUnited;
      if(val !== null && val !== undefined && val !== ""){
        alert('val='+val);
        $http({
          method:"post",
          params:{sizeUnit:val},
          url:rmiPath+"/supnuevo/supnuevoGetSupnuevoScaleInfoListMobile.do",
        }).success(function(response){
          var scaleArr = new Array();
          response.scaleArr.map(function(index,i){
            scaleArr.push(index);
          })
          for(var i = 0 ; i < scaleArr.length;i++){
            var o = {'value':'','label':''};
            o.label = scaleArr[i].label;
            o.value = scaleArr[i].value;
            $scope.scaleUnit.push(o);
          }
        }).error(function(err){
          for(var field in err){
            alert('field'+field);
          }
          alert(err.toString());
        })
      }

    }
    $scope.changeScaleUnit = function(){

    }
    $scope.changeTax = function(){

    }


    $scope.addSupnuevoCommonCommodity = function(){

      if($scope.selectedCodeInfo!=undefined&&$scope.selectedCodeInfo!=null){
        var codigo = $scope.selectedCodeInfo.codigo;
        var taxId = $scope.commodity.taxId;
        if($scope.commodity.nombre==undefined||$scope.commodity.nombre==null||$scope.commodity.nombre==''){
          $scope.commodity.nombre=$scope.selectedCodeInfo.goodName;
        }
        var nombre = $scope.commodity.nombre;
        var sizeValue = $scope.commodity.sizeValue;
        var sizeUnited = $scope.commodity.sizeUnited;
        var scaleUnited = $scope.commodity.scaleUnited;
        var supnuevoMerchantId = locals.get('supnuevoMerchantId','');
        if(codigo === null || codigo === undefined || codigo === ''){
          alert("商品条码不能为空");
          return false;
        }
        if(taxId === null || taxId === undefined || taxId === ''){
          alert("商品税类不能为空");
          return false;
        }
        if(nombre === null || nombre === undefined || nombre === ''){
          alert("商品名称不能为空");
          return false;
        }
        if(nombre !== null || nombre !== undefined || nombre !== ''){

          var reg=eval('/^\\w{10,}$/');
          var re=reg.exec(nombre);
          if(re==undefined||re==null){
            alert("商品名称不能少于10位");
            return false;
          }
        }

        if(sizeValue === null || sizeValue === undefined || sizeValue === ''){
          alert("商品含量不能为空");
          return false;
        }
        if(sizeUnited === null || sizeUnited === undefined || sizeUnited === ''){
          alert("含量单位不能为空");
          return false;
        }
        if(scaleUnited === null || scaleUnited === undefined || scaleUnited === ''){
          alert("比价单位不能为空");
          return false;
        }
        $http({
          method:"post",
          params:{
            taxId:taxId,
            codigo:codigo,
            supnuevoMerchantId:supnuevoMerchantId,
            nombre:nombre,
            sizeValue:sizeValue,
            sizeUnited:sizeUnited,
            scaleUnited:scaleUnited
          },
          url:rmiPath+"/supnuevo/supnuevoSaveOrUpdateSupnuevoCommonCommodityMobile.do",
        }).success(function(response){

          var errorMsg = response.errorMsg;
          var message = response.message;
          if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
            alert(errorMsg);
            $scope.commodity = {
              codigo :'',
              nombre : '',
              sizeValue:'',
              sizeUnited:'',
              scaleUnited:'',
              taxId:'',
            }
          }
          if(message !== null && message !== undefined && message !== ""){
            alert(message);
            $scope.commodity = {
              codigo :'',
              nombre : '',
              sizeValue:'',
              sizeUnited:'',
              scaleUnited:'',
              taxId:'',
            }
            $state.go('query');
          }

        }).error(function(err){
          alert(err);
        })

      }
      else{

        var codigo = $scope.commodity.codigo;
        var taxId = $scope.commodity.taxId;
        var nombre = $scope.commodity.nombre;
        var sizeValue = $scope.commodity.sizeValue;
        var sizeUnited = $scope.commodity.sizeUnited;
        var scaleUnited = $scope.commodity.scaleUnited;
        var supnuevoMerchantId = locals.get('supnuevoMerchantId','');
        if(codigo === null || codigo === undefined || codigo === ''){
          alert("商品条码不能为空");
          return false;
        }

        if(codigo !== null || codigo !== undefined || codigo !== ''){
          var reg=eval('/^\\w{5,}$/');
          var re=reg.exec(codigo);
          if(re==undefined||re==null){
            alert("商品条码不能少于5位");
            return false;
          }
        }
        if(taxId === null || taxId === undefined || taxId === ''){
          alert("商品税类不能为空");
          return false;
        }
        if(nombre === null || nombre === undefined || nombre === ''){
          alert("商品名称不能为空");
          return false;
        }
        if(nombre !== null || nombre !== undefined || nombre !== ''){

          var reg=eval('/^\\w{10,}$/');
          var re=reg.exec(nombre);
          if(re==undefined||re==null){
            alert("商品名称不能少于10位");
            return false;
          }
        }

        if(sizeValue === null || sizeValue === undefined || sizeValue === ''){
          alert("商品含量不能为空");
          return false;
        }
        if(sizeUnited === null || sizeUnited === undefined || sizeUnited === ''){
          alert("含量单位不能为空");
          return false;
        }
        if(scaleUnited === null || scaleUnited === undefined || scaleUnited === ''){
          alert("比价单位不能为空");
          return false;
        }
        $http({
          method:"post",
          params:{
            taxId:taxId,
            codigo:codigo,
            supnuevoMerchantId:supnuevoMerchantId,
            nombre:nombre,
            sizeValue:sizeValue,
            sizeUnited:sizeUnited,
            scaleUnited:scaleUnited
          },
          url:rmiPath+"/supnuevo/supnuevoSaveOrUpdateSupnuevoCommonCommodityMobile.do",
        }).success(function(response){
          var errorMsg = response.errorMsg;
          var message = response.message;
          if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
            alert(errorMsg);
            $scope.commodity = {
              codigo :'',
              nombre : '',
              sizeValue:'',
              sizeUnited:'',
              scaleUnited:'',
              taxId:'',
            }
          }
          if(message !== null && message !== undefined && message !== ""){
            alert(message);
            $scope.commodity = {
              codigo :'',
              nombre : '',
              sizeValue:'',
              sizeUnited:'',
              scaleUnited:'',
              taxId:'',
            }
            $state.go('query');
          }

        }).error(function(err){
          alert(err);
        })

      }

    }





  })

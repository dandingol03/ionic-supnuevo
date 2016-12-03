/**
 * Created by yiming on 16/11/9.
 */
angular.module('app')
  .controller('addOrUpdateGoodsController',function($scope,$rootScope,$state,locals,$http,$stateParams,rmiPath){

    $scope.commodityTax = new Array();
    $scope.sizeUnit = new Array();
    $scope.scaleUnit = new Array();


    $scope.changeSizeUnit = function(){

      $scope.scaleUnit = [];
      var val = $scope.commodity.sizeUnited;
      if(val !== null && val !== undefined && val !== ""){
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



    if($stateParams.info!==undefined&&$stateParams.info!==null)
    {
      $scope.info=$stateParams.info;
      if(Object.prototype.toString.call($stateParams.info)=='[object String]')
        $scope.info=JSON.parse($scope.info);
    }

    if($scope.info.selectedCodeInfo!==undefined&&$scope.info.selectedCodeInfo!=null){
      $scope.selectedCodeInfo=$scope.info.selectedCodeInfo;
      $scope.commodity = {
        username:locals.get('username',''),
        codigo :'',
        nombre : '',
        sizeValue:'',
        sizeUnited: '',
        scaleUnited:'',
        taxId:'',
      }

      $scope.commodity.nombre = $scope.selectedCodeInfo.nombre;
      $scope.commodity.sizeValue = $scope.selectedCodeInfo.setSizeValue;
      $scope.commodity.sizeUnited = $scope.selectedCodeInfo.sizeUnit;
      $scope.commodity.scaleUnited = $scope.selectedCodeInfo.scaleUnit;
      $scope.commodity.taxId = $scope.selectedCodeInfo.taxId;

      $scope.changeSizeUnit();

    }else{
      $scope.commodity = {
        username:locals.get('username',''),
        codigo :'',
        nombre : '',
        sizeValue:'',
        sizeUnited:'',
        scaleUnited:'',
        taxId:'',
      }

    }

    if($scope.info.myHTML!==undefined&&$scope.info.myHTML!==null){
       $scope.myHTML=$scope.info.myHTML;
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


    $scope.ob={};

    if($scope.commodityTax.length>0)
    {
      if($scope.commodity.taxId=='')
      {
        $scope.ob.selectedTax=$scope.commodityTax[0];
      }else{
        $scope.commodityTax.map(function(tax,i) {
          if(tax.value==$scope.commodity.taxId){
            $scope.ob.selectedTax=$scope.commodityTax[i];
            $scope.commodity.taxId = $scope.ob.selectedTax.value;

          }

        })
      }
    }


    $scope.taxChange=function () {
      $scope.commodity.taxId=$scope.ob.selectedTax.value;
    }


    $scope.goBack = function(){

      if($scope.info.selectedCodeInfo!==undefined&&$scope.info.selectedCodeInfo!=null){
        $rootScope.codeNum=$scope.selectedCodeInfo.codigo;
        $state.go("query");
      }else{
        $state.go("query");
      }

    }

    $scope.changeScaleUnit = function(){

    }
    $scope.changeTax = function(){

    }



    $scope.addSupnuevoCommonCommodity = function(){

      //修改信息
      if($scope.selectedCodeInfo!=undefined&&$scope.selectedCodeInfo!=null){
        var codigo = $scope.selectedCodeInfo.codigo;
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
        if(taxId === null || taxId === undefined || taxId === ''){
          alert("商品税类不能为空");
          return false;
        }
        if(nombre === null || nombre === undefined || nombre === ''){
          alert("商品名称不能为空");
          return false;
        }
        if(nombre !== null || nombre !== undefined || nombre !== ''){
          if(nombre.length<10){
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

            $rootScope.codeNum=$scope.selectedCodeInfo.codigo;
            $state.go('query');
          }

        }).error(function(err){
          alert(err);
        })

      }
      //添加商品
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
          if(codigo.length<5){
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
          if(nombre.length<10){
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
            $rootScope.codeNum=$scope.commodity.codigo;
            $state.go('query');
          }

        }).error(function(err){
          alert(err);
        })

      }

    }





  })

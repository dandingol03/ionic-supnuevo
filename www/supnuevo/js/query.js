   angular.module('app')
  .controller('queryController',function($scope,$state,$http,$ionicPlatform,locals,rmiPath,$ionicModal,$ionicPopup,$rootScope){
    $scope.user = {username:locals.get('username',''),supnuevoMerchantId:locals.get('supnuevoMerchantId','')};
    $scope.selectedCode = {codeNum:''};

    $scope.goods = {codeNum:''};
    $scope.barCodes = new Array();
    $scope.tax = new Array();
    $scope.sizeArr = new Array();
    $scope.selectedCodeInfo = {priceId:'',price:'',oldPrice:'',priceShow:"",price1:'',nombre:'',codigo:'',iva:'',printType:''};

    $scope.printType = {type1:'0',type2:'0',type3:'0',type4:'0'};
    $scope.taxMark = 0;
    $scope.amount = 0;
    $scope.class = {
      class1:'button button-block button-stable',
      class2:'button button-block button-stable',
      class3:'button button-block button-stable',
      class4:'button button-block button-stable'};

    $ionicModal.fromTemplateUrl('codeNum.html', function(modal) {
      $scope.codeNumModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });



    $scope.queryGoodsCode = function(){
      var code = $scope.goods.codeNum;
      if(code !== null && code !== undefined && code !== "" &&　code.length === 4){
        $scope.taxMark = 0;
        $scope.amount = 0;
        $scope.barCodes = [];
        $scope.selectedCodeInfo = {
          priceId: '',
          price: '',
          oldPrice: '',
          priceShow: '',
          price1: '',
          nombre: '',
          codigo: '',
          iva: '',
          printType: ''
        };
        $scope.printType = {type1: '0', type2: '0', type3: '0', type4: '0'};
        $scope.taxMark = 0;
        $scope.class = {
          class1: 'button button-block button-stable',
          class2: 'button button-block button-stable',
          class3: 'button button-block button-stable',
          class4: 'button button-block button-stable'
        }
            //$cordovaProgress.show('qq');
        $http({
          method:"post",
          params:{
            codigo:code,
            merchantId:$scope.user.supnuevoMerchantId
          },

          url:rmiPath+"/supnuevo/supnuevoGetQueryDataListByInputStringBs.do",
          error:function(err){

          },
        }).success(function(response){
          //cordova.plugins.Keyboard.close();
          $scope.goods.codeNum = '';
          if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){
            //TODO:add ionicloading plugin
            alert(response.errorMessage);
            $state.go("login");
          }else{
          if(response.message === undefined || response.message === null || response.message ===""){
          var array = new Array();
          response.array.map(function(index,i){
            array.push(index);
          });
          $scope.barCodes = [];
          for(var i = 0 ; i < array.length;i++){
            var o = {value:'',label:''};
            o.label = array[i].commodityId;
            o.value = array[i].codigo;
            $scope.barCodes.push(o);
          }

          $scope.codeNumModal.show();
          }else{
            alert(response.message);

          }
        }
        }).error(function(err){
          alert(err.toSource());

        })

      }

    }

    $scope.func = function(codeNum){
     // var codigo = $scope.selectedCode[codeNum]
      var supnuevoMerchantId =  $scope.user.supnuevoMerchantId;
      var codigo = codeNum;

      $scope.selectedCode.codeNum = codigo;
      $scope.code = [];
      $scope.myHTML='';

      var i = 0;
      var length = codeNum.length;
      var count = length%5;
      while(i<count-1) {
        $scope.myHTML = $scope.myHTML+'<span>'+codeNum.substring(i*5,i*5+5)+'</span>';
        i=i+1;
      }
      if(i==count-1){
        $scope.myHTML = $scope.myHTML+'<span>'+codeNum.substring(i*5,length)+'</span>';
      }

        $scope.codeNumModal.hide();

      $http({
        method:"post",
        params:{
          codigo:codigo,
          supnuevoMerchantId:supnuevoMerchantId
        },
        url:rmiPath+"/supnuevo/supnuevoGetSupnuevoBuyerPriceFormByCodigoBs.do",
      }).success(function(response){
        var goodInfo = response.object;

        for(var info in goodInfo){
          $scope.selectedCodeInfo[info] = goodInfo[info];
        }
        if($scope.selectedCodeInfo.setSizeValue!=undefined&&$scope.selectedCodeInfo.setSizeValue!=null
          &&$scope.selectedCodeInfo.sizeUnit!=undefined&&$scope.selectedCodeInfo.sizeUnit!=null)
        {
          $scope.selectedCodeInfo.goodName=$scope.selectedCodeInfo.nombre+','+
            $scope.selectedCodeInfo.setSizeValue+','+$scope.selectedCodeInfo.sizeUnit;
        }
        else{
          $scope.selectedCodeInfo.goodName=$scope.selectedCodeInfo.nombre;
        }

        var printType = goodInfo["printType"];
        for(var i = 0 ; i < printType.length; i++){
          var j = i + 1;
          var type = "type" + j;
          var clazz= "class" + j;
          $scope.printType[type]=printType.charAt(i);
          if(printType.charAt(i) == '1')
            $scope.class[clazz] = 'button button-block button-positive';
          else
            $scope.class[clazz] = 'button button-block button-stable';
        }
      }).error(function(err){
        alert(err);
      })
    }


    //修改和添加的数据同步
    if($rootScope.codeNum!==undefined&&$rootScope.codeNum!==null)
    {
      $scope.newFunc = function(codeNum){
        var supnuevoMerchantId =  $scope.user.supnuevoMerchantId;
        var codigo = codeNum;

        $scope.selectedCode.codeNum = codigo;
        $scope.code = [];
        $scope.myHTML='';

        var i = 0;
        var length = codeNum.length;
        var count = length%5;
        while(i<count-1) {
          $scope.myHTML = $scope.myHTML+'<span>'+codeNum.substring(i*5,i*5+5)+'</span>';
          i=i+1;
        }
        if(i==count-1){
          $scope.myHTML = $scope.myHTML+'<span>'+codeNum.substring(i*5,length)+'</span>';
        }

        $http({
          method:"post",
          params:{
            codigo:codigo,
            supnuevoMerchantId:supnuevoMerchantId
          },
          url:rmiPath+"/supnuevo/supnuevoGetSupnuevoBuyerPriceFormByCodigoBs.do",
        }).success(function(response){
          var goodInfo = response.object;

          for(var info in goodInfo){
            $scope.selectedCodeInfo[info] = goodInfo[info];
          }
          if($scope.selectedCodeInfo.setSizeValue!=undefined&&$scope.selectedCodeInfo.setSizeValue!=null
            &&$scope.selectedCodeInfo.sizeUnit!=undefined&&$scope.selectedCodeInfo.sizeUnit!=null)
          {
            $scope.selectedCodeInfo.goodName=$scope.selectedCodeInfo.nombre+','+
              $scope.selectedCodeInfo.setSizeValue+','+$scope.selectedCodeInfo.sizeUnit;
          }else{
            $scope.selectedCodeInfo.goodName=$scope.selectedCodeInfo.nombre;
          }

          $rootScope.codeNum=null;

          var printType = goodInfo["printType"];
          for(var i = 0 ; i < printType.length; i++){
            var j = i + 1;
            var type = "type" + j;
            var clazz= "class" + j;
            $scope.printType[type]=printType.charAt(i);
            if(printType.charAt(i) == '1')
              $scope.class[clazz] = 'button button-block button-positive';
            else
              $scope.class[clazz] = 'button button-block button-stable';
          }
        }).error(function(err){
          alert(err);
        })
      }

      $scope.newFunc($rootScope.codeNum);



    }




    $scope.verify = function(){
     // if(cordova.plugins.Keyboard.isVisible){
      // }else{
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.priceShow * 100)/100;
        $scope.selectedCodeInfo.price1 = Math.round($scope.selectedCodeInfo.priceShow * 100)/100;
        $scope.taxMark = 0;
        $scope.amount = 0;
      //}
    }
    $scope.verify1 = function(){
      if(isNaN($scope.selectedCodeInfo.priceShow)){
        var reg = /[a-z]/;
        $scope.selectedCodeInfo.priceShow = $scope.selectedCodeInfo.priceShow.replace(reg, "0");
        $scope.selectedCodeInfo.price = $scope.selectedCodeInfo.priceShow;
        cordova.plugins.Keyboard.close();
      }
    }
    $scope.getGoodInfo = function(){
      console.log("aa");
    }

    $scope.updatePrice = function(){
      $scope.selectedCodeInfo.price =  $scope.selectedCodeInfo.oldPrice;
      $scope.selectedCodeInfo.priceShow =  $scope.selectedCodeInfo.oldPrice;
      $scope.selectedCodeInfo.price1 =  $scope.selectedCodeInfo.oldPrice;
      $scope.taxMark = 0;
      $scope.amount = 0;
    }
    $scope.doClearGoodCode = function(){
      cordova.plugins.Keyboard.close();
      $scope.goods.codeNum = "";
      $scope.taxMark = 0;
      $scope.amount = 0;
      $scope.goods = {codeNum: ''};
      $scope.barCodes = [];
      $scope.selectedCodeInfo = {
        priceId: '',
        price: '',
        oldPrice: '',
        priceShow: '',
        price1: '',
        nombre: '',
        codigo: '',
        iva: '',
        printType: ''
      };
      $scope.printType = {type1: '0', type2: '0', type3: '0', type4: '0'};
      $scope.taxMark = 0;
      $scope.class = {
        class1: 'button button-block button-stable',
        class2: 'button button-block button-stable',
        class3: 'button button-block button-stable',
        class4: 'button button-block button-stable'
      }
    }
    $scope.doClearCodeNum = function(){
      cordova.plugins.Keyboard.close();
      $scope.selectedCodeInfo.priceShow = "";
    }
    $scope.addGoods=function(){
        $http({
          method:"post",
          params:{
            merchantId:$scope.user.supnuevoMerchantId
          },
          url:rmiPath+"/supnuevo/supnuevoGetSupnuevoCommodityTaxInfoListMobile.do",
        }).success(function(response){
          if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){
            alert(response.errorMessage);
            $state.go("login");
          }else{
          var taxArr = new Array();
          var sizeArr = new Array();
          response.taxArr.map(function(index,i){
            taxArr.push(index);
          })
          response.sizeArr.map(function(index,i){
            sizeArr.push(index);
          })
            for(var i = 0 ; i < taxArr.length;i++){
              var o = {'value':'','label':''};
              o.label = taxArr[i].label;
              o.value = taxArr[i].value;
              $scope.tax.push(o);
            }
          for(var i = 0 ; i < sizeArr.length;i++){
            var o = {'value':'','label':''};
            o.label = sizeArr[i].label;
            o.value = sizeArr[i].value;
            $scope.sizeArr.push(o);
          }
          $state.go("addOrUpdateGoods",{info:JSON.stringify({taxName:$scope.tax,sizeArr:$scope.sizeArr,myHtml:$scope.myHTML})});
          }

        }).error(function(){

        })

    }

    $scope.updateGoods=function(){

      $http({
        method:"post",
        params:{
          merchantId:$scope.user.supnuevoMerchantId
        },
        url:rmiPath+"/supnuevo/supnuevoGetSupnuevoCommodityTaxInfoListMobile.do",
      }).success(function(response){
        if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== ""){
          alert(response.errorMessage);
          $state.go("login");
        }else{
          var taxArr = new Array();
          var sizeArr = new Array();
          response.taxArr.map(function(index,i){
            taxArr.push(index);
          })
          response.sizeArr.map(function(index,i){
            sizeArr.push(index);
          })
          for(var i = 0 ; i < taxArr.length;i++){
            var o = {'value':'','label':''};
            o.label = taxArr[i].label;
            o.value = taxArr[i].value;
            $scope.tax.push(o);
          }
          for(var i = 0 ; i < sizeArr.length;i++){
            var o = {'value':'','label':''};
            o.label = sizeArr[i].label;
            o.value = sizeArr[i].value;
            $scope.sizeArr.push(o);
          }

          if($scope.selectedCodeInfo.codigo!=undefined&&$scope.selectedCodeInfo.codigo!=null&&$scope.selectedCodeInfo.codigo!=''){
            $state.go("addOrUpdateGoods",
              {info:JSON.stringify({selectedCodeInfo:$scope.selectedCodeInfo,taxName:$scope.tax,sizeArr:$scope.sizeArr,myHTML:$scope.myHTML})});
          }else{
            alert('请先选择要修改的商品！');

          }

          }


      }).error(function(){

      })

        }




    $scope.addIVA = function(){
        if($scope.taxMark >= 0){
          $scope.taxMark = 1;
        }else if($scope.taxMark < 0){
          $scope.taxMark = 0;
        }
        $scope.selectedCodeInfo.price = (Math.round($scope.selectedCodeInfo.price1 * (1 + $scope.taxMark * $scope.selectedCodeInfo.iva)*(1 + $scope.amount) *100))/100;
        $scope.selectedCodeInfo.priceShow = $scope.selectedCodeInfo.price;


    }
    $scope.addPercentage1=function(){
        $scope.amount =  $scope.amount + 0.1;
        $scope.selectedCodeInfo.price = (Math.round($scope.selectedCodeInfo.price1 * (1 + $scope.taxMark * $scope.selectedCodeInfo.iva)*(1 + $scope.amount) *100))/100;
        $scope.selectedCodeInfo.priceShow = $scope.selectedCodeInfo.price;
    }
    $scope.addPercentage2=function(){
      $scope.amount =  $scope.amount + 0.05;
      $scope.selectedCodeInfo.price = (Math.round($scope.selectedCodeInfo.price1 * (1 + $scope.taxMark * $scope.selectedCodeInfo.iva)*(1 + $scope.amount) *100))/100;
      $scope.selectedCodeInfo.priceShow = $scope.selectedCodeInfo.price;
    }
    $scope.zero=function(){
      $scope.selectedCodeInfo.price = new Number(parseInt($scope.selectedCodeInfo.price));
      $scope.selectedCodeInfo.priceShow =$scope.selectedCodeInfo.price.toFixed(2);
    }
    $scope.reduceIVA=function(){
      if($scope.taxMark <= 0){
        $scope.taxMark = -1;
      }else if($scope.taxMark > 0){
        $scope.taxMark = 0;
      }
        $scope.selectedCodeInfo.price = Math.round($scope.selectedCodeInfo.price1 * (1 +  $scope.taxMark*$scope.selectedCodeInfo.iva)*(1 + $scope.amount)*100)/100;
        $scope.selectedCodeInfo.priceShow = $scope.selectedCodeInfo.price;
    }
    $scope.reducePercentage1=function(){
      $scope.amount =  $scope.amount - 0.1;
      $scope.selectedCodeInfo.price = (Math.round($scope.selectedCodeInfo.price1 * (1 + $scope.taxMark * $scope.selectedCodeInfo.iva)*(1 + $scope.amount) *100))/100;
      $scope.selectedCodeInfo.priceShow = $scope.selectedCodeInfo.price;
    }
    $scope.reducePercentage2=function(){
      $scope.amount =  $scope.amount - 0.05;
      $scope.selectedCodeInfo.price = (Math.round($scope.selectedCodeInfo.price1 * (1 + $scope.taxMark * $scope.selectedCodeInfo.iva)*(1 + $scope.amount) *100))/100;
        $scope.selectedCodeInfo.priceShow = $scope.selectedCodeInfo.price;

    }
    $scope.zero1=function(){
      $scope.selectedCodeInfo.price = new Number(parseInt($scope.selectedCodeInfo.price)+'.50');
      $scope.selectedCodeInfo.priceShow =$scope.selectedCodeInfo.price.toFixed(2);
    }
    $scope.savePrice = function(){
      var price = $scope.selectedCodeInfo.priceShow;
      var priceId = $scope.selectedCodeInfo.priceId;
      var codigo = $scope.selectedCodeInfo.codigo;
      var merchantId = $scope.user.supnuevoMerchantId;
      var type1 = $scope.printType.type1;
      var type2 = $scope.printType.type2;
      var type3 = $scope.printType.type3;
      var type4 = $scope.printType.type4;
      var printType = type1 + type2 + type3 + type4;
      if(price !== null && price !== undefined && price !== ''){
        $http({
          method:"post",
          params:{
            price:price,
            priceId:priceId,
            printType: printType,
            codigo:codigo,
            merchantId:merchantId
          },
          url:rmiPath+"/supnuevo/supnueSaveOrUpdateSupnuevoBuyerCommodityPriceMobile.do?",
        }).success(function(response){
          if(response.errorMessage !== null && response.errorMessage !== undefined && response.errorMessage !== "") {
            alert(response.errorMessage);
            $state.go("login");
          }else {
            var o = response.message;
            alert(o);
            $scope.taxMark = 0;
            $scope.amount = 0;
            $scope.goods = {codeNum: ''};
            $scope.barCodes = [];
            $scope.selectedCode={codeNum:'',codeNum1:'',codeNum2:'',codeNum3:''};
            $scope.myHTML='';

            $scope.selectedCodeInfo = {
              priceId: '',
              price: '',
              oldPrice: '',
              priceShow: '',
              price1: '',
              nombre: '',
              codigo: '',
              iva: '',
              printType: '',
              codeNum:''
            };
            $scope.printType = {type1: '0', type2: '0', type3: '0', type4: '0'};
            $scope.taxMark = 0;
            $scope.class = {
              class1: 'button button-block button-stable',
              class2: 'button button-block button-stable',
              class3: 'button button-block button-stable',
              class4: 'button button-block button-stable'
            }
          }
        }).error(function(err){
          alert(err);
        })
      }else{
        alert('请输入查询商品后再进行改价!');
      }
    }

    $scope.updatePrintType1 = function(){
      if($scope.printType.type1 == '0'){
        $scope.class.class1 = "button button-block button-positive";
        $scope.printType.type1 = '1';
      }else if($scope.printType.type1 == '1'){
        $scope.class.class1 = "button button-block button-stable";
        $scope.printType.type1 = '0';
      }
    }
    $scope.updatePrintType2 = function(){
      if($scope.printType.type2 == '0'){
        $scope.class.class2 = "button button-block button-positive";
        $scope.printType.type2 = '1';
      }else if($scope.printType.type2 == '1'){
        $scope.class.class2 = "button button-block button-stable";
        $scope.printType.type2 = '0';
      }
    }
    $scope.updatePrintType3 = function(){
      if($scope.printType.type3 == '0'){
        $scope.class.class3 = "button button-block button-positive";
        $scope.printType.type3 = '1';
      }else if($scope.printType.type3 == '1'){
        $scope.class.class3 = "button button-block button-stable";
        $scope.printType.type3 = '0';
      }
    }
    $scope.updatePrintType4 = function(){
      if($scope.printType.type4 == '0'){
        $scope.class.class4 = "button button-block button-positive";
        $scope.printType.type4 = '1';
      }else if($scope.printType.type4 == '1'){
        $scope.class.class4 = "button button-block button-stable";
        $scope.printType.type4 = '0';
      }
    }
    $scope.$on('$destroy', function() {
      $scope.codeNumModal.remove();
    })

    $scope.changePriceRelated = function(){

      var type1 = $scope.printType.type1;
      var type2 = $scope.printType.type2;
      var type3 = $scope.printType.type3;
      var type4 = $scope.printType.type4;
      $scope.selectedCodeInfo.printType = type1 + type2 + type3 + type4;

     // alert('printType='+$scope.selectedCodeInfo.printType);
      if($scope.selectedCodeInfo.groupId!=null&&$scope.selectedCodeInfo.groupId!=undefined){
        $state.go('changeRelatedPrice',{selectedCodeinfo:JSON.stringify($scope.selectedCodeInfo)});
        $scope.selectedCode.codeNum='';
        $scope.myHTML='';
        $scope.selectedCodeInfo = {
          priceId: '',
          price: '',
          oldPrice: '',
          priceShow: '',
          price1: '',
          nombre: '',
          codigo: '',
          iva: '',
          printType: ''
        };
      }else{

        var confirmPopup = $ionicPopup.confirm({
          title: '组改价',
          template: '没有查询到相关商品,单击确定修改当前商品价格'
        });
        confirmPopup.then(function(res) {
          if(res) {
            $scope.savePrice();
          } else {
            console.log('You are not sure');
          }
        });
      }

    }


  })


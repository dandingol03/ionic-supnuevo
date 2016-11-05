angular.module('app')
.controller('loginController',function($scope,$state,$ionicLoading,$http,$cordovaProgress,$cordovaNetwork,locals,rmiPath
,$rootScope){

    var supnuevoUrl=rmiPath+"/supnuevo/supnuevoGetUserLoginJSONObjectMobile.do";

    $scope.user = [{
      'username':'',
      'password':'',
    }];
    $scope.username=new Object();
    $scope.password= new Object();
    $scope.change = function(){
      console.log($scope.user.username);
    }
    $scope.doClear1 = function(){
      var username = $scope.user.username;
      if(username !== null && username !== undefined && username !== "")
        $scope.user.username="";
    }
    $scope.doClear2 = function(){
      var password = $scope.user.password;
      if(password !== null && password !== undefined && password !== "")
        $scope.user.password="";
    }
    $scope.goQuery1 = function(){
      $state.go("query");
    }
    $scope.goQuery = function(){
        var debug=true;
      //var status = $cordovaNetwork.getNetwork();
      //if($cordovaNetwork.isOnline()){
          if(debug){
        var user = $scope.user;
        if(user.username === null || user.username === undefined || user.username === ''){
          alert("用户名不能为空");
          return false;
        }
        if(user.password === null || user.password === undefined || user.password === ''){
          alert("密码不能为空");
          return false;
        }
        //else{
          //$cordovaProgress.show(true);
            //alert("aaa");
        //}

        $http({
          method:"post",
          params:{
            loginName:user.username,
            password:user.password
          },
          url:supnuevoUrl,

        }).success(function(response){
          var errorMsg =  response.errorMsg;
          if(errorMsg !== null && errorMsg !== undefined && errorMsg !== ""){
            alert(errorMsg);

           }else{
             var supnuevoMerchantId = response.merchantId;
            $rootScope.supnuevoMerchantId = response.merchantId;
             locals.set("merchantStates",response.merchantStates);
             locals.set("username",user.username);
             locals.set("password",user.password);
             locals.set("supnuevoMerchantId",supnuevoMerchantId);
             if(response.merchantStates[0]==1){
              $state.go("query");
            }else{
              $state.go("thefifth");
            }


          }
        }).error(function(err){
            alert(err.toString());
            $ionicLoading.show({
              template:'connect the server timeout',
              duration:'2000'
            });
        })
      }else{
        $ionicLoading.show({
          template:'could not connect the server',
          duration:'2000'
        });
      }
    }
/*  $scope.doPhoto = function(){
      var options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
      };

      $cordovaCamera.getPicture(options).then(function(imageURI) {
        $scope.imageSrc= imageURI;
      }, function(err) {
        // error
      });
  }*/
  })
  //.service('ToastService', ['$cordovaToast', function ($cordovaToast) {
  //  return {
  //    showShortTop: function (message) {
  //      $cordovaToast.showShortTop(message);
  //    },
  //    showShortCenter: function (message) {
  //      $cordovaToast.showShortCenter(message);
  //    },
  //    showShortBottom: function (message) {
  //      $cordovaToast.showShortBottom(message);
  //    },
  //    showLongTop: function (message) {
  //      $cordovaToast.showLongTop(message);
  //    },
  //    showLongCenter: function (message) {
  //      $cordovaToast.showLongCenter(message);
  //    },
  //    showLongBottom: function (message) {
  //      $cordovaToast.showLongBottom(message);
  //    }
  //  }
  //}])

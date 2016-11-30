angular.module('app',['ionic','ui.router','ngCordova','locals'])
  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });
  })


.config(function($stateProvider,$urlRouterProvider){

        $stateProvider.state('verify',{
            url:'/verify',
            controller: 'verifyController',
        });

        $stateProvider.state('login',{
            url:'/login',
            controller: 'loginController',
            templateUrl:'supnuevo/html/login.html'
        });

        $stateProvider.state('query',{
            cache:false,
            url:'/query',
            controller: 'queryController',
            templateUrl:'supnuevo/html/query.html'

        });


        $stateProvider.state('queryNew',{
          cache:false,
          url:'/queryNew',
          controller: 'queryNewController',
          templateUrl:'supnuevo/html/queryNew.html'

        });

        $stateProvider.state('addGoods',{
            url:'/addGoods/:info',
            controller: 'addGoodsController',
            templateUrl:'supnuevo/html/addGoods.html'
        });

        $stateProvider.state('addOrUpdateGoods',{
            url:'/addOrUpdateGoods/:info',
            controller: 'addOrUpdateGoodsController',
            templateUrl:'supnuevo/html/addOrUpdateGoods.html'
        });

        $stateProvider.state('thefifth',{
            url:'/thefifth',
            controller:'theFifthController',
            templateUrl:'supnuevo/html/thefifth.html'
         });

        $stateProvider.state('changeRelatedPrice',{
          url:'/changeRelatedPrice/:selectedCodeinfo',
          controller:'changeRelatedPriceController',
          templateUrl:'supnuevo/html/changeRelatedPrice.html'
        });

        $urlRouterProvider.otherwise('/login');
    })



  //.controller('verifyController',function($cordovaFile){
    //$cordovaFile.readAsText(cordova.file.dataDirectory, "1.txt")
    //  .then(function (success) {
    //    alert(success);
    //  }, function (error) {
    //    alert(error);
    //  });

    //$cordovaFile.readAsText(cordova.file.applicationDirectory,'www/supnuevo/file/userInfo.json').then(function(success){
    //  alert("aaa");
    //},function(error){
    //  alert(error);
    //});

  //})
  //.constant("rmiPath","http://158.69.137.173:80")

  //.constant("rmiPath","http://142.4.194.0:8080/supnuevo")

  .constant("rmiPath","http://142.4.194.0:8080/")

 //.constant("rmiPath","/proxy/local")
//.constant("rmiPath","http://192.168.1.102:8080/supnuevo")


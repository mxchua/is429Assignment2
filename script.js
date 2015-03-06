// Firebase Script
// Initializing angularfire
var myApp = angular.module("myApp", ["ngRoute", "firebase"]);

// Configure routing
myApp.config(['$routeProvider',
    function ($routeProvider) {$routeProvider.
        when('/home', {
            templateUrl: 'home.html',
            controller: 'homePage'
        }).
        when('/session', {
            templateUrl: 'session.html',
            controller: 'sessionPage'
        }).
        when('/login', {
            templateUrl: 'login.html',
            controller: 'loginPage'
        }).
        when('/register', {
            templateUrl: 'register.html',
            controller: 'registerPage'
        }).
        when('/stuHome', {
            templateUrl: 'stuHome.html',
            controller: 'homePage'
        }).
        otherwise({
            redirectTo: '/login'
        });
    }
]);

// Mainpage angular controller
myApp.controller('homePage', function ($scope, $firebase, $rootScope, $location) {
    // $rootScope.userLoggedin = "max";
    // Grandfather Reference
    console.log($rootScope.userLoggedin);
    if($rootScope.userLoggedin == "" || $rootScope.userLoggedin == null ){
        $location.path("/login");
    }
    var ref = new Firebase("https://assignment2.firebaseio.com");
    // General Reference
    var refGeneral = new Firebase("https://assignment2.firebaseio.com/General");
    var syncGeneral = $firebase(refGeneral);
    var syncObjectGeneral = syncGeneral.$asObject();
    // Session Reference
    var refSession = new Firebase("https://assignment2.firebaseio.com/Session/");
    var syncSession = $firebase(refSession);
    var syncObjectSession = syncSession.$asObject();
    var syncArraySession = syncSession.$asArray();
    console.log(syncArraySession.length);
    for(var i = 0; i<syncArraySession.length; i++ ){
        console.log(syncArraySession[i]);
    }
    // create new session Function
    $scope.createNewSession = function() {
        // To generate new ID
        var newID = syncObjectGeneral.ID +1;
        syncObjectGeneral.ID = newID;
        syncObjectGeneral.$save();
        // adding new session to database
        var sessionName = $('input[name=sessionName').val();
        var sessionPW1 = $('input[name=sessionPassword1').val();
        var sessionPW2 = $('input[name=sessionPassword2').val();

        if(sessionPW1 != sessionPW2){
            $('.pwError').css('display', 'inline-block');
        }

        toAdd = {}; 
        toAdd[newID] ={
            password: sessionPW1,
            name: sessionName
        } ; 
        refSession.update(toAdd);
        // Setting $rootscope to store current session to be used by other controller
        var selectedSessionRef = refSession.child(newID);
        // $rootScope.selectedSession = $firebase(selectedSessionRef).$asObject()
        // window.location = '/session';
        // $scope.$apply(function() { $location.path("/session"); });
        $rootScope.selectedSessionID = newID;
        $location.path("/session");
    }
    $scope.retrieveSession = function() {
        var userInputSessionID = $('input[name=userInputSessionID').val();
        console.log('Testttttt');
        console.log(syncObjectSession);
        console.log(syncArraySession);
        for(var i = 0; i<syncArraySession.length ; i++){
            console.log(syncArraySession[i].$id);
            var currentIteratedSessionID = syncArraySession[i].$id;
            if(userInputSessionID == currentIteratedSessionID){
                $rootScope.selectedSessionID = currentIteratedSessionID;
                var refPW = new Firebase("https://assignment2.firebaseio.com/Session/"+currentIteratedSessionID);
                var syncPW = $firebase(refPW);
                var syncObjectPW = syncPW.$asObject();
                
                setTimeout(function(){
                    console.log(syncObjectPW.password);
                    var pw = syncObjectPW.password;
                    if(pw ==""){
                        $location.path("/session");
                        console.log('no pw, login success');
                        return;
                        
                    }else{
                        var userPwInput = $('input[name=userInputPassword]').val()
                        if (pw == userPwInput){
                            $location.path("/session");
                            console.log('login success')
                            return false;
                        }else{
                            $('.sessionPWError').css('display', 'block');
                            $('.sessionIDError').css('display', 'none');
                            console.log('login error');
                            return false;
                        }
                    }
                    
                }, 200)
                
                //$location.path("/session");
                 return false;
            }
        }
        $('.sessionIDError').css('display', 'block');
        $('.sessionPWError').css('display', 'none');
        
    }
    
});

myApp.controller('sessionPage', function ($scope, $firebase, $rootScope, $location){
    var selectedSessionID = $rootScope.selectedSessionID;
    if($rootScope.userLoggedin == "" || $rootScope.userLoggedin == null ){
        $location.path("/login");
    }

    var refSelectedSession = new Firebase("https://assignment2.firebaseio.com/Session/"+selectedSessionID);
    var syncSelectedSession = $firebase(refSelectedSession);
    var syncObjectSelectedSession = syncSelectedSession.$asObject();
    
    var refQuestions = refSelectedSession.child('Questions');
    var syncQuestions = $firebase(refQuestions);
    var syncObjectQuestions = syncQuestions.$asArray();
    console.log(syncObjectQuestions);
    $scope.questions = syncObjectQuestions;
    
    $scope.refresh = function() {
        $location.path("/session");
    };
    
    $scope.addQuestion = function() {
        var userInputQuestion = $('textarea[name=userInputQuestion]').val();
        console.log(userInputQuestion);
        toAdd ={
            question: userInputQuestion,
            vote: 0
        } ; 
        
        refQuestions.push(toAdd);
        $('textarea[name=userInputQuestion]').val("");
        $location.path("/session");
    };
    
    $scope.vote = function(questionId){
        $('.revoteError').css('display','none');
        var qnRef = refQuestions.child(questionId);
        var qnSync = $firebase(qnRef);
        var qnObj = qnSync.$asObject();
        var votersRef = qnRef.child('voters');
        var votersSync = $firebase(votersRef);
        var votersObject = votersSync.$asArray();
        console.log(votersObject[0]);
        setTimeout(function(){
            var hasNotVote = true;
            for(var i = 0; i<votersObject.length; i++){
                console.log(votersObject[i].$value);
                if(votersObject[i].$value == $rootScope.userLoggedin){
                    hasNotVote = false;
                    break;
                }
            }
            if(hasNotVote){
                var currentVote = qnObj.vote + 1;
                console.log(qnObj.vote);
                qnObj.vote = currentVote;
                console.log(qnObj.vote);
                // qnObj.$save;
                qnRef.child('vote').set(currentVote);
                votersRef.push($rootScope.userLoggedin);
            }else{
                $('.revoteError').css('display','block');
            }
            
            
            // $location.path("/session");  
        },200);
    
    };
     

});

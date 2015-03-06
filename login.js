// Firebase Script


// Mainpage angular controller
myApp.controller('loginPage', function ($scope, $firebase, $rootScope, $location) {
    // Grandfather Reference
    var ref = new Firebase("https://assignment2.firebaseio.com");
    
    // General Reference
    var refUser = new Firebase("https://assignment2.firebaseio.com/User");
    var syncUser = $firebase(refUser);
    var syncObjectUser = syncUser.$asObject();
    
    //login via google
    $scope.loginGoogle = function(){
          ref.authWithOAuthPopup("google", function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
             $location.href("/home");
             console.log(authData.google.displayName);
            console.log("Authenticated successfully with daniel:", authData);
           
          }
        });
            
    }
    
    
    
    //method for creating user
    $scope.checkUser = function(){
       // adding new user to databasev
       var username = $('input[name=username]').val();
       var password = $('input[name=password]').val();
    
       var syncArrayUser = syncUser.$asArray();
             
        //check if user's input is valid
        if(username==="" && password===""){
             $('.emptyUsername').css('display', 'block');
             $('.emptyPassword').css('display', 'block');
             return;
        }else{
                
                
               //checking if firebase already has this username
               for(var i = 0; i<syncArrayUser.length; i++ ){
                   //printing out a single object of the table
                    // console.log(syncArrayUser[i]);
                    
                    console.log(syncArrayUser[i].$id);
                    
                    if(username === syncArrayUser[i].$id && password === syncArrayUser[i].password){
                        if(syncArrayUser[i].role === "student"){
                            $rootScope.userLoggedin = username;
                            $location.path("/stuHome");
                        }else{
                            $rootScope.userLoggedin = username;
                            $location.path("/home");
                        }
                    }else{
              
                        $('.incorrectInput').css('display', 'block');
                    }
                 }    
                
        }
        
        if(username===""){
            $('.emptyUsername').css('display', 'block');
            return;
        }else{
             $('.emptyUsername').css('display', 'none');
             return;
        }
        
        if(password===""){
            $('.emptyPassword').css('display', 'block');
            return;
        }else{
            $('.emptyPassword').css('display', 'none');
            return;
        }
        

    } //end of checking user method
    
});



myApp.controller('registerPage',function ($scope, $firebase, $rootScope, $location){
      // Grandfather Reference
    var ref = new Firebase("https://assignment2.firebaseio.com");
    
    // General Reference
    var refUser = new Firebase("https://assignment2.firebaseio.com/User");
    var syncUser = $firebase(refUser);
    var syncObjectUser = syncUser.$asObject();
    
      
    
    
    //method for creating user
    $scope.createUser = function(){
   
       // adding new user to databasev
       var username = $('input[name=username]').val();
       var password = $('input[name=password]').val();
       var password2 = $('input[name=password2]').val();
    
       var syncArrayUser = syncUser.$asArray();

        //check if user's input is valid
        
        if(username==="" && password===""){
             $('.emptyUsername').css('display', 'block');
             $('.emptyPassword').css('display', 'block');
             return;
        }
        
        if(password!=password2){
            $('.diffPassword').css('display', 'block');
            return;
        }else{
            
             $('.diffPassword').css('display', 'none');
            //checking if firebase already has this username
            for(var i = 0; i<syncArrayUser.length; i++ ){
            
                if(username == syncArrayUser[i].$id ){
                    $('.duplicatedUser').css('display', 'block');
                }
            }
       
            //if user's input is valid, insert it into firebase
            toAdd = {}; 
            toAdd[username] ={
                password: password,
                role: "student"
            } ; 
            refUser.update(toAdd);
            
            $location.path("/login");
       
           
        }
        
        
        
        
        
        
        if(username===""){
            $('.emptyUsername').css('display', 'block');
            return;
        }else{
             $('.emptyUsername').css('display', 'none');
             return;
        }
        
        if(password===""){
            $('.emptyPassword').css('display', 'block');
            return;
        }else{
            $('.emptyPassword').css('display', 'none');
            return;
        }
        
    } //end of createUser method
    
    
     


});

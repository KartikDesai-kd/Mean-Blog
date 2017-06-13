
   var app= angular.module("BlogApp",['ngFileUpload',"ngRoute","ui.bootstrap"]);

        app.controller("BlogController",BlogController)
           .filter('pagination', function() {
                return function(data, start) {
                    return data.slice(start);
                };
            });
        app.controller("LoginController",LoginController);
      
        app.config(function($routeProvider) {
                $routeProvider
                .when("/", {
                    templateUrl : "home.html"
                })
                .when("/about", {
                    templateUrl : "about.html"
                })
                .when("/login", {
                    templateUrl : "login.html",
                    controller : "LoginController"
                })
                .when("/postarticle", {
                    templateUrl : "postarticle.html",
                    controller : "BlogController"
                });
       });
      
    //Blog controller   
     function BlogController($scope,Upload,$http){
         $scope.resetForm=resetForm;
         $scope.deletePost=deletePost;
         $scope.editPost=editPost;
         $scope.updatePost=updatePost;
         $scope.enable=false;
        
         function init(){
              getAllPosts(); 
         }

         init();
         
         function resetForm(){
              event.preventDefault();
              $scope.enable=false;
              $scope.upload = {};
         }

         function editPost(postId){
             $scope.enable=true;
             $http.get("/api/blogpost/"+postId)
                  .then(function(post){
                        console.log("data: "+JSON.stringify(post["data"]));
                        $scope.upload=post["data"];
                  });
         }
        function deletePost(postId){
              $http.delete("/api/blogpost/"+postId)
                   .then(getAllPosts);
         }
         function getAllPosts(){
               $scope.upload = {};
              $http.get('/api/blogpost').then(function(response){
              console.log(response.data);
              $scope.pageSize = 3;
              $scope.currentPage = 1;
              $scope.uploads = response.data;
              
       });
    }


         $scope.submit = function(upload){
	            console.log("post: "+ JSON.stringify(upload));
                Upload.upload({
                        url: '/api/blogpost',
                        method: 'post',
                        data: upload
                        }).then(function (response) {
                       console.log(response.data);
                      /*  $scope.uploads.push(response.data);
                        $scope.upload = {};*/
                        getAllPosts();
                        });
         }
         function updatePost(post){
              $scope.enable=false;
              console.log(post);
              $http
                  .put("/api/blogpost/"+post._id,post)
                  .then(getAllPosts);
         }
     }      
   //End Blog controller

   //Login Controller
      function LoginController($scope,$http,$window,Login){
             console.log("in login controller");

             $scope.submit = function(upload){
                console.log("post: "+ JSON.stringify(upload));
                if(upload.email=="admin@gmail.com" && upload.password=="123456789"){
                   console.log("in");
                   $window.location.href= "#!postarticle";
                }
         }    
      }
      LoginController.$inject = ['$scope', '$http','$window'];
   //End Login Controller   
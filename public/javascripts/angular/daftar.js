var angularModule = angular.module('daftarApp',[])

angularModule.controller('controllerDaftar', function($scope){
  $scope.default = "true"
  $scope.siswa = "false"
  $scope.guru = "false"

  $scope.default_view = function(){
    $scope.default = "true"
    $scope.siswa = "false"
    $scope.guru = "false"
  }

  $scope.siswa_view = function(){
    $scope.default = "false"
    $scope.siswa = "true"
    $scope.guru = "false"
  }

  $scope.guru_view = function(){
    $scope.default = "false"
    $scope.siswa = "false"
    $scope.guru = "true"
  }

})

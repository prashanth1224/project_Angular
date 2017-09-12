// Immediately invoked functional expressions for lexical 
// scoping which will use for not to disturb global scope
(function(){
	"use strict";

	angular
	.module("ngClassifieds")
	.controller("classifiedsCtrl", function($scope, $http,$state, classifiedsFactory, $mdSidenav, $mdToast, $mdDialog){

		var vm = this;

		vm.categories;
		vm.classified;
		vm.classifieds;
		vm.closeSidebar = closeSidebar;
		vm.deleteClassified = deleteClassified;
		vm.editing;
		vm.editClassified = editClassified;
		vm.openSidebar = openSidebar;
		vm.saveClassified = saveClassified;
		// vm.saveEditClassified = saveEditClassified;


		classifiedsFactory.getClassifieds().then(function(classifieds){
			vm.classifieds = classifieds.data;
			vm.categories = getCategories(vm.classifieds);
		});

		var contact = {
			name : "Prashanth",
			phone: "(555) 555-0000",
			email: "pr@gmail.com"
		};

		$scope.$on('newClassified', function(event, classified){
			classified.id = vm.classifieds.length + 1;
			vm.classifieds.push(classified);
			showToast('classified saved!');
		});

		$scope.$on('editSaved', function(event, message){
			showToast(message);
		});


		

		function openSidebar(){
			$state.go('classifieds.new');
		}

		function closeSidebar(){
			$mdSidenav('left').close();
		}

		function saveClassified (classified){
			if (classified) {
				classified.contact = contact;
				vm.classifieds.push(classified);
				vm.classified = {};
				closeSidebar();
				showToast("classified saved!");
			}  		 	
		}

		function editClassified (classified){
			$state.go('classifieds.edit', {
				id: classified.id,
				classified: classified
			});
		}


		function saveEdit(){
			vm.editing = false;
			vm.classified = {};
			closeSidebar();
			showToast("Edit classified saved");
		}

		function deleteClassified(event, classified){
			var confirm = $mdDialog.confirm()
			.title('Are you sure, you want to delete' + classified.title + '?')
			.ok('Yes')
			.cancel('No')
			.targetEvent(event);
			$mdDialog.show(confirm).then(function(){
				var index = $scope.classifieds.indexOf(classified);
				$scope.classifieds.splice(index, 1);
			}, function(){

			});
		}


		function showToast(message){
			$mdToast.show(
				$mdToast.simple()
				.content(message)
				.position("top right")
				.hideDelay(3000)
				);	
		}

		function getCategories(classifieds){
			var categories = [];
			angular.forEach(classifieds, function(item){
				angular.forEach(item.categories, function(category){
					categories.push(category);
				});
			});

			return _.uniq(categories);
		}

	});
})();	
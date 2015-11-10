'use strict';

(function() {

	var MODULE = angular.module('de.tum.in.realtime.data.dump', [ 'ngRoute',
			'ngResource']);

	MODULE.config(function($routeProvider) {
		$routeProvider.when('/', {
			controller : mainProvider,
			templateUrl : '/de.tum.in.realtime.data.dump/main/htm/bluetooth.htm'
		});
		$routeProvider.when('/wifi', {
			controller : mainProvider,
			templateUrl : '/de.tum.in.realtime.data.dump/main/htm/wifi.htm'
		});
		$routeProvider.otherwise('/');
	});

	MODULE.run(function($rootScope, $location) {
		$rootScope.alerts = [];
		$rootScope.closeAlert = function(index) {
			$rootScope.alerts.splice(index, 1);
		};
		$rootScope.page = function() {
			return $location.path();
		}
	});

	function BackendManager($resource, error)
	{
		var THIS = this;
		
		THIS.bluetoothResources = [];
		THIS.wifiResources = [];
		THIS.name = "";
		THIS.type1 = "bluetooth";
		THIS.type2 = "wifi";
		
		var interceptor = {
			responseError : error
		};
		
		var backends = $resource("/rest/data/:type", {}, {
			list : {
				method : 'GET',
				interceptor : interceptor,
				isArray : true
			}
		});		
		
		THIS.refresh = function() {
			THIS.bluetoothResources = backends.list({type: THIS.type1});
			THIS.wifiResources = backends.list({type: THIS.type2});
			THIS.name = "";
		}
		
		THIS.read = function(meta) {
			THIS.name = meta.name;
		}
		
	}

	var mainProvider = function($scope, $resource) {
		function error(e) {
			$scope.alerts.push({
				type : 'danger',
				msg : e.status
			});
		}

		$scope.bm = new BackendManager($resource, error);
	}

})();

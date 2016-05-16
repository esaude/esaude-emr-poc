'use strict';

angular.module('patient.details')
    .directive("dynamicName",function($compile){
        return {
            restrict:"A",
            terminal:true,
            priority:1000,
            link:function(scope,element,attrs){
                element.attr('name', scope.$eval(attrs.dynamicName));
                element.removeAttr("dynamic-name");
                $compile(element)(scope);
            }
        };
    });

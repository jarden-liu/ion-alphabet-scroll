(function() {
    'use strict';

    angular.module('ion-alphabet-scroll', [])
        .directive('ionAlphabetScroll', ionAlphabetScroll);

    ionAlphabetScroll.$inject = ['$ionicScrollDelegate', '$location', '$timeout', '$document', '$window', "$rootScope"];

    function ionAlphabetScroll($ionicScrollDelegate, $location, $timeout, $document, $window, $rootScope) {
        return {
            require: '?ngModel',
            restrict: 'E',
            replace: true,
            compile: function(element, attrs, transclude) {
                var childConetnts = element.contents();
                var template = angular.element([
                    '<div class="ion_alphabet_list_outer {{alphabetListClass}}" style="{{alphabetListStyle}}">',
                    '<div class="ion_alphabet_list" data-ng-repeat="(letter, items) in sortedAlphabetList" ng-if="items.length>0">',
                    '<ion-item class="alphabet_item_divider" id="index_{{letter}}">{{letter}}</ion-item>',
                    '<div class="alphabet_item_box">',
                    '<ion-list>',
                    '<ion-item class="alphabet_item" ng-repeat="item in items"></ion-item>',
                    '</ion-list>',
                    '</div></div>',
                    ' </div>'
                ].join(''));
                var sidebar = angular.element(['<ul class="ion_alphabet_sidebar" id="ionAlphabetSidebar"  on-touch="ionAlphabetSidebarOnTouch()" on-release="ionAlphabetSidebarOnRelease()">',
                    '<li  ng-repeat="index in alphabetIndexLists">{{index}}</li>',
                    '</ul>'
                ].join(''));

                var tipBox = angular.element('<div class="ion_alphabet_tip" ng-show="alphabetTipShow">{{alphabetTipContent}}</div>');




                var sidebarMar = 10;
                if (ionic.Platform.isIOS()) {
                    sidebarMar += 15;
                }
                var headerHeight;
                if (attrs.headerHeight) {
                    var heightStr = attrs.headerHeight.replace('px', '');
                    headerHeight = parseInt(heightStr);
                } else {
                    headerHeight = 48;
                }
                var subHeaderHeight = attrs.subHeaderHeight === "true" ? 44 : 0;

                var sidebarMarginTop = headerHeight + subHeaderHeight + sidebarMar;

                var tabHeight;
                if (attrs.tabHeight) {
                    var heightStr = attrs.tabHeight.replace('px', '');
                    tabHeight = parseInt(heightStr);
                } else {
                    tabHeight = 50;
                }
                var windowHeight = window.innerHeight;
                var barHeight = windowHeight - tabHeight - sidebarMarginTop;

                sidebar.css({
                    "margin-top": sidebarMarginTop + 'px'
                });

                sidebar.css({
                    "height": barHeight + 'px'
                });

                angular.element(template.find('ion-item')[1]).append(childConetnts);
                element.html('');
                element.append(template);
                element.parent().parent().after(sidebar);
                element.parent().parent().after(tipBox);

                return function(scope, element, attrs, ngModel) {
                    scope.alphabetListClass = attrs.class;
                    scope.alphabetListStyle = attrs.style;
                    var sortKey = attrs.key;
                    var shouldSort = attrs.sort || true;

                    if (!ngModel) return;



                    ngModel.$render = function() {
                        var dataList = ngModel.$viewValue || [];
                        var tempList = {};
                        if (shouldSort) {
                            var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                            for (var i = 0; i < letters.length; i++) {
                                var nextChar = letters.charAt(i);
                                tempList[nextChar] = [];
                            };
                        }
                        angular.forEach(dataList, function(item) {
                            var letter = item[sortKey].toUpperCase().charAt(0);
                            if (angular.isUndefined(tempList[letter])) {
                                tempList[letter] = [];
                            }
                            tempList[letter].push(item);
                        });
                        scope.sortedAlphabetList = tempList;


                        $rootScope.alphabetIndexLists = iterateAlphabetSidebar();
                        scope.alphaScrollGoToList = function(letter) {
                            if (letter == '☆') {
                                letter = 'A';
                                $ionicScrollDelegate.scrollTop();
                                return;
                            }
                            if (letter == '#') {
                                letter = 'Z';
                                $ionicScrollDelegate.scrollBottom();
                                return;
                            }

                            if (scope.sortedAlphabetList[letter].length == 0) {
                                return;
                            }
                            $location.hash('index_' + letter);
                            $ionicScrollDelegate.anchorScroll(false);


                        }


                        scope.showAlphabetTip = function(num) {
                            scope.alphabetTipContent  = num;
                            $rootScope.alphabetTipContent =num;
                        }



                        var touchFuc = function(ev) {
                            ev.preventDefault();
                            var Y = ev.touches && ev.touches[0] ? ev.touches[0].pageY : ev.pageY;
                            if (Y < (sidebarMarginTop)) {
                                return;
                            } else {
                                var pointY = Y - sidebarMarginTop;
                                var n = parseInt(pointY / barHeight * 100 / 3.5);
                                if (n > 27) {
                                    return;
                                } else {
                                    scope.alphabetTipContent = scope.alphabetIndexLists[n];
                                    $rootScope.alphabetTipContent =angular.copy(scope.alphabetTipContent);
                                    scope.$apply();
                                }
                            }

                        };

                        scope.$watch('alphabetTipContent', function(newVal, oldVal) {
                            if (newVal === oldVal) {
                                return;
                            } else {
                                scope.alphaScrollGoToList(scope.alphabetTipContent);
                            }
                        });


                        scope.$on('ion-alphabet-sidebar-on-touch', function() {
                            $rootScope.alphabetTipShow = true;
                            angular.element($document[0].body).bind('touchstart', touchFuc);
                            angular.element($document[0].body).bind('mousedown', touchFuc);

                            angular.element($document[0].body).bind('touchmove', touchFuc);
                            angular.element($document[0].body).bind('mousemove', touchFuc);
                        });

                        scope.$on('ion-alphabet-sidebar-on-release', function() {
                            $rootScope.alphabetTipShow = false;
                            angular.element($document[0].body).unbind('touchmove', touchFuc);
                            angular.element($document[0].body).unbind('mousemove', touchFuc);

                            angular.element($document[0].body).unbind('touchstart', touchFuc);
                            angular.element($document[0].body).unbind('mousedown', touchFuc);
                        });


                        $rootScope.ionAlphabetSidebarOnTouch = function() {
                            $rootScope.$broadcast('ion-alphabet-sidebar-on-touch');
                        }

                        $rootScope.ionAlphabetSidebarOnRelease = function() {
                            $rootScope.$broadcast('ion-alphabet-sidebar-on-release');
                        }

                        $rootScope.$on('ion-alphabet-scroll-hide', function() {
                            element.css('display', 'none');
                            var sidebar = angular.element(document.querySelector('#ionAlphabetSidebar'));
                            sidebar.css('display', 'none');
                        });

                        $rootScope.$on('ion-alphabet-scroll-show', function() {
                            element.css('display', 'block');
                            var sidebar = angular.element(document.querySelector('#ionAlphabetSidebar'));
                            sidebar.css('display', 'block');
                        });


                        angular.element($window).bind('resize', function() {
                            barResize();
                        });


                        function barResize() {
                            var sidebar = angular.element(document.querySelector('#ionAlphabetSidebar'));
                            windowHeight = window.innerHeight;
                            barHeight = windowHeight - tabHeight - sidebarMarginTop;
                            sidebar.css({
                                "height": barHeight + 'px'
                            });
                        }

                        function iterateAlphabetSidebar() {
                            var str = "☆ABCDEFGHIJKLMNOPQRSTUVWXYZ#";
                            var indexs = new Array();
                            for (var i = 0; i < str.length; i++) {
                                var nextChar = str.charAt(i);
                                indexs.push(nextChar);
                            }

                            return indexs;
                        }
                    };
                }
            }
        };

    }
}());

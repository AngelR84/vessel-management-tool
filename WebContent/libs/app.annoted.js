fibity.manager.app = angular.module('fbtmApp',['ngRoute','chartjs',"ngAnimate",'ui.calendar','ui.bootstrap','googlechart','sy.bootstrap.timepicker','template/syTimepicker/timepicker.html','template/syTimepicker/popup.html','google-maps']);
fibity.manager.api.init = function(apiRoot) {
	  var apisToLoad = 2; // must match number of calls to gapi.client.load();
	  
	  var callback = function() {
		  if (--apisToLoad == 0){
	    		console.log("API ready!");
	    		angular.element(document).ready(function() {
	    		     angular.bootstrap(document, ['fbtmApp']);
	    	    });
	    	  }
	  };
	  
	  gapi.client.load('account', 'v1beta1', callback, apiRoot);
	  gapi.client.load('manager', 'v1beta1', callback, apiRoot);
	  //gapi.client.load('dev', 'v1beta1', callback, apiRoot);
	  //gapi.client.load('oauth2', 'v2', callback);
};
	
function init(){
	fibity.manager.api.init(fibity.manager.api.url + "/_ah/api");
}

var mobileHover = function () {
    jQuery('*').on('touchstart', function () {
    		jQuery(this).trigger('hover');
    }).on('touchend', function () {
    		jQuery(this).trigger('hover');
    });
};

mobileHover();
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]);
angular.module("ui.bootstrap.tpls", ["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/popup.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset-titles.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]);
angular.module('ui.bootstrap.transition', [])

/**
 * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
 * @param  {DOMElement} element  The DOMElement that will be animated.
 * @param  {string|object|function} trigger  The thing that will cause the transition to start:
 *   - As a string, it represents the css class to be added to the element.
 *   - As an object, it represents a hash of style attributes to be applied to the element.
 *   - As a function, it represents a function to be called that will cause the transition to occur.
 * @return {Promise}  A promise that is resolved when the transition finishes.
 */
.factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

  var $transition = function(element, trigger, options) {
    options = options || {};
    var deferred = $q.defer();
    var endEventName = $transition[options.animation ? "animationEndEventName" : "transitionEndEventName"];

    var transitionEndHandler = function(event) {
      $rootScope.$apply(function() {
        element.unbind(endEventName, transitionEndHandler);
        deferred.resolve(element);
      });
    };

    if (endEventName) {
      element.bind(endEventName, transitionEndHandler);
    }

    // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
    $timeout(function() {
      if ( angular.isString(trigger) ) {
        element.addClass(trigger);
      } else if ( angular.isFunction(trigger) ) {
        trigger(element);
      } else if ( angular.isObject(trigger) ) {
        element.css(trigger);
      }
      //If browser does not support transitions, instantly resolve
      if ( !endEventName ) {
        deferred.resolve(element);
      }
    });

    // Add our custom cancel function to the promise that is returned
    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    // i.e. it will therefore never raise a transitionEnd event for that transition
    deferred.promise.cancel = function() {
      if ( endEventName ) {
        element.unbind(endEventName, transitionEndHandler);
      }
      deferred.reject('Transition cancelled');
    };

    return deferred.promise;
  };

  // Work out the name of the transitionEnd event
  var transElement = document.createElement('trans');
  var transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'transition': 'transitionend'
  };
  var animationEndEventNames = {
    'WebkitTransition': 'webkitAnimationEnd',
    'MozTransition': 'animationend',
    'OTransition': 'oAnimationEnd',
    'transition': 'animationend'
  };
  function findEndEventName(endEventNames) {
    for (var name in endEventNames){
      if (transElement.style[name] !== undefined) {
        return endEventNames[name];
      }
    }
  }
  $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
  $transition.animationEndEventName = findEndEventName(animationEndEventNames);
  return $transition;
}]);

angular.module('ui.bootstrap.collapse',['ui.bootstrap.transition'])

// The collapsible directive indicates a block of html that will expand and collapse
.directive('collapse', ['$transition', function($transition) {
  // CSS transitions don't work with height: auto, so we have to manually change the height to a
  // specific value and then once the animation completes, we can reset the height to auto.
  // Unfortunately if you do this while the CSS transitions are specified (i.e. in the CSS class
  // "collapse") then you trigger a change to height 0 in between.
  // The fix is to remove the "collapse" CSS class while changing the height back to auto - phew!
  var fixUpHeight = function(scope, element, height) {
    // We remove the collapse CSS class to prevent a transition when we change to height: auto
    element.removeClass('collapse');
    element.css({ height: height });
    // It appears that  reading offsetWidth makes the browser realise that we have changed the
    // height already :-/
    var x = element[0].offsetWidth;
    element.addClass('collapse');
  };

  return {
    link: function(scope, element, attrs) {

      var isCollapsed;
      var initialAnimSkip = true;

      scope.$watch(attrs.collapse, function(value) {
        if (value) {
          collapse();
        } else {
          expand();
        }
      });
      

      var currentTransition;
      var doTransition = function(change) {
        if ( currentTransition ) {
          currentTransition.cancel();
        }
        currentTransition = $transition(element,change);
        currentTransition.then(
          function() { currentTransition = undefined; },
          function() { currentTransition = undefined; }
        );
        return currentTransition;
      };

      var expand = function() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          if ( !isCollapsed ) {
            fixUpHeight(scope, element, 'auto');
            element.addClass('in');
          }
        } else {
          doTransition({ height : element[0].scrollHeight + 'px' })
          .then(function() {
            // This check ensures that we don't accidentally update the height if the user has closed
            // the group while the animation was still running
            if ( !isCollapsed ) {
              fixUpHeight(scope, element, 'auto');
              element.addClass('in');
            }
          });
        }
        isCollapsed = false;
      };
      
      var collapse = function() {
        isCollapsed = true;
        element.removeClass('in');
        if (initialAnimSkip) {
          initialAnimSkip = false;
          fixUpHeight(scope, element, 0);
        } else {
          fixUpHeight(scope, element, element[0].scrollHeight + 'px');
          doTransition({'height':'0'});
        }
      };
    }
  };
}]);

angular.module('ui.bootstrap.accordion', ['ui.bootstrap.collapse'])

.constant('accordionConfig', {
  closeOthers: true
})

.controller('AccordionController', ['$scope', '$attrs', 'accordionConfig', function ($scope, $attrs, accordionConfig) {

  // This array keeps track of the accordion groups
  this.groups = [];

  // Keep reference to user's scope to properly assign `is-open`
  this.scope = $scope;

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : accordionConfig.closeOthers;
    if ( closeOthers ) {
      angular.forEach(this.groups, function (group) {
        if ( group !== openGroup ) {
          group.isOpen = false;
        }
      });
    }
  };
  
  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function (event) {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if ( index !== -1 ) {
      this.groups.splice(this.groups.indexOf(group), 1);
    }
  };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('accordion', function () {
  return {
    restrict:'EA',
    controller:'AccordionController',
    transclude: true,
    replace: false,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('accordionGroup', ['$parse', '$transition', '$timeout', function($parse, $transition, $timeout) {
  return {
    require:'^accordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl:'template/accordion/accordion-group.html',
    scope:{ heading:'@' },        // Create an isolated scope and interpolate the heading attribute onto this scope
    controller: ['$scope', function($scope) {
      this.setHeading = function(element) {
        this.heading = element;
      };
    }],
    link: function(scope, element, attrs, accordionCtrl) {
      var getIsOpen, setIsOpen;

      accordionCtrl.addGroup(scope);

      scope.isOpen = false;
      
      if ( attrs.isOpen ) {
        getIsOpen = $parse(attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        accordionCtrl.scope.$watch(getIsOpen, function(value) {
          scope.isOpen = !!value;
        });
      }

      scope.$watch('isOpen', function(value) {
        if ( value ) {
          accordionCtrl.closeOthers(scope);
        }
        if ( setIsOpen ) {
          setIsOpen(accordionCtrl.scope, value);
        }
      });
    }
  };
}])

// Use accordion-heading below an accordion-group to provide a heading containing HTML
// <accordion-group>
//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
// </accordion-group>
.directive('accordionHeading', function() {
  return {
    restrict: 'EA',
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^accordionGroup',
    compile: function(element, attr, transclude) {
      return function link(scope, element, attr, accordionGroupCtrl) {
        // Pass the heading to the accordion-group controller
        // so that it can be transcluded into the right place in the template
        // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
        accordionGroupCtrl.setHeading(transclude(scope, function() {}));
      };
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
// <div class="accordion-group">
//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
//   ...
// </div>
.directive('accordionTransclude', function() {
  return {
    require: '^accordionGroup',
    link: function(scope, element, attr, controller) {
      scope.$watch(function() { return controller[attr.accordionTransclude]; }, function(heading) {
        if ( heading ) {
          element.html('');
          element.append(heading);
        }
      });
    }
  };
});

angular.module("ui.bootstrap.alert", []).directive('alert', function () {
  return {
    restrict:'EA',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope: {
      type: '=',
      close: '&'
    },
    link: function(scope, iElement, iAttrs) {
      scope.closeable = "close" in iAttrs;
    }
  };
});

angular.module('ui.bootstrap.bindHtml', [])

  .directive('bindHtmlUnsafe', function () {
    return function (scope, element, attr) {
      element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
      scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
        element.html(value || '');
      });
    };
  });
angular.module('ui.bootstrap.buttons', [])

.constant('buttonConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
})

.directive('btnRadio', ['buttonConfig', function (buttonConfig) {
  var activeClass = buttonConfig.activeClass || 'active';
  var toggleEvent = buttonConfig.toggleEvent || 'click';

  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {

      //model -> UI
      ngModelCtrl.$render = function () {
        element.toggleClass(activeClass, angular.equals(ngModelCtrl.$modelValue, scope.$eval(attrs.btnRadio)));
      };

      //ui->model
      element.bind(toggleEvent, function () {
        if (!element.hasClass(activeClass)) {
          scope.$apply(function () {
            ngModelCtrl.$setViewValue(scope.$eval(attrs.btnRadio));
            ngModelCtrl.$render();
          });
        }
      });
    }
  };
}])

.directive('btnCheckbox', ['buttonConfig', function (buttonConfig) {
  var activeClass = buttonConfig.activeClass || 'active';
  var toggleEvent = buttonConfig.toggleEvent || 'click';

  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {

      function getTrueValue() {
        var trueValue = scope.$eval(attrs.btnCheckboxTrue);
        return angular.isDefined(trueValue) ? trueValue : true;
      }

      function getFalseValue() {
        var falseValue = scope.$eval(attrs.btnCheckboxFalse);
        return angular.isDefined(falseValue) ? falseValue : false;
      }

      //model -> UI
      ngModelCtrl.$render = function () {
        element.toggleClass(activeClass, angular.equals(ngModelCtrl.$modelValue, getTrueValue()));
      };

      //ui->model
      element.bind(toggleEvent, function () {
        scope.$apply(function () {
          ngModelCtrl.$setViewValue(element.hasClass(activeClass) ? getFalseValue() : getTrueValue());
          ngModelCtrl.$render();
        });
      });
    }
  };
}]);

/**
* @ngdoc overview
* @name ui.bootstrap.carousel
*
* @description
* AngularJS version of an image carousel.
*
*/
angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
.controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function ($scope, $timeout, $transition, $q) {
  var self = this,
    slides = self.slides = [],
    currentIndex = -1,
    currentTimeout, isPlaying;
  self.currentSlide = null;

  /* direction: "prev" or "next" */
  self.select = function(nextSlide, direction) {
    var nextIndex = slides.indexOf(nextSlide);
    //Decide direction if it's not given
    if (direction === undefined) {
      direction = nextIndex > currentIndex ? "next" : "prev";
    }
    if (nextSlide && nextSlide !== self.currentSlide) {
      if ($scope.$currentTransition) {
        $scope.$currentTransition.cancel();
        //Timeout so ng-class in template has time to fix classes for finished slide
        $timeout(goNext);
      } else {
        goNext();
      }
    }
    function goNext() {
      //If we have a slide to transition from and we have a transition type and we're allowed, go
      if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
        //We shouldn't do class manip in here, but it's the same weird thing bootstrap does. need to fix sometime
        nextSlide.$element.addClass(direction);
        var reflow = nextSlide.$element[0].offsetWidth; //force reflow

        //Set all other slides to stop doing their stuff for the new transition
        angular.forEach(slides, function(slide) {
          angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
        });
        angular.extend(nextSlide, {direction: direction, active: true, entering: true});
        angular.extend(self.currentSlide||{}, {direction: direction, leaving: true});

        $scope.$currentTransition = $transition(nextSlide.$element, {});
        //We have to create new pointers inside a closure since next & current will change
        (function(next,current) {
          $scope.$currentTransition.then(
            function(){ transitionDone(next, current); },
            function(){ transitionDone(next, current); }
          );
        }(nextSlide, self.currentSlide));
      } else {
        transitionDone(nextSlide, self.currentSlide);
      }
      self.currentSlide = nextSlide;
      currentIndex = nextIndex;
      //every time you change slides, reset the timer
      restartTimer();
    }
    function transitionDone(next, current) {
      angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
      angular.extend(current||{}, {direction: '', active: false, leaving: false, entering: false});
      $scope.$currentTransition = null;
    }
  };

  /* Allow outside people to call indexOf on slides array */
  self.indexOfSlide = function(slide) {
    return slides.indexOf(slide);
  };

  $scope.next = function() {
    var newIndex = (currentIndex + 1) % slides.length;

    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'next');
    }
  };

  $scope.prev = function() {
    var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

    //Prevent this user-triggered transition from occurring if there is already one in progress
    if (!$scope.$currentTransition) {
      return self.select(slides[newIndex], 'prev');
    }
  };

  $scope.select = function(slide) {
    self.select(slide);
  };

  $scope.isActive = function(slide) {
     return self.currentSlide === slide;
  };

  $scope.slides = function() {
    return slides;
  };

  $scope.$watch('interval', restartTimer);
  function restartTimer() {
    if (currentTimeout) {
      $timeout.cancel(currentTimeout);
    }
    function go() {
      if (isPlaying) {
        $scope.next();
        restartTimer();
      } else {
        $scope.pause();
      }
    }
    var interval = +$scope.interval;
    if (!isNaN(interval) && interval>=0) {
      currentTimeout = $timeout(go, interval);
    }
  }
  $scope.play = function() {
    if (!isPlaying) {
      isPlaying = true;
      restartTimer();
    }
  };
  $scope.pause = function() {
    if (!$scope.noPause) {
      isPlaying = false;
      if (currentTimeout) {
        $timeout.cancel(currentTimeout);
      }
    }
  };

  self.addSlide = function(slide, element) {
    slide.$element = element;
    slides.push(slide);
    //if this is the first slide or the slide is set to active, select it
    if(slides.length === 1 || slide.active) {
      self.select(slides[slides.length-1]);
      if (slides.length == 1) {
        $scope.play();
      }
    } else {
      slide.active = false;
    }
  };

  self.removeSlide = function(slide) {
    //get the index of the slide inside the carousel
    var index = slides.indexOf(slide);
    slides.splice(index, 1);
    if (slides.length > 0 && slide.active) {
      if (index >= slides.length) {
        self.select(slides[index-1]);
      } else {
        self.select(slides[index]);
      }
    } else if (currentIndex > index) {
      currentIndex--;
    }
  };
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:carousel
 * @restrict EA
 *
 * @description
 * Carousel is the outer container for a set of image 'slides' to showcase.
 *
 * @param {number=} interval The time, in milliseconds, that it will take the carousel to go to the next slide.
 * @param {boolean=} noTransition Whether to disable transitions on the carousel.
 * @param {boolean=} noPause Whether to disable pausing on the carousel (by default, the carousel interval pauses on hover).
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <carousel>
      <slide>
        <img src="http://placekitten.com/150/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>Beautiful!</p>
        </div>
      </slide>
      <slide>
        <img src="http://placekitten.com/100/150" style="margin:auto;">
        <div class="carousel-caption">
          <p>D'aww!</p>
        </div>
      </slide>
    </carousel>
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
 */
.directive('carousel', [function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    controller: 'CarouselController',
    require: 'carousel',
    templateUrl: 'template/carousel/carousel.html',
    scope: {
      interval: '=',
      noTransition: '=',
      noPause: '='
    }
  };
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.carousel.directive:slide
 * @restrict EA
 *
 * @description
 * Creates a slide inside a {@link ui.bootstrap.carousel.directive:carousel carousel}.  Must be placed as a child of a carousel element.
 *
 * @param {boolean=} active Model binding, whether or not this slide is currently active.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
<div ng-controller="CarouselDemoCtrl">
  <carousel>
    <slide ng-repeat="slide in slides" active="slide.active">
      <img ng-src="{{slide.image}}" style="margin:auto;">
      <div class="carousel-caption">
        <h4>Slide {{$index}}</h4>
        <p>{{slide.text}}</p>
      </div>
    </slide>
  </carousel>
  <div class="row-fluid">
    <div class="span6">
      <ul>
        <li ng-repeat="slide in slides">
          <button class="btn btn-mini" ng-class="{'btn-info': !slide.active, 'btn-success': slide.active}" ng-disabled="slide.active" ng-click="slide.active = true">select</button>
          {{$index}}: {{slide.text}}
        </li>
      </ul>
      <a class="btn" ng-click="addSlide()">Add Slide</a>
    </div>
    <div class="span6">
      Interval, in milliseconds: <input type="number" ng-model="myInterval">
      <br />Enter a negative number to stop the interval.
    </div>
  </div>
</div>
  </file>
  <file name="script.js">
function CarouselDemoCtrl($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 200 + ((slides.length + (25 * slides.length)) % 150);
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/200',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' '
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) $scope.addSlide();
}
  </file>
  <file name="demo.css">
    .carousel-indicators {
      top: auto;
      bottom: 15px;
    }
  </file>
</example>
*/

.directive('slide', ['$parse', function($parse) {
  return {
    require: '^carousel',
    restrict: 'EA',
    transclude: true,
    replace: true,
    templateUrl: 'template/carousel/slide.html',
    scope: {
    },
    link: function (scope, element, attrs, carouselCtrl) {
      //Set up optional 'active' = binding
      if (attrs.active) {
        var getActive = $parse(attrs.active);
        var setActive = getActive.assign;
        var lastValue = scope.active = getActive(scope.$parent);
        scope.$watch(function parentActiveWatch() {
          var parentActive = getActive(scope.$parent);

          if (parentActive !== scope.active) {
            // we are out of sync and need to copy
            if (parentActive !== lastValue) {
              // parent changed and it has precedence
              lastValue = scope.active = parentActive;
            } else {
              // if the parent can be assigned then do so
              setActive(scope.$parent, parentActive = lastValue = scope.active);
            }
          }
          return parentActive;
        });
      }

      carouselCtrl.addSlide(scope, element);
      //when the scope is destroyed then remove the slide from the current slides array
      scope.$on('$destroy', function() {
        carouselCtrl.removeSlide(scope);
      });

      scope.$watch('active', function(active) {
        if (active) {
          carouselCtrl.select(scope);
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, "position") || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].body.scrollTop || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].body.scrollLeft  || $document[0].documentElement.scrollLeft)
        };
      }
    };
  }]);

angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.position'])

.constant('datepickerConfig', {
  dayFormat: 'dd',
  monthFormat: 'MMMM',
  yearFormat: 'yyyy',
  dayHeaderFormat: 'EEE',
  dayTitleFormat: 'MMMM yyyy',
  monthTitleFormat: 'yyyy',
  showWeeks: true,
  startingDay: 0,
  yearRange: 20,
  minDate: null,
  maxDate: null
})

.controller('DatepickerController', ['$scope', '$attrs', 'dateFilter', 'datepickerConfig', function($scope, $attrs, dateFilter, dtConfig) {
  var format = {
    day:        getValue($attrs.dayFormat,        dtConfig.dayFormat),
    month:      getValue($attrs.monthFormat,      dtConfig.monthFormat),
    year:       getValue($attrs.yearFormat,       dtConfig.yearFormat),
    dayHeader:  getValue($attrs.dayHeaderFormat,  dtConfig.dayHeaderFormat),
    dayTitle:   getValue($attrs.dayTitleFormat,   dtConfig.dayTitleFormat),
    monthTitle: getValue($attrs.monthTitleFormat, dtConfig.monthTitleFormat)
  },
  startingDay = getValue($attrs.startingDay,      dtConfig.startingDay),
  yearRange =   getValue($attrs.yearRange,        dtConfig.yearRange);

  this.minDate = dtConfig.minDate ? new Date(dtConfig.minDate) : null;
  this.maxDate = dtConfig.maxDate ? new Date(dtConfig.maxDate) : null;

  function getValue(value, defaultValue) {
    return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
  }

  function getDaysInMonth( year, month ) {
    return new Date(year, month, 0).getDate();
  }

  function getDates(startDate, n) {
    var dates = new Array(n);
    var current = startDate, i = 0;
    while (i < n) {
      dates[i++] = new Date(current);
      current.setDate( current.getDate() + 1 );
    }
    return dates;
  }

  function makeDate(date, format, isSelected, isSecondary) {
    return { date: date, label: dateFilter(date, format), selected: !!isSelected, secondary: !!isSecondary };
  }

  this.modes = [
    {
      name: 'day',
      getVisibleDates: function(date, selected) {
        var year = date.getFullYear(), month = date.getMonth(), firstDayOfMonth = new Date(year, month, 1);
        var difference = startingDay - firstDayOfMonth.getDay(),
        numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
        firstDate = new Date(firstDayOfMonth), numDates = 0;

        if ( numDisplayedFromPreviousMonth > 0 ) {
          firstDate.setDate( - numDisplayedFromPreviousMonth + 1 );
          numDates += numDisplayedFromPreviousMonth; // Previous
        }
        numDates += getDaysInMonth(year, month + 1); // Current
        numDates += (7 - numDates % 7) % 7; // Next

        var days = getDates(firstDate, numDates), labels = new Array(7);
        for (var i = 0; i < numDates; i ++) {
          var dt = new Date(days[i]);
          days[i] = makeDate(dt, format.day, (selected && selected.getDate() === dt.getDate() && selected.getMonth() === dt.getMonth() && selected.getFullYear() === dt.getFullYear()), dt.getMonth() !== month);
        }
        for (var j = 0; j < 7; j++) {
          labels[j] = dateFilter(days[j].date, format.dayHeader);
        }
        return { objects: days, title: dateFilter(date, format.dayTitle), labels: labels };
      },
      compare: function(date1, date2) {
        return (new Date( date1.getFullYear(), date1.getMonth(), date1.getDate() ) - new Date( date2.getFullYear(), date2.getMonth(), date2.getDate() ) );
      },
      split: 7,
      step: { months: 1 }
    },
    {
      name: 'month',
      getVisibleDates: function(date, selected) {
        var months = new Array(12), year = date.getFullYear();
        for ( var i = 0; i < 12; i++ ) {
          var dt = new Date(year, i, 1);
          months[i] = makeDate(dt, format.month, (selected && selected.getMonth() === i && selected.getFullYear() === year));
        }
        return { objects: months, title: dateFilter(date, format.monthTitle) };
      },
      compare: function(date1, date2) {
        return new Date( date1.getFullYear(), date1.getMonth() ) - new Date( date2.getFullYear(), date2.getMonth() );
      },
      split: 3,
      step: { years: 1 }
    },
    {
      name: 'year',
      getVisibleDates: function(date, selected) {
        var years = new Array(yearRange), year = date.getFullYear(), startYear = parseInt((year - 1) / yearRange, 10) * yearRange + 1;
        for ( var i = 0; i < yearRange; i++ ) {
          var dt = new Date(startYear + i, 0, 1);
          years[i] = makeDate(dt, format.year, (selected && selected.getFullYear() === dt.getFullYear()));
        }
        return { objects: years, title: [years[0].label, years[yearRange - 1].label].join(' - ') };
      },
      compare: function(date1, date2) {
        return date1.getFullYear() - date2.getFullYear();
      },
      split: 5,
      step: { years: yearRange }
    }
  ];

  this.isDisabled = function(date, mode) {
    var currentMode = this.modes[mode || 0];
    return ((this.minDate && currentMode.compare(date, this.minDate) < 0) || (this.maxDate && currentMode.compare(date, this.maxDate) > 0) || ($scope.dateDisabled && $scope.dateDisabled({date: date, mode: currentMode.name})));
  };
}])

.directive( 'datepicker', ['dateFilter', '$parse', 'datepickerConfig', '$log', function (dateFilter, $parse, datepickerConfig, $log) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/datepicker/datepicker.html',
    scope: {
      dateDisabled: '&'
    },
    require: ['datepicker', '?^ngModel'],
    controller: 'DatepickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0], ngModel = ctrls[1];

      if (!ngModel) {
        return; // do nothing if no ng-model
      }

      // Configuration parameters
      var mode = 0, selected = new Date(), showWeeks = datepickerConfig.showWeeks;

      if (attrs.showWeeks) {
        scope.$parent.$watch($parse(attrs.showWeeks), function(value) {
          showWeeks = !! value;
          updateShowWeekNumbers();
        });
      } else {
        updateShowWeekNumbers();
      }

      if (attrs.min) {
        scope.$parent.$watch($parse(attrs.min), function(value) {
          datepickerCtrl.minDate = value ? new Date(value) : null;
          refill();
        });
      }
      if (attrs.max) {
        scope.$parent.$watch($parse(attrs.max), function(value) {
          datepickerCtrl.maxDate = value ? new Date(value) : null;
          refill();
        });
      }

      function updateShowWeekNumbers() {
        scope.showWeekNumbers = mode === 0 && showWeeks;
      }

      // Split array into smaller arrays
      function split(arr, size) {
        var arrays = [];
        while (arr.length > 0) {
          arrays.push(arr.splice(0, size));
        }
        return arrays;
      }

      function refill( updateSelected ) {
        var date = null, valid = true;

        if ( ngModel.$modelValue ) {
          date = new Date( ngModel.$modelValue );

          if ( isNaN(date) ) {
            valid = false;
            $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
          } else if ( updateSelected ) {
            selected = date;
          }
        }
        ngModel.$setValidity('date', valid);

        var currentMode = datepickerCtrl.modes[mode], data = currentMode.getVisibleDates(selected, date);
        angular.forEach(data.objects, function(obj) {
          obj.disabled = datepickerCtrl.isDisabled(obj.date, mode);
        });

        ngModel.$setValidity('date-disabled', (!date || !datepickerCtrl.isDisabled(date)));

        scope.rows = split(data.objects, currentMode.split);
        scope.labels = data.labels || [];
        scope.title = data.title;
      }

      function setMode(value) {
        mode = value;
        updateShowWeekNumbers();
        refill();
      }

      ngModel.$render = function() {
        refill( true );
      };

      scope.select = function( date ) {
        if ( mode === 0 ) {
          var dt = new Date( ngModel.$modelValue );
          dt.setFullYear( date.getFullYear(), date.getMonth(), date.getDate() );
          ngModel.$setViewValue( dt );
          refill( true );
        } else {
          selected = date;
          setMode( mode - 1 );
        }
      };
      scope.move = function(direction) {
        var step = datepickerCtrl.modes[mode].step;
        selected.setMonth( selected.getMonth() + direction * (step.months || 0) );
        selected.setFullYear( selected.getFullYear() + direction * (step.years || 0) );
        refill();
      };
      scope.toggleMode = function() {
        setMode( (mode + 1) % datepickerCtrl.modes.length );
      };
      scope.getWeekNumber = function(row) {
        return ( mode === 0 && scope.showWeekNumbers && row.length === 7 ) ? getISO8601WeekNumber(row[0].date) : null;
      };

      function getISO8601WeekNumber(date) {
        var checkDate = new Date(date);
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
        var time = checkDate.getTime();
        checkDate.setMonth(0); // Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      }
    }
  };
}])

.constant('datepickerPopupConfig', {
  dateFormat: 'yyyy-MM-dd',
  currentText: 'Today',
  toggleWeeksText: 'Weeks',
  clearText: 'Clear',
  closeText: 'Done',
  closeOnDateSelection: true,
  appendToBody: false
})

.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'datepickerPopupConfig', 'datepickerConfig',
function ($compile, $parse, $document, $position, dateFilter, datepickerPopupConfig, datepickerConfig) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    link: function(originalScope, element, attrs, ngModel) {
      var dateFormat;
      attrs.$observe('datepickerPopup', function(value) {
          dateFormat = value || datepickerPopupConfig.dateFormat;
          ngModel.$render();
      });

      var closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? originalScope.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection;
      var appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? originalScope.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;

      // create a child scope for the datepicker directive so we are not polluting original scope
      var scope = originalScope.$new();

      originalScope.$on('$destroy', function() {
        scope.$destroy();
      });

      attrs.$observe('currentText', function(text) {
        scope.currentText = angular.isDefined(text) ? text : datepickerPopupConfig.currentText;
      });
      attrs.$observe('toggleWeeksText', function(text) {
        scope.toggleWeeksText = angular.isDefined(text) ? text : datepickerPopupConfig.toggleWeeksText;
      });
      attrs.$observe('clearText', function(text) {
        scope.clearText = angular.isDefined(text) ? text : datepickerPopupConfig.clearText;
      });
      attrs.$observe('closeText', function(text) {
        scope.closeText = angular.isDefined(text) ? text : datepickerPopupConfig.closeText;
      });

      var getIsOpen, setIsOpen;
      if ( attrs.isOpen ) {
        getIsOpen = $parse(attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        originalScope.$watch(getIsOpen, function updateOpen(value) {
          scope.isOpen = !! value;
        });
      }
      scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

      function setOpen( value ) {
        if (setIsOpen) {
          setIsOpen(originalScope, !!value);
        } else {
          scope.isOpen = !!value;
        }
      }

      var documentClickBind = function(event) {
        if (scope.isOpen && event.target !== element[0]) {
          scope.$apply(function() {
            setOpen(false);
          });
        }
      };

      var elementFocusBind = function() {
        scope.$apply(function() {
          setOpen( true );
        });
      };

      // popup element used to display calendar
      var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>');
      popupEl.attr({
        'ng-model': 'date',
        'ng-change': 'dateSelection()'
      });
      var datepickerEl = angular.element(popupEl.children()[0]);
      if (attrs.datepickerOptions) {
        datepickerEl.attr(angular.extend({}, originalScope.$eval(attrs.datepickerOptions)));
      }

      // TODO: reverse from dateFilter string to Date object
      function parseDate(viewValue) {
        if (!viewValue) {
          ngModel.$setValidity('date', true);
          return null;
        } else if (angular.isDate(viewValue)) {
          ngModel.$setValidity('date', true);
          return viewValue;
        } else if (angular.isString(viewValue)) {
          var date = new Date(viewValue);
          if (isNaN(date)) {
            ngModel.$setValidity('date', false);
            return undefined;
          } else {
            ngModel.$setValidity('date', true);
            return date;
          }
        } else {
          ngModel.$setValidity('date', false);
          return undefined;
        }
      }
      ngModel.$parsers.unshift(parseDate);

      // Inner change
      scope.dateSelection = function() {
        ngModel.$setViewValue(scope.date);
        ngModel.$render();

        if (closeOnDateSelection) {
          setOpen( false );
        }
      };

      element.bind('input change keyup', function() {
        scope.$apply(function() {
          updateCalendar();
        });
      });

      // Outter change
      ngModel.$render = function() {
        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : '';
        element.val(date);

        updateCalendar();
      };

      function updateCalendar() {
        scope.date = ngModel.$modelValue;
        updatePosition();
      }

      function addWatchableAttribute(attribute, scopeProperty, datepickerAttribute) {
        if (attribute) {
          originalScope.$watch($parse(attribute), function(value){
            scope[scopeProperty] = value;
          });
          datepickerEl.attr(datepickerAttribute || scopeProperty, scopeProperty);
        }
      }
      addWatchableAttribute(attrs.min, 'min');
      addWatchableAttribute(attrs.max, 'max');
      if (attrs.showWeeks) {
        addWatchableAttribute(attrs.showWeeks, 'showWeeks', 'show-weeks');
      } else {
        scope.showWeeks = datepickerConfig.showWeeks;
        datepickerEl.attr('show-weeks', 'showWeeks');
      }
      if (attrs.dateDisabled) {
        datepickerEl.attr('date-disabled', attrs.dateDisabled);
      }

      function updatePosition() {
        scope.position = appendToBody ? $position.offset(element) : $position.position(element);
        scope.position.top = scope.position.top + element.prop('offsetHeight');
      }

      var documentBindingInitialized = false, elementFocusInitialized = false;
      scope.$watch('isOpen', function(value) {
        if (value) {
          updatePosition();
          $document.bind('click', documentClickBind);
          if(elementFocusInitialized) {
            element.unbind('focus', elementFocusBind);
          }
          element[0].focus();
          documentBindingInitialized = true;
        } else {
          if(documentBindingInitialized) {
            $document.unbind('click', documentClickBind);
          }
          element.bind('focus', elementFocusBind);
          elementFocusInitialized = true;
        }

        if ( setIsOpen ) {
          setIsOpen(originalScope, value);
        }
      });

      var $setModelValue = $parse(attrs.ngModel).assign;

      scope.today = function() {
        $setModelValue(originalScope, new Date());
      };
      scope.clear = function() {
        $setModelValue(originalScope, null);
      };

      var $popup = $compile(popupEl)(scope);
      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };
}])

.directive('datepickerPopupWrap', function() {
  return {
    restrict:'EA',
    replace: true,
    transclude: true,
    templateUrl: 'template/datepicker/popup.html',
    link:function (scope, element, attrs) {
      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  };
});

/*
 * dropdownToggle - Provides dropdown menu functionality in place of bootstrap js
 * @restrict class or attribute
 * @example:
   <li class="dropdown">
     <a class="dropdown-toggle">My Dropdown Menu</a>
     <ul class="dropdown-menu">
       <li ng-repeat="choice in dropChoices">
         <a ng-href="{{choice.href}}">{{choice.text}}</a>
       </li>
     </ul>
   </li>
 */

angular.module('ui.bootstrap.dropdownToggle', []).directive('dropdownToggle', ['$document', '$location', function ($document, $location) {
  var openElement = null,
      closeMenu   = angular.noop;
  return {
    restrict: 'CA',
    link: function(scope, element, attrs) {
      scope.$watch('$location.path', function() { closeMenu(); });
      element.parent().bind('click', function() { closeMenu(); });
      element.bind('click', function (event) {

        var elementWasOpen = (element === openElement);

        event.preventDefault();
        event.stopPropagation();

        if (!!openElement) {
          closeMenu();
        }

        if (!elementWasOpen && !element.hasClass('disabled') && !element.prop('disabled')) {
          element.parent().addClass('open');
          openElement = element;
          closeMenu = function (event) {
            if (event) {
              event.preventDefault();
              event.stopPropagation();
            }
            $document.unbind('click', closeMenu);
            element.parent().removeClass('open');
            closeMenu = angular.noop;
            openElement = null;
          };
          $document.bind('click', closeMenu);
        }
      });
    }
  };
}]);

angular.module('ui.bootstrap.modal', [])

/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function () {
    return {
      createNew: function () {
        var stack = [];

        return {
          add: function (key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function (key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function () {
            return stack[stack.length - 1];
          },
          remove: function (key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function () {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function () {
            return stack.length;
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('modalBackdrop', ['$modalStack', '$timeout', function ($modalStack, $timeout) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/modal/backdrop.html',
      link: function (scope, element, attrs) {

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });

        scope.close = function (evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop != 'static') {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };
      }
    };
  }])

  .directive('modalWindow', ['$timeout', function ($timeout) {
    return {
      restrict: 'EA',
      scope: {
        index: '@'
      },
      replace: true,
      transclude: true,
      templateUrl: 'template/modal/window.html',
      link: function (scope, element, attrs) {
        scope.windowClass = attrs.windowClass || '';

        //trigger CSS transitions
        $timeout(function () {
          scope.animate = true;
        });
      }
    };
  }])

  .factory('$modalStack', ['$document', '$compile', '$rootScope', '$$stackedMap',
    function ($document, $compile, $rootScope, $$stackedMap) {

      var backdropjqLiteEl, backdropDomEl;
      var backdropScope = $rootScope.$new(true);
      var body = $document.find('body').eq(0);
      var openedWindows = $$stackedMap.createNew();
      var $modalStack = {};

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex){
        backdropScope.index = newBackdropIndex;
      });

      function removeModalWindow(modalInstance) {

        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        //remove window DOM element
        modalWindow.modalDomEl.remove();

        //remove backdrop if no longer needed
        if (backdropDomEl && backdropIndex() == -1) {
          backdropDomEl.remove();
          backdropDomEl = undefined;
        }

        //destroy scope
        modalWindow.modalScope.$destroy();
      }

      $document.bind('keydown', function (evt) {
        var modal;

        if (evt.which === 27) {
          modal = openedWindows.top();
          if (modal && modal.value.keyboard) {
            $rootScope.$apply(function () {
              $modalStack.dismiss(modal.key);
            });
          }
        }
      });

      $modalStack.open = function (modalInstance, modal) {

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard
        });

        var angularDomEl = angular.element('<div modal-window></div>');
        angularDomEl.attr('window-class', modal.windowClass);
        angularDomEl.attr('index', openedWindows.length() - 1);
        angularDomEl.html(modal.content);

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        body.append(modalDomEl);

        if (backdropIndex() >= 0 && !backdropDomEl) {
            backdropjqLiteEl = angular.element('<div modal-backdrop></div>');
            backdropDomEl = $compile(backdropjqLiteEl)(backdropScope);
            body.append(backdropDomEl);
        }
      };

      $modalStack.close = function (modalInstance, result) {
        var modal = openedWindows.get(modalInstance);
        if (modal) {
          modal.value.deferred.resolve(result);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.dismiss = function (modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance).value;
        if (modalWindow) {
          modalWindow.deferred.reject(reason);
          removeModalWindow(modalInstance);
        }
      };

      $modalStack.getTop = function () {
        return openedWindows.top();
      };

      return $modalStack;
    }])

  .provider('$modal', function () {

    var $modalProvider = {
      options: {
        backdrop: true, //can be also false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$modalStack',
        function ($injector, $rootScope, $q, $http, $templateCache, $controller, $modalStack) {

          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $http.get(options.templateUrl, {cache: $templateCache}).then(function (result) {
                return result.data;
              });
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function (value, key) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              }
            });
            return promisesArr;
          }

          $modal.open = function (modalOptions) {

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              close: function (result) {
                $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));


            templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {

              var modalScope = (modalOptions.scope || $rootScope).$new();
              modalScope.$close = modalInstance.close;
              modalScope.$dismiss = modalInstance.dismiss;

              var ctrlInstance, ctrlLocals = {};
              var resolveIter = 1;

              //controllers
              if (modalOptions.controller) {
                ctrlLocals.$scope = modalScope;
                ctrlLocals.$modalInstance = modalInstance;
                angular.forEach(modalOptions.resolve, function (value, key) {
                  ctrlLocals[key] = tplAndVars[resolveIter++];
                });

                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
              }

              $modalStack.open(modalInstance, {
                scope: modalScope,
                deferred: modalResultDeferred,
                content: tplAndVars[0],
                backdrop: modalOptions.backdrop,
                keyboard: modalOptions.keyboard,
                windowClass: modalOptions.windowClass
              });

            }, function resolveError(reason) {
              modalResultDeferred.reject(reason);
            });

            templateAndResolvePromise.then(function () {
              modalOpenedDeferred.resolve(true);
            }, function () {
              modalOpenedDeferred.reject(false);
            });

            return modalInstance;
          };

          return $modal;
        }]
    };

    return $modalProvider;
  });

angular.module('ui.bootstrap.pagination', [])

.controller('PaginationController', ['$scope', '$attrs', '$parse', '$interpolate', function ($scope, $attrs, $parse, $interpolate) {
  var self = this,
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(defaultItemsPerPage) {
    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = defaultItemsPerPage;
    }
  };

  this.noPrevious = function() {
    return this.page === 1;
  };
  this.noNext = function() {
    return this.page === $scope.totalPages;
  };

  this.isActive = function(page) {
    return this.page === page;
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.getAttributeValue = function(attribute, defaultValue, interpolate) {
    return angular.isDefined(attribute) ? (interpolate ? $interpolate(attribute)($scope.$parent) : $scope.$parent.$eval(attribute)) : defaultValue;
  };

  this.render = function() {
    this.page = parseInt($scope.page, 10) || 1;
    if (this.page > 0 && this.page <= $scope.totalPages) {
      $scope.pages = this.getPages(this.page, $scope.totalPages);
    }
  };

  $scope.selectPage = function(page) {
    if ( ! self.isActive(page) && page > 0 && page <= $scope.totalPages) {
      $scope.page = page;
      $scope.onSelectPage({ page: page });
    }
  };

  $scope.$watch('page', function() {
    self.render();
  });

  $scope.$watch('totalItems', function() {
    $scope.totalPages = self.calculateTotalPages();
  });

  $scope.$watch('totalPages', function(value) {
    setNumPages($scope.$parent, value); // Readonly variable

    if ( self.page > value ) {
      $scope.selectPage(value);
    } else {
      self.render();
    }
  });
}])

.constant('paginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('pagination', ['$parse', 'paginationConfig', function($parse, config) {
  return {
    restrict: 'EA',
    scope: {
      page: '=',
      totalItems: '=',
      onSelectPage:' &'
    },
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pagination.html',
    replace: true,
    link: function(scope, element, attrs, paginationCtrl) {

      // Setup configuration parameters
      var maxSize,
      boundaryLinks  = paginationCtrl.getAttributeValue(attrs.boundaryLinks,  config.boundaryLinks      ),
      directionLinks = paginationCtrl.getAttributeValue(attrs.directionLinks, config.directionLinks     ),
      firstText      = paginationCtrl.getAttributeValue(attrs.firstText,      config.firstText,     true),
      previousText   = paginationCtrl.getAttributeValue(attrs.previousText,   config.previousText,  true),
      nextText       = paginationCtrl.getAttributeValue(attrs.nextText,       config.nextText,      true),
      lastText       = paginationCtrl.getAttributeValue(attrs.lastText,       config.lastText,      true),
      rotate         = paginationCtrl.getAttributeValue(attrs.rotate,         config.rotate);

      paginationCtrl.init(config.itemsPerPage);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive, isDisabled) {
        return {
          number: number,
          text: text,
          active: isActive,
          disabled: isDisabled
        };
      }

      paginationCtrl.getPages = function(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = ( angular.isDefined(maxSize) && maxSize < totalPages );

        // recompute if maxSize
        if ( isMaxSized ) {
          if ( rotate ) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, paginationCtrl.isActive(number), false);
          pages.push(page);
        }

        // Add links to move between page sets
        if ( isMaxSized && ! rotate ) {
          if ( startPage > 1 ) {
            var previousPageSet = makePage(startPage - 1, '...', false, false);
            pages.unshift(previousPageSet);
          }

          if ( endPage < totalPages ) {
            var nextPageSet = makePage(endPage + 1, '...', false, false);
            pages.push(nextPageSet);
          }
        }

        // Add previous & next links
        if (directionLinks) {
          var previousPage = makePage(currentPage - 1, previousText, false, paginationCtrl.noPrevious());
          pages.unshift(previousPage);

          var nextPage = makePage(currentPage + 1, nextText, false, paginationCtrl.noNext());
          pages.push(nextPage);
        }

        // Add first & last links
        if (boundaryLinks) {
          var firstPage = makePage(1, firstText, false, paginationCtrl.noPrevious());
          pages.unshift(firstPage);

          var lastPage = makePage(totalPages, lastText, false, paginationCtrl.noNext());
          pages.push(lastPage);
        }

        return pages;
      };
    }
  };
}])

.constant('pagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('pager', ['pagerConfig', function(config) {
  return {
    restrict: 'EA',
    scope: {
      page: '=',
      totalItems: '=',
      onSelectPage:' &'
    },
    controller: 'PaginationController',
    templateUrl: 'template/pagination/pager.html',
    replace: true,
    link: function(scope, element, attrs, paginationCtrl) {

      // Setup configuration parameters
      var previousText = paginationCtrl.getAttributeValue(attrs.previousText, config.previousText, true),
      nextText         = paginationCtrl.getAttributeValue(attrs.nextText,     config.nextText,     true),
      align            = paginationCtrl.getAttributeValue(attrs.align,        config.align);

      paginationCtrl.init(config.itemsPerPage);

      // Create page object used in template
      function makePage(number, text, isDisabled, isPrevious, isNext) {
        return {
          number: number,
          text: text,
          disabled: isDisabled,
          previous: ( align && isPrevious ),
          next: ( align && isNext )
        };
      }

      paginationCtrl.getPages = function(currentPage) {
        return [
          makePage(currentPage - 1, previousText, paginationCtrl.noPrevious(), true, false),
          makePage(currentPage + 1, nextText, paginationCtrl.noNext(), false, true)
        ];
      };
    }
  };
}]);

/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
angular.module( 'ui.bootstrap.tooltip', [ 'ui.bootstrap.position', 'ui.bootstrap.bindHtml' ] )

/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider( '$tooltip', function () {
  // The default options tooltip and popover.
  var defaultOptions = {
    placement: 'top',
    animation: true,
    popupDelay: 0
  };

  // Default hide triggers for each show trigger
  var triggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur'
  };

  // The options specified to the provider globally.
  var globalOptions = {};
  
  /**
   * `options({})` allows global configuration of all tooltips in the
   * application.
   *
   *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
   */
	this.options = function( value ) {
		angular.extend( globalOptions, value );
	};

  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
   */
  this.setTriggers = function setTriggers ( triggers ) {
    angular.extend( triggerMap, triggers );
  };

  /**
   * This is a helper function for translating camel-case to snake-case.
   */
  function snake_case(name){
    var regexp = /[A-Z]/g;
    var separator = '-';
    return name.replace(regexp, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */
  this.$get = [ '$window', '$compile', '$timeout', '$parse', '$document', '$position', '$interpolate', function ( $window, $compile, $timeout, $parse, $document, $position, $interpolate ) {
    return function $tooltip ( type, prefix, defaultTriggerShow ) {
      var options = angular.extend( {}, defaultOptions, globalOptions );

      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */
      function getTriggers ( trigger ) {
        var show = trigger || options.trigger || defaultTriggerShow;
        var hide = triggerMap[show] || show;
        return {
          show: show,
          hide: hide
        };
      }

      var directiveName = snake_case( type );

      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
      var template = 
        '<'+ directiveName +'-popup '+
          'title="'+startSym+'tt_title'+endSym+'" '+
          'content="'+startSym+'tt_content'+endSym+'" '+
          'placement="'+startSym+'tt_placement'+endSym+'" '+
          'animation="tt_animation" '+
          'is-open="tt_isOpen"'+
          '>'+
        '</'+ directiveName +'-popup>';

      return {
        restrict: 'EA',
        scope: true,
        link: function link ( scope, element, attrs ) {
          var tooltip = $compile( template )( scope );
          var transitionTimeout;
          var popupTimeout;
          var $body = $document.find( 'body' );
          var appendToBody = angular.isDefined( options.appendToBody ) ? options.appendToBody : false;
          var triggers = getTriggers( undefined );
          var hasRegisteredTriggers = false;
          var hasEnableExp = angular.isDefined(attrs[prefix+'Enable']);

          // By default, the tooltip is not open.
          // TODO add ability to start tooltip opened
          scope.tt_isOpen = false;

          function toggleTooltipBind () {
            if ( ! scope.tt_isOpen ) {
              showTooltipBind();
            } else {
              hideTooltipBind();
            }
          }
          
          // Show the tooltip with delay if specified, otherwise show it immediately
          function showTooltipBind() {
            if(hasEnableExp && !scope.$eval(attrs[prefix+'Enable'])) {
              return;
            }
            if ( scope.tt_popupDelay ) {
              popupTimeout = $timeout( show, scope.tt_popupDelay );
            } else {
              scope.$apply( show );
            }
          }

          function hideTooltipBind () {
            scope.$apply(function () {
              hide();
            });
          }
          
          // Show the tooltip popup element.
          function show() {
            var position,
                ttWidth,
                ttHeight,
                ttPosition;

            // Don't show empty tooltips.
            if ( ! scope.tt_content ) {
              return;
            }

            // If there is a pending remove transition, we must cancel it, lest the
            // tooltip be mysteriously removed.
            if ( transitionTimeout ) {
              $timeout.cancel( transitionTimeout );
            }
            
            // Set the initial positioning.
            tooltip.css({ top: 0, left: 0, display: 'block' });
            
            // Now we add it to the DOM because need some info about it. But it's not 
            // visible yet anyway.
            if ( appendToBody ) {
                $body.append( tooltip );
            } else {
              element.after( tooltip );
            }

            // Get the position of the directive element.
            position = appendToBody ? $position.offset( element ) : $position.position( element );

            // Get the height and width of the tooltip so we can center it.
            ttWidth = tooltip.prop( 'offsetWidth' );
            ttHeight = tooltip.prop( 'offsetHeight' );
            
            // Calculate the tooltip's top and left coordinates to center it with
            // this directive.
            switch ( scope.tt_placement ) {
              case 'right':
                ttPosition = {
                  top: position.top + position.height / 2 - ttHeight / 2,
                  left: position.left + position.width
                };
                break;
              case 'bottom':
                ttPosition = {
                  top: position.top + position.height,
                  left: position.left + position.width / 2 - ttWidth / 2
                };
                break;
              case 'left':
                ttPosition = {
                  top: position.top + position.height / 2 - ttHeight / 2,
                  left: position.left - ttWidth
                };
                break;
              default:
                ttPosition = {
                  top: position.top - ttHeight,
                  left: position.left + position.width / 2 - ttWidth / 2
                };
                break;
            }

            ttPosition.top += 'px';
            ttPosition.left += 'px';

            // Now set the calculated positioning.
            tooltip.css( ttPosition );
              
            // And show the tooltip.
            scope.tt_isOpen = true;
          }
          
          // Hide the tooltip popup element.
          function hide() {
            // First things first: we don't show it anymore.
            scope.tt_isOpen = false;

            //if tooltip is going to be shown after delay, we must cancel this
            $timeout.cancel( popupTimeout );
            
            // And now we remove it from the DOM. However, if we have animation, we 
            // need to wait for it to expire beforehand.
            // FIXME: this is a placeholder for a port of the transitions library.
            if ( scope.tt_animation ) {
              transitionTimeout = $timeout(function () {
                tooltip.remove();
              }, 500);
            } else {
              tooltip.remove();
            }
          }

          /**
           * Observe the relevant attributes.
           */
          attrs.$observe( type, function ( val ) {
            if (val) {
              scope.tt_content = val;
            } else {
              if ( scope.tt_isOpen ) {
                hide();
              }
            }
          });

          attrs.$observe( prefix+'Title', function ( val ) {
            scope.tt_title = val;
          });

          attrs.$observe( prefix+'Placement', function ( val ) {
            scope.tt_placement = angular.isDefined( val ) ? val : options.placement;
          });

          attrs.$observe(prefix + 'Animation', function (val) {
            scope.tt_animation = angular.isDefined(val) ? !!val : options.animation;
          });

          attrs.$observe( prefix+'PopupDelay', function ( val ) {
            var delay = parseInt( val, 10 );
            scope.tt_popupDelay = ! isNaN(delay) ? delay : options.popupDelay;
          });

          attrs.$observe( prefix+'Trigger', function ( val ) {

            if (hasRegisteredTriggers) {
              element.unbind( triggers.show, showTooltipBind );
              element.unbind( triggers.hide, hideTooltipBind );
            }

            triggers = getTriggers( val );

            if ( triggers.show === triggers.hide ) {
              element.bind( triggers.show, toggleTooltipBind );
            } else {
              element.bind( triggers.show, showTooltipBind );
              element.bind( triggers.hide, hideTooltipBind );
            }

            hasRegisteredTriggers = true;
          });

          attrs.$observe( prefix+'AppendToBody', function ( val ) {
            appendToBody = angular.isDefined( val ) ? $parse( val )( scope ) : appendToBody;
          });

          // if a tooltip is attached to <body> we need to remove it on
          // location change as its parent scope will probably not be destroyed
          // by the change.
          if ( appendToBody ) {
            scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess () {
            if ( scope.tt_isOpen ) {
              hide();
            }
          });
          }

          // Make sure tooltip is destroyed and removed.
          scope.$on('$destroy', function onDestroyTooltip() {
            $timeout.cancel( popupTimeout );
            tooltip.remove();
            tooltip.unbind();
            tooltip = null;
            $body = null;
          });
        }
      };
    };
  }];
})

.directive( 'tooltipPopup', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-popup.html'
  };
})

.directive( 'tooltip', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'tooltip', 'tooltip', 'mouseenter' );
}])

.directive( 'tooltipHtmlUnsafePopup', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
  };
})

.directive( 'tooltipHtmlUnsafe', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'tooltipHtmlUnsafe', 'tooltip', 'mouseenter' );
}]);

/**
 * The following features are still outstanding: popup delay, animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html popovers, and selector delegatation.
 */
angular.module( 'ui.bootstrap.popover', [ 'ui.bootstrap.tooltip' ] )
.directive( 'popoverPopup', function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover.html'
  };
})
.directive( 'popover', [ '$compile', '$timeout', '$parse', '$window', '$tooltip', function ( $compile, $timeout, $parse, $window, $tooltip ) {
  return $tooltip( 'popover', 'popover', 'click' );
}]);


angular.module('ui.bootstrap.progressbar', ['ui.bootstrap.transition'])

.constant('progressConfig', {
  animate: true,
  autoType: false,
  stackedTypes: ['success', 'info', 'warning', 'danger']
})

.controller('ProgressBarController', ['$scope', '$attrs', 'progressConfig', function($scope, $attrs, progressConfig) {

    // Whether bar transitions should be animated
    var animate = angular.isDefined($attrs.animate) ? $scope.$eval($attrs.animate) : progressConfig.animate;
    var autoType = angular.isDefined($attrs.autoType) ? $scope.$eval($attrs.autoType) : progressConfig.autoType;
    var stackedTypes = angular.isDefined($attrs.stackedTypes) ? $scope.$eval('[' + $attrs.stackedTypes + ']') : progressConfig.stackedTypes;

    // Create bar object
    this.makeBar = function(newBar, oldBar, index) {
        var newValue = (angular.isObject(newBar)) ? newBar.value : (newBar || 0);
        var oldValue =  (angular.isObject(oldBar)) ? oldBar.value : (oldBar || 0);
        var type = (angular.isObject(newBar) && angular.isDefined(newBar.type)) ? newBar.type : (autoType) ? getStackedType(index || 0) : null;

        return {
            from: oldValue,
            to: newValue,
            type: type,
            animate: animate
        };
    };

    function getStackedType(index) {
        return stackedTypes[index];
    }

    this.addBar = function(bar) {
        $scope.bars.push(bar);
        $scope.totalPercent += bar.to;
    };

    this.clearBars = function() {
        $scope.bars = [];
        $scope.totalPercent = 0;
    };
    this.clearBars();
}])

.directive('progress', function() {
    return {
        restrict: 'EA',
        replace: true,
        controller: 'ProgressBarController',
        scope: {
            value: '=percent',
            onFull: '&',
            onEmpty: '&'
        },
        templateUrl: 'template/progressbar/progress.html',
        link: function(scope, element, attrs, controller) {
            scope.$watch('value', function(newValue, oldValue) {
                controller.clearBars();

                if (angular.isArray(newValue)) {
                    // Stacked progress bar
                    for (var i=0, n=newValue.length; i < n; i++) {
                        controller.addBar(controller.makeBar(newValue[i], oldValue[i], i));
                    }
                } else {
                    // Simple bar
                    controller.addBar(controller.makeBar(newValue, oldValue));
                }
            }, true);

            // Total percent listeners
            scope.$watch('totalPercent', function(value) {
              if (value >= 100) {
                scope.onFull();
              } else if (value <= 0) {
                scope.onEmpty();
              }
            }, true);
        }
    };
})

.directive('progressbar', ['$transition', function($transition) {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            width: '=',
            old: '=',
            type: '=',
            animate: '='
        },
        templateUrl: 'template/progressbar/bar.html',
        link: function(scope, element) {
            scope.$watch('width', function(value) {
                if (scope.animate) {
                    element.css('width', scope.old + '%');
                    $transition(element, {width: value + '%'});
                } else {
                    element.css('width', value + '%');
                }
            });
        }
    };
}]);
angular.module('ui.bootstrap.rating', [])

.constant('ratingConfig', {
  max: 5,
  stateOn: null,
  stateOff: null
})

.controller('RatingController', ['$scope', '$attrs', '$parse', 'ratingConfig', function($scope, $attrs, $parse, ratingConfig) {

  this.maxRange = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : ratingConfig.max;
  this.stateOn = angular.isDefined($attrs.stateOn) ? $scope.$parent.$eval($attrs.stateOn) : ratingConfig.stateOn;
  this.stateOff = angular.isDefined($attrs.stateOff) ? $scope.$parent.$eval($attrs.stateOff) : ratingConfig.stateOff;

  this.createRateObjects = function(states) {
    var defaultOptions = {
      stateOn: this.stateOn,
      stateOff: this.stateOff
    };

    for (var i = 0, n = states.length; i < n; i++) {
      states[i] = angular.extend({ index: i }, defaultOptions, states[i]);
    }
    return states;
  };

  // Get objects used in template
  $scope.range = angular.isDefined($attrs.ratingStates) ?  this.createRateObjects(angular.copy($scope.$parent.$eval($attrs.ratingStates))): this.createRateObjects(new Array(this.maxRange));

  $scope.rate = function(value) {
    if ( $scope.readonly || $scope.value === value) {
      return;
    }

    $scope.value = value;
  };

  $scope.enter = function(value) {
    if ( ! $scope.readonly ) {
      $scope.val = value;
    }
    $scope.onHover({value: value});
  };

  $scope.reset = function() {
    $scope.val = angular.copy($scope.value);
    $scope.onLeave();
  };

  $scope.$watch('value', function(value) {
    $scope.val = value;
  });

  $scope.readonly = false;
  if ($attrs.readonly) {
    $scope.$parent.$watch($parse($attrs.readonly), function(value) {
      $scope.readonly = !!value;
    });
  }
}])

.directive('rating', function() {
  return {
    restrict: 'EA',
    scope: {
      value: '=',
      onHover: '&',
      onLeave: '&'
    },
    controller: 'RatingController',
    templateUrl: 'template/rating/rating.html',
    replace: true
  };
});

/**
 * @ngdoc overview
 * @name ui.bootstrap.tabs
 *
 * @description
 * AngularJS version of the tabs directive.
 */

angular.module('ui.bootstrap.tabs', [])

.directive('tabs', function() {
  return function() {
    throw new Error("The `tabs` directive is deprecated, please migrate to `tabset`. Instructions can be found at http://github.com/angular-ui/bootstrap/tree/master/CHANGELOG.md");
  };
})

.controller('TabsetController', ['$scope', function TabsetCtrl($scope) {
  var ctrl = this,
      tabs = ctrl.tabs = $scope.tabs = [];

  ctrl.select = function(tab) {
    angular.forEach(tabs, function(tab) {
      tab.active = false;
    });
    tab.active = true;
  };

  ctrl.addTab = function addTab(tab) {
    tabs.push(tab);
    if (tabs.length === 1 || tab.active) {
      ctrl.select(tab);
    }
  };

  ctrl.removeTab = function removeTab(tab) {
    var index = tabs.indexOf(tab);
    //Select a new tab if the tab to be removed is selected
    if (tab.active && tabs.length > 1) {
      //If this is the last tab, select the previous tab. else, the next tab.
      var newActiveIndex = index == tabs.length - 1 ? index - 1 : index + 1;
      ctrl.select(tabs[newActiveIndex]);
    }
    tabs.splice(index, 1);
  };
}])

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabset
 * @restrict EA
 *
 * @description
 * Tabset is the outer container for the tabs directive
 *
 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
 * @param {string=} direction  What direction the tabs should be rendered. Available:
 * 'right', 'left', 'below'.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab heading="Vertical Tab 1"><b>First</b> Content!</tab>
      <tab heading="Vertical Tab 2"><i>Second</i> Content!</tab>
    </tabset>
    <hr />
    <tabset vertical="true">
      <tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</tab>
      <tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</tab>
    </tabset>
  </file>
</example>
 */
.directive('tabset', function() {
  return {
    restrict: 'EA',
    transclude: true,
    replace: true,
    require: '^tabset',
    scope: {},
    controller: 'TabsetController',
    templateUrl: 'template/tabs/tabset.html',
    compile: function(elm, attrs, transclude) {
      return function(scope, element, attrs, tabsetCtrl) {
        scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
        scope.type = angular.isDefined(attrs.type) ? scope.$parent.$eval(attrs.type) : 'tabs';
        scope.direction = angular.isDefined(attrs.direction) ? scope.$parent.$eval(attrs.direction) : 'top';
        scope.tabsAbove = (scope.direction != 'below');
        tabsetCtrl.$scope = scope;
        tabsetCtrl.$transcludeFn = transclude;
      };
    }
  };
})

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tab
 * @restrict EA
 *
 * @param {string=} heading The visible heading, or title, of the tab. Set HTML headings with {@link ui.bootstrap.tabs.directive:tabHeading tabHeading}.
 * @param {string=} select An expression to evaluate when the tab is selected.
 * @param {boolean=} active A binding, telling whether or not this tab is selected.
 * @param {boolean=} disabled A binding, telling whether or not this tab is disabled.
 *
 * @description
 * Creates a tab with a heading and content. Must be placed within a {@link ui.bootstrap.tabs.directive:tabset tabset}.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <div ng-controller="TabsDemoCtrl">
      <button class="btn btn-small" ng-click="items[0].active = true">
        Select item 1, using active binding
      </button>
      <button class="btn btn-small" ng-click="items[1].disabled = !items[1].disabled">
        Enable/disable item 2, using disabled binding
      </button>
      <br />
      <tabset>
        <tab heading="Tab 1">First Tab</tab>
        <tab select="alertMe()">
          <tab-heading><i class="icon-bell"></i> Alert me!</tab-heading>
          Second Tab, with alert callback and html heading!
        </tab>
        <tab ng-repeat="item in items"
          heading="{{item.title}}"
          disabled="item.disabled"
          active="item.active">
          {{item.content}}
        </tab>
      </tabset>
    </div>
  </file>
  <file name="script.js">
    function TabsDemoCtrl($scope) {
      $scope.items = [
        { title:"Dynamic Title 1", content:"Dynamic Item 0" },
        { title:"Dynamic Title 2", content:"Dynamic Item 1", disabled: true }
      ];

      $scope.alertMe = function() {
        setTimeout(function() {
          alert("You've selected the alert tab!");
        });
      };
    };
  </file>
</example>
 */

/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabHeading
 * @restrict EA
 *
 * @description
 * Creates an HTML heading for a {@link ui.bootstrap.tabs.directive:tab tab}. Must be placed as a child of a tab element.
 *
 * @example
<example module="ui.bootstrap">
  <file name="index.html">
    <tabset>
      <tab>
        <tab-heading><b>HTML</b> in my titles?!</tab-heading>
        And some content, too!
      </tab>
      <tab>
        <tab-heading><i class="icon-heart"></i> Icon heading?!?</tab-heading>
        That's right.
      </tab>
    </tabset>
  </file>
</example>
 */
.directive('tab', ['$parse', function($parse) {
  return {
    require: '^tabset',
    restrict: 'EA',
    replace: true,
    templateUrl: 'template/tabs/tab.html',
    transclude: true,
    scope: {
      heading: '@',
      onSelect: '&select', //This callback is called in contentHeadingTransclude
                          //once it inserts the tab's content into the dom
      onDeselect: '&deselect'
    },
    controller: function() {
      //Empty controller so other directives can require being 'under' a tab
    },
    compile: function(elm, attrs, transclude) {
      return function postLink(scope, elm, attrs, tabsetCtrl) {
        var getActive, setActive;
        if (attrs.active) {
          getActive = $parse(attrs.active);
          setActive = getActive.assign;
          scope.$parent.$watch(getActive, function updateActive(value, oldVal) {
            // Avoid re-initializing scope.active as it is already initialized
            // below. (watcher is called async during init with value ===
            // oldVal)
            if (value !== oldVal) {
              scope.active = !!value;
            }
          });
          scope.active = getActive(scope.$parent);
        } else {
          setActive = getActive = angular.noop;
        }

        scope.$watch('active', function(active) {
          // Note this watcher also initializes and assigns scope.active to the
          // attrs.active expression.
          setActive(scope.$parent, active);
          if (active) {
            tabsetCtrl.select(scope);
            scope.onSelect();
          } else {
            scope.onDeselect();
          }
        });

        scope.disabled = false;
        if ( attrs.disabled ) {
          scope.$parent.$watch($parse(attrs.disabled), function(value) {
            scope.disabled = !! value;
          });
        }

        scope.select = function() {
          if ( ! scope.disabled ) {
            scope.active = true;
          }
        };

        tabsetCtrl.addTab(scope);
        scope.$on('$destroy', function() {
          tabsetCtrl.removeTab(scope);
        });


        //We need to transclude later, once the content container is ready.
        //when this link happens, we're inside a tab heading.
        scope.$transcludeFn = transclude;
      };
    }
  };
}])

.directive('tabHeadingTransclude', [function() {
  return {
    restrict: 'A',
    require: '^tab',
    link: function(scope, elm, attrs, tabCtrl) {
      scope.$watch('headingElement', function updateHeadingElement(heading) {
        if (heading) {
          elm.html('');
          elm.append(heading);
        }
      });
    }
  };
}])

.directive('tabContentTransclude', function() {
  return {
    restrict: 'A',
    require: '^tabset',
    link: function(scope, elm, attrs) {
      var tab = scope.$eval(attrs.tabContentTransclude);

      //Now our tab is ready to be transcluded: both the tab heading area
      //and the tab content area are loaded.  Transclude 'em both.
      tab.$transcludeFn(tab.$parent, function(contents) {
        angular.forEach(contents, function(node) {
          if (isTabHeading(node)) {
            //Let tabHeadingTransclude know.
            tab.headingElement = node;
          } else {
            elm.append(node);
          }
        });
      });
    }
  };
  function isTabHeading(node) {
    return node.tagName &&  (
      node.hasAttribute('tab-heading') ||
      node.hasAttribute('data-tab-heading') ||
      node.tagName.toLowerCase() === 'tab-heading' ||
      node.tagName.toLowerCase() === 'data-tab-heading'
    );
  }
})

.directive('tabsetTitles', function() {
  return {
    restrict: 'A',
    require: '^tabset',
    templateUrl: 'template/tabs/tabset-titles.html',
    replace: true,
    link: function(scope, elm, attrs, tabsetCtrl) {
      if (!scope.$eval(attrs.tabsetTitles)) {
        elm.remove();
      } else {
        //now that tabs location has been decided, transclude the tab titles in
        tabsetCtrl.$transcludeFn(tabsetCtrl.$scope.$parent, function(node) {
          elm.append(node);
        });
      }
    }
  };
});

angular.module('ui.bootstrap.timepicker', [])

.constant('timepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  showMeridian: true,
  meridians: ['AM', 'PM'],
  readonlyInput: false,
  mousewheel: true
})

.directive('timepicker', ['$parse', '$log', 'timepickerConfig', function ($parse, $log, timepickerConfig) {
  return {
    restrict: 'EA',
    require:'?^ngModel',
    replace: true,
    scope: {},
    templateUrl: 'template/timepicker/timepicker.html',
    link: function(scope, element, attrs, ngModel) {
      if ( !ngModel ) {
        return; // do nothing if no ng-model
      }

      var selected = new Date(), meridians = timepickerConfig.meridians;

      var hourStep = timepickerConfig.hourStep;
      if (attrs.hourStep) {
        scope.$parent.$watch($parse(attrs.hourStep), function(value) {
          hourStep = parseInt(value, 10);
        });
      }

      var minuteStep = timepickerConfig.minuteStep;
      if (attrs.minuteStep) {
        scope.$parent.$watch($parse(attrs.minuteStep), function(value) {
          minuteStep = parseInt(value, 10);
        });
      }

      // 12H / 24H mode
      scope.showMeridian = timepickerConfig.showMeridian;
      if (attrs.showMeridian) {
        scope.$parent.$watch($parse(attrs.showMeridian), function(value) {
          scope.showMeridian = !!value;

          if ( ngModel.$error.time ) {
            // Evaluate from template
            var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
            if (angular.isDefined( hours ) && angular.isDefined( minutes )) {
              selected.setHours( hours );
              refresh();
            }
          } else {
            updateTemplate();
          }
        });
      }

      // Get scope.hours in 24H mode if valid
      function getHoursFromTemplate ( ) {
        var hours = parseInt( scope.hours, 10 );
        var valid = ( scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
        if ( !valid ) {
          return undefined;
        }

        if ( scope.showMeridian ) {
          if ( hours === 12 ) {
            hours = 0;
          }
          if ( scope.meridian === meridians[1] ) {
            hours = hours + 12;
          }
        }
        return hours;
      }

      function getMinutesFromTemplate() {
        var minutes = parseInt(scope.minutes, 10);
        return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
      }

      function pad( value ) {
        return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
      }

      // Input elements
      var inputs = element.find('input'), hoursInputEl = inputs.eq(0), minutesInputEl = inputs.eq(1);

      // Respond on mousewheel spin
      var mousewheel = (angular.isDefined(attrs.mousewheel)) ? scope.$eval(attrs.mousewheel) : timepickerConfig.mousewheel;
      if ( mousewheel ) {

        var isScrollingUp = function(e) {
          if (e.originalEvent) {
            e = e.originalEvent;
          }
          //pick correct delta variable depending on event
          var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
          return (e.detail || delta > 0);
        };

        hoursInputEl.bind('mousewheel wheel', function(e) {
          scope.$apply( (isScrollingUp(e)) ? scope.incrementHours() : scope.decrementHours() );
          e.preventDefault();
        });

        minutesInputEl.bind('mousewheel wheel', function(e) {
          scope.$apply( (isScrollingUp(e)) ? scope.incrementMinutes() : scope.decrementMinutes() );
          e.preventDefault();
        });
      }

      scope.readonlyInput = (angular.isDefined(attrs.readonlyInput)) ? scope.$eval(attrs.readonlyInput) : timepickerConfig.readonlyInput;
      if ( ! scope.readonlyInput ) {

        var invalidate = function(invalidHours, invalidMinutes) {
          ngModel.$setViewValue( null );
          ngModel.$setValidity('time', false);
          if (angular.isDefined(invalidHours)) {
            scope.invalidHours = invalidHours;
          }
          if (angular.isDefined(invalidMinutes)) {
            scope.invalidMinutes = invalidMinutes;
          }
        };

        scope.updateHours = function() {
          var hours = getHoursFromTemplate();

          if ( angular.isDefined(hours) ) {
            selected.setHours( hours );
            refresh( 'h' );
          } else {
            invalidate(true);
          }
        };

        hoursInputEl.bind('blur', function(e) {
          if ( !scope.validHours && scope.hours < 10) {
            scope.$apply( function() {
              scope.hours = pad( scope.hours );
            });
          }
        });

        scope.updateMinutes = function() {
          var minutes = getMinutesFromTemplate();

          if ( angular.isDefined(minutes) ) {
            selected.setMinutes( minutes );
            refresh( 'm' );
          } else {
            invalidate(undefined, true);
          }
        };

        minutesInputEl.bind('blur', function(e) {
          if ( !scope.invalidMinutes && scope.minutes < 10 ) {
            scope.$apply( function() {
              scope.minutes = pad( scope.minutes );
            });
          }
        });
      } else {
        scope.updateHours = angular.noop;
        scope.updateMinutes = angular.noop;
      }

      ngModel.$render = function() {
        var date = ngModel.$modelValue ? new Date( ngModel.$modelValue ) : null;

        if ( isNaN(date) ) {
          ngModel.$setValidity('time', false);
          $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
        } else {
          if ( date ) {
            selected = date;
          }
          makeValid();
          updateTemplate();
        }
      };

      // Call internally when we know that model is valid.
      function refresh( keyboardChange ) {
        makeValid();
        ngModel.$setViewValue( new Date(selected) );
        updateTemplate( keyboardChange );
      }

      function makeValid() {
        ngModel.$setValidity('time', true);
        scope.invalidHours = false;
        scope.invalidMinutes = false;
      }

      function updateTemplate( keyboardChange ) {
        var hours = selected.getHours(), minutes = selected.getMinutes();

        if ( scope.showMeridian ) {
          hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
        }
        scope.hours =  keyboardChange === 'h' ? hours : pad(hours);
        scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
        scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
      }

      function addMinutes( minutes ) {
        var dt = new Date( selected.getTime() + minutes * 60000 );
        selected.setHours( dt.getHours(), dt.getMinutes() );
        refresh();
      }

      scope.incrementHours = function() {
        addMinutes( hourStep * 60 );
      };
      scope.decrementHours = function() {
        addMinutes( - hourStep * 60 );
      };
      scope.incrementMinutes = function() {
        addMinutes( minuteStep );
      };
      scope.decrementMinutes = function() {
        addMinutes( - minuteStep );
      };
      scope.toggleMeridian = function() {
        addMinutes( 12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1) );
      };
    }
  };
}]);

angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position', 'ui.bootstrap.bindHtml'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('typeaheadParser', ['$parse', function ($parse) {

  //                      00000111000000000000022200000000000000003333333333333330000000000044000
  var TYPEAHEAD_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;

  return {
    parse:function (input) {

      var match = input.match(TYPEAHEAD_REGEXP), modelMapper, viewMapper, source;
      if (!match) {
        throw new Error(
          "Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_'" +
            " but got '" + input + "'.");
      }

      return {
        itemName:match[3],
        source:$parse(match[4]),
        viewMapper:$parse(match[2] || match[1]),
        modelMapper:$parse(match[1])
      };
    }
  };
}])

  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$position', 'typeaheadParser',
    function ($compile, $parse, $q, $timeout, $document, $position, typeaheadParser) {

  var HOT_KEYS = [9, 13, 27, 38, 40];

  return {
    require:'ngModel',
    link:function (originalScope, element, attrs, modelCtrl) {

      //SUPPORTED ATTRIBUTES (OPTIONS)

      //minimal no of characters that needs to be entered before typeahead kicks-in
      var minSearch = originalScope.$eval(attrs.typeaheadMinLength) || 1;

      //minimal wait time after last character typed before typehead kicks-in
      var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

      //should it restrict model values to the ones selected from the popup only?
      var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

      //binding to a variable that indicates if matches are being retrieved asynchronously
      var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

      //a callback executed when a match is selected
      var onSelectCallback = $parse(attrs.typeaheadOnSelect);

      var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

      //INTERNAL VARIABLES

      //model setter executed upon match selection
      var $setModelValue = $parse(attrs.ngModel).assign;

      //expressions used by typeahead
      var parserResult = typeaheadParser.parse(attrs.typeahead);

      var hasFocus;

      //pop-up element used to display matches
      var popUpEl = angular.element('<div typeahead-popup></div>');
      popUpEl.attr({
        matches: 'matches',
        active: 'activeIdx',
        select: 'select(activeIdx)',
        query: 'query',
        position: 'position'
      });
      //custom item template
      if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
        popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
      }

      //create a child scope for the typeahead directive so we are not polluting original scope
      //with typeahead-specific data (matches, query etc.)
      var scope = originalScope.$new();
      originalScope.$on('$destroy', function(){
        scope.$destroy();
      });

      var resetMatches = function() {
        scope.matches = [];
        scope.activeIdx = -1;
      };

      var getMatchesAsync = function(inputValue) {

        var locals = {$viewValue: inputValue};
        isLoadingSetter(originalScope, true);
        $q.when(parserResult.source(originalScope, locals)).then(function(matches) {

          //it might happen that several async queries were in progress if a user were typing fast
          //but we are interested only in responses that correspond to the current view value
          if (inputValue === modelCtrl.$viewValue && hasFocus) {
            if (matches.length > 0) {

              scope.activeIdx = 0;
              scope.matches.length = 0;

              //transform labels
              for(var i=0; i<matches.length; i++) {
                locals[parserResult.itemName] = matches[i];
                scope.matches.push({
                  label: parserResult.viewMapper(scope, locals),
                  model: matches[i]
                });
              }

              scope.query = inputValue;
              //position pop-up with matches - we need to re-calculate its position each time we are opening a window
              //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
              //due to other elements being rendered
              scope.position = $position.position(element);
              scope.position.top = scope.position.top + element.prop('offsetHeight');

            } else {
              resetMatches();
            }
            isLoadingSetter(originalScope, false);
          }
        }, function(){
          resetMatches();
          isLoadingSetter(originalScope, false);
        });
      };

      resetMatches();

      //we need to propagate user's query so we can higlight matches
      scope.query = undefined;

      //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later 
      var timeoutPromise;

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function (inputValue) {

        hasFocus = true;

        if (inputValue && inputValue.length >= minSearch) {
          if (waitTime > 0) {
            if (timeoutPromise) {
              $timeout.cancel(timeoutPromise);//cancel previous timeout
            }
            timeoutPromise = $timeout(function () {
              getMatchesAsync(inputValue);
            }, waitTime);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        } else {
          if (!inputValue) {
            // Reset in case user had typed something previously.
            modelCtrl.$setValidity('editable', true);
            return inputValue;
          } else {
            modelCtrl.$setValidity('editable', false);
            return undefined;
          }
        }
      });

      modelCtrl.$formatters.push(function (modelValue) {

        var candidateViewValue, emptyViewValue;
        var locals = {};

        if (inputFormatter) {

          locals['$model'] = modelValue;
          return inputFormatter(originalScope, locals);

        } else {

          //it might happen that we don't have enough info to properly render input value
          //we need to check for this situation and simply return model value if we can't apply custom formatting
          locals[parserResult.itemName] = modelValue;
          candidateViewValue = parserResult.viewMapper(originalScope, locals);
          locals[parserResult.itemName] = undefined;
          emptyViewValue = parserResult.viewMapper(originalScope, locals);

          return candidateViewValue!== emptyViewValue ? candidateViewValue : modelValue;
        }
      });

      scope.select = function (activeIdx) {
        //called from within the $digest() cycle
        var locals = {};
        var model, item;

        locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
        model = parserResult.modelMapper(originalScope, locals);
        $setModelValue(originalScope, model);
        modelCtrl.$setValidity('editable', true);

        onSelectCallback(originalScope, {
          $item: item,
          $model: model,
          $label: parserResult.viewMapper(originalScope, locals)
        });

        resetMatches();

        //return focus to the input element if a mach was selected via a mouse click event
        element[0].focus();
      };

      //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
      element.bind('keydown', function (evt) {

        //typeahead is open and an "interesting" key was pressed
        if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
          if (evt.which === 13) {
            evt.preventDefault();
          }
          return;
        }

        evt.preventDefault();

        if (evt.which === 40) {
          scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
          scope.$digest();

        } else if (evt.which === 38) {
          scope.activeIdx = (scope.activeIdx ? scope.activeIdx : scope.matches.length) - 1;
          scope.$digest();

        } else if (evt.which === 13 || evt.which === 9) {
          scope.$apply(function () {
            scope.select(scope.activeIdx);
          });

        } else if (evt.which === 27) {
          evt.stopPropagation();

          resetMatches();
          scope.$digest();
        }
      });

      element.bind('blur', function (evt) {
        hasFocus = false;
      });

      // Keep reference to click handler to unbind it.
      var dismissClickHandler = function (evt) {
        if (element[0] !== evt.target) {
          resetMatches();
          scope.$digest();
        }
      };

      $document.bind('click', dismissClickHandler);

      originalScope.$on('$destroy', function(){
        $document.unbind('click', dismissClickHandler);
      });

      element.after($compile(popUpEl)(scope));
    }
  };

}])

  .directive('typeaheadPopup', function () {
    return {
      restrict:'EA',
      scope:{
        matches:'=',
        query:'=',
        active:'=',
        position:'=',
        select:'&'
      },
      replace:true,
      templateUrl:'template/typeahead/typeahead-popup.html',
      link:function (scope, element, attrs) {

        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function () {
          return scope.matches.length > 0;
        };

        scope.isActive = function (matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function (matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function (activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
    return {
      restrict:'EA',
      scope:{
        index:'=',
        match:'=',
        query:'='
      },
      link:function (scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $http.get(tplUrl, {cache: $templateCache}).success(function(tplContent){
           element.replaceWith($compile(tplContent.trim())(scope));
        });
      }
    };
  }])

  .filter('typeaheadHighlight', function() {

    function escapeRegexp(queryToEscape) {
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    }

    return function(matchItem, query) {
      return query ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem;
    };
  });
angular.module("template/accordion/accordion-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion-group.html",
    "<div class=\"accordion-group\">\n" +
    "  <div class=\"accordion-heading\" ><a class=\"accordion-toggle\" ng-click=\"isOpen = !isOpen\" accordion-transclude=\"heading\">{{heading}}</a></div>\n" +
    "  <div class=\"accordion-body\" collapse=\"!isOpen\">\n" +
    "    <div class=\"accordion-inner\" ng-transclude></div>  </div>\n" +
    "</div>");
}]);

angular.module("template/accordion/accordion.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/accordion/accordion.html",
    "<div class=\"accordion\" ng-transclude></div>");
}]);

angular.module("template/alert/alert.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/alert/alert.html",
    "<div class='alert' ng-class='type && \"alert-\" + type'>\n" +
    "    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n" +
    "    <div ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/carousel/carousel.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/carousel/carousel.html",
    "<div ng-mouseenter=\"pause()\" ng-mouseleave=\"play()\" class=\"carousel\">\n" +
    "    <ol class=\"carousel-indicators\" ng-show=\"slides().length > 1\">\n" +
    "        <li ng-repeat=\"slide in slides()\" ng-class=\"{active: isActive(slide)}\" ng-click=\"select(slide)\"></li>\n" +
    "    </ol>\n" +
    "    <div class=\"carousel-inner\" ng-transclude></div>\n" +
    "    <a ng-click=\"prev()\" class=\"carousel-control left\" ng-show=\"slides().length > 1\">&lsaquo;</a>\n" +
    "    <a ng-click=\"next()\" class=\"carousel-control right\" ng-show=\"slides().length > 1\">&rsaquo;</a>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/carousel/slide.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/carousel/slide.html",
    "<div ng-class=\"{\n" +
    "    'active': leaving || (active && !entering),\n" +
    "    'prev': (next || active) && direction=='prev',\n" +
    "    'next': (next || active) && direction=='next',\n" +
    "    'right': direction=='prev',\n" +
    "    'left': direction=='next'\n" +
    "  }\" class=\"item\" ng-transclude></div>\n" +
    "");
}]);

angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/datepicker.html",
    "<table>\n" +
    "  <thead>\n" +
    "    <tr class=\"text-center\">\n" +
    "      <th><button type=\"button\" class=\"btn pull-left\" ng-click=\"move(-1)\"><i class=\"icon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{rows[0].length - 2 + showWeekNumbers}}\"><button type=\"button\" class=\"btn btn-block\" ng-click=\"toggleMode()\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn pull-right\" ng-click=\"move(1)\"><i class=\"icon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "    <tr class=\"text-center\" ng-show=\"labels.length > 0\">\n" +
    "      <th ng-show=\"showWeekNumbers\">#</th>\n" +
    "      <th ng-repeat=\"label in labels\">{{label}}</th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows\">\n" +
    "      <td ng-show=\"showWeekNumbers\" class=\"text-center\"><em>{{ getWeekNumber(row) }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row\" class=\"text-center\">\n" +
    "        <button type=\"button\" style=\"width:100%;\" class=\"btn\" ng-class=\"{'btn-info': dt.selected}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\"><span ng-class=\"{muted: dt.secondary}\">{{dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/popup.html",
    "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
    "	<li ng-transclude></li>\n" +
    "	<li class=\"divider\"></li>\n" +
    "	<li style=\"padding: 9px;\">\n" +
    "		<span class=\"btn-group\">\n" +
    "			<button type=\"button\" class=\"btn btn-small btn-inverse\" ng-click=\"today()\">{{currentText}}</button>\n" +
    "			<button type=\"button\" class=\"btn btn-small btn-info\" ng-click=\"showWeeks = ! showWeeks\" ng-class=\"{active: showWeeks}\">{{toggleWeeksText}}</button>\n" +
    "			<button type=\"button\" class=\"btn btn-small btn-danger\" ng-click=\"clear()\">{{clearText}}</button>\n" +
    "		</span>\n" +
    "		<button type=\"button\" class=\"btn btn-small btn-success pull-right\" ng-click=\"isOpen = false\">{{closeText}}</button>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/backdrop.html",
    "<div class=\"modal-backdrop fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1040 + index*10}\" ng-click=\"close($event)\"></div>");
}]);

angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/window.html",
    "<div class=\"modal fade {{ windowClass }}\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10}\" ng-transclude></div>");
}]);

angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pager.html",
    "<div class=\"pager\">\n" +
    "  <ul>\n" +
    "    <li ng-repeat=\"page in pages\" ng-class=\"{disabled: page.disabled, previous: page.previous, next: page.next}\"><a ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pagination.html",
    "<div class=\"pagination\"><ul>\n" +
    "  <li ng-repeat=\"page in pages\" ng-class=\"{active: page.active, disabled: page.disabled}\"><a ng-click=\"selectPage(page.number)\">{{page.text}}</a></li>\n" +
    "  </ul>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/tooltip/tooltip-html-unsafe-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html",
    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" bind-html-unsafe=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/tooltip/tooltip-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tooltip/tooltip-popup.html",
    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"tooltip-arrow\"></div>\n" +
    "  <div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/popover/popover.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/popover/popover.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/progressbar/bar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/bar.html",
    "<div class=\"bar\" ng-class='type && \"bar-\" + type'></div>");
}]);

angular.module("template/progressbar/progress.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/progressbar/progress.html",
    "<div class=\"progress\"><progressbar ng-repeat=\"bar in bars\" width=\"bar.to\" old=\"bar.from\" animate=\"bar.animate\" type=\"bar.type\"></progressbar></div>");
}]);

angular.module("template/rating/rating.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rating/rating.html",
    "<span ng-mouseleave=\"reset()\">\n" +
    "	<i ng-repeat=\"r in range\" ng-mouseenter=\"enter($index + 1)\" ng-click=\"rate($index + 1)\" ng-class=\"$index < val && (r.stateOn || 'icon-star') || (r.stateOff || 'icon-star-empty')\"></i>\n" +
    "</span>");
}]);

angular.module("template/tabs/tab.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tab.html",
    "<li ng-class=\"{active: active, disabled: disabled}\">\n" +
    "  <a ng-click=\"select()\" tab-heading-transclude>{{heading}}</a>\n" +
    "</li>\n" +
    "");
}]);

angular.module("template/tabs/tabset-titles.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tabset-titles.html",
    "<ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical}\">\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/tabs/tabset.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/tabs/tabset.html",
    "\n" +
    "<div class=\"tabbable\" ng-class=\"{'tabs-right': direction == 'right', 'tabs-left': direction == 'left', 'tabs-below': direction == 'below'}\">\n" +
    "  <div tabset-titles=\"tabsAbove\"></div>\n" +
    "  <div class=\"tab-content\">\n" +
    "    <div class=\"tab-pane\" \n" +
    "         ng-repeat=\"tab in tabs\" \n" +
    "         ng-class=\"{active: tab.active}\"\n" +
    "         tab-content-transclude=\"tab\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div tabset-titles=\"!tabsAbove\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/timepicker/timepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/timepicker/timepicker.html",
    "<table class=\"form-inline\">\n" +
    "	<tr class=\"text-center\">\n" +
    "		<td><a ng-click=\"incrementHours()\" class=\"btn btn-link\"><i class=\"icon-chevron-up\"></i></a></td>\n" +
    "		<td>&nbsp;</td>\n" +
    "		<td><a ng-click=\"incrementMinutes()\" class=\"btn btn-link\"><i class=\"icon-chevron-up\"></i></a></td>\n" +
    "		<td ng-show=\"showMeridian\"></td>\n" +
    "	</tr>\n" +
    "	<tr>\n" +
    "		<td class=\"control-group\" ng-class=\"{'error': invalidHours}\"><input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"span1 text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\"></td>\n" +
    "		<td>:</td>\n" +
    "		<td class=\"control-group\" ng-class=\"{'error': invalidMinutes}\"><input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"span1 text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\"></td>\n" +
    "		<td ng-show=\"showMeridian\"><button type=\"button\" ng-click=\"toggleMeridian()\" class=\"btn text-center\">{{meridian}}</button></td>\n" +
    "	</tr>\n" +
    "	<tr class=\"text-center\">\n" +
    "		<td><a ng-click=\"decrementHours()\" class=\"btn btn-link\"><i class=\"icon-chevron-down\"></i></a></td>\n" +
    "		<td>&nbsp;</td>\n" +
    "		<td><a ng-click=\"decrementMinutes()\" class=\"btn btn-link\"><i class=\"icon-chevron-down\"></i></a></td>\n" +
    "		<td ng-show=\"showMeridian\"></td>\n" +
    "	</tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a tabindex=\"-1\" bind-html-unsafe=\"match.label | typeaheadHighlight:query\"></a>");
}]);

angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<ul class=\"typeahead dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n" +
    "    <li ng-repeat=\"match in matches\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\">\n" +
    "        <div typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>");
}]);
/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.11.0 - 2014-05-01
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdown","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(a){return{link:function(b,c,d){function e(b){function d(){j===e&&(j=void 0)}var e=a(c,b);return j&&j.cancel(),j=e,e.then(d,d),e}function f(){k?(k=!1,g()):(c.removeClass("collapse").addClass("collapsing"),e({height:c[0].scrollHeight+"px"}).then(g))}function g(){c.removeClass("collapsing"),c.addClass("collapse in"),c.css({height:"auto"})}function h(){if(k)k=!1,i(),c.css({height:0});else{c.css({height:c[0].scrollHeight+"px"});{c[0].offsetWidth}c.removeClass("collapse in").addClass("collapsing"),e({height:0}).then(i)}}function i(){c.removeClass("collapsing"),c.addClass("collapse")}var j,k=!0;b.$watch(d.collapse,function(a){a?h():f()})}}}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,c){this.groups=[],this.closeOthers=function(d){var e=angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):c.closeOthers;e&&angular.forEach(this.groups,function(a){a!==d&&(a.isOpen=!1)})},this.addGroup=function(a){var b=this;this.groups.push(a),a.$on("$destroy",function(){b.removeGroup(a)})},this.removeGroup=function(a){var b=this.groups.indexOf(a);-1!==b&&this.groups.splice(b,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(a){this.heading=a}},link:function(a,b,c,d){d.addGroup(a),a.$watch("isOpen",function(b){b&&d.closeOthers(a)}),a.toggleOpen=function(){a.isDisabled||(a.isOpen=!a.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(a,b,c,d,e){d.setHeading(e(a,function(){}))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,c,d){a.$watch(function(){return d[c.accordionTransclude]},function(a){a&&(b.html(""),b.append(a))})}}}),angular.module("ui.bootstrap.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"@",close:"&"}}}),angular.module("ui.bootstrap.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,c){b.addClass("ng-binding").data("$binding",c.bindHtmlUnsafe),a.$watch(c.bindHtmlUnsafe,function(a){b.html(a||"")})}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass||"active",this.toggleEvent=a.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){var e=d[0],f=d[1];f.$render=function(){b.toggleClass(e.activeClass,angular.equals(f.$modelValue,a.$eval(c.btnRadio)))},b.bind(e.toggleEvent,function(){var d=b.hasClass(e.activeClass);(!d||angular.isDefined(c.uncheckable))&&a.$apply(function(){f.$setViewValue(d?null:a.$eval(c.btnRadio)),f.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){function e(){return g(c.btnCheckboxTrue,!0)}function f(){return g(c.btnCheckboxFalse,!1)}function g(b,c){var d=a.$eval(b);return angular.isDefined(d)?d:c}var h=d[0],i=d[1];i.$render=function(){b.toggleClass(h.activeClass,angular.equals(i.$modelValue,e()))},b.bind(h.toggleEvent,function(){a.$apply(function(){i.$setViewValue(b.hasClass(h.activeClass)?f():e()),i.$render()})})}}}),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition",function(a,b,c){function d(){e();var c=+a.interval;!isNaN(c)&&c>=0&&(g=b(f,c))}function e(){g&&(b.cancel(g),g=null)}function f(){h?(a.next(),d()):a.pause()}var g,h,i=this,j=i.slides=a.slides=[],k=-1;i.currentSlide=null;var l=!1;i.select=a.select=function(e,f){function g(){if(!l){if(i.currentSlide&&angular.isString(f)&&!a.noTransition&&e.$element){e.$element.addClass(f);{e.$element[0].offsetWidth}angular.forEach(j,function(a){angular.extend(a,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(e,{direction:f,active:!0,entering:!0}),angular.extend(i.currentSlide||{},{direction:f,leaving:!0}),a.$currentTransition=c(e.$element,{}),function(b,c){a.$currentTransition.then(function(){h(b,c)},function(){h(b,c)})}(e,i.currentSlide)}else h(e,i.currentSlide);i.currentSlide=e,k=m,d()}}function h(b,c){angular.extend(b,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(c||{},{direction:"",active:!1,leaving:!1,entering:!1}),a.$currentTransition=null}var m=j.indexOf(e);void 0===f&&(f=m>k?"next":"prev"),e&&e!==i.currentSlide&&(a.$currentTransition?(a.$currentTransition.cancel(),b(g)):g())},a.$on("$destroy",function(){l=!0}),i.indexOfSlide=function(a){return j.indexOf(a)},a.next=function(){var b=(k+1)%j.length;return a.$currentTransition?void 0:i.select(j[b],"next")},a.prev=function(){var b=0>k-1?j.length-1:k-1;return a.$currentTransition?void 0:i.select(j[b],"prev")},a.isActive=function(a){return i.currentSlide===a},a.$watch("interval",d),a.$on("$destroy",e),a.play=function(){h||(h=!0,d())},a.pause=function(){a.noPause||(h=!1,e())},i.addSlide=function(b,c){b.$element=c,j.push(b),1===j.length||b.active?(i.select(j[j.length-1]),1==j.length&&a.play()):b.active=!1},i.removeSlide=function(a){var b=j.indexOf(a);j.splice(b,1),j.length>0&&a.active?i.select(b>=j.length?j[b-1]:j[b]):k>b&&k--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",function(){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{active:"=?"},link:function(a,b,c,d){d.addSlide(a,b),a.$on("$destroy",function(){d.removeSlide(a)}),a.$watch("active",function(b){b&&d.select(a)})}}}),angular.module("ui.bootstrap.dateparser",[]).service("dateParser",["$locale","orderByFilter",function(a,b){function c(a,b,c){return 1===b&&c>28?29===c&&(a%4===0&&a%100!==0||a%400===0):3===b||5===b||8===b||10===b?31>c:!0}this.parsers={};var d={yyyy:{regex:"\\d{4}",apply:function(a){this.year=+a}},yy:{regex:"\\d{2}",apply:function(a){this.year=+a+2e3}},y:{regex:"\\d{1,4}",apply:function(a){this.year=+a}},MMMM:{regex:a.DATETIME_FORMATS.MONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.MONTH.indexOf(b)}},MMM:{regex:a.DATETIME_FORMATS.SHORTMONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.SHORTMONTH.indexOf(b)}},MM:{regex:"0[1-9]|1[0-2]",apply:function(a){this.month=a-1}},M:{regex:"[1-9]|1[0-2]",apply:function(a){this.month=a-1}},dd:{regex:"[0-2][0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},d:{regex:"[1-2]?[0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},EEEE:{regex:a.DATETIME_FORMATS.DAY.join("|")},EEE:{regex:a.DATETIME_FORMATS.SHORTDAY.join("|")}};this.createParser=function(a){var c=[],e=a.split("");return angular.forEach(d,function(b,d){var f=a.indexOf(d);if(f>-1){a=a.split(""),e[f]="("+b.regex+")",a[f]="$";for(var g=f+1,h=f+d.length;h>g;g++)e[g]="",a[g]="$";a=a.join(""),c.push({index:f,apply:b.apply})}}),{regex:new RegExp("^"+e.join("")+"$"),map:b(c,"index")}},this.parse=function(b,d){if(!angular.isString(b))return b;d=a.DATETIME_FORMATS[d]||d,this.parsers[d]||(this.parsers[d]=this.createParser(d));var e=this.parsers[d],f=e.regex,g=e.map,h=b.match(f);if(h&&h.length){for(var i,j={year:1900,month:0,date:1,hours:0},k=1,l=h.length;l>k;k++){var m=g[k-1];m.apply&&m.apply.call(j,h[k])}return c(j.year,j.month,j.date)&&(i=new Date(j.year,j.month,j.date,j.hours)),i}}}]),angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(a,b){function c(a,c){return a.currentStyle?a.currentStyle[c]:b.getComputedStyle?b.getComputedStyle(a)[c]:a.style[c]}function d(a){return"static"===(c(a,"position")||"static")}var e=function(b){for(var c=a[0],e=b.offsetParent||c;e&&e!==c&&d(e);)e=e.offsetParent;return e||c};return{position:function(b){var c=this.offset(b),d={top:0,left:0},f=e(b[0]);f!=a[0]&&(d=this.offset(angular.element(f)),d.top+=f.clientTop-f.scrollTop,d.left+=f.clientLeft-f.scrollLeft);var g=b[0].getBoundingClientRect();return{width:g.width||b.prop("offsetWidth"),height:g.height||b.prop("offsetHeight"),top:c.top-d.top,left:c.left-d.left}},offset:function(c){var d=c[0].getBoundingClientRect();return{width:d.width||c.prop("offsetWidth"),height:d.height||c.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].documentElement.scrollLeft)}},positionElements:function(a,b,c,d){var e,f,g,h,i=c.split("-"),j=i[0],k=i[1]||"center";e=d?this.offset(a):this.position(a),f=b.prop("offsetWidth"),g=b.prop("offsetHeight");var l={center:function(){return e.left+e.width/2-f/2},left:function(){return e.left},right:function(){return e.left+e.width}},m={center:function(){return e.top+e.height/2-g/2},top:function(){return e.top},bottom:function(){return e.top+e.height}};switch(j){case"right":h={top:m[k](),left:l[j]()};break;case"left":h={top:m[k](),left:e.left-f};break;case"bottom":h={top:m[j](),left:l[k]()};break;default:h={top:e.top-g,left:l[k]()}}return h}}}]),angular.module("ui.bootstrap.datepicker",["ui.bootstrap.dateparser","ui.bootstrap.position"]).constant("datepickerConfig",{formatDay:"dd",formatMonth:"MMMM",formatYear:"yyyy",formatDayHeader:"EEE",formatDayTitle:"MMMM yyyy",formatMonthTitle:"yyyy",datepickerMode:"day",minMode:"day",maxMode:"year",showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null}).controller("DatepickerController",["$scope","$attrs","$parse","$interpolate","$timeout","$log","dateFilter","datepickerConfig",function(a,b,c,d,e,f,g,h){var i=this,j={$setViewValue:angular.noop};this.modes=["day","month","year"],angular.forEach(["formatDay","formatMonth","formatYear","formatDayHeader","formatDayTitle","formatMonthTitle","minMode","maxMode","showWeeks","startingDay","yearRange"],function(c,e){i[c]=angular.isDefined(b[c])?8>e?d(b[c])(a.$parent):a.$parent.$eval(b[c]):h[c]}),angular.forEach(["minDate","maxDate"],function(d){b[d]?a.$parent.$watch(c(b[d]),function(a){i[d]=a?new Date(a):null,i.refreshView()}):i[d]=h[d]?new Date(h[d]):null}),a.datepickerMode=a.datepickerMode||h.datepickerMode,a.uniqueId="datepicker-"+a.$id+"-"+Math.floor(1e4*Math.random()),this.activeDate=angular.isDefined(b.initDate)?a.$parent.$eval(b.initDate):new Date,a.isActive=function(b){return 0===i.compare(b.date,i.activeDate)?(a.activeDateId=b.uid,!0):!1},this.init=function(a){j=a,j.$render=function(){i.render()}},this.render=function(){if(j.$modelValue){var a=new Date(j.$modelValue),b=!isNaN(a);b?this.activeDate=a:f.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'),j.$setValidity("date",b)}this.refreshView()},this.refreshView=function(){if(this.element){this._refreshView();var a=j.$modelValue?new Date(j.$modelValue):null;j.$setValidity("date-disabled",!a||this.element&&!this.isDisabled(a))}},this.createDateObject=function(a,b){var c=j.$modelValue?new Date(j.$modelValue):null;return{date:a,label:g(a,b),selected:c&&0===this.compare(a,c),disabled:this.isDisabled(a),current:0===this.compare(a,new Date)}},this.isDisabled=function(c){return this.minDate&&this.compare(c,this.minDate)<0||this.maxDate&&this.compare(c,this.maxDate)>0||b.dateDisabled&&a.dateDisabled({date:c,mode:a.datepickerMode})},this.split=function(a,b){for(var c=[];a.length>0;)c.push(a.splice(0,b));return c},a.select=function(b){if(a.datepickerMode===i.minMode){var c=j.$modelValue?new Date(j.$modelValue):new Date(0,0,0,0,0,0,0);c.setFullYear(b.getFullYear(),b.getMonth(),b.getDate()),j.$setViewValue(c),j.$render()}else i.activeDate=b,a.datepickerMode=i.modes[i.modes.indexOf(a.datepickerMode)-1]},a.move=function(a){var b=i.activeDate.getFullYear()+a*(i.step.years||0),c=i.activeDate.getMonth()+a*(i.step.months||0);i.activeDate.setFullYear(b,c,1),i.refreshView()},a.toggleMode=function(b){b=b||1,a.datepickerMode===i.maxMode&&1===b||a.datepickerMode===i.minMode&&-1===b||(a.datepickerMode=i.modes[i.modes.indexOf(a.datepickerMode)+b])},a.keys={13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down"};var k=function(){e(function(){i.element[0].focus()},0,!1)};a.$on("datepicker.focus",k),a.keydown=function(b){var c=a.keys[b.which];if(c&&!b.shiftKey&&!b.altKey)if(b.preventDefault(),b.stopPropagation(),"enter"===c||"space"===c){if(i.isDisabled(i.activeDate))return;a.select(i.activeDate),k()}else!b.ctrlKey||"up"!==c&&"down"!==c?(i.handleKeyDown(c,b),i.refreshView()):(a.toggleMode("up"===c?1:-1),k())}}]).directive("datepicker",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/datepicker.html",scope:{datepickerMode:"=?",dateDisabled:"&"},require:["datepicker","?^ngModel"],controller:"DatepickerController",link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f)}}}).directive("daypicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/day.html",require:"^datepicker",link:function(b,c,d,e){function f(a,b){return 1!==b||a%4!==0||a%100===0&&a%400!==0?i[b]:29}function g(a,b){var c=new Array(b),d=new Date(a),e=0;for(d.setHours(12);b>e;)c[e++]=new Date(d),d.setDate(d.getDate()+1);return c}function h(a){var b=new Date(a);b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/864e5)/7)+1}b.showWeeks=e.showWeeks,e.step={months:1},e.element=c;var i=[31,28,31,30,31,30,31,31,30,31,30,31];e._refreshView=function(){var c=e.activeDate.getFullYear(),d=e.activeDate.getMonth(),f=new Date(c,d,1),i=e.startingDay-f.getDay(),j=i>0?7-i:-i,k=new Date(f);j>0&&k.setDate(-j+1);for(var l=g(k,42),m=0;42>m;m++)l[m]=angular.extend(e.createDateObject(l[m],e.formatDay),{secondary:l[m].getMonth()!==d,uid:b.uniqueId+"-"+m});b.labels=new Array(7);for(var n=0;7>n;n++)b.labels[n]={abbr:a(l[n].date,e.formatDayHeader),full:a(l[n].date,"EEEE")};if(b.title=a(e.activeDate,e.formatDayTitle),b.rows=e.split(l,7),b.showWeeks){b.weekNumbers=[];for(var o=h(b.rows[0][0].date),p=b.rows.length;b.weekNumbers.push(o++)<p;);}},e.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(b.getFullYear(),b.getMonth(),b.getDate())},e.handleKeyDown=function(a){var b=e.activeDate.getDate();if("left"===a)b-=1;else if("up"===a)b-=7;else if("right"===a)b+=1;else if("down"===a)b+=7;else if("pageup"===a||"pagedown"===a){var c=e.activeDate.getMonth()+("pageup"===a?-1:1);e.activeDate.setMonth(c,1),b=Math.min(f(e.activeDate.getFullYear(),e.activeDate.getMonth()),b)}else"home"===a?b=1:"end"===a&&(b=f(e.activeDate.getFullYear(),e.activeDate.getMonth()));e.activeDate.setDate(b)},e.refreshView()}}}]).directive("monthpicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/month.html",require:"^datepicker",link:function(b,c,d,e){e.step={years:1},e.element=c,e._refreshView=function(){for(var c=new Array(12),d=e.activeDate.getFullYear(),f=0;12>f;f++)c[f]=angular.extend(e.createDateObject(new Date(d,f,1),e.formatMonth),{uid:b.uniqueId+"-"+f});b.title=a(e.activeDate,e.formatMonthTitle),b.rows=e.split(c,3)},e.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth())-new Date(b.getFullYear(),b.getMonth())},e.handleKeyDown=function(a){var b=e.activeDate.getMonth();if("left"===a)b-=1;else if("up"===a)b-=3;else if("right"===a)b+=1;else if("down"===a)b+=3;else if("pageup"===a||"pagedown"===a){var c=e.activeDate.getFullYear()+("pageup"===a?-1:1);e.activeDate.setFullYear(c)}else"home"===a?b=0:"end"===a&&(b=11);e.activeDate.setMonth(b)},e.refreshView()}}}]).directive("yearpicker",["dateFilter",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/year.html",require:"^datepicker",link:function(a,b,c,d){function e(a){return parseInt((a-1)/f,10)*f+1}var f=d.yearRange;d.step={years:f},d.element=b,d._refreshView=function(){for(var b=new Array(f),c=0,g=e(d.activeDate.getFullYear());f>c;c++)b[c]=angular.extend(d.createDateObject(new Date(g+c,0,1),d.formatYear),{uid:a.uniqueId+"-"+c});a.title=[b[0].label,b[f-1].label].join(" - "),a.rows=d.split(b,5)},d.compare=function(a,b){return a.getFullYear()-b.getFullYear()},d.handleKeyDown=function(a){var b=d.activeDate.getFullYear();"left"===a?b-=1:"up"===a?b-=5:"right"===a?b+=1:"down"===a?b+=5:"pageup"===a||"pagedown"===a?b+=("pageup"===a?-1:1)*d.step.years:"home"===a?b=e(d.activeDate.getFullYear()):"end"===a&&(b=e(d.activeDate.getFullYear())+f-1),d.activeDate.setFullYear(b)},d.refreshView()}}}]).constant("datepickerPopupConfig",{datepickerPopup:"yyyy-MM-dd",currentText:"Today",clearText:"Clear",closeText:"Done",closeOnDateSelection:!0,appendToBody:!1,showButtonBar:!0}).directive("datepickerPopup",["$compile","$parse","$document","$position","dateFilter","dateParser","datepickerPopupConfig",function(a,b,c,d,e,f,g){return{restrict:"EA",require:"ngModel",scope:{isOpen:"=?",currentText:"@",clearText:"@",closeText:"@",dateDisabled:"&"},link:function(h,i,j,k){function l(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function m(a){if(a){if(angular.isDate(a)&&!isNaN(a))return k.$setValidity("date",!0),a;if(angular.isString(a)){var b=f.parse(a,n)||new Date(a);return isNaN(b)?void k.$setValidity("date",!1):(k.$setValidity("date",!0),b)}return void k.$setValidity("date",!1)}return k.$setValidity("date",!0),null}var n,o=angular.isDefined(j.closeOnDateSelection)?h.$parent.$eval(j.closeOnDateSelection):g.closeOnDateSelection,p=angular.isDefined(j.datepickerAppendToBody)?h.$parent.$eval(j.datepickerAppendToBody):g.appendToBody;h.showButtonBar=angular.isDefined(j.showButtonBar)?h.$parent.$eval(j.showButtonBar):g.showButtonBar,h.getText=function(a){return h[a+"Text"]||g[a+"Text"]},j.$observe("datepickerPopup",function(a){n=a||g.datepickerPopup,k.$render()});var q=angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");q.attr({"ng-model":"date","ng-change":"dateSelection()"});var r=angular.element(q.children()[0]);j.datepickerOptions&&angular.forEach(h.$parent.$eval(j.datepickerOptions),function(a,b){r.attr(l(b),a)}),angular.forEach(["minDate","maxDate"],function(a){j[a]&&(h.$parent.$watch(b(j[a]),function(b){h[a]=b}),r.attr(l(a),a))}),j.dateDisabled&&r.attr("date-disabled","dateDisabled({ date: date, mode: mode })"),k.$parsers.unshift(m),h.dateSelection=function(a){angular.isDefined(a)&&(h.date=a),k.$setViewValue(h.date),k.$render(),o&&(h.isOpen=!1,i[0].focus())},i.bind("input change keyup",function(){h.$apply(function(){h.date=k.$modelValue})}),k.$render=function(){var a=k.$viewValue?e(k.$viewValue,n):"";i.val(a),h.date=m(k.$modelValue)};var s=function(a){h.isOpen&&a.target!==i[0]&&h.$apply(function(){h.isOpen=!1})},t=function(a){h.keydown(a)};i.bind("keydown",t),h.keydown=function(a){27===a.which?(a.preventDefault(),a.stopPropagation(),h.close()):40!==a.which||h.isOpen||(h.isOpen=!0)},h.$watch("isOpen",function(a){a?(h.$broadcast("datepicker.focus"),h.position=p?d.offset(i):d.position(i),h.position.top=h.position.top+i.prop("offsetHeight"),c.bind("click",s)):c.unbind("click",s)}),h.select=function(a){if("today"===a){var b=new Date;angular.isDate(k.$modelValue)?(a=new Date(k.$modelValue),a.setFullYear(b.getFullYear(),b.getMonth(),b.getDate())):a=new Date(b.setHours(0,0,0,0))}h.dateSelection(a)},h.close=function(){h.isOpen=!1,i[0].focus()};var u=a(q)(h);p?c.find("body").append(u):i.after(u),h.$on("$destroy",function(){u.remove(),i.unbind("keydown",t),c.unbind("click",s)})}}}]).directive("datepickerPopupWrap",function(){return{restrict:"EA",replace:!0,transclude:!0,templateUrl:"template/datepicker/popup.html",link:function(a,b){b.bind("click",function(a){a.preventDefault(),a.stopPropagation()})}}}),angular.module("ui.bootstrap.dropdown",[]).constant("dropdownConfig",{openClass:"open"}).service("dropdownService",["$document",function(a){var b=null;this.open=function(e){b||(a.bind("click",c),a.bind("keydown",d)),b&&b!==e&&(b.isOpen=!1),b=e},this.close=function(e){b===e&&(b=null,a.unbind("click",c),a.unbind("keydown",d))};var c=function(a){a&&a.isDefaultPrevented()||b.$apply(function(){b.isOpen=!1})},d=function(a){27===a.which&&(b.focusToggleElement(),c())}}]).controller("DropdownController",["$scope","$attrs","$parse","dropdownConfig","dropdownService","$animate",function(a,b,c,d,e,f){var g,h=this,i=a.$new(),j=d.openClass,k=angular.noop,l=b.onToggle?c(b.onToggle):angular.noop;this.init=function(d){h.$element=d,b.isOpen&&(g=c(b.isOpen),k=g.assign,a.$watch(g,function(a){i.isOpen=!!a}))},this.toggle=function(a){return i.isOpen=arguments.length?!!a:!i.isOpen},this.isOpen=function(){return i.isOpen},i.focusToggleElement=function(){h.toggleElement&&h.toggleElement[0].focus()},i.$watch("isOpen",function(b,c){f[b?"addClass":"removeClass"](h.$element,j),b?(i.focusToggleElement(),e.open(i)):e.close(i),k(a,b),angular.isDefined(b)&&b!==c&&l(a,{open:!!b})}),a.$on("$locationChangeSuccess",function(){i.isOpen=!1}),a.$on("$destroy",function(){i.$destroy()})}]).directive("dropdown",function(){return{restrict:"CA",controller:"DropdownController",link:function(a,b,c,d){d.init(b)}}}).directive("dropdownToggle",function(){return{restrict:"CA",require:"?^dropdown",link:function(a,b,c,d){if(d){d.toggleElement=b;var e=function(e){e.preventDefault(),b.hasClass("disabled")||c.disabled||a.$apply(function(){d.toggle()})};b.bind("click",e),b.attr({"aria-haspopup":!0,"aria-expanded":!1}),a.$watch(d.isOpen,function(a){b.attr("aria-expanded",!!a)}),a.$on("$destroy",function(){b.unbind("click",e)})}}}}),angular.module("ui.bootstrap.modal",["ui.bootstrap.transition"]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,c){a.push({key:b,value:c})},get:function(b){for(var c=0;c<a.length;c++)if(b==a[c].key)return a[c]},keys:function(){for(var b=[],c=0;c<a.length;c++)b.push(a[c].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var c=-1,d=0;d<a.length;d++)if(b==a[d].key){c=d;break}return a.splice(c,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},length:function(){return a.length}}}}}).directive("modalBackdrop",["$timeout",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(b){b.animate=!1,a(function(){b.animate=!0})}}}]).directive("modalWindow",["$modalStack","$timeout",function(a,b){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:function(a,b){return b.templateUrl||"template/modal/window.html"},link:function(c,d,e){d.addClass(e.windowClass||""),c.size=e.size,b(function(){c.animate=!0,d[0].focus()}),c.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))}}}}]).factory("$modalStack",["$transition","$timeout","$document","$compile","$rootScope","$$stackedMap",function(a,b,c,d,e,f){function g(){for(var a=-1,b=n.keys(),c=0;c<b.length;c++)n.get(b[c]).value.backdrop&&(a=c);return a}function h(a){var b=c.find("body").eq(0),d=n.get(a).value;n.remove(a),j(d.modalDomEl,d.modalScope,300,function(){d.modalScope.$destroy(),b.toggleClass(m,n.length()>0),i()})}function i(){if(k&&-1==g()){var a=l;j(k,l,150,function(){a.$destroy(),a=null}),k=void 0,l=void 0}}function j(c,d,e,f){function g(){g.done||(g.done=!0,c.remove(),f&&f())}d.animate=!1;var h=a.transitionEndEventName;if(h){var i=b(g,e);c.bind(h,function(){b.cancel(i),g(),d.$apply()})}else b(g,0)}var k,l,m="modal-open",n=f.createNew(),o={};return e.$watch(g,function(a){l&&(l.index=a)}),c.bind("keydown",function(a){var b;27===a.which&&(b=n.top(),b&&b.value.keyboard&&(a.preventDefault(),e.$apply(function(){o.dismiss(b.key,"escape key press")})))}),o.open=function(a,b){n.add(a,{deferred:b.deferred,modalScope:b.scope,backdrop:b.backdrop,keyboard:b.keyboard});var f=c.find("body").eq(0),h=g();h>=0&&!k&&(l=e.$new(!0),l.index=h,k=d("<div modal-backdrop></div>")(l),f.append(k));var i=angular.element("<div modal-window></div>");i.attr({"template-url":b.windowTemplateUrl,"window-class":b.windowClass,size:b.size,index:n.length()-1,animate:"animate"}).html(b.content);var j=d(i)(b.scope);n.top().value.modalDomEl=j,f.append(j),f.addClass(m)},o.close=function(a,b){var c=n.get(a).value;c&&(c.deferred.resolve(b),h(a))},o.dismiss=function(a,b){var c=n.get(a).value;c&&(c.deferred.reject(b),h(a))},o.dismissAll=function(a){for(var b=this.getTop();b;)this.dismiss(b.key,a),b=this.getTop()},o.getTop=function(){return n.top()},o}]).provider("$modal",function(){var a={options:{backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(b,c,d,e,f,g,h){function i(a){return a.template?d.when(a.template):e.get(a.templateUrl,{cache:f}).then(function(a){return a.data})}function j(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(d.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var e=d.defer(),f=d.defer(),k={result:e.promise,opened:f.promise,close:function(a){h.close(k,a)},dismiss:function(a){h.dismiss(k,a)}};if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw new Error("One of template or templateUrl options is required.");var l=d.all([i(b)].concat(j(b.resolve)));return l.then(function(a){var d=(b.scope||c).$new();d.$close=k.close,d.$dismiss=k.dismiss;var f,i={},j=1;b.controller&&(i.$scope=d,i.$modalInstance=k,angular.forEach(b.resolve,function(b,c){i[c]=a[j++]}),f=g(b.controller,i)),h.open(k,{scope:d,deferred:e,content:a[0],backdrop:b.backdrop,keyboard:b.keyboard,windowClass:b.windowClass,windowTemplateUrl:b.windowTemplateUrl,size:b.size})},function(a){e.reject(a)}),l.then(function(){f.resolve(!0)},function(){f.reject(!1)}),k},k}]};return a}),angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse",function(a,b,c){var d=this,e={$setViewValue:angular.noop},f=b.numPages?c(b.numPages).assign:angular.noop;this.init=function(f,g){e=f,this.config=g,e.$render=function(){d.render()},b.itemsPerPage?a.$parent.$watch(c(b.itemsPerPage),function(b){d.itemsPerPage=parseInt(b,10),a.totalPages=d.calculateTotalPages()}):this.itemsPerPage=g.itemsPerPage},this.calculateTotalPages=function(){var b=this.itemsPerPage<1?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)},this.render=function(){a.page=parseInt(e.$viewValue,10)||1},a.selectPage=function(b){a.page!==b&&b>0&&b<=a.totalPages&&(e.$setViewValue(b),e.$render())},a.getText=function(b){return a[b+"Text"]||d.config[b+"Text"]},a.noPrevious=function(){return 1===a.page},a.noNext=function(){return a.page===a.totalPages},a.$watch("totalItems",function(){a.totalPages=d.calculateTotalPages()}),a.$watch("totalPages",function(b){f(a.$parent,b),a.page>b?a.selectPage(b):e.$render()})}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{totalItems:"=",firstText:"@",previousText:"@",nextText:"@",lastText:"@"},require:["pagination","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(c,d,e,f){function g(a,b,c){return{number:a,text:b,active:c}}function h(a,b){var c=[],d=1,e=b,f=angular.isDefined(k)&&b>k;f&&(l?(d=Math.max(a-Math.floor(k/2),1),e=d+k-1,e>b&&(e=b,d=e-k+1)):(d=(Math.ceil(a/k)-1)*k+1,e=Math.min(d+k-1,b)));for(var h=d;e>=h;h++){var i=g(h,h,h===a);c.push(i)}if(f&&!l){if(d>1){var j=g(d-1,"...",!1);c.unshift(j)}if(b>e){var m=g(e+1,"...",!1);c.push(m)}}return c}var i=f[0],j=f[1];if(j){var k=angular.isDefined(e.maxSize)?c.$parent.$eval(e.maxSize):b.maxSize,l=angular.isDefined(e.rotate)?c.$parent.$eval(e.rotate):b.rotate;c.boundaryLinks=angular.isDefined(e.boundaryLinks)?c.$parent.$eval(e.boundaryLinks):b.boundaryLinks,c.directionLinks=angular.isDefined(e.directionLinks)?c.$parent.$eval(e.directionLinks):b.directionLinks,i.init(j,b),e.maxSize&&c.$parent.$watch(a(e.maxSize),function(a){k=parseInt(a,10),i.render()});var m=i.render;i.render=function(){m(),c.page>0&&c.page<=c.totalPages&&(c.pages=h(c.page,c.totalPages))}}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{totalItems:"=",previousText:"@",nextText:"@"},require:["pager","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,c,d,e){var f=e[0],g=e[1];g&&(b.align=angular.isDefined(d.align)?b.$parent.$eval(d.align):a.align,f.init(g,a))}}}]),angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).provider("$tooltip",function(){function a(a){var b=/[A-Z]/g,c="-";
return a.replace(b,function(a,b){return(b?c:"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0},c={mouseenter:"mouseleave",click:"click",focus:"blur"},d={};this.options=function(a){angular.extend(d,a)},this.setTriggers=function(a){angular.extend(c,a)},this.$get=["$window","$compile","$timeout","$parse","$document","$position","$interpolate",function(e,f,g,h,i,j,k){return function(e,l,m){function n(a){var b=a||o.trigger||m,d=c[b]||b;return{show:b,hide:d}}var o=angular.extend({},b,d),p=a(e),q=k.startSymbol(),r=k.endSymbol(),s="<div "+p+'-popup title="'+q+"tt_title"+r+'" content="'+q+"tt_content"+r+'" placement="'+q+"tt_placement"+r+'" animation="tt_animation" is-open="tt_isOpen"></div>';return{restrict:"EA",scope:!0,compile:function(){var a=f(s);return function(b,c,d){function f(){b.tt_isOpen?m():k()}function k(){(!y||b.$eval(d[l+"Enable"]))&&(b.tt_popupDelay?v||(v=g(p,b.tt_popupDelay,!1),v.then(function(a){a()})):p()())}function m(){b.$apply(function(){q()})}function p(){return v=null,u&&(g.cancel(u),u=null),b.tt_content?(r(),t.css({top:0,left:0,display:"block"}),w?i.find("body").append(t):c.after(t),z(),b.tt_isOpen=!0,b.$digest(),z):angular.noop}function q(){b.tt_isOpen=!1,g.cancel(v),v=null,b.tt_animation?u||(u=g(s,500)):s()}function r(){t&&s(),t=a(b,function(){}),b.$digest()}function s(){u=null,t&&(t.remove(),t=null)}var t,u,v,w=angular.isDefined(o.appendToBody)?o.appendToBody:!1,x=n(void 0),y=angular.isDefined(d[l+"Enable"]),z=function(){var a=j.positionElements(c,t,b.tt_placement,w);a.top+="px",a.left+="px",t.css(a)};b.tt_isOpen=!1,d.$observe(e,function(a){b.tt_content=a,!a&&b.tt_isOpen&&q()}),d.$observe(l+"Title",function(a){b.tt_title=a}),d.$observe(l+"Placement",function(a){b.tt_placement=angular.isDefined(a)?a:o.placement}),d.$observe(l+"PopupDelay",function(a){var c=parseInt(a,10);b.tt_popupDelay=isNaN(c)?o.popupDelay:c});var A=function(){c.unbind(x.show,k),c.unbind(x.hide,m)};d.$observe(l+"Trigger",function(a){A(),x=n(a),x.show===x.hide?c.bind(x.show,f):(c.bind(x.show,k),c.bind(x.hide,m))});var B=b.$eval(d[l+"Animation"]);b.tt_animation=angular.isDefined(B)?!!B:o.animation,d.$observe(l+"AppendToBody",function(a){w=angular.isDefined(a)?h(a)(b):w}),w&&b.$on("$locationChangeSuccess",function(){b.tt_isOpen&&q()}),b.$on("$destroy",function(){g.cancel(u),g.cancel(v),A(),s()})}}}}}]}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(a){return a("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$tooltip",function(a){return a("popover","popover","click")}]),angular.module("ui.bootstrap.progressbar",[]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig",function(a,b,c){var d=this,e=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):c.animate;this.bars=[],a.max=angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max,this.addBar=function(b,c){e||c.css({transition:"none"}),this.bars.push(b),b.$watch("value",function(c){b.percent=+(100*c/a.max).toFixed(2)}),b.$on("$destroy",function(){c=null,d.removeBar(b)})},this.removeBar=function(a){this.bars.splice(this.bars.indexOf(a),1)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},templateUrl:"template/progressbar/progress.html"}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,c,d){d.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,c,d){d.addBar(a,angular.element(b.children()[0]))}}}),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","ratingConfig",function(a,b,c){var d={$setViewValue:angular.noop};this.init=function(e){d=e,d.$render=this.render,this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):c.stateOn,this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):c.stateOff;var f=angular.isDefined(b.ratingStates)?a.$parent.$eval(b.ratingStates):new Array(angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max);a.range=this.buildTemplateObjects(f)},this.buildTemplateObjects=function(a){for(var b=0,c=a.length;c>b;b++)a[b]=angular.extend({index:b},{stateOn:this.stateOn,stateOff:this.stateOff},a[b]);return a},a.rate=function(b){!a.readonly&&b>=0&&b<=a.range.length&&(d.$setViewValue(b),d.$render())},a.enter=function(b){a.readonly||(a.value=b),a.onHover({value:b})},a.reset=function(){a.value=d.$viewValue,a.onLeave()},a.onKeydown=function(b){/(37|38|39|40)/.test(b.which)&&(b.preventDefault(),b.stopPropagation(),a.rate(a.value+(38===b.which||39===b.which?1:-1)))},this.render=function(){a.value=d.$viewValue}}]).directive("rating",function(){return{restrict:"EA",require:["rating","ngModel"],scope:{readonly:"=?",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0,link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f)}}}),angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,c=b.tabs=a.tabs=[];b.select=function(a){angular.forEach(c,function(b){b.active&&b!==a&&(b.active=!1,b.onDeselect())}),a.active=!0,a.onSelect()},b.addTab=function(a){c.push(a),1===c.length?a.active=!0:a.active&&b.select(a)},b.removeTab=function(a){var d=c.indexOf(a);if(a.active&&c.length>1){var e=d==c.length-1?d-1:d+1;b.select(c[e])}c.splice(d,1)}}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{type:"@"},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,c){a.vertical=angular.isDefined(c.vertical)?a.$parent.$eval(c.vertical):!1,a.justified=angular.isDefined(c.justified)?a.$parent.$eval(c.justified):!1}}}).directive("tab",["$parse",function(a){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{active:"=?",heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(b,c,d){return function(b,c,e,f){b.$watch("active",function(a){a&&f.select(b)}),b.disabled=!1,e.disabled&&b.$parent.$watch(a(e.disabled),function(a){b.disabled=!!a}),b.select=function(){b.disabled||(b.active=!0)},f.addTab(b),b.$on("$destroy",function(){f.removeTab(b)}),b.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){function a(a){return a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||"data-tab-heading"===a.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(b,c,d){var e=b.$eval(d.tabContentTransclude);e.$transcludeFn(e.$parent,function(b){angular.forEach(b,function(b){a(b)?e.headingElement=b:c.append(b)})})}}}),angular.module("ui.bootstrap.timepicker",[]).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:null,readonlyInput:!1,mousewheel:!0}).controller("TimepickerController",["$scope","$attrs","$parse","$log","$locale","timepickerConfig",function(a,b,c,d,e,f){function g(){var b=parseInt(a.hours,10),c=a.showMeridian?b>0&&13>b:b>=0&&24>b;return c?(a.showMeridian&&(12===b&&(b=0),a.meridian===p[1]&&(b+=12)),b):void 0}function h(){var b=parseInt(a.minutes,10);return b>=0&&60>b?b:void 0}function i(a){return angular.isDefined(a)&&a.toString().length<2?"0"+a:a}function j(a){k(),o.$setViewValue(new Date(n)),l(a)}function k(){o.$setValidity("time",!0),a.invalidHours=!1,a.invalidMinutes=!1}function l(b){var c=n.getHours(),d=n.getMinutes();a.showMeridian&&(c=0===c||12===c?12:c%12),a.hours="h"===b?c:i(c),a.minutes="m"===b?d:i(d),a.meridian=n.getHours()<12?p[0]:p[1]}function m(a){var b=new Date(n.getTime()+6e4*a);n.setHours(b.getHours(),b.getMinutes()),j()}var n=new Date,o={$setViewValue:angular.noop},p=angular.isDefined(b.meridians)?a.$parent.$eval(b.meridians):f.meridians||e.DATETIME_FORMATS.AMPMS;this.init=function(c,d){o=c,o.$render=this.render;var e=d.eq(0),g=d.eq(1),h=angular.isDefined(b.mousewheel)?a.$parent.$eval(b.mousewheel):f.mousewheel;h&&this.setupMousewheelEvents(e,g),a.readonlyInput=angular.isDefined(b.readonlyInput)?a.$parent.$eval(b.readonlyInput):f.readonlyInput,this.setupInputEvents(e,g)};var q=f.hourStep;b.hourStep&&a.$parent.$watch(c(b.hourStep),function(a){q=parseInt(a,10)});var r=f.minuteStep;b.minuteStep&&a.$parent.$watch(c(b.minuteStep),function(a){r=parseInt(a,10)}),a.showMeridian=f.showMeridian,b.showMeridian&&a.$parent.$watch(c(b.showMeridian),function(b){if(a.showMeridian=!!b,o.$error.time){var c=g(),d=h();angular.isDefined(c)&&angular.isDefined(d)&&(n.setHours(c),j())}else l()}),this.setupMousewheelEvents=function(b,c){var d=function(a){a.originalEvent&&(a=a.originalEvent);var b=a.wheelDelta?a.wheelDelta:-a.deltaY;return a.detail||b>0};b.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementHours():a.decrementHours()),b.preventDefault()}),c.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementMinutes():a.decrementMinutes()),b.preventDefault()})},this.setupInputEvents=function(b,c){if(a.readonlyInput)return a.updateHours=angular.noop,void(a.updateMinutes=angular.noop);var d=function(b,c){o.$setViewValue(null),o.$setValidity("time",!1),angular.isDefined(b)&&(a.invalidHours=b),angular.isDefined(c)&&(a.invalidMinutes=c)};a.updateHours=function(){var a=g();angular.isDefined(a)?(n.setHours(a),j("h")):d(!0)},b.bind("blur",function(){!a.invalidHours&&a.hours<10&&a.$apply(function(){a.hours=i(a.hours)})}),a.updateMinutes=function(){var a=h();angular.isDefined(a)?(n.setMinutes(a),j("m")):d(void 0,!0)},c.bind("blur",function(){!a.invalidMinutes&&a.minutes<10&&a.$apply(function(){a.minutes=i(a.minutes)})})},this.render=function(){var a=o.$modelValue?new Date(o.$modelValue):null;isNaN(a)?(o.$setValidity("time",!1),d.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):(a&&(n=a),k(),l())},a.incrementHours=function(){m(60*q)},a.decrementHours=function(){m(60*-q)},a.incrementMinutes=function(){m(r)},a.decrementMinutes=function(){m(-r)},a.toggleMeridian=function(){m(720*(n.getHours()<12?1:-1))}}]).directive("timepicker",function(){return{restrict:"EA",require:["timepicker","?^ngModel"],controller:"TimepickerController",replace:!0,scope:{},templateUrl:"template/timepicker/timepicker.html",link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f,b.find("input"))}}}),angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function(c){var d=c.match(b);if(!d)throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "'+c+'".');return{itemName:d[3],source:a(d[4]),viewMapper:a(d[2]||d[1]),modelMapper:a(d[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,c,d,e,f,g){var h=[9,13,27,38,40];return{require:"ngModel",link:function(i,j,k,l){var m,n=i.$eval(k.typeaheadMinLength)||1,o=i.$eval(k.typeaheadWaitMs)||0,p=i.$eval(k.typeaheadEditable)!==!1,q=b(k.typeaheadLoading).assign||angular.noop,r=b(k.typeaheadOnSelect),s=k.typeaheadInputFormatter?b(k.typeaheadInputFormatter):void 0,t=k.typeaheadAppendToBody?i.$eval(k.typeaheadAppendToBody):!1,u=b(k.ngModel).assign,v=g.parse(k.typeahead),w=i.$new();i.$on("$destroy",function(){w.$destroy()});var x="typeahead-"+w.$id+"-"+Math.floor(1e4*Math.random());j.attr({"aria-autocomplete":"list","aria-expanded":!1,"aria-owns":x});var y=angular.element("<div typeahead-popup></div>");y.attr({id:x,matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"}),angular.isDefined(k.typeaheadTemplateUrl)&&y.attr("template-url",k.typeaheadTemplateUrl);var z=function(){w.matches=[],w.activeIdx=-1,j.attr("aria-expanded",!1)},A=function(a){return x+"-option-"+a};w.$watch("activeIdx",function(a){0>a?j.removeAttr("aria-activedescendant"):j.attr("aria-activedescendant",A(a))});var B=function(a){var b={$viewValue:a};q(i,!0),c.when(v.source(i,b)).then(function(c){var d=a===l.$viewValue;if(d&&m)if(c.length>0){w.activeIdx=0,w.matches.length=0;for(var e=0;e<c.length;e++)b[v.itemName]=c[e],w.matches.push({id:A(e),label:v.viewMapper(w,b),model:c[e]});w.query=a,w.position=t?f.offset(j):f.position(j),w.position.top=w.position.top+j.prop("offsetHeight"),j.attr("aria-expanded",!0)}else z();d&&q(i,!1)},function(){z(),q(i,!1)})};z(),w.query=void 0;var C;l.$parsers.unshift(function(a){return m=!0,a&&a.length>=n?o>0?(C&&d.cancel(C),C=d(function(){B(a)},o)):B(a):(q(i,!1),z()),p?a:a?void l.$setValidity("editable",!1):(l.$setValidity("editable",!0),a)}),l.$formatters.push(function(a){var b,c,d={};return s?(d.$model=a,s(i,d)):(d[v.itemName]=a,b=v.viewMapper(i,d),d[v.itemName]=void 0,c=v.viewMapper(i,d),b!==c?b:a)}),w.select=function(a){var b,c,e={};e[v.itemName]=c=w.matches[a].model,b=v.modelMapper(i,e),u(i,b),l.$setValidity("editable",!0),r(i,{$item:c,$model:b,$label:v.viewMapper(i,e)}),z(),d(function(){j[0].focus()},0,!1)},j.bind("keydown",function(a){0!==w.matches.length&&-1!==h.indexOf(a.which)&&(a.preventDefault(),40===a.which?(w.activeIdx=(w.activeIdx+1)%w.matches.length,w.$digest()):38===a.which?(w.activeIdx=(w.activeIdx?w.activeIdx:w.matches.length)-1,w.$digest()):13===a.which||9===a.which?w.$apply(function(){w.select(w.activeIdx)}):27===a.which&&(a.stopPropagation(),z(),w.$digest()))}),j.bind("blur",function(){m=!1});var D=function(a){j[0]!==a.target&&(z(),w.$digest())};e.bind("click",D),i.$on("$destroy",function(){e.unbind("click",D)});var E=a(y)(w);t?e.find("body").append(E):j.after(E)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,c){a.templateUrl=c.templateUrl,a.isOpen=function(){return a.matches.length>0},a.isActive=function(b){return a.active==b},a.selectActive=function(b){a.active=b},a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$http","$templateCache","$compile","$parse",function(a,b,c,d){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},link:function(e,f,g){var h=d(g.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a.get(h,{cache:b}).success(function(a){f.replaceWith(c(a.trim())(e))})}}}]).filter("typeaheadHighlight",function(){function a(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(b,c){return c?(""+b).replace(new RegExp(a(c),"gi"),"<strong>$&</strong>"):b}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion-group.html",'<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion.html",'<div class="panel-group" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(a){a.put("template/alert/alert.html",'<div class="alert" ng-class="{\'alert-{{type || \'warning\'}}\': true, \'alert-dismissable\': closeable}" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(a){a.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(a){a.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")}]),angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/datepicker.html",'<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')}]),angular.module("template/datepicker/day.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/day.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/month.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/month.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/popup.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/popup.html",'<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')}]),angular.module("template/datepicker/year.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/year.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(a){a.put("template/modal/backdrop.html",'<div class="modal-backdrop fade"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(a){a.put("template/modal/window.html",'<div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" ng-transclude></div></div>\n</div>')}]),angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pager.html",'<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n</ul>')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pagination.html",'<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n</ul>')}]),angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]),angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/bar.html",'<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>')}]),angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progress.html",'<div class="progress" ng-transclude></div>')}]),angular.module("template/progressbar/progressbar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progressbar.html",'<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>')}]),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(a){a.put("template/rating/rating.html",'<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabset-titles.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset-titles.html","<ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical}\">\n</ul>\n")}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset.html",'\n<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')}]),angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(a){a.put("template/timepicker/timepicker.html",'<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n')}]),angular.module("template/typeahead/typeahead-match.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-match.html",'<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')}]),angular.module("template/typeahead/typeahead-popup.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-popup.html",'<ul class="dropdown-menu" ng-if="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>')
}]);
var Chart=function(s){function v(a,c,b){a=A((a-c.graphMin)/(c.steps*c.stepValue),1,0);return b*c.steps*a}function x(a,c,b,e){function h(){g+=f;var k=a.animation?A(d(g),null,0):1;e.clearRect(0,0,q,u);a.scaleOverlay?(b(k),c()):(c(),b(k));if(1>=g)D(h);else if("function"==typeof a.onAnimationComplete)a.onAnimationComplete()}var f=a.animation?1/A(a.animationSteps,Number.MAX_VALUE,1):1,d=B[a.animationEasing],g=a.animation?0:1;"function"!==typeof c&&(c=function(){});D(h)}function C(a,c,b,e,h,f){var d;a=
Math.floor(Math.log(e-h)/Math.LN10);h=Math.floor(h/(1*Math.pow(10,a)))*Math.pow(10,a);e=Math.ceil(e/(1*Math.pow(10,a)))*Math.pow(10,a)-h;a=Math.pow(10,a);for(d=Math.round(e/a);d<b||d>c;)a=d<b?a/2:2*a,d=Math.round(e/a);c=[];z(f,c,d,h,a);return{steps:d,stepValue:a,graphMin:h,labels:c}}function z(a,c,b,e,h){if(a)for(var f=1;f<b+1;f++)c.push(E(a,{value:(e+h*f).toFixed(0!=h%1?h.toString().split(".")[1].length:0)}))}function A(a,c,b){return!isNaN(parseFloat(c))&&isFinite(c)&&a>c?c:!isNaN(parseFloat(b))&&
isFinite(b)&&a<b?b:a}function y(a,c){var b={},e;for(e in a)b[e]=a[e];for(e in c)b[e]=c[e];return b}function E(a,c){var b=!/\W/.test(a)?F[a]=F[a]||E(document.getElementById(a).innerHTML):new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+a.replace(/[\r\t\n]/g," ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');");return c?
b(c):b}var r=this,B={linear:function(a){return a},easeInQuad:function(a){return a*a},easeOutQuad:function(a){return-1*a*(a-2)},easeInOutQuad:function(a){return 1>(a/=0.5)?0.5*a*a:-0.5*(--a*(a-2)-1)},easeInCubic:function(a){return a*a*a},easeOutCubic:function(a){return 1*((a=a/1-1)*a*a+1)},easeInOutCubic:function(a){return 1>(a/=0.5)?0.5*a*a*a:0.5*((a-=2)*a*a+2)},easeInQuart:function(a){return a*a*a*a},easeOutQuart:function(a){return-1*((a=a/1-1)*a*a*a-1)},easeInOutQuart:function(a){return 1>(a/=0.5)?
0.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)},easeInQuint:function(a){return 1*(a/=1)*a*a*a*a},easeOutQuint:function(a){return 1*((a=a/1-1)*a*a*a*a+1)},easeInOutQuint:function(a){return 1>(a/=0.5)?0.5*a*a*a*a*a:0.5*((a-=2)*a*a*a*a+2)},easeInSine:function(a){return-1*Math.cos(a/1*(Math.PI/2))+1},easeOutSine:function(a){return 1*Math.sin(a/1*(Math.PI/2))},easeInOutSine:function(a){return-0.5*(Math.cos(Math.PI*a/1)-1)},easeInExpo:function(a){return 0==a?1:1*Math.pow(2,10*(a/1-1))},easeOutExpo:function(a){return 1==
a?1:1*(-Math.pow(2,-10*a/1)+1)},easeInOutExpo:function(a){return 0==a?0:1==a?1:1>(a/=0.5)?0.5*Math.pow(2,10*(a-1)):0.5*(-Math.pow(2,-10*--a)+2)},easeInCirc:function(a){return 1<=a?a:-1*(Math.sqrt(1-(a/=1)*a)-1)},easeOutCirc:function(a){return 1*Math.sqrt(1-(a=a/1-1)*a)},easeInOutCirc:function(a){return 1>(a/=0.5)?-0.5*(Math.sqrt(1-a*a)-1):0.5*(Math.sqrt(1-(a-=2)*a)+1)},easeInElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(1==(a/=1))return 1;b||(b=0.3);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*
Math.PI)*Math.asin(1/e);return-(e*Math.pow(2,10*(a-=1))*Math.sin((1*a-c)*2*Math.PI/b))},easeOutElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(1==(a/=1))return 1;b||(b=0.3);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*Math.PI)*Math.asin(1/e);return e*Math.pow(2,-10*a)*Math.sin((1*a-c)*2*Math.PI/b)+1},easeInOutElastic:function(a){var c=1.70158,b=0,e=1;if(0==a)return 0;if(2==(a/=0.5))return 1;b||(b=1*0.3*1.5);e<Math.abs(1)?(e=1,c=b/4):c=b/(2*Math.PI)*Math.asin(1/e);return 1>a?-0.5*e*Math.pow(2,10*
(a-=1))*Math.sin((1*a-c)*2*Math.PI/b):0.5*e*Math.pow(2,-10*(a-=1))*Math.sin((1*a-c)*2*Math.PI/b)+1},easeInBack:function(a){return 1*(a/=1)*a*(2.70158*a-1.70158)},easeOutBack:function(a){return 1*((a=a/1-1)*a*(2.70158*a+1.70158)+1)},easeInOutBack:function(a){var c=1.70158;return 1>(a/=0.5)?0.5*a*a*(((c*=1.525)+1)*a-c):0.5*((a-=2)*a*(((c*=1.525)+1)*a+c)+2)},easeInBounce:function(a){return 1-B.easeOutBounce(1-a)},easeOutBounce:function(a){return(a/=1)<1/2.75?1*7.5625*a*a:a<2/2.75?1*(7.5625*(a-=1.5/2.75)*
a+0.75):a<2.5/2.75?1*(7.5625*(a-=2.25/2.75)*a+0.9375):1*(7.5625*(a-=2.625/2.75)*a+0.984375)},easeInOutBounce:function(a){return 0.5>a?0.5*B.easeInBounce(2*a):0.5*B.easeOutBounce(2*a-1)+0.5}},q=s.canvas.width,u=s.canvas.height;window.devicePixelRatio&&(s.canvas.style.width=q+"px",s.canvas.style.height=u+"px",s.canvas.height=u*window.devicePixelRatio,s.canvas.width=q*window.devicePixelRatio,s.scale(window.devicePixelRatio,window.devicePixelRatio));this.PolarArea=function(a,c){r.PolarArea.defaults={scaleOverlay:!0,
scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleShowLine:!0,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",
animateRotate:!0,animateScale:!1,onAnimationComplete:null};var b=c?y(r.PolarArea.defaults,c):r.PolarArea.defaults;return new G(a,b,s)};this.Radar=function(a,c){r.Radar.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleShowLine:!0,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!1,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",
scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,angleShowLineOut:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,pointLabelFontFamily:"'Arial'",pointLabelFontStyle:"normal",pointLabelFontSize:12,pointLabelFontColor:"#666",pointDot:!0,pointDotRadius:3,pointDotStrokeWidth:1,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Radar.defaults,c):r.Radar.defaults;return new H(a,b,s)};this.Pie=function(a,
c){r.Pie.defaults={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,onAnimationComplete:null};var b=c?y(r.Pie.defaults,c):r.Pie.defaults;return new I(a,b,s)};this.Doughnut=function(a,c){r.Doughnut.defaults={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:50,animation:!0,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,
onAnimationComplete:null};var b=c?y(r.Doughnut.defaults,c):r.Doughnut.defaults;return new J(a,b,s)};this.Line=function(a,c){r.Line.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:!0,
pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:2,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Line.defaults,c):r.Line.defaults;return new K(a,b,s)};this.Bar=function(a,c){r.Bar.defaults={scaleOverlay:!1,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleFontFamily:"'Arial'",
scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,barShowStroke:!0,barStrokeWidth:2,barValueSpacing:5,barDatasetSpacing:1,animation:!0,animationSteps:60,animationEasing:"easeOutQuart",onAnimationComplete:null};var b=c?y(r.Bar.defaults,c):r.Bar.defaults;return new L(a,b,s)};var G=function(a,c,b){var e,h,f,d,g,k,j,l,m;g=Math.min.apply(Math,[q,u])/2;g-=Math.max.apply(Math,[0.5*c.scaleFontSize,0.5*c.scaleLineWidth]);
d=2*c.scaleFontSize;c.scaleShowLabelBackdrop&&(d+=2*c.scaleBackdropPaddingY,g-=1.5*c.scaleBackdropPaddingY);l=g;d=d?d:5;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.length;f++)a[f].value>e&&(e=a[f].value),a[f].value<h&&(h=a[f].value);f=Math.floor(l/(0.66*d));d=Math.floor(0.5*(l/d));m=c.scaleShowLabels?c.scaleLabel:null;c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(m,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(l,f,d,e,h,
m);k=g/j.steps;x(c,function(){for(var a=0;a<j.steps;a++)if(c.scaleShowLine&&(b.beginPath(),b.arc(q/2,u/2,k*(a+1),0,2*Math.PI,!0),b.strokeStyle=c.scaleLineColor,b.lineWidth=c.scaleLineWidth,b.stroke()),c.scaleShowLabels){b.textAlign="center";b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;var e=j.labels[a];if(c.scaleShowLabelBackdrop){var d=b.measureText(e).width;b.fillStyle=c.scaleBackdropColor;b.beginPath();b.rect(Math.round(q/2-d/2-c.scaleBackdropPaddingX),Math.round(u/2-k*(a+
1)-0.5*c.scaleFontSize-c.scaleBackdropPaddingY),Math.round(d+2*c.scaleBackdropPaddingX),Math.round(c.scaleFontSize+2*c.scaleBackdropPaddingY));b.fill()}b.textBaseline="middle";b.fillStyle=c.scaleFontColor;b.fillText(e,q/2,u/2-k*(a+1))}},function(e){var d=-Math.PI/2,g=2*Math.PI/a.length,f=1,h=1;c.animation&&(c.animateScale&&(f=e),c.animateRotate&&(h=e));for(e=0;e<a.length;e++)b.beginPath(),b.arc(q/2,u/2,f*v(a[e].value,j,k),d,d+h*g,!1),b.lineTo(q/2,u/2),b.closePath(),b.fillStyle=a[e].color,b.fill(),
c.segmentShowStroke&&(b.strokeStyle=c.segmentStrokeColor,b.lineWidth=c.segmentStrokeWidth,b.stroke()),d+=h*g},b)},H=function(a,c,b){var e,h,f,d,g,k,j,l,m;a.labels||(a.labels=[]);g=Math.min.apply(Math,[q,u])/2;d=2*c.scaleFontSize;for(e=l=0;e<a.labels.length;e++)b.font=c.pointLabelFontStyle+" "+c.pointLabelFontSize+"px "+c.pointLabelFontFamily,h=b.measureText(a.labels[e]).width,h>l&&(l=h);g-=Math.max.apply(Math,[l,1.5*(c.pointLabelFontSize/2)]);g-=c.pointLabelFontSize;l=g=A(g,null,0);d=d?d:5;e=Number.MIN_VALUE;
h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(m=0;m<a.datasets[f].data.length;m++)a.datasets[f].data[m]>e&&(e=a.datasets[f].data[m]),a.datasets[f].data[m]<h&&(h=a.datasets[f].data[m]);f=Math.floor(l/(0.66*d));d=Math.floor(0.5*(l/d));m=c.scaleShowLabels?c.scaleLabel:null;c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(m,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(l,f,d,e,h,m);k=g/j.steps;x(c,function(){var e=2*Math.PI/
a.datasets[0].data.length;b.save();b.translate(q/2,u/2);if(c.angleShowLineOut){b.strokeStyle=c.angleLineColor;b.lineWidth=c.angleLineWidth;for(var d=0;d<a.datasets[0].data.length;d++)b.rotate(e),b.beginPath(),b.moveTo(0,0),b.lineTo(0,-g),b.stroke()}for(d=0;d<j.steps;d++){b.beginPath();if(c.scaleShowLine){b.strokeStyle=c.scaleLineColor;b.lineWidth=c.scaleLineWidth;b.moveTo(0,-k*(d+1));for(var f=0;f<a.datasets[0].data.length;f++)b.rotate(e),b.lineTo(0,-k*(d+1));b.closePath();b.stroke()}c.scaleShowLabels&&
(b.textAlign="center",b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily,b.textBaseline="middle",c.scaleShowLabelBackdrop&&(f=b.measureText(j.labels[d]).width,b.fillStyle=c.scaleBackdropColor,b.beginPath(),b.rect(Math.round(-f/2-c.scaleBackdropPaddingX),Math.round(-k*(d+1)-0.5*c.scaleFontSize-c.scaleBackdropPaddingY),Math.round(f+2*c.scaleBackdropPaddingX),Math.round(c.scaleFontSize+2*c.scaleBackdropPaddingY)),b.fill()),b.fillStyle=c.scaleFontColor,b.fillText(j.labels[d],0,-k*(d+
1)))}for(d=0;d<a.labels.length;d++){b.font=c.pointLabelFontStyle+" "+c.pointLabelFontSize+"px "+c.pointLabelFontFamily;b.fillStyle=c.pointLabelFontColor;var f=Math.sin(e*d)*(g+c.pointLabelFontSize),h=Math.cos(e*d)*(g+c.pointLabelFontSize);b.textAlign=e*d==Math.PI||0==e*d?"center":e*d>Math.PI?"right":"left";b.textBaseline="middle";b.fillText(a.labels[d],f,-h)}b.restore()},function(d){var e=2*Math.PI/a.datasets[0].data.length;b.save();b.translate(q/2,u/2);for(var g=0;g<a.datasets.length;g++){b.beginPath();
b.moveTo(0,d*-1*v(a.datasets[g].data[0],j,k));for(var f=1;f<a.datasets[g].data.length;f++)b.rotate(e),b.lineTo(0,d*-1*v(a.datasets[g].data[f],j,k));b.closePath();b.fillStyle=a.datasets[g].fillColor;b.strokeStyle=a.datasets[g].strokeColor;b.lineWidth=c.datasetStrokeWidth;b.fill();b.stroke();if(c.pointDot){b.fillStyle=a.datasets[g].pointColor;b.strokeStyle=a.datasets[g].pointStrokeColor;b.lineWidth=c.pointDotStrokeWidth;for(f=0;f<a.datasets[g].data.length;f++)b.rotate(e),b.beginPath(),b.arc(0,d*-1*
v(a.datasets[g].data[f],j,k),c.pointDotRadius,2*Math.PI,!1),b.fill(),b.stroke()}b.rotate(e)}b.restore()},b)},I=function(a,c,b){for(var e=0,h=Math.min.apply(Math,[u/2,q/2])-5,f=0;f<a.length;f++)e+=a[f].value;x(c,null,function(d){var g=-Math.PI/2,f=1,j=1;c.animation&&(c.animateScale&&(f=d),c.animateRotate&&(j=d));for(d=0;d<a.length;d++){var l=j*a[d].value/e*2*Math.PI;b.beginPath();b.arc(q/2,u/2,f*h,g,g+l);b.lineTo(q/2,u/2);b.closePath();b.fillStyle=a[d].color;b.fill();c.segmentShowStroke&&(b.lineWidth=
c.segmentStrokeWidth,b.strokeStyle=c.segmentStrokeColor,b.stroke());g+=l}},b)},J=function(a,c,b){for(var e=0,h=Math.min.apply(Math,[u/2,q/2])-5,f=h*(c.percentageInnerCutout/100),d=0;d<a.length;d++)e+=a[d].value;x(c,null,function(d){var k=-Math.PI/2,j=1,l=1;c.animation&&(c.animateScale&&(j=d),c.animateRotate&&(l=d));for(d=0;d<a.length;d++){var m=l*a[d].value/e*2*Math.PI;b.beginPath();b.arc(q/2,u/2,j*h,k,k+m,!1);b.arc(q/2,u/2,j*f,k+m,k,!0);b.closePath();b.fillStyle=a[d].color;b.fill();c.segmentShowStroke&&
(b.lineWidth=c.segmentStrokeWidth,b.strokeStyle=c.segmentStrokeColor,b.stroke());k+=m}},b)},K=function(a,c,b){var e,h,f,d,g,k,j,l,m,t,r,n,p,s=0;g=u;b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;t=1;for(d=0;d<a.labels.length;d++)e=b.measureText(a.labels[d]).width,t=e>t?e:t;q/a.labels.length<t?(s=45,q/a.labels.length<Math.cos(s)*t?(s=90,g-=t):g-=Math.sin(s)*t):g-=c.scaleFontSize;d=c.scaleFontSize;g=g-5-d;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(l=
0;l<a.datasets[f].data.length;l++)a.datasets[f].data[l]>e&&(e=a.datasets[f].data[l]),a.datasets[f].data[l]<h&&(h=a.datasets[f].data[l]);f=Math.floor(g/(0.66*d));d=Math.floor(0.5*(g/d));l=c.scaleShowLabels?c.scaleLabel:"";c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(l,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(g,f,d,e,h,l);k=Math.floor(g/j.steps);d=1;if(c.scaleShowLabels){b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;
for(e=0;e<j.labels.length;e++)h=b.measureText(j.labels[e]).width,d=h>d?h:d;d+=10}r=q-d-t;m=Math.floor(r/(a.labels.length-1));n=q-t/2-r;p=g+c.scaleFontSize/2;x(c,function(){b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(q-t/2+5,p);b.lineTo(q-t/2-r-5,p);b.stroke();0<s?(b.save(),b.textAlign="right"):b.textAlign="center";b.fillStyle=c.scaleFontColor;for(var d=0;d<a.labels.length;d++)b.save(),0<s?(b.translate(n+d*m,p+c.scaleFontSize),b.rotate(-(s*(Math.PI/180))),b.fillText(a.labels[d],
0,0),b.restore()):b.fillText(a.labels[d],n+d*m,p+c.scaleFontSize+3),b.beginPath(),b.moveTo(n+d*m,p+3),c.scaleShowGridLines&&0<d?(b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+d*m,5)):b.lineTo(n+d*m,p+3),b.stroke();b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(n,p+5);b.lineTo(n,5);b.stroke();b.textAlign="right";b.textBaseline="middle";for(d=0;d<j.steps;d++)b.beginPath(),b.moveTo(n-3,p-(d+1)*k),c.scaleShowGridLines?(b.lineWidth=c.scaleGridLineWidth,
b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+r+5,p-(d+1)*k)):b.lineTo(n-0.5,p-(d+1)*k),b.stroke(),c.scaleShowLabels&&b.fillText(j.labels[d],n-8,p-(d+1)*k)},function(d){function e(b,c){return p-d*v(a.datasets[b].data[c],j,k)}for(var f=0;f<a.datasets.length;f++){b.strokeStyle=a.datasets[f].strokeColor;b.lineWidth=c.datasetStrokeWidth;b.beginPath();b.moveTo(n,p-d*v(a.datasets[f].data[0],j,k));for(var g=1;g<a.datasets[f].data.length;g++)c.bezierCurve?b.bezierCurveTo(n+m*(g-0.5),e(f,g-1),n+m*(g-0.5),
e(f,g),n+m*g,e(f,g)):b.lineTo(n+m*g,e(f,g));b.stroke();c.datasetFill?(b.lineTo(n+m*(a.datasets[f].data.length-1),p),b.lineTo(n,p),b.closePath(),b.fillStyle=a.datasets[f].fillColor,b.fill()):b.closePath();if(c.pointDot){b.fillStyle=a.datasets[f].pointColor;b.strokeStyle=a.datasets[f].pointStrokeColor;b.lineWidth=c.pointDotStrokeWidth;for(g=0;g<a.datasets[f].data.length;g++)b.beginPath(),b.arc(n+m*g,p-d*v(a.datasets[f].data[g],j,k),c.pointDotRadius,0,2*Math.PI,!0),b.fill(),b.stroke()}}},b)},L=function(a,
c,b){var e,h,f,d,g,k,j,l,m,t,r,n,p,s,w=0;g=u;b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;t=1;for(d=0;d<a.labels.length;d++)e=b.measureText(a.labels[d]).width,t=e>t?e:t;q/a.labels.length<t?(w=45,q/a.labels.length<Math.cos(w)*t?(w=90,g-=t):g-=Math.sin(w)*t):g-=c.scaleFontSize;d=c.scaleFontSize;g=g-5-d;e=Number.MIN_VALUE;h=Number.MAX_VALUE;for(f=0;f<a.datasets.length;f++)for(l=0;l<a.datasets[f].data.length;l++)a.datasets[f].data[l]>e&&(e=a.datasets[f].data[l]),a.datasets[f].data[l]<
h&&(h=a.datasets[f].data[l]);f=Math.floor(g/(0.66*d));d=Math.floor(0.5*(g/d));l=c.scaleShowLabels?c.scaleLabel:"";c.scaleOverride?(j={steps:c.scaleSteps,stepValue:c.scaleStepWidth,graphMin:c.scaleStartValue,labels:[]},z(l,j.labels,j.steps,c.scaleStartValue,c.scaleStepWidth)):j=C(g,f,d,e,h,l);k=Math.floor(g/j.steps);d=1;if(c.scaleShowLabels){b.font=c.scaleFontStyle+" "+c.scaleFontSize+"px "+c.scaleFontFamily;for(e=0;e<j.labels.length;e++)h=b.measureText(j.labels[e]).width,d=h>d?h:d;d+=10}r=q-d-t;m=
Math.floor(r/a.labels.length);s=(m-2*c.scaleGridLineWidth-2*c.barValueSpacing-(c.barDatasetSpacing*a.datasets.length-1)-(c.barStrokeWidth/2*a.datasets.length-1))/a.datasets.length;n=q-t/2-r;p=g+c.scaleFontSize/2;x(c,function(){b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(q-t/2+5,p);b.lineTo(q-t/2-r-5,p);b.stroke();0<w?(b.save(),b.textAlign="right"):b.textAlign="center";b.fillStyle=c.scaleFontColor;for(var d=0;d<a.labels.length;d++)b.save(),0<w?(b.translate(n+
d*m,p+c.scaleFontSize),b.rotate(-(w*(Math.PI/180))),b.fillText(a.labels[d],0,0),b.restore()):b.fillText(a.labels[d],n+d*m+m/2,p+c.scaleFontSize+3),b.beginPath(),b.moveTo(n+(d+1)*m,p+3),b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+(d+1)*m,5),b.stroke();b.lineWidth=c.scaleLineWidth;b.strokeStyle=c.scaleLineColor;b.beginPath();b.moveTo(n,p+5);b.lineTo(n,5);b.stroke();b.textAlign="right";b.textBaseline="middle";for(d=0;d<j.steps;d++)b.beginPath(),b.moveTo(n-3,p-(d+1)*
k),c.scaleShowGridLines?(b.lineWidth=c.scaleGridLineWidth,b.strokeStyle=c.scaleGridLineColor,b.lineTo(n+r+5,p-(d+1)*k)):b.lineTo(n-0.5,p-(d+1)*k),b.stroke(),c.scaleShowLabels&&b.fillText(j.labels[d],n-8,p-(d+1)*k)},function(d){b.lineWidth=c.barStrokeWidth;for(var e=0;e<a.datasets.length;e++){b.fillStyle=a.datasets[e].fillColor;b.strokeStyle=a.datasets[e].strokeColor;for(var f=0;f<a.datasets[e].data.length;f++){var g=n+c.barValueSpacing+m*f+s*e+c.barDatasetSpacing*e+c.barStrokeWidth*e;b.beginPath();
b.moveTo(g,p);b.lineTo(g,p-d*v(a.datasets[e].data[f],j,k)+c.barStrokeWidth/2);b.lineTo(g+s,p-d*v(a.datasets[e].data[f],j,k)+c.barStrokeWidth/2);b.lineTo(g+s,p);c.barShowStroke&&b.stroke();b.closePath();b.fill()}}},b)},D=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)},F={}};
'use strict';

(function () {
  var chartjs = angular.module('chartjs', []),
    chartTypes = {
      line: 'Line',
      bar: 'Bar',
      radar: 'Radar',
      polar: 'PolarArea',
      pie: 'Pie',
      doughnut: 'Doughnut'
    },
    makeChartDirective = function (chartType) {
      var upper = chartType.charAt(0).toUpperCase() + chartType.slice(1);
      chartjs.directive('cjs' + upper, function (chartFactory) { 
        return new chartFactory(chartType) 
      });
    },
    sizeChart = function (width, height, canvas) {
      var oW = canvas.width,
          oH = canvas.height;
      if (oW !== width || oH !== height) {      
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    },
    fitChart = function (canvas, element) {
      var w = element.parent().prop('offsetWidth'),
          h = element.parent().prop('offsetHeight');
      return sizeChart(w, h, canvas);
    };

  for (var c in chartTypes) {
    makeChartDirective(c);
  }

  chartjs.factory('chartFactory', function () {
    return function (chartType) {

      var chartType = chartTypes[chartType],
        extractSpecOpts = function (opts, attrs) {
          var i = opts.length, 
            extracted = {},
            cv;
          
          while (i--) {
            cv = attrs[opts[i]];
            if (typeof(cv) !== 'undefined') {
              extracted[opts[i]] = cv;
            }
          }
          return extracted;
        };

      if (typeof(chartType) === 'undefined') {
        return;
      }

      return {
        restrict: 'EAC',
        template: '<canvas></canvas>',
        replace: true,
        scope: {
          dataset: '=',
          options: '=',
          autofit: '='
        },
        link: function postLink(scope, element, attrs) {
          var ctx = element[0].getContext('2d'),
              chart = new Chart(ctx),
              chartOpts = {},
              specOpts = [],
              autofit = scope.autofit,
              bound = false,
              drawChart = function (value, forceRedraw) {
                if ((autofit && fitChart(ctx.canvas, element)) || forceRedraw) {
                  chart = new Chart(ctx);
                  chart[chartType](value, chartOpts);
                }

                if (!bound) {
                  angular.element(window).bind('resize', function () {
                    drawChart(value);
                  });
                  bound = true;
                }
              };

          // HACK: to get default params out of protected scope from ChartJS
          try {
            chart[chartType]([], {});
          } catch (e) {}
          specOpts = Object.keys(chart[chartType].defaults);
          // ENDHACK

          angular.extend(chartOpts, scope.options, extractSpecOpts(specOpts, attrs));

          scope.$watch('dataset', function (value) {
            if (!value) {
              return;
            }
            drawChart(value, true);
          }, true);
        }
      }
    }
  });
})();
(function (module) {
     
    var fileReader = function ($q, $log) {
 
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
        };
    };
 
    module.factory("fileReader",
                   ["$q", "$log", fileReader]);
 
}(angular.module("fbtmApp")));
/**
 * @license AngularJS v1.2.1
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* jshint maxlen: false */

/**
 * @ngdoc overview
 * @name ngAnimate
 * @description
 *
 * # ngAnimate
 *
 * The `ngAnimate` module provides support for JavaScript, CSS3 transition and CSS3 keyframe animation hooks within existing core and custom directives.
 *
 * {@installModule animate}
 *
 * <div doc-module-components="ngAnimate"></div>
 *
 * # Usage
 *
 * To see animations in action, all that is required is to define the appropriate CSS classes
 * or to register a JavaScript animation via the myModule.animation() function. The directives that support animation automatically are:
 * `ngRepeat`, `ngInclude`, `ngIf`, `ngSwitch`, `ngShow`, `ngHide`, `ngView` and `ngClass`. Custom directives can take advantage of animation
 * by using the `$animate` service.
 *
 * Below is a more detailed breakdown of the supported animation events provided by pre-existing ng directives:
 *
 * | Directive                                                 | Supported Animations                               |
 * |---------------------------------------------------------- |----------------------------------------------------|
 * | {@link ng.directive:ngRepeat#usage_animations ngRepeat}         | enter, leave and move                              |
 * | {@link ngRoute.directive:ngView#usage_animations ngView}        | enter and leave                                    |
 * | {@link ng.directive:ngInclude#usage_animations ngInclude}       | enter and leave                                    |
 * | {@link ng.directive:ngSwitch#usage_animations ngSwitch}         | enter and leave                                    |
 * | {@link ng.directive:ngIf#usage_animations ngIf}                 | enter and leave                                    |
 * | {@link ng.directive:ngClass#usage_animations ngClass}           | add and remove                                     |
 * | {@link ng.directive:ngShow#usage_animations ngShow & ngHide}    | add and remove (the ng-hide class value)           |
 *
 * You can find out more information about animations upon visiting each directive page.
 *
 * Below is an example of how to apply animations to a directive that supports animation hooks:
 *
 * <pre>
 * <style type="text/css">
 * .slide.ng-enter, .slide.ng-leave {
 *   -webkit-transition:0.5s linear all;
 *   transition:0.5s linear all;
 * }
 *
 * .slide.ng-enter { }        /&#42; starting animations for enter &#42;/
 * .slide.ng-enter-active { } /&#42; terminal animations for enter &#42;/
 * .slide.ng-leave { }        /&#42; starting animations for leave &#42;/
 * .slide.ng-leave-active { } /&#42; terminal animations for leave &#42;/
 * </style>
 *
 * <!--
 * the animate service will automatically add .ng-enter and .ng-leave to the element
 * to trigger the CSS transition/animations
 * -->
 * <ANY class="slide" ng-include="..."></ANY>
 * </pre>
 *
 * Keep in mind that if an animation is running, any child elements cannot be animated until the parent element's
 * animation has completed.
 *
 * <h2>CSS-defined Animations</h2>
 * The animate service will automatically apply two CSS classes to the animated element and these two CSS classes
 * are designed to contain the start and end CSS styling. Both CSS transitions and keyframe animations are supported
 * and can be used to play along with this naming structure.
 *
 * The following code below demonstrates how to perform animations using **CSS transitions** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * /&#42;
 *  The animate class is apart of the element and the ng-enter class
 *  is attached to the element once the enter animation event is triggered
 * &#42;/
 * .reveal-animation.ng-enter {
 *  -webkit-transition: 1s linear all; /&#42; Safari/Chrome &#42;/
 *  transition: 1s linear all; /&#42; All other modern browsers and IE10+ &#42;/
 *
 *  /&#42; The animation preparation code &#42;/
 *  opacity: 0;
 * }
 *
 * /&#42;
 *  Keep in mind that you want to combine both CSS
 *  classes together to avoid any CSS-specificity
 *  conflicts
 * &#42;/
 * .reveal-animation.ng-enter.ng-enter-active {
 *  /&#42; The animation code itself &#42;/
 *  opacity: 1;
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * The following code below demonstrates how to perform animations using **CSS animations** with Angular:
 *
 * <pre>
 * <style type="text/css">
 * .reveal-animation.ng-enter {
 *   -webkit-animation: enter_sequence 1s linear; /&#42; Safari/Chrome &#42;/
 *   animation: enter_sequence 1s linear; /&#42; IE10+ and Future Browsers &#42;/
 * }
 * &#64-webkit-keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * &#64keyframes enter_sequence {
 *   from { opacity:0; }
 *   to { opacity:1; }
 * }
 * </style>
 *
 * <div class="view-container">
 *   <div ng-view class="reveal-animation"></div>
 * </div>
 * </pre>
 *
 * Both CSS3 animations and transitions can be used together and the animate service will figure out the correct duration and delay timing.
 *
 * Upon DOM mutation, the event class is added first (something like `ng-enter`), then the browser prepares itself to add
 * the active class (in this case `ng-enter-active`) which then triggers the animation. The animation module will automatically
 * detect the CSS code to determine when the animation ends. Once the animation is over then both CSS classes will be
 * removed from the DOM. If a browser does not support CSS transitions or CSS animations then the animation will start and end
 * immediately resulting in a DOM element that is at its final state. This final state is when the DOM element
 * has no CSS transition/animation classes applied to it.
 *
 * <h3>CSS Staggering Animations</h3>
 * A Staggering animation is a collection of animations that are issued with a slight delay in between each successive operation resulting in a
 * curtain-like effect. The ngAnimate module, as of 1.2.0, supports staggering animations and the stagger effect can be
 * performed by creating a **ng-EVENT-stagger** CSS class and attaching that class to the base CSS class used for
 * the animation. The style property expected within the stagger class can either be a **transition-delay** or an
 * **animation-delay** property (or both if your animation contains both transitions and keyframe animations).
 *
 * <pre>
 * .my-animation.ng-enter {
 *   /&#42; standard transition code &#42;/
 *   -webkit-transition: 1s linear all;
 *   transition: 1s linear all;
 *   opacity:0;
 * }
 * .my-animation.ng-enter-stagger {
 *   /&#42; this will have a 100ms delay between each successive leave animation &#42;/
 *   -webkit-transition-delay: 0.1s;
 *   transition-delay: 0.1s;
 *
 *   /&#42; in case the stagger doesn't work then these two values
 *    must be set to 0 to avoid an accidental CSS inheritance &#42;/
 *   -webkit-transition-duration: 0s;
 *   transition-duration: 0s;
 * }
 * .my-animation.ng-enter.ng-enter-active {
 *   /&#42; standard transition styles &#42;/
 *   opacity:1;
 * }
 * </pre>
 *
 * Staggering animations work by default in ngRepeat (so long as the CSS class is defiend). Outside of ngRepeat, to use staggering animations
 * on your own, they can be triggered by firing multiple calls to the same event on $animate. However, the restrictions surrounding this
 * are that each of the elements must have the same CSS className value as well as the same parent element. A stagger operation
 * will also be reset if more than 10ms has passed after the last animation has been fired.
 *
 * The following code will issue the **ng-leave-stagger** event on the element provided:
 *
 * <pre>
 * var kids = parent.children();
 *
 * $animate.leave(kids[0]); //stagger index=0
 * $animate.leave(kids[1]); //stagger index=1
 * $animate.leave(kids[2]); //stagger index=2
 * $animate.leave(kids[3]); //stagger index=3
 * $animate.leave(kids[4]); //stagger index=4
 *
 * $timeout(function() {
 *   //stagger has reset itself
 *   $animate.leave(kids[5]); //stagger index=0
 *   $animate.leave(kids[6]); //stagger index=1
 * }, 100, false);
 * </pre>
 *
 * Stagger animations are currently only supported within CSS-defined animations.
 *
 * <h2>JavaScript-defined Animations</h2>
 * In the event that you do not want to use CSS3 transitions or CSS3 animations or if you wish to offer animations on browsers that do not
 * yet support CSS transitions/animations, then you can make use of JavaScript animations defined inside of your AngularJS module.
 *
 * <pre>
 * //!annotate="YourApp" Your AngularJS Module|Replace this or ngModule with the module that you used to define your application.
 * var ngModule = angular.module('YourApp', []);
 * ngModule.animation('.my-crazy-animation', function() {
 *   return {
 *     enter: function(element, done) {
 *       //run the animation here and call done when the animation is complete
 *       return function(cancelled) {
 *         //this (optional) function will be called when the animation
 *         //completes or when the animation is cancelled (the cancelled
 *         //flag will be set to true if cancelled).
 *       }
 *     }
 *     leave: function(element, done) { },
 *     move: function(element, done) { },
 *
 *     //animation that can be triggered before the class is added
 *     beforeAddClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is added
 *     addClass: function(element, className, done) { },
 *
 *     //animation that can be triggered before the class is removed
 *     beforeRemoveClass: function(element, className, done) { },
 *
 *     //animation that can be triggered after the class is removed
 *     removeClass: function(element, className, done) { }
 *   }
 * });
 * </pre>
 *
 * JavaScript-defined animations are created with a CSS-like class selector and a collection of events which are set to run
 * a javascript callback function. When an animation is triggered, $animate will look for a matching animation which fits
 * the element's CSS class attribute value and then run the matching animation event function (if found).
 * In other words, if the CSS classes present on the animated element match any of the JavaScript animations then the callback function
 * be executed. It should be also noted that only simple, single class selectors are allowed (compound class selectors are not supported).
 *
 * Within a JavaScript animation, an object containing various event callback animation functions is expected to be returned.
 * As explained above, these callbacks are triggered based on the animation event. Therefore if an enter animation is run,
 * and the JavaScript animation is found, then the enter callback will handle that animation (in addition to the CSS keyframe animation
 * or transition code that is defined via a stylesheet).
 *
 */

angular.module('ngAnimate', ['ng'])

  /**
   * @ngdoc object
   * @name ngAnimate.$animateProvider
   * @description
   *
   * The `$animateProvider` allows developers to register JavaScript animation event handlers directly inside of a module.
   * When an animation is triggered, the $animate service will query the $animate service to find any animations that match
   * the provided name value.
   *
   * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
   *
   * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
   *
   */
  .config(['$provide', '$animateProvider', function($provide, $animateProvider) {
    var noop = angular.noop;
    var forEach = angular.forEach;
    var selectors = $animateProvider.$$selectors;

    var ELEMENT_NODE = 1;
    var NG_ANIMATE_STATE = '$$ngAnimateState';
    var NG_ANIMATE_CLASS_NAME = 'ng-animate';
    var rootAnimateState = {running: true};

    $provide.decorator('$animate', ['$delegate', '$injector', '$sniffer', '$rootElement', '$timeout', '$rootScope', '$document',
                            function($delegate,   $injector,   $sniffer,   $rootElement,   $timeout,   $rootScope,   $document) {

      $rootElement.data(NG_ANIMATE_STATE, rootAnimateState);

      // disable animations during bootstrap, but once we bootstrapped, enable animations
      $rootScope.$$postDigest(function() {
        rootAnimateState.running = false;
      });

      function lookup(name) {
        if (name) {
          var matches = [],
              flagMap = {},
              classes = name.substr(1).split('.');

          //the empty string value is the default animation
          //operation which performs CSS transition and keyframe
          //animations sniffing. This is always included for each
          //element animation procedure if the browser supports
          //transitions and/or keyframe animations
          if ($sniffer.transitions || $sniffer.animations) {
            classes.push('');
          }

          for(var i=0; i < classes.length; i++) {
            var klass = classes[i],
                selectorFactoryName = selectors[klass];
            if(selectorFactoryName && !flagMap[klass]) {
              matches.push($injector.get(selectorFactoryName));
              flagMap[klass] = true;
            }
          }
          return matches;
        }
      }

      /**
       * @ngdoc object
       * @name ngAnimate.$animate
       * @function
       *
       * @description
       * The `$animate` service provides animation detection support while performing DOM operations (enter, leave and move) as well as during addClass and removeClass operations.
       * When any of these operations are run, the $animate service
       * will examine any JavaScript-defined animations (which are defined by using the $animateProvider provider object)
       * as well as any CSS-defined animations against the CSS classes present on the element once the DOM operation is run.
       *
       * The `$animate` service is used behind the scenes with pre-existing directives and animation with these directives
       * will work out of the box without any extra configuration.
       *
       * Requires the {@link ngAnimate `ngAnimate`} module to be installed.
       *
       * Please visit the {@link ngAnimate `ngAnimate`} module overview page learn more about how to use animations in your application.
       *
       */
      return {
        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enter
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Appends the element to the parentElement element that resides in the document and then runs the enter animation. Once
         * the animation is started, the following CSS classes will be present on the element for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.enter(...) is called                                                             | class="my-animation"                        |
         * | 2. element is inserted into the parentElement element or beside the afterElement element     | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-enter class is added to the element                                               | class="my-animation ng-animate ng-enter"    |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-enter"    |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-enter"    |
         * | 7. the .ng-enter-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-enter ng-enter-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} parentElement the parent element of the element that will be the focus of the enter animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the enter animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        enter : function(element, parentElement, afterElement, doneCallback) {
          this.enabled(false, element);
          $delegate.enter(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            performAnimation('enter', 'ng-enter', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#leave
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Runs the leave animation operation and, upon completion, removes the element from the DOM. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during enter animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.leave(...) is called                                                             | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 3. the .ng-leave class is added to the element                                               | class="my-animation ng-animate ng-leave"    |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-leave"    |
         * | 5. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-leave"    |
         * | 6. the .ng-leave-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 7. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-leave ng-leave-active" |
         * | 8. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 9. The element is removed from the DOM                                                       | ...                                         |
         * | 10. The doneCallback() callback is fired (if provided)                                       | ...                                         |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the leave animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        leave : function(element, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $rootScope.$$postDigest(function() {
            performAnimation('leave', 'ng-leave', element, null, null, function() {
              $delegate.leave(element);
            }, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#move
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @description
         * Fires the move DOM operation. Just before the animation starts, the animate service will either append it into the parentElement container or
         * add the element directly after the afterElement element if present. Then the move animation will be run. Once
         * the animation is started, the following CSS classes will be added for the duration of the animation:
         *
         * Below is a breakdown of each step that occurs during move animation:
         *
         * | Animation Step                                                                               | What the element class attribute looks like |
         * |----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.move(...) is called                                                              | class="my-animation"                        |
         * | 2. element is moved into the parentElement element or beside the afterElement element        | class="my-animation"                        |
         * | 3. $animate runs any JavaScript-defined animations on the element                            | class="my-animation ng-animate"             |
         * | 4. the .ng-move class is added to the element                                                | class="my-animation ng-animate ng-move"     |
         * | 5. $animate scans the element styles to get the CSS transition/animation duration and delay  | class="my-animation ng-animate ng-move"     |
         * | 6. $animate waits for 10ms (this performs a reflow)                                          | class="my-animation ng-animate ng-move"     |
         * | 7. the .ng-move-active and .ng-animate-active classes is added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 8. $animate waits for X milliseconds for the animation to complete                           | class="my-animation ng-animate ng-animate-active ng-move ng-move-active" |
         * | 9. The animation ends and all generated CSS classes are removed from the element             | class="my-animation"                        |
         * | 10. The doneCallback() callback is fired (if provided)                                       | class="my-animation"                        |
         *
         * @param {jQuery/jqLite element} element the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} parentElement the parentElement element of the element that will be the focus of the move animation
         * @param {jQuery/jqLite element} afterElement the sibling element (which is the previous element) of the element that will be the focus of the move animation
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        move : function(element, parentElement, afterElement, doneCallback) {
          cancelChildAnimations(element);
          this.enabled(false, element);
          $delegate.move(element, parentElement, afterElement);
          $rootScope.$$postDigest(function() {
            performAnimation('move', 'ng-move', element, parentElement, afterElement, noop, doneCallback);
          });
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#addClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then attaches the className value to the element as a CSS class.
         * Unlike the other animation methods, the animate service will suffix the className value with {@type -add} in order to provide
         * the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if no CSS transitions
         * or keyframes are defined on the -add or base CSS class).
         *
         * Below is a breakdown of each step that occurs during addClass animation:
         *
         * | Animation Step                                                                                 | What the element class attribute looks like |
         * |------------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.addClass(element, 'super') is called                                               | class="my-animation"                        |
         * | 2. $animate runs any JavaScript-defined animations on the element                              | class="my-animation ng-animate"             |
         * | 3. the .super-add class are added to the element                                               | class="my-animation ng-animate super-add"   |
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay    | class="my-animation ng-animate super-add"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                            | class="my-animation ng-animate super-add"   |
         * | 6. the .super, .super-add-active and .ng-animate-active classes are added (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super super-add super-add-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                             | class="my-animation super-add super-add-active"  |
         * | 8. The animation ends and all generated CSS classes are removed from the element               | class="my-animation super"                  |
         * | 9. The super class is kept on the element                                                      | class="my-animation super"                  |
         * | 10. The doneCallback() callback is fired (if provided)                                         | class="my-animation super"                  |
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be added to the element and then animated
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        addClass : function(element, className, doneCallback) {
          performAnimation('addClass', className, element, null, null, function() {
            $delegate.addClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#removeClass
         * @methodOf ngAnimate.$animate
         *
         * @description
         * Triggers a custom animation event based off the className variable and then removes the CSS class provided by the className value
         * from the element. Unlike the other animation methods, the animate service will suffix the className value with {@type -remove} in
         * order to provide the animate service the setup and active CSS classes in order to trigger the animation (this will be skipped if
         * no CSS transitions or keyframes are defined on the -remove or base CSS classes).
         *
         * Below is a breakdown of each step that occurs during removeClass animation:
         *
         * | Animation Step                                                                                | What the element class attribute looks like     |
         * |-----------------------------------------------------------------------------------------------|---------------------------------------------|
         * | 1. $animate.removeClass(element, 'super') is called                                           | class="my-animation super"                  |
         * | 2. $animate runs any JavaScript-defined animations on the element                             | class="my-animation super ng-animate"       |
         * | 3. the .super-remove class are added to the element                                           | class="my-animation super ng-animate super-remove"|
         * | 4. $animate scans the element styles to get the CSS transition/animation duration and delay   | class="my-animation super ng-animate super-remove"   |
         * | 5. $animate waits for 10ms (this performs a reflow)                                           | class="my-animation super ng-animate super-remove"   |
         * | 6. the .super-remove-active and .ng-animate-active classes are added and .super is removed (this triggers the CSS transition/animation) | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"          |
         * | 7. $animate waits for X milliseconds for the animation to complete                            | class="my-animation ng-animate ng-animate-active super-remove super-remove-active"   |
         * | 8. The animation ends and all generated CSS classes are removed from the element              | class="my-animation"                        |
         * | 9. The doneCallback() callback is fired (if provided)                                         | class="my-animation"                        |
         *
         *
         * @param {jQuery/jqLite element} element the element that will be animated
         * @param {string} className the CSS class that will be animated and then removed from the element
         * @param {function()=} doneCallback the callback function that will be called once the animation is complete
        */
        removeClass : function(element, className, doneCallback) {
          performAnimation('removeClass', className, element, null, null, function() {
            $delegate.removeClass(element, className);
          }, doneCallback);
        },

        /**
         * @ngdoc function
         * @name ngAnimate.$animate#enabled
         * @methodOf ngAnimate.$animate
         * @function
         *
         * @param {boolean=} value If provided then set the animation on or off.
         * @return {boolean} Current animation state.
         *
         * @description
         * Globally enables/disables animations.
         *
        */
        enabled : function(value, element) {
          switch(arguments.length) {
            case 2:
              if(value) {
                cleanup(element);
              } else {
                var data = element.data(NG_ANIMATE_STATE) || {};
                data.disabled = true;
                element.data(NG_ANIMATE_STATE, data);
              }
            break;

            case 1:
              rootAnimateState.disabled = !value;
            break;

            default:
              value = !rootAnimateState.disabled;
            break;
          }
          return !!value;
         }
      };

      /*
        all animations call this shared animation triggering function internally.
        The animationEvent variable refers to the JavaScript animation event that will be triggered
        and the className value is the name of the animation that will be applied within the
        CSS code. Element, parentElement and afterElement are provided DOM elements for the animation
        and the onComplete callback will be fired once the animation is fully complete.
      */
      function performAnimation(animationEvent, className, element, parentElement, afterElement, domOperation, doneCallback) {
        var classes = (element.attr('class') || '') + ' ' + className;
        var animationLookup = (' ' + classes).replace(/\s+/g,'.');
        if (!parentElement) {
          parentElement = afterElement ? afterElement.parent() : element.parent();
        }

        var matches = lookup(animationLookup);
        var isClassBased = animationEvent == 'addClass' || animationEvent == 'removeClass';
        var ngAnimateState = element.data(NG_ANIMATE_STATE) || {};

        //skip the animation if animations are disabled, a parent is already being animated,
        //the element is not currently attached to the document body or then completely close
        //the animation if any matching animations are not found at all.
        //NOTE: IE8 + IE9 should close properly (run closeAnimation()) in case a NO animation is not found.
        if (animationsDisabled(element, parentElement) || matches.length === 0) {
          domOperation();
          closeAnimation();
          return;
        }

        var animations = [];
        //only add animations if the currently running animation is not structural
        //or if there is no animation running at all
        if(!ngAnimateState.running || !(isClassBased && ngAnimateState.structural)) {
          forEach(matches, function(animation) {
            //add the animation to the queue to if it is allowed to be cancelled
            if(!animation.allowCancel || animation.allowCancel(element, animationEvent, className)) {
              var beforeFn, afterFn = animation[animationEvent];

              //Special case for a leave animation since there is no point in performing an
              //animation on a element node that has already been removed from the DOM
              if(animationEvent == 'leave') {
                beforeFn = afterFn;
                afterFn = null; //this must be falsy so that the animation is skipped for leave
              } else {
                beforeFn = animation['before' + animationEvent.charAt(0).toUpperCase() + animationEvent.substr(1)];
              }
              animations.push({
                before : beforeFn,
                after : afterFn
              });
            }
          });
        }

        //this would mean that an animation was not allowed so let the existing
        //animation do it's thing and close this one early
        if(animations.length === 0) {
          domOperation();
          fireDoneCallbackAsync();
          return;
        }

        if(ngAnimateState.running) {
          //if an animation is currently running on the element then lets take the steps
          //to cancel that animation and fire any required callbacks
          $timeout.cancel(ngAnimateState.closeAnimationTimeout);
          cleanup(element);
          cancelAnimations(ngAnimateState.animations);
          (ngAnimateState.done || noop)(true);
        }

        //There is no point in perform a class-based animation if the element already contains
        //(on addClass) or doesn't contain (on removeClass) the className being animated.
        //The reason why this is being called after the previous animations are cancelled
        //is so that the CSS classes present on the element can be properly examined.
        if((animationEvent == 'addClass'    && element.hasClass(className)) ||
           (animationEvent == 'removeClass' && !element.hasClass(className))) {
          domOperation();
          fireDoneCallbackAsync();
          return;
        }

        //the ng-animate class does nothing, but it's here to allow for
        //parent animations to find and cancel child animations when needed
        element.addClass(NG_ANIMATE_CLASS_NAME);

        element.data(NG_ANIMATE_STATE, {
          running:true,
          structural:!isClassBased,
          animations:animations,
          done:onBeforeAnimationsComplete
        });

        //first we run the before animations and when all of those are complete
        //then we perform the DOM operation and run the next set of animations
        invokeRegisteredAnimationFns(animations, 'before', onBeforeAnimationsComplete);

        function onBeforeAnimationsComplete(cancelled) {
          domOperation();
          if(cancelled === true) {
            closeAnimation();
            return;
          }

          //set the done function to the final done function
          //so that the DOM event won't be executed twice by accident
          //if the after animation is cancelled as well
          var data = element.data(NG_ANIMATE_STATE);
          if(data) {
            data.done = closeAnimation;
            element.data(NG_ANIMATE_STATE, data);
          }
          invokeRegisteredAnimationFns(animations, 'after', closeAnimation);
        }

        function invokeRegisteredAnimationFns(animations, phase, allAnimationFnsComplete) {
          var endFnName = phase + 'End';
          forEach(animations, function(animation, index) {
            var animationPhaseCompleted = function() {
              progress(index, phase);
            };

            //there are no before functions for enter + move since the DOM
            //operations happen before the performAnimation method fires
            if(phase == 'before' && (animationEvent == 'enter' || animationEvent == 'move')) {
              animationPhaseCompleted();
              return;
            }

            if(animation[phase]) {
              animation[endFnName] = isClassBased ?
                animation[phase](element, className, animationPhaseCompleted) :
                animation[phase](element, animationPhaseCompleted);
            } else {
              animationPhaseCompleted();
            }
          });

          function progress(index, phase) {
            var phaseCompletionFlag = phase + 'Complete';
            var currentAnimation = animations[index];
            currentAnimation[phaseCompletionFlag] = true;
            (currentAnimation[endFnName] || noop)();

            for(var i=0;i<animations.length;i++) {
              if(!animations[i][phaseCompletionFlag]) return;
            }

            allAnimationFnsComplete();
          }
        }

        function fireDoneCallbackAsync() {
          doneCallback && $timeout(doneCallback, 0, false);
        }

        function closeAnimation() {
          if(!closeAnimation.hasBeenRun) {
            closeAnimation.hasBeenRun = true;
            var data = element.data(NG_ANIMATE_STATE);
            if(data) {
              /* only structural animations wait for reflow before removing an
                 animation, but class-based animations don't. An example of this
                 failing would be when a parent HTML tag has a ng-class attribute
                 causing ALL directives below to skip animations during the digest */
              if(isClassBased) {
                cleanup(element);
              } else {
                data.closeAnimationTimeout = $timeout(function() {
                  cleanup(element);
                }, 0, false);
                element.data(NG_ANIMATE_STATE, data);
              }
            }
            fireDoneCallbackAsync();
          }
        }
      }

      function cancelChildAnimations(element) {
        var node = element[0];
        if(node.nodeType != ELEMENT_NODE) {
          return;
        }

        forEach(node.querySelectorAll('.' + NG_ANIMATE_CLASS_NAME), function(element) {
          element = angular.element(element);
          var data = element.data(NG_ANIMATE_STATE);
          if(data) {
            cancelAnimations(data.animations);
            cleanup(element);
          }
        });
      }

      function cancelAnimations(animations) {
        var isCancelledFlag = true;
        forEach(animations, function(animation) {
          if(!animations['beforeComplete']) {
            (animation.beforeEnd || noop)(isCancelledFlag);
          }
          if(!animations['afterComplete']) {
            (animation.afterEnd || noop)(isCancelledFlag);
          }
        });
      }

      function cleanup(element) {
        if(element[0] == $rootElement[0]) {
          if(!rootAnimateState.disabled) {
            rootAnimateState.running = false;
            rootAnimateState.structural = false;
          }
        } else {
          element.removeClass(NG_ANIMATE_CLASS_NAME);
          element.removeData(NG_ANIMATE_STATE);
        }
      }

      function animationsDisabled(element, parentElement) {
        if (rootAnimateState.disabled) return true;

        if(element[0] == $rootElement[0]) {
          return rootAnimateState.disabled || rootAnimateState.running;
        }

        do {
          //the element did not reach the root element which means that it
          //is not apart of the DOM. Therefore there is no reason to do
          //any animations on it
          if(parentElement.length === 0) break;

          var isRoot = parentElement[0] == $rootElement[0];
          var state = isRoot ? rootAnimateState : parentElement.data(NG_ANIMATE_STATE);
          var result = state && (!!state.disabled || !!state.running);
          if(isRoot || result) {
            return result;
          }

          if(isRoot) return true;
        }
        while(parentElement = parentElement.parent());

        return true;
      }
    }]);

    $animateProvider.register('', ['$window', '$sniffer', '$timeout', function($window, $sniffer, $timeout) {
      // Detect proper transitionend/animationend event names.
      var CSS_PREFIX = '', TRANSITION_PROP, TRANSITIONEND_EVENT, ANIMATION_PROP, ANIMATIONEND_EVENT;

      // If unprefixed events are not supported but webkit-prefixed are, use the latter.
      // Otherwise, just use W3C names, browsers not supporting them at all will just ignore them.
      // Note: Chrome implements `window.onwebkitanimationend` and doesn't implement `window.onanimationend`
      // but at the same time dispatches the `animationend` event and not `webkitAnimationEnd`.
      // Register both events in case `window.onanimationend` is not supported because of that,
      // do the same for `transitionend` as Safari is likely to exhibit similar behavior.
      // Also, the only modern browser that uses vendor prefixes for transitions/keyframes is webkit
      // therefore there is no reason to test anymore for other vendor prefixes: http://caniuse.com/#search=transition
      if (window.ontransitionend === undefined && window.onwebkittransitionend !== undefined) {
        CSS_PREFIX = '-webkit-';
        TRANSITION_PROP = 'WebkitTransition';
        TRANSITIONEND_EVENT = 'webkitTransitionEnd transitionend';
      } else {
        TRANSITION_PROP = 'transition';
        TRANSITIONEND_EVENT = 'transitionend';
      }

      if (window.onanimationend === undefined && window.onwebkitanimationend !== undefined) {
        CSS_PREFIX = '-webkit-';
        ANIMATION_PROP = 'WebkitAnimation';
        ANIMATIONEND_EVENT = 'webkitAnimationEnd animationend';
      } else {
        ANIMATION_PROP = 'animation';
        ANIMATIONEND_EVENT = 'animationend';
      }

      var DURATION_KEY = 'Duration';
      var PROPERTY_KEY = 'Property';
      var DELAY_KEY = 'Delay';
      var ANIMATION_ITERATION_COUNT_KEY = 'IterationCount';
      var NG_ANIMATE_PARENT_KEY = '$$ngAnimateKey';
      var NG_ANIMATE_CSS_DATA_KEY = '$$ngAnimateCSS3Data';
      var NG_ANIMATE_FALLBACK_CLASS_NAME = 'ng-animate-start';
      var NG_ANIMATE_FALLBACK_ACTIVE_CLASS_NAME = 'ng-animate-active';

      var lookupCache = {};
      var parentCounter = 0;

      var animationReflowQueue = [], animationTimer, timeOut = false;
      function afterReflow(callback) {
        animationReflowQueue.push(callback);
        $timeout.cancel(animationTimer);
        animationTimer = $timeout(function() {
          forEach(animationReflowQueue, function(fn) {
            fn();
          });
          animationReflowQueue = [];
          animationTimer = null;
          lookupCache = {};
        }, 10, false);
      }

      function applyStyle(node, style) {
        var oldStyle = node.getAttribute('style') || '';
        var newStyle = (oldStyle.length > 0 ? '; ' : '') + style;
        node.setAttribute('style', newStyle);
        return oldStyle;
      }

      function getElementAnimationDetails(element, cacheKey) {
        var data = cacheKey ? lookupCache[cacheKey] : null;
        if(!data) {
          var transitionDuration = 0;
          var transitionDelay = 0;
          var animationDuration = 0;
          var animationDelay = 0;
          var transitionDelayStyle;
          var animationDelayStyle;
          var transitionDurationStyle;
          var transitionPropertyStyle;

          //we want all the styles defined before and after
          forEach(element, function(element) {
            if (element.nodeType == ELEMENT_NODE) {
              var elementStyles = $window.getComputedStyle(element) || {};

              transitionDurationStyle = elementStyles[TRANSITION_PROP + DURATION_KEY];

              transitionDuration = Math.max(parseMaxTime(transitionDurationStyle), transitionDuration);

              transitionPropertyStyle = elementStyles[TRANSITION_PROP + PROPERTY_KEY];

              transitionDelayStyle = elementStyles[TRANSITION_PROP + DELAY_KEY];

              transitionDelay  = Math.max(parseMaxTime(transitionDelayStyle), transitionDelay);

              animationDelayStyle = elementStyles[ANIMATION_PROP + DELAY_KEY];

              animationDelay   = Math.max(parseMaxTime(animationDelayStyle), animationDelay);

              var aDuration  = parseMaxTime(elementStyles[ANIMATION_PROP + DURATION_KEY]);

              if(aDuration > 0) {
                aDuration *= parseInt(elementStyles[ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY], 10) || 1;
              }

              animationDuration = Math.max(aDuration, animationDuration);
            }
          });
          data = {
            total : 0,
            transitionPropertyStyle: transitionPropertyStyle,
            transitionDurationStyle: transitionDurationStyle,
            transitionDelayStyle: transitionDelayStyle,
            transitionDelay: transitionDelay,
            transitionDuration: transitionDuration,
            animationDelayStyle: animationDelayStyle,
            animationDelay: animationDelay,
            animationDuration: animationDuration
          };
          if(cacheKey) {
            lookupCache[cacheKey] = data;
          }
        }
        return data;
      }

      function parseMaxTime(str) {
        var maxValue = 0;
        var values = angular.isString(str) ?
          str.split(/\s*,\s*/) :
          [];
        forEach(values, function(value) {
          maxValue = Math.max(parseFloat(value) || 0, maxValue);
        });
        return maxValue;
      }

      function getCacheKey(element) {
        var parentElement = element.parent();
        var parentID = parentElement.data(NG_ANIMATE_PARENT_KEY);
        if(!parentID) {
          parentElement.data(NG_ANIMATE_PARENT_KEY, ++parentCounter);
          parentID = parentCounter;
        }
        return parentID + '-' + element[0].className;
      }

      function animateSetup(element, className) {
        var cacheKey = getCacheKey(element);
        var eventCacheKey = cacheKey + ' ' + className;
        var stagger = {};
        var ii = lookupCache[eventCacheKey] ? ++lookupCache[eventCacheKey].total : 0;

        if(ii > 0) {
          var staggerClassName = className + '-stagger';
          var staggerCacheKey = cacheKey + ' ' + staggerClassName;
          var applyClasses = !lookupCache[staggerCacheKey];

          applyClasses && element.addClass(staggerClassName);

          stagger = getElementAnimationDetails(element, staggerCacheKey);

          applyClasses && element.removeClass(staggerClassName);
        }

        element.addClass(className);

        var timings = getElementAnimationDetails(element, eventCacheKey);

        /* there is no point in performing a reflow if the animation
           timeout is empty (this would cause a flicker bug normally
           in the page. There is also no point in performing an animation
           that only has a delay and no duration */
        var maxDuration = Math.max(timings.transitionDuration, timings.animationDuration);
        if(maxDuration === 0) {
          element.removeClass(className);
          return false;
        }

        var node = element[0];
        //temporarily disable the transition so that the enter styles
        //don't animate twice (this is here to avoid a bug in Chrome/FF).
        var activeClassName = '';
        if(timings.transitionDuration > 0) {
          element.addClass(NG_ANIMATE_FALLBACK_CLASS_NAME);
          activeClassName += NG_ANIMATE_FALLBACK_ACTIVE_CLASS_NAME + ' ';
          node.style[TRANSITION_PROP + PROPERTY_KEY] = 'none';
        }

        forEach(className.split(' '), function(klass, i) {
          activeClassName += (i > 0 ? ' ' : '') + klass + '-active';
        });

        element.data(NG_ANIMATE_CSS_DATA_KEY, {
          className : className,
          activeClassName : activeClassName,
          maxDuration : maxDuration,
          classes : className + ' ' + activeClassName,
          timings : timings,
          stagger : stagger,
          ii : ii
        });

        return true;
      }

      function animateRun(element, className, activeAnimationComplete) {
        var data = element.data(NG_ANIMATE_CSS_DATA_KEY);
        if(!element.hasClass(className) || !data) {
          activeAnimationComplete();
          return;
        }

        var node = element[0];
        var timings = data.timings;
        var stagger = data.stagger;
        var maxDuration = data.maxDuration;
        var activeClassName = data.activeClassName;
        var maxDelayTime = Math.max(timings.transitionDelay, timings.animationDelay) * 1000;
        var startTime = Date.now();
        var css3AnimationEvents = ANIMATIONEND_EVENT + ' ' + TRANSITIONEND_EVENT;
        var formerStyle;
        var ii = data.ii;

        var applyFallbackStyle, style = '';
        if(timings.transitionDuration > 0) {
          node.style[TRANSITION_PROP + PROPERTY_KEY] = '';

          var propertyStyle = timings.transitionPropertyStyle;
          if(propertyStyle.indexOf('all') == -1) {
            applyFallbackStyle = true;
            var fallbackProperty = $sniffer.msie ? '-ms-zoom' : 'clip';
            style += CSS_PREFIX + 'transition-property: ' + propertyStyle + ', ' + fallbackProperty + '; ';
            style += CSS_PREFIX + 'transition-duration: ' + timings.transitionDurationStyle + ', ' + timings.transitionDuration + 's; ';
          }
        }

        if(ii > 0) {
          if(stagger.transitionDelay > 0 && stagger.transitionDuration === 0) {
            var delayStyle = timings.transitionDelayStyle;
            if(applyFallbackStyle) {
              delayStyle += ', ' + timings.transitionDelay + 's';
            }

            style += CSS_PREFIX + 'transition-delay: ' +
                     prepareStaggerDelay(delayStyle, stagger.transitionDelay, ii) + '; ';
          }

          if(stagger.animationDelay > 0 && stagger.animationDuration === 0) {
            style += CSS_PREFIX + 'animation-delay: ' +
                     prepareStaggerDelay(timings.animationDelayStyle, stagger.animationDelay, ii) + '; ';
          }
        }

        if(style.length > 0) {
          formerStyle = applyStyle(node, style);
        }

        element.on(css3AnimationEvents, onAnimationProgress);
        element.addClass(activeClassName);

        // This will automatically be called by $animate so
        // there is no need to attach this internally to the
        // timeout done method.
        return function onEnd(cancelled) {
          element.off(css3AnimationEvents, onAnimationProgress);
          element.removeClass(activeClassName);
          animateClose(element, className);
          if(formerStyle != null) {
            formerStyle.length > 0 ?
              node.setAttribute('style', formerStyle) :
              node.removeAttribute('style');
          }
        };

        function onAnimationProgress(event) {
          event.stopPropagation();
          var ev = event.originalEvent || event;
          var timeStamp = ev.$manualTimeStamp || ev.timeStamp || Date.now();
          /* $manualTimeStamp is a mocked timeStamp value which is set
           * within browserTrigger(). This is only here so that tests can
           * mock animations properly. Real events fallback to event.timeStamp,
           * or, if they don't, then a timeStamp is automatically created for them.
           * We're checking to see if the timeStamp surpasses the expected delay,
           * but we're using elapsedTime instead of the timeStamp on the 2nd
           * pre-condition since animations sometimes close off early */
          if(Math.max(timeStamp - startTime, 0) >= maxDelayTime && ev.elapsedTime >= maxDuration) {
            activeAnimationComplete();
          }
        }
      }

      function prepareStaggerDelay(delayStyle, staggerDelay, index) {
        var style = '';
        forEach(delayStyle.split(','), function(val, i) {
          style += (i > 0 ? ',' : '') +
                   (index * staggerDelay + parseInt(val, 10)) + 's';
        });
        return style;
      }

      function animateBefore(element, className) {
        if(animateSetup(element, className)) {
          return function(cancelled) {
            cancelled && animateClose(element, className);
          };
        }
      }

      function animateAfter(element, className, afterAnimationComplete) {
        if(element.data(NG_ANIMATE_CSS_DATA_KEY)) {
          return animateRun(element, className, afterAnimationComplete);
        } else {
          animateClose(element, className);
          afterAnimationComplete();
        }
      }

      function animate(element, className, animationComplete) {
        //If the animateSetup function doesn't bother returning a
        //cancellation function then it means that there is no animation
        //to perform at all
        var preReflowCancellation = animateBefore(element, className);
        if(!preReflowCancellation) {
          animationComplete();
          return;
        }

        //There are two cancellation functions: one is before the first
        //reflow animation and the second is during the active state
        //animation. The first function will take care of removing the
        //data from the element which will not make the 2nd animation
        //happen in the first place
        var cancel = preReflowCancellation;
        afterReflow(function() {
          //once the reflow is complete then we point cancel to
          //the new cancellation function which will remove all of the
          //animation properties from the active animation
          cancel = animateAfter(element, className, animationComplete);
        });

        return function(cancelled) {
          (cancel || noop)(cancelled);
        };
      }

      function animateClose(element, className) {
        element.removeClass(className);
        element.removeClass(NG_ANIMATE_FALLBACK_CLASS_NAME);
        element.removeData(NG_ANIMATE_CSS_DATA_KEY);
      }

      return {
        allowCancel : function(element, animationEvent, className) {
          //always cancel the current animation if it is a
          //structural animation
          var oldClasses = (element.data(NG_ANIMATE_CSS_DATA_KEY) || {}).classes;
          if(!oldClasses || ['enter','leave','move'].indexOf(animationEvent) >= 0) {
            return true;
          }

          var parentElement = element.parent();
          var clone = angular.element(element[0].cloneNode());

          //make the element super hidden and override any CSS style values
          clone.attr('style','position:absolute; top:-9999px; left:-9999px');
          clone.removeAttr('id');
          clone.html('');

          forEach(oldClasses.split(' '), function(klass) {
            clone.removeClass(klass);
          });

          var suffix = animationEvent == 'addClass' ? '-add' : '-remove';
          clone.addClass(suffixClasses(className, suffix));
          parentElement.append(clone);

          var timings = getElementAnimationDetails(clone);
          clone.remove();

          return Math.max(timings.transitionDuration, timings.animationDuration) > 0;
        },

        enter : function(element, animationCompleted) {
          return animate(element, 'ng-enter', animationCompleted);
        },

        leave : function(element, animationCompleted) {
          return animate(element, 'ng-leave', animationCompleted);
        },

        move : function(element, animationCompleted) {
          return animate(element, 'ng-move', animationCompleted);
        },

        beforeAddClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore(element, suffixClasses(className, '-add'));
          if(cancellationMethod) {
            afterReflow(animationCompleted);
            return cancellationMethod;
          }
          animationCompleted();
        },

        addClass : function(element, className, animationCompleted) {
          return animateAfter(element, suffixClasses(className, '-add'), animationCompleted);
        },

        beforeRemoveClass : function(element, className, animationCompleted) {
          var cancellationMethod = animateBefore(element, suffixClasses(className, '-remove'));
          if(cancellationMethod) {
            afterReflow(animationCompleted);
            return cancellationMethod;
          }
          animationCompleted();
        },

        removeClass : function(element, className, animationCompleted) {
          return animateAfter(element, suffixClasses(className, '-remove'), animationCompleted);
        }
      };

      function suffixClasses(classes, suffix) {
        var className = '';
        classes = angular.isArray(classes) ? classes : classes.split(/\s+/);
        forEach(classes, function(klass, i) {
          if(klass && klass.length > 0) {
            className += (i > 0 ? ' ' : '') + klass + suffix;
          }
        });
        return className;
      }
    }]);
  }]);


})(window, window.angular);
angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function () {
            return hostElPos.left;
          },
          right: function () {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function () {
            return hostElPos.top;
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);

angular.module('sy.bootstrap.timepicker', 
['ui.bootstrap.position'])

.constant('syTimepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  showMeridian: true,
  showSeconds: true,
  meridians: null,
  readonlyInput: false,
  mousewheel: true
})

.controller('syTimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'syTimepickerConfig', 
  function($scope, $attrs, $parse, $log, $locale, syTimepickerConfig) {
  var selected = new Date(),
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : syTimepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

  $scope.showSeconds = getValue($attrs.showSeconds, syTimepickerConfig.showSeconds);

  function getValue(value, defaultValue) {
    return angular.isDefined(value) ? $scope.$parent.$eval(value) : defaultValue;
  }

  this.init = function( ngModelCtrl_, inputs ) {
    ngModelCtrl = ngModelCtrl_;
    ngModelCtrl.$render = this.render;

    var hoursInputEl = inputs.eq(0),
        minutesInputEl = inputs.eq(1),
        secondsInputEl = inputs.eq(2);

    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : syTimepickerConfig.mousewheel;
    if ( mousewheel ) {
      this.setupMousewheelEvents( hoursInputEl, minutesInputEl, secondsInputEl );
    }

    $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? scope.$parent.$eval($attrs.readonlyInput) : syTimepickerConfig.readonlyInput;
    this.setupInputEvents( hoursInputEl, minutesInputEl, secondsInputEl );
  };

  var hourStep = syTimepickerConfig.hourStep;
  if ($attrs.hourStep) {
    $scope.$parent.$watch($parse($attrs.hourStep), function(value) {
      hourStep = parseInt(value, 10);
    });
  }

  var minuteStep = syTimepickerConfig.minuteStep;
  if ($attrs.minuteStep) {
    $scope.$parent.$watch($parse($attrs.minuteStep), function(value) {
      minuteStep = parseInt(value, 10);
    });
  }

  var secondStep = syTimepickerConfig.secondStep;
  if ($attrs.secondStep) {
    $scope.$parent.$watch($parse($attrs.secondStep), function(value) {
      secondStep = parseInt(value, 10);
    });
  }

  // 12H / 24H mode
  $scope.showMeridian = syTimepickerConfig.showMeridian;
  if ($attrs.showMeridian) {
    $scope.$parent.$watch($parse($attrs.showMeridian), function(value) {
      $scope.showMeridian = !!value;

      if ( ngModelCtrl.$error.time ) {
        // Evaluate from template
        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate();
        if (angular.isDefined( hours ) && angular.isDefined( minutes )) {
          selected.setHours( hours );
          refresh();
        }
      } else {
        updateTemplate();
      }
    });
  }

  // Get $scope.hours in 24H mode if valid
  function getHoursFromTemplate ( ) {
    var hours = parseInt( $scope.hours, 10 );
    var valid = ( $scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
    if ( !valid ) {
      return undefined;
    }

    if ( $scope.showMeridian ) {
      if ( hours === 12 ) {
        hours = 0;
      }
      if ( $scope.meridian === meridians[1] ) {
        hours = hours + 12;
      }
    }
    return hours;
  }

  function getMinutesFromTemplate() {
    var minutes = parseInt($scope.minutes, 10);
    return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
  }

  function getSecondsFromTemplate() {
    var seconds = parseInt($scope.seconds, 10);
    return ( seconds >= 0 && seconds < 60 ) ? seconds : undefined;
  }

  function pad( value ) {
    return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
  }

  // Respond on mousewheel spin
  this.setupMousewheelEvents = function( hoursInputEl, minutesInputEl , secondsInputEl ) {
    var isScrollingUp = function(e) {
      if (e.originalEvent) {
        e = e.originalEvent;
      }
      //pick correct delta variable depending on event
      var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
      return (e.detail || delta > 0);
    };

    hoursInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementHours() : $scope.decrementHours() );
      e.preventDefault();
    });

    minutesInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementMinutes() : $scope.decrementMinutes() );
      e.preventDefault();
    });

    secondsInputEl.bind('mousewheel wheel', function(e) {
      $scope.$apply( (isScrollingUp(e)) ? $scope.incrementSeconds() : $scope.decrementSeconds() );
      e.preventDefault();
    });
  };

  this.setupInputEvents = function( hoursInputEl, minutesInputEl, secondsInputEl ) {
    if ( $scope.readonlyInput ) {
      $scope.updateHours = angular.noop;
      $scope.updateMinutes = angular.noop;
      $scope.updateSeconds = angular.noop;
      return;
    }

    var invalidate = function(invalidHours, invalidMinutes, invalidSeconds) {
      ngModelCtrl.$setViewValue( null );
      ngModelCtrl.$setValidity('time', false);
      if (angular.isDefined(invalidHours)) {
        $scope.invalidHours = invalidHours;
      }
      if (angular.isDefined(invalidMinutes)) {
        $scope.invalidMinutes = invalidMinutes;
      }
      if (angular.isDefined(invalidSeconds)) {
        $scope.invalidSeconds = invalidSeconds;
      }
    };

    $scope.updateHours = function() {
      var hours = getHoursFromTemplate();

      if ( angular.isDefined(hours) ) {
        selected.setHours( hours );
        refresh( 'h' );
      } else {
        invalidate(true);
      }
    };

    hoursInputEl.bind('blur', function(e) {
      if ( !$scope.validHours && $scope.hours < 10) {
        $scope.$apply( function() {
          $scope.hours = pad( $scope.hours );
        });
      }
    });

    $scope.updateMinutes = function() {
      var minutes = getMinutesFromTemplate();

      if ( angular.isDefined(minutes) ) {
        selected.setMinutes( minutes );
        refresh( 'm' );
      } else {
        invalidate(undefined, true);
      }
    };

    minutesInputEl.bind('blur', function(e) {
      if ( !$scope.invalidMinutes && $scope.minutes < 10 ) {
        $scope.$apply( function() {
          $scope.minutes = pad( $scope.minutes );
        });
      }
    });

    $scope.updateSeconds = function() {
      var seconds = getSecondsFromTemplate();

      if ( angular.isDefined(seconds) ) {
        selected.setSeconds( seconds );
        refresh( 's' );
      } else {
        invalidate(undefined, true);
      }
    };

    secondsInputEl.bind('blur', function(e) {
      if ( !$scope.invalidSeconds && $scope.seconds < 10 ) {
        $scope.$apply( function() {
          $scope.seconds = pad( $scope.seconds );
        });
      }
    });
  };

  this.render = function() {
    var date = ngModelCtrl.$modelValue ? new Date( ngModelCtrl.$modelValue ) : null;

    if ( isNaN(date) ) {
      ngModelCtrl.$setValidity('time', false);
      $log.error('syTimepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
    } else {
      if ( date ) {
        selected = date;
      }
      makeValid();
      updateTemplate();
    }
  };

  // Call internally when we know that model is valid.
  function refresh( keyboardChange ) {
    makeValid();
    ngModelCtrl.$setViewValue( new Date(selected) );
    updateTemplate( keyboardChange );
  }

  function makeValid() {
    ngModelCtrl.$setValidity('time', true);
    $scope.invalidHours = false;
    $scope.invalidMinutes = false;
    $scope.invalidSeconds = false;
  }

  function updateTemplate( keyboardChange ) {
    var hours = selected.getHours(), minutes = selected.getMinutes(), seconds = selected.getSeconds();

    if ( $scope.showMeridian ) {
      hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
    }

    $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
    $scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
    $scope.seconds = keyboardChange === 's' ? seconds : pad(seconds);
    $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
  }

  function addMinutes( minutes ) {
    var dt = new Date( selected.getTime() + minutes * 60000 );
    selected.setHours( dt.getHours(), dt.getMinutes() );
    refresh();
  }

  function addSeconds( seconds ) {
    var dt = new Date( selected.getTime() + seconds * 1000 );
    selected.setHours( dt.getHours(), dt.getMinutes(), dt.getSeconds());
    refresh();
  }

  $scope.incrementHours = function() {
    addMinutes( hourStep * 60);
  };
  $scope.decrementHours = function() {
    addMinutes( - hourStep * 60);
  };
  $scope.incrementMinutes = function() {
    addMinutes( minuteStep);
  };
  $scope.decrementMinutes = function() {
    addMinutes( - minuteStep);
  };
  $scope.incrementSeconds = function() {
    addSeconds( secondStep );
  };
  $scope.decrementSeconds = function() {
    addSeconds( - secondStep );
  };
  $scope.toggleMeridian = function() {
    addMinutes( 12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1) );
  };
}])

.directive('syTimepicker', function () {
  return {
    restrict: 'EA',
    require: ['syTimepicker', '?^ngModel'],
    controller:'syTimepickerController',
    replace: true,
    scope: {},
    templateUrl: 'template/syTimepicker/timepicker.html',
    link: function(sscope, element, attrs, ctrls) {
      var syTimepickerCtrl = ctrls[0], ngModel = ctrls[1];

      if ( ngModel ) {
        syTimepickerCtrl.init( ngModel, element.find('input') );
      }
    }
  };
})

.constant('syTimepickerPopupConfig', {
  timeFormat: 'HH:mm:ss',
  appendToBody: false
})

.directive('syTimepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'syTimepickerPopupConfig', 'syTimepickerConfig',
function ($compile, $parse, $document, $position, dateFilter, syTimepickerPopupConfig, syTimepickerConfig) {
  return {
    restrict: 'EA',
    require: 'ngModel',
    priority: 1,
    link: function(originalScope, element, attrs, ngModel) {
      var scope = originalScope.$new(), // create a child scope so we are not polluting original one
          timeFormat,
          appendToBody = angular.isDefined(attrs.syTimepickerAppendToBody) ? originalScope.$eval(attrs.syTimepickerAppendToBody) : syTimepickerPopupConfig.appendToBody;

      attrs.$observe('syTimepickerPopup', function(value) {
          timeFormat = value || syTimepickerPopupConfig.timeFormat;
          ngModel.$render();
      });

      originalScope.$on('$destroy', function() {
        $popup.remove();
        scope.$destroy();
      });

      var getIsOpen, setIsOpen;
      if ( attrs.isOpen ) {
        getIsOpen = $parse(attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        originalScope.$watch(getIsOpen, function updateOpen(value) {
          scope.isOpen = !! value;
        });
      }
      scope.isOpen = getIsOpen ? getIsOpen(originalScope) : false; // Initial state

      function setOpen( value ) {
        if (setIsOpen) {
          setIsOpen(originalScope, !!value);
        } else {
          scope.isOpen = !!value;
        }
      }

      var documentClickBind = function(event) {
        if (scope.isOpen && event.target !== element[0]) {
          scope.$apply(function() {
            setOpen(false);
          });
        }
      };

      var elementFocusBind = function() {
        scope.$apply(function() {
          setOpen( true );
        });
      };

      // popup element used to display calendar
      var popupEl = angular.element('<div sy-timepicker-popup-wrap><div sy-timepicker></div></div>');
      popupEl.attr({
        'ng-model': 'date',
        'ng-change': 'dateSelection()'
      });
      var syTimepickerEl = angular.element(popupEl.children()[0]),
          syTimepickerOptions = {};
      if (attrs.syTimepickerOptions) {
        syTimepickerOptions = originalScope.$eval(attrs.syTimepickerOptions);
        syTimepickerEl.attr(angular.extend({}, syTimepickerOptions));
      }

      function parseTime(viewValue) {
        if (!viewValue) {
          ngModel.$setValidity('time', true);
          return null;
        } else if (angular.isDate(viewValue)) {
          ngModel.$setValidity('time', true);
          return viewValue;
        } else if (angular.isString(viewValue)) {
          var date = new moment('1970-01-01 ' + viewValue, 'YYYY-MM-DD ' + timeFormat);

          if (!date.isValid()) {
            ngModel.$setValidity('time', false);
            return undefined;
          } else {
            ngModel.$setValidity('time', true);
            return date.toDate();
          }
        } else {
          ngModel.$setValidity('time', false);
          return undefined;
        }
      }
      ngModel.$parsers.unshift(parseTime);

      // Inner change
      scope.dateSelection = function(dt) {
        if (angular.isDefined(dt)) {
          scope.date = dt;
        }
        ngModel.$setViewValue(scope.date);
        ngModel.$render();
      };

      element.bind('input change keyup', function() {
        scope.$apply(function() {
          scope.date = ngModel.$modelValue;
        });
      });

      // Outter change
      ngModel.$render = function() {
        var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, timeFormat) : '';
        element.val(date);
        scope.date = ngModel.$modelValue;
      };

      function addWatchableAttribute(attribute, scopeProperty, syTimepickerAttribute) {
        if (attribute) {
          originalScope.$watch($parse(attribute), function(value){
            scope[scopeProperty] = value;
          });
          syTimepickerEl.attr(syTimepickerAttribute || scopeProperty, scopeProperty);
        }
      }

      if (attrs.showMeridian) {
        syTimepickerEl.attr('show-meridian', attrs.showMeridian);
      }

      if (attrs.showSeconds) {
        syTimepickerEl.attr('show-seconds', attrs.showSeconds);
      }

      function updatePosition() {
        scope.position = appendToBody ? $position.offset(element) : $position.position(element);
        scope.position.top = scope.position.top + element.prop('offsetHeight');
      }

      var documentBindingInitialized = false, elementFocusInitialized = false;
      scope.$watch('isOpen', function(value) {
        if (value) {
          updatePosition();
          $document.bind('click', documentClickBind);
          if(elementFocusInitialized) {
            element.unbind('focus', elementFocusBind);
          }
          element[0].focus();
          documentBindingInitialized = true;
        } else {
          if(documentBindingInitialized) {
            $document.unbind('click', documentClickBind);
          }
          element.bind('focus', elementFocusBind);
          elementFocusInitialized = true;
        }

        if ( setIsOpen ) {
          setIsOpen(originalScope, value);
        }
      });

      var $popup = $compile(popupEl)(scope);
      if ( appendToBody ) {
        $document.find('body').append($popup);
      } else {
        element.after($popup);
      }
    }
  };
}])

.directive('syTimepickerPopupWrap', function() {
  return {
    restrict:'EA',
    replace: true,
    transclude: true,
    templateUrl: 'template/syTimepicker/popup.html',
    link:function (scope, element, attrs) {
      element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
    }
  };
});

angular.module("template/syTimepicker/timepicker.html", []).run(["$templateCache",
  function($templateCache) {
    $templateCache.put("template/syTimepicker/timepicker.html",
      "<table>\n" +
      "	<tbody>\n" +
      "		<tr class=\"text-center\">\n" +
      "			<td><a ng-click=\"incrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
      "			<td>&nbsp;</td>\n" +
      "			<td><a ng-click=\"incrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
      "     <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
      "     <td ng-show=\"showSeconds\"><a ng-click=\"incrementSeconds()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n" +
      "			<td ng-show=\"showMeridian\"></td>\n" +
      "		</tr>\n" +
      "		<tr>\n" +
      "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
      "				<input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
      "			</td>\n" +
      "			<td>:</td>\n" +
      "			<td style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
      "				<input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
      "			</td>\n" +
      "     <td ng-show=\"showSeconds\">:</td>\n" +
      "     <td ng-show=\"showSeconds\" style=\"width:50px;\" class=\"form-group\" ng-class=\"{'has-error': invalidSeconds}\" ng-show=\"showSeconds\">\n" +
      "       <input type=\"text\" ng-model=\"seconds\" ng-change=\"updateSeconds()\" class=\"form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\">\n" +
      "     </td>\n" +
      "			<td ng-show=\"showMeridian\"><button type=\"button\" class=\"btn btn-default text-center\" ng-click=\"toggleMeridian()\">{{meridian}}</button></td>\n" +
      "		</tr>\n" +
      "		<tr class=\"text-center\">\n" +
      "			<td><a ng-click=\"decrementHours()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
      "			<td>&nbsp;</td>\n" +
      "			<td><a ng-click=\"decrementMinutes()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
      "     <td ng-show=\"showSeconds\">&nbsp;</td>\n" +
      "     <td ng-show=\"showSeconds\"><a ng-click=\"decrementSeconds()\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n" +
      "			<td ng-show=\"showMeridian\"></td>\n" +
      "		</tr>\n" +
      "	</tbody>\n" +
      "</table>\n" +
      "");
  }
]);

angular.module("template/syTimepicker/popup.html", []).run(["$templateCache",
  function($templateCache) {
    $templateCache.put("template/syTimepicker/popup.html",
      "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\" style=\"min-width:0px;\">\n" +
      "	<li ng-transclude></li>\n" +
      "</ul>\n" +
      "");
  }
]);
angular.module("dialogs.controllers",["ui.bootstrap.modal"]).controller("errorDialogCtrl",["$scope","$modalInstance","msg",function(o,a,l){o.msg=angular.isDefined(l)?l:"An unknown error has occurred.",o.close=function(){a.close()}}]).controller("waitDialogCtrl",["$scope","$modalInstance","$timeout","msg","progress",function(o,a,l,n,e){o.msg=angular.isDefined(n)?n:"Waiting on operation to complete.",o.progress=angular.isDefined(e)?e:100,o.$on("dialogs.wait.complete",function(){l(function(){a.close()})}),o.$on("dialogs.wait.message",function(a,l){o.msg=angular.isDefined(l.msg)?l.msg:o.msg}),o.$on("dialogs.wait.progress",function(a,l){o.msg=angular.isDefined(l.msg)?l.msg:o.msg,o.progress=angular.isDefined(l.progress)?l.progress:o.progress}),o.getProgress=function(){return{width:o.progress+"%"}}}]).controller("notifyDialogCtrl",["$scope","$modalInstance","header","msg",function(o,a,l,n){o.header=angular.isDefined(l)?l:"Notification",o.msg=angular.isDefined(n)?n:"Unknown application notification.",o.close=function(){a.close()}}]).controller("confirmDialogCtrl",["$scope","$modalInstance","header","msg",function(o,a,l,n){o.header=angular.isDefined(l)?l:"Confirmation",o.msg=angular.isDefined(n)?n:"Confirmation required.",o.no=function(){a.dismiss("no")},o.yes=function(){a.close("yes")}}]),angular.module("dialogs.services",["ui.bootstrap.modal","dialogs.controllers"]).factory("$dialogs",["$modal",function(o){return{error:function(a){return o.open({templateUrl:"/dialogs/error.html",controller:"errorDialogCtrl",resolve:{msg:function(){return angular.copy(a)}}})},wait:function(a,l){return o.open({templateUrl:"/dialogs/wait.html",controller:"waitDialogCtrl",resolve:{msg:function(){return angular.copy(a)},progress:function(){return angular.copy(l)}}})},notify:function(a,l){return o.open({templateUrl:"/dialogs/notify.html",controller:"notifyDialogCtrl",resolve:{header:function(){return angular.copy(a)},msg:function(){return angular.copy(l)}}})},confirm:function(a,l){return o.open({templateUrl:"/dialogs/confirm.html",controller:"confirmDialogCtrl",resolve:{header:function(){return angular.copy(a)},msg:function(){return angular.copy(l)}}})},create:function(a,l,n,e){var i=angular.isDefined(e.key)?e.key:!0,s=angular.isDefined(e.back)?e.back:!0;return o.open({templateUrl:a,controller:l,keyboard:i,backdrop:s,resolve:{data:function(){return angular.copy(n)}}})}}}]),angular.module("dialogs",["dialogs.services"]).run(["$templateCache",function(o){o.put("/dialogs/error.html",'<div class="modal" id="errorModal" role="dialog" aria-Labelledby="errorModalLabel"><div class="modal-dialog"><div class="modal-content"><div class="modal-header dialog-header-error"><button type="button" class="close" ng-click="close()">&times;</button><h4 class="modal-title text-danger"><span class="glyphicon glyphicon-warning-sign"></span> Error</h4></div><div class="modal-body text-danger" ng-bind-html-unsafe="msg"></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="close()">Close</button></div></div></div></div>'),o.put("/dialogs/wait.html",'<div class="modal" id="waitModal" role="dialog" aria-Labelledby="waitModalLabel"><div class="modal-dialog"><div class="modal-content"><div class="modal-header dialog-header-wait"><h4 class="modal-title"><span class="glyphicon glyphicon-time"></span> Please Wait</h4></div><div class="modal-body"><p ng-bind-html-unsafe="msg"></p><div class="progress progress-striped active"><div class="progress-bar progress-bar-info" ng-style="getProgress()"></div><span class="sr-only">{{progress}}% Complete</span></div></div></div></div></div>'),o.put("/dialogs/notify.html",'<div class="modal" id="notifyModal" role="dialog" aria-Labelledby="notifyModalLabel"><div class="modal-dialog"><div class="modal-content"><div class="modal-header dialog-header-notify"><button type="button" class="close" ng-click="close()" class="pull-right">&times;</button><h4 class="modal-title text-info"><span class="glyphicon glyphicon-info-sign"></span> {{header}}</h4></div><div class="modal-body text-info" ng-bind-html-unsafe="msg"></div><div class="modal-footer"><button type="button" class="btn btn-primary" ng-click="close()">OK</button></div></div></div></div>'),o.put("/dialogs/confirm.html",'<div class="modal" id="confirmModal" role="dialog" aria-Labelledby="confirmModalLabel"><div class="modal-dialog"><div class="modal-content"><div class="modal-header dialog-header-confirm"><button type="button" class="close" ng-click="no()">&times;</button><h4 class="modal-title"><span class="glyphicon glyphicon-check"></span> {{header}}</h4></div><div class="modal-body" ng-bind-html-unsafe="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="yes()">Yes</button><button type="button" class="btn btn-primary" ng-click="no()">No</button></div></div></div></div>')}]);
/**
 * @description Google Chart Api Directive Module for AngularJS
 * @version 0.0.11
 * @author Nicolas Bouillon <nicolas@bouil.org>
 * @author GitHub contributors
 * @license MIT
 * @year 2013
 */
(function (document, window, angular) {
    'use strict';

    angular.module('googlechart', [])

        .value('googleChartApiConfig', {
            version: '1',
            optionalSettings: {
                packages: ['corechart']
            }
        })

        .provider('googleJsapiUrl', function () {
            var protocol = 'https:';
            var url = '//www.google.com/jsapi';

            this.setProtocol = function(newProtocol) {
                protocol = newProtocol;
            };

            this.setUrl = function(newUrl) {
                url = newUrl;
            };

            this.$get = function() {
                return (protocol ? protocol : '') + url;
            };
        })
        .factory('googleChartApiPromise', ['$rootScope', '$q', 'googleChartApiConfig', 'googleJsapiUrl', function ($rootScope, $q, apiConfig, googleJsapiUrl) {
            var apiReady = $q.defer();
            var onLoad = function () {
                // override callback function
                var settings = {
                    callback: function () {
                        var oldCb = apiConfig.optionalSettings.callback;
                        $rootScope.$apply(function () {
                            apiReady.resolve();
                        });

                        if (angular.isFunction(oldCb)) {
                            oldCb.call(this);
                        }
                    }
                };

                settings = angular.extend({}, apiConfig.optionalSettings, settings);

                window.google.load('visualization', apiConfig.version, settings);
            };
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');

            script.setAttribute('type', 'text/javascript');
            script.src = googleJsapiUrl;

            if (script.addEventListener) { // Standard browsers (including IE9+)
                script.addEventListener('load', onLoad, false);
            } else { // IE8 and below
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        onLoad();
                    }
                };
            }

            head.appendChild(script);

            return apiReady.promise;
        }])
        .directive('googleChart', ['$timeout', '$window', '$rootScope', 'googleChartApiPromise', function ($timeout, $window, $rootScope, googleChartApiPromise) {
            return {
                restrict: 'A',
                scope: {
                    beforeDraw: '&',
                    chart: '=chart',
                    onReady: '&',
                    onSelect: '&',
                    select: '&'
                },
                link: function ($scope, $elm, $attrs) {
                    /* Watches, to refresh the chart when its data, formatters, options, view,
                        or type change. All other values intentionally disregarded to avoid double
                        calls to the draw function. Please avoid making changes to these objects
                        directly from this directive.*/
                    $scope.$watch(function () {
                        if ($scope.chart) {
                            return {
                                customFormatters: $scope.chart.customFormatters,
                                data: $scope.chart.data,
                                formatters: $scope.chart.formatters,
                                options: $scope.chart.options,
                                type: $scope.chart.type,
                                view: $scope.chart.view
                            };
                        }
                        return $scope.chart;
                    }, function () {
                        drawAsync();
                    }, true); // true is for deep object equality checking

                    // Redraw the chart if the window is resized
                    var resizeHandler = $rootScope.$on('resizeMsg', function () {
                        $timeout(function () {
                            // Not always defined yet in IE so check
                            if($scope.chartWrapper) {
                                drawAsync();
                            }
                        });
                    });

                    //Cleanup resize handler.
                    $scope.$on('$destroy', function () {
                        resizeHandler();
                    });

                    // Keeps old formatter configuration to compare against
                    $scope.oldChartFormatters = {};

                    function applyFormat(formatType, formatClass, dataTable) {

                        if (typeof($scope.chart.formatters[formatType]) != 'undefined') {
                            if (!angular.equals($scope.chart.formatters[formatType], $scope.oldChartFormatters[formatType])) {
                                $scope.oldChartFormatters[formatType] = $scope.chart.formatters[formatType];
                                $scope.formatters[formatType] = [];

                                if (formatType === 'color') {
                                    for (var cIdx = 0; cIdx < $scope.chart.formatters[formatType].length; cIdx++) {
                                        var colorFormat = new formatClass();

                                        for (i = 0; i < $scope.chart.formatters[formatType][cIdx].formats.length; i++) {
                                            var data = $scope.chart.formatters[formatType][cIdx].formats[i];

                                            if (typeof(data.fromBgColor) != 'undefined' && typeof(data.toBgColor) != 'undefined')
                                                colorFormat.addGradientRange(data.from, data.to, data.color, data.fromBgColor, data.toBgColor);
                                            else
                                                colorFormat.addRange(data.from, data.to, data.color, data.bgcolor);
                                        }

                                        $scope.formatters[formatType].push(colorFormat)
                                    }
                                } else {

                                    for (var i = 0; i < $scope.chart.formatters[formatType].length; i++) {
                                        $scope.formatters[formatType].push(new formatClass(
                                            $scope.chart.formatters[formatType][i])
                                        );
                                    }
                                }
                            }


                            //apply formats to dataTable
                            for (i = 0; i < $scope.formatters[formatType].length; i++) {
                                if ($scope.chart.formatters[formatType][i].columnNum < dataTable.getNumberOfColumns())
                                    $scope.formatters[formatType][i].format(dataTable, $scope.chart.formatters[formatType][i].columnNum);
                            }


                            //Many formatters require HTML tags to display special formatting
                            if (formatType === 'arrow' || formatType === 'bar' || formatType === 'color')
                                $scope.chart.options.allowHtml = true;
                        }
                    }

                    function draw() {
                        if (!draw.triggered && ($scope.chart != undefined)) {
                            draw.triggered = true;
                            $timeout(function () {

                                if (typeof ($scope.chartWrapper) == 'undefined') {
                                    var chartWrapperArgs = {
                                        chartType: $scope.chart.type,
                                        dataTable: $scope.chart.data,
                                        view: $scope.chart.view,
                                        options: $scope.chart.options,
                                        containerId: $elm[0]
                                    };

                                    $scope.chartWrapper = new google.visualization.ChartWrapper(chartWrapperArgs);
                                    google.visualization.events.addListener($scope.chartWrapper, 'ready', function () {
                                        $scope.chart.displayed = true;
                                        $scope.$apply(function (scope) {
                                            scope.onReady({ chartWrapper: scope.chartWrapper });
                                        });
                                    });
                                    google.visualization.events.addListener($scope.chartWrapper, 'error', function (err) {
                                        console.log("Chart not displayed due to error: " + err.message + ". Full error object follows.");
                                        console.log(err);
                                    });
                                    google.visualization.events.addListener($scope.chartWrapper, 'select', function () {
                                        var selectedItem = $scope.chartWrapper.getChart().getSelection()[0];
                                        $scope.$apply(function () {
                                            if ($attrs.select) {
                                                console.log('Angular-Google-Chart: The \'select\' attribute is deprecated and will be removed in a future release.  Please use \'onSelect\'.');
                                                $scope.select({ selectedItem: selectedItem });
                                            }
                                            else {
                                                $scope.onSelect({ selectedItem: selectedItem });
                                            }
                                        });
                                    });
                                }
                                else {
                                    $scope.chartWrapper.setChartType($scope.chart.type);
                                    $scope.chartWrapper.setDataTable($scope.chart.data);
                                    $scope.chartWrapper.setView($scope.chart.view);
                                    $scope.chartWrapper.setOptions($scope.chart.options);
                                }

                                if (typeof($scope.formatters) === 'undefined')
                                    $scope.formatters = {};

                                if (typeof($scope.chart.formatters) != 'undefined') {
                                    applyFormat("number", google.visualization.NumberFormat, $scope.chartWrapper.getDataTable());
                                    applyFormat("arrow", google.visualization.ArrowFormat, $scope.chartWrapper.getDataTable());
                                    applyFormat("date", google.visualization.DateFormat, $scope.chartWrapper.getDataTable());
                                    applyFormat("bar", google.visualization.BarFormat, $scope.chartWrapper.getDataTable());
                                    applyFormat("color", google.visualization.ColorFormat, $scope.chartWrapper.getDataTable());
                                }

                                var customFormatters = $scope.chart.customFormatters;
                                if (typeof(customFormatters) != 'undefined') {
                                    for (var name in customFormatters) {
                                        applyFormat(name, customFormatters[name], $scope.chartWrapper.getDataTable());
                                    }
                                }

                                $timeout(function () {
                                    $scope.beforeDraw({ chartWrapper: $scope.chartWrapper });
                                    $scope.chartWrapper.draw();
                                    draw.triggered = false;
                                });
                            }, 0, true);
                        }
                    }

                    function drawAsync() {
                        googleChartApiPromise.then(function () {
                            draw();
                        })
                    }
                }
            };
        }])

        .run(['$rootScope', '$window', function ($rootScope, $window) {
            angular.element($window).bind('resize', function () {
                $rootScope.$emit('resizeMsg');
            });
        }]);

})(document, window, window.angular);



var EventValidator = Class.create();


EventValidator.prototype = {
				/**
				 * 
				 * @param eventList
				 * @param event
				 */
				initialize: function(/*List*/ eventList, /*Map*/ event){
					//config
					/*List*/ 	  this.eventList = eventList;
					/*Map*/ 	  this.event 	 = event;			
				},

				/**
				 * 
				 * @param eventList
				 * @param event
				 * @returns {Boolean}
				 */
	/*BOOL*/	isValid : function(/*List*/ eventList, /*Map*/ event){
						var result = true;
						//algoritmo
						
						// recorriendo la lista para saber si los eventos excluyentes estan activos todo el dia (allDay == TRUE)
						if(this.eventList.length == 0){
							result = true;
						}
						else{
							for(var j = 0; j < this.eventList.length; j++){
								if(this.eventList[j].allDay == true){
									if(this.testCase1(j) == true){
										result = false;
										break;
									}
									if(this.testCase2(j) == true){
										result = false;
										break;
									}
									if(this.testCase3(j) == true){
										result = false;
										break;
									}
									if(this.testCase4(j) == true){
										result = false;
										break;
									}
								}	
							}
						}
				  return result;
				},
				 
				 /**
				  * 
				  * @param index  indice del evento excluyente dentro de la lista de eventos.
				  * @returns {Boolean}
				  * @function TESTCASE1 = retorna el true si el evento actual se crea antes del evento excluyente y termina dentro del evento excluyente. (true == ERROR)
				  * 
				  * 		============ Evento Actual =============
				  *  									=========== Evento N =======
				  */
				
 /*BOOL*/	 	testCase1: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start < this.eventList[index].start &&
						this.event.end  > this.eventList[index].start &&
						this.event.end  <= this.eventList[index].end)
						result = true;
					 
					 return result;
				 },
				 
				 /**
				  * 
				  * @param index
				  * @returns {Boolean}
				  * @function TESTCASE2 = retorna true si el evento actual se crea dentro del evento excluyente y termina fuera o dentro del evento excluyente.(true == ERROR)
				  * 
				  * 						   ============ Evento Actual =============
				  *  	=========== Evento N ==========
				  */
				 
/*BOOL*/	 	testCase2: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start > this.eventList[index].start &&
						this.event.start < this.eventList[index].end &&
						this.event.end >= this.eventList[index].end)
						
						result = true;
					 return result;
				 },		
				
				 /**
				  * 
				  * @param index
				  * @returns {Boolean}
				  * @function TESTCASE3 = retorna true si el evento actual se crea fuera del evento excluyente y termina fuera del evento excluyente.(true == ERRRO)
				  * 
				  * 						   ============ Evento Actual =============
				  *  			======================== Evento N ==============================
				  */
				 
/*BOOL*/	 	testCase3: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start >= this.eventList[index].start &&
						this.event.start < this.eventList[index].end &&
						this.event.end > this.eventList[index].start &&
						this.event.end <= this.eventList[index].end)
						 result = true;
					 return result;
				 },	
				 
				 /**
				  * 
				  * @param index
				  * @returns {Boolean}
				  * @function TESTCASE3 = retorna true si el evento actual se crea fuera del evento excluyente y termina fuera del evento excluyente.(true == ERRRO)
				  * 
				  * 		=================== Evento Actual ===========================
				  *  				============ Evento N ================
				  */
				 
/*BOOL*/	 	testCase4: function(/*index de eventList*/index){
					 var result = false;
					 if(this.event.start <= this.eventList[index].start &&
						this.event.end >= this.eventList[index].end)
						 result = true;
					 return result;
				 }	
};























//configuración de las rutas

fibity.manager.app.config(['$routeProvider',function($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl : 'views/login.html',
		controller : 'GTLoginVC'
	}).when('/logout', {
		templateUrl : 'views/logout.html',
		controller : 'GTLogoutVC'
	}).when('/antennas', {
			redirectTo : '/antennas/collection'
	}).when('/antennas/list', {
		templateUrl : 'views/antennas.html',
		controller : 'GTAntennasVC'
	}).when('/antennas/collection', {
		templateUrl : 'views/antennascollection.html',
		controller : 'GTAntennasVC'		
	}).when('/antennas/map', {
		templateUrl : 'views/antennasmap.html',
		controller : 'GTAntennasMapVC'		
	}).when('/billing', {
		templateUrl : 'views/billing.html',
		controller : 'GTBillingVC'
	}).when('/organization', {
		templateUrl : 'views/organization.html',
		controller : 'GTOrganizationsVC'
	}).when('/dashboard', {
		templateUrl : 'views/dashboard.html',
	    controller : 'GTDashboardVC'
	}).when('/infocard', {
		redirectTo : '/infocard/collection'
	}).when('/infocard/collection', {
		templateUrl : 'views/infocardcollection.html',
		controller : 'GTInfoCardsVC'
	}).when('/infocard/list', {
		templateUrl : 'views/infocardlist.html',
		controller : 'GTInfoCardsVC'
	}).when('/campaigns', {
		redirectTo : '/campaigns/collection'
	}).when('/campaigns/collection', {
		templateUrl : 'views/campaignscollection.html',
		controller : 'GTCampaignsVC'
	}).when('/campaigns/list', {
		templateUrl : 'views/campaignslist.html',
		controller : 'GTCampaignsVC'
	}).when('/customers', {
		redirectTo : '/customers/collection'
	}).when('/customers/collection', {
		templateUrl : 'views/customerscollectionview.html',
		controller : 'GTCustomersVC'
	}).when('/customers/list', {
		templateUrl : 'views/customerslistview.html',
		//controller : 'mainController'
	}).when('/schedule',{
		templateUrl : 'views/schedule.html'
	}).otherwise({
		redirectTo : '/organization'
	});
}]).run( ["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    		if(asm.isLogin()){
    			if ( next.templateUrl == "views/login.html" ) {
    			          $location.path( "/" );
    			}
    		}else{
    			if ( next.templateUrl != "views/login.html" ) {
			          $location.path( "/login" );
			}
    		};
    });
 }]);



var ASMEntity = Class.create();


ASMEntity.prototype = {
				initialize: function(){
					//config
					/*Map*/ 	  this._data 				= {};
					/*Map*/ 		this.config 				= {};
							  
					/*String*/ 		this.idKey 				= "id";
					/*String*/ 		this.kindKey 			= "kind";
					/*String*/ 		this.dataKey 			= "data";	
					/*String 		cacheableKey = "_asm_entity_cacheable",
					String 			syncableKey = "_asm_entity_syncableKey",*/
					/*String*/ 		this.cacheTimestampKey 	=  "timestamp";					
				},

//				ASMEntity : function(/*String*/ kind, /*Map*/ data){
//				
//				    this.config[this.kindKey] = kind;
//				    //this.config[cacheableKey] = true;
//				    //this.config[syncableKey] = false;
//				    this.config[this.cacheTimestampKey] = 0;
//				    this.config[this.idKey] = "";
//				    
//				    this._data = data;
//				  },
				  
				init : function(/*String*/ kind, /*Map*/ data){
					    this.config[this.kindKey] = kind;
					    this.config[this.cacheTimestampKey] = 0;
					    this.config[this.idKey] = "";
					    //this.config[cacheableKey] = true;
					    //this.config[syncableKey] = false;
					    this._data = data;
					    return this;
				  }, 
				  
				initWithId : function( /*String*/ kind, /*String*/ id, /*Map*/ data){

					    this.config[this.kindKey] = kind;
					    this.config[this.idKey] = id;
					    this.config[this.cacheTimestampKey] = 0;
					    //this.config[cacheableKey] = true;
					    //this.config[syncableKey] = false;
					    this._data = data;
					    this._data[this.idKey] = id;
					    return this;
				 },
				
				initFromCache : function ( /*String*/ json){
				      /*Map*/ var value = JSON.parse(json);  

				      this.config[this.kindKey] = value[this.kindKey];
				      this.config[this.idKey] = value[this.idKey];
				      this.config[this.cacheTimestampKey] = value[this.cacheTimestampKey];
				      //TODO:
				      
				      //this.config[cacheableKey] = value[cacheableKey];
				      //this.config[syncableKey] = value[syncableKey];

				      this._data = value[this.dataKey];
				      return this;
				      
				},
				  
				initFromEntity : function( /*AMEntity*/ entity){
						 this.initFromCache(entity.json());
				},
				    
				initFromServer : function( /*String*/ kind, /*String*/ id, /*String*/ json){
				        this._data = JSON.decode(json);
				        this.config[this.idKey] = id;
				        this.config[this.kindKey] = kind;
				        //this.config[cacheableKey] = true;
				        //this.config[syncableKey] = true;
				        return this;
				  },
				  
/*int*/ 		getCacheTimestamp : function(){
					   return this.config[this.cacheTimestampKey];
				  },
				  
/*void*/ 		updateCacheTimestamp : function(){
					    this.config[this.cacheTimestampKey] = Date.now();
				},
					  
/*String*/ 		kind : function(){
					    return this.config[this.kindKey];
				  },
					  
/*Future<Map<String,String>>*/ 
			    save : function(){
					    /*ASMFactory*/ //var  model = new ASMFactory();
					    return asm.save(this);    
				  },
					  
					  /*
					   * 
					   */	  
					  
				set id(/*String*/ id){
					  	this.config[this.idKey] = id;
					  	this._data[this.idKey] = id;
				  },
				
/*String*/ 		get id(){ 
						return this.config[this.idKey];

				  },
					  
/*String*/ 		stringForKey : function( /*String*/ key){
						//var v = this._data[key];
						//if(v == undefined ) v = "";
					    return this._data[key];
			      },
					  
/*void*/ 		setStringForKey : function(/*String*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
					  
/*int*/ 			intForKey : function(/*String*/ key){
					    return this._data[key];
				  },
					  
/*void*/ 		setIntForKey : function(/*int*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
/*double*/ 		doubleForKey : function(/*String*/ key){
					    return this._data[key];
				  },
					  
/*void*/ 		setDoubleForKey : function(/*double*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
/*bool*/ 		boolForKey : function(/*String*/ key){
						 return ((this._data[key] == true) || (this._data[key] == false)) ?
							  this._data[key]
						  :
							  undefined;
				  },
					  
/*void*/ 		setBoolForKey : function(/*bool*/ value, /*String*/ key){
					      if ((value == true) || (value == false))
					    	  		this._data[key] = value;
				  },
					  
/*List*/ 		listForKey : function(/*String*/ key){
					      return this._data[key];
				  },
					  
/*void*/ 		setListForKey : function(/*List*/ value, /*String*/ key){
					      this._data[key] = value;
				  },
					  
/*void*/ 		addItemToListForKey : function(/*var*/ item, /*String*/ key){
					    if (this._data[key] == null) this._data[key] = [];
					     this._data[key].push(item);
				  },
					  
/*void*/ 		removeIndexInListForKey : function(/*int*/ index, /*String*/ key){
					     //DART: this._data[key].removeAt(index);
					     index > -1 ? this._data[key].splice(index, 1) : null;
				  },
				  
/*void*/	   removeElementInListForKey : function(/*String*/ element, /*String*/ key){
					     //DART: this._data[key].removeAt(index);
					     var index =  this._data[key].indexOf(element);
					     index > -1 ? this._data[key].splice(index, 1) : null;
				  },
					  
/*int*/ 			lengthOfListForKey : function( /*String*/ key){
					    return this._data[key].length;
				  },
					  
/*String*/ 		json : function(){
					    /* Map */  
						var obj = this.config;
						obj[this.dataKey] = this._data;
					    return JSON.stringify(obj);
				  },
				getData : function(){
					    return this._data;
				},

/*String*/ 		toString : function(){
					    return "Config: " + JSON.stringify(this.config) + " Data: " + JSON.stringify(this._data);
				  },

/*String*/ 		cacheKey : function(){
					    return this.config[this.kindKey] + ":" + this.config[this.idKey];
				  }  
};


const ASM_NO_EXPIRATION = 99999999999;

var ASMFactory =  Class.create();

ASMFactory.prototype = {
		initialize: function(){
/*int*/ 				this.cacheExpiredTime 	= ASM_NO_EXPIRATION;
/*String*/			this.serverUrl 			= "";
/*String*/ 			this.authAppId 			= "";
/*String*/			this.authAppKey 			= "";  
/*String*/ 			this.authToken 			= "";
/*String*/ 			this.cacheExpirationTimeKey 	= "expirationtime";
					this.cacheTimestampKey 	= "timestamp";
/*String*/ 			this.cacheableKey 		= "cacheable";
/*String*/ 			this.syncableKey 		= "syncableKey";
					this.profileKey 			= "profile";
					this.deviceIdKey 		= "deviceid";
					this.tokenKey 			= "token";
/*Map*/ 				this.kinds 				= {};

					this.currentOrganization = "7000001";
					this.appId = fibity.manager.api.appId;
					
					//Si hay token -> consultar token

					//Si no hay token -> login

					//Recuperar el token

					//recuperar la lista de organizaciones

					//seleccionar la primera org como predeterminada.

					//

			

		},
		
					initAPI: function(){
						gapi.client.load('dev', 'v1beta1', function() {
							  console.log("API Ready!");
						}, this.serverUrl + "/_ah/api/");
					},
					
/*Boolean */ 		isLogin: function(){
		 	  			return (this.getToken() != undefined);
		 	  		},
		 	  		
		 	  		setToken: function(token){
		 	  			if(token == undefined){
		 	  				localStorage.removeItem(this.tokenKey);
		 	  				localStorage.removeItem(this.profileKey);
		 	  			}else localStorage[this.tokenKey] = token;
		 	  		},
		 	  		
		 	  		getToken: function(){
		 	  			return localStorage[this.tokenKey];
		 	  		},
		 	  		
/*String*/		 	getDeviceId: function(){
		 	  			if(localStorage[this.deviceIdKey] == undefined)
		 	  				localStorage[this.deviceIdKey] = uuid.v4();
		 	  			return localStorage[this.deviceIdKey];
		 	  		},
		 	  		
/*Future<Boolean> */	login: function(email, password){
						var future = new asyncFuture();
						request = {
								"email":email,
								"password":password,
								"deviceId": this.getDeviceId(),
								"appId": this.appId
						};
						
		 	  			gapi.client.account.login(request).execute(function(resp){
		 	  				if(!resp.error){
		 	  					asm.setToken(resp.token);
		 	  					future.return(true);
		 	  				}else{
		 	  					//asm.testCredentials(resp.error);
		 	  					future.return(false);
		 	  				}
		 	  			});
		 	  			return future;
		 	  		},
		 	  		
		 	  		logout: function(){
						var future = new asyncFuture();
		 	  			request = {
								"token": this.getToken(),
								"deviceId": this.getDeviceId()
						};
		 	  			gapi.client.account.logout(request).execute(function(resp){
		 	  				
		 	  				var deviceId = localStorage["deviceid"];
		 	  				localStorage.clear();
		 	  				localStorage["deviceid"] =  deviceId;
		 	  				location.reload();
		 	  				
		 	  				/*asm.setToken(undefined);
		 	  				if(resp){
		 	  					future.return(true);
		 	  				}else{
		 	  					future.return(false);
		 	  				}*/
		 	  			});
		 	  			return future;
		 	  		},
		 	  		
		 	  		setProfile: function(profile){
		 	  			if(profile == undefined)
		 	  				localStorage.removeItem(this.profileKey);
		 	  			else localStorage[this.profileKey] = JSON.stringify(profile);
		 	  		},
		 	  		
		 	  		
/*future<profile>*/  getProfile: function(){
		 	  			var future = new asyncFuture();
		 	  			if(localStorage[this.profileKey] == undefined){
							request = {
									"deviceId": this.getDeviceId(),
									"token": this.getToken()
							};
							
			 	  			gapi.client.account.getProfile(request).execute(function(resp){
			 	  				if(!resp.error){
			 	  					asm.setProfile(resp.result);
			 	  					future.return(resp.result);
			 	  				}else{
			 	  					asm.testCredentials(resp.error);
			 	  				}
			 	  			});
		 	  			}else{
		 	  				future.return(JSON.parse(localStorage[asm.profileKey]));
		 	  			}
		 	  			return future;
		 	  		},
		 	  		
		 	  		getCurrentOrganizationId: function(){
		 	  			return this.currentOrganization;
		 	  		},
		 	  		

/*void*/ 			setServerUrl : function ( /*String*/ url){
		 	     		this.serverUrl = url;  
		 	   		},

/*void*/ 			setExpiredTime : function( /*int*/ cache_expired_time){
						this.cacheExpiredTime = cache_expired_time;
		 	   		},
	   
/*void*/ 			setServerAuthentication : function( /*String*/ appId, /*String*/ appKey,/*String*/ Token){
						this.authAppId = appId;
						this.authAppKey = appKey;
						this.authToken = Token;
		 	   		},

/*
* Config Class
*/
/*void*/ 			configKind : function(/*String*/ kind, /*bool*/ syncable, /*bool*/ cacheable,  /*int*/ cache_expired_time){
		 		  		var obj = {};
		 		  		obj[this.syncableKey] = syncable;
		 		  		obj[this.cacheableKey] = cacheable;
		 		  		obj[this.cacheTimestampKey] = 0;
		 		  		obj[this.cacheExpirationTimeKey] = cache_expired_time;
						this.kinds[kind] = obj;
		 	  		},	
		 	  		
		 	  		

		 	  		
		 	  	  /*
		 	  	   * Search a entity by Id
		 	  	   */
/*Future<ASMEntity>*/ 
		 	  	    getEntityOfKindById : function(/*String*/ kind, /*String*/ id){

			 	  	    var future = new asyncFuture();
		  /*ASMEntity*/ var result = null;
		     /*String*/ value = localStorage[kind + ":" + id];
			 	  	    if(value != null){
			 	  	    		result = new ASMEntity();
			 	  	    		result.initFromCache(value);
			 	  	      	future.return(result);
			 	  	    }else{
			 	  	    		var request = { "deviceId": asm.getDeviceId(), "token": asm.getToken() };
			 	  	    		request.id = id;
			 	  			gapi.client.manager[kind].get(request).execute(function(data){
			 	  				if(data.error == undefined){
			 	  						result = new ASMEntity();
			 	  						result.initWithId(kind,data.id,data.result);
			 	  						asm._insertInCache(result);
			 	  						future.return(result);
			 	  				}else{
			 	  					asm.testCredentials(data.error);
			 	  					future.return(null);
			 	  				}
			 	  			});
			 	  	    	
			 	  	    	
			 	  	    }
			 	  	    return future;
		 	  	    },
		 	  	  
		 	  	  
/*Future<List<ASMEntity>>*/ 
		 	  	   getAllEntitiesOfKind: function(/*String*/ kind){
		 	  	    
	/*ASMEntity*/       var entity;
	/*List<ASMEntity>*/ var result =[];
			 	  	    var future = new asyncFuture();
			 	  	    
						var expiration = this.kinds[kind][this.cacheExpirationTimeKey];
						var timestamp = this.kinds[kind][this.cacheTimestampKey];
						var actualTimestamp = new Date().getTime();
						
						if(actualTimestamp < (timestamp + expiration)){
							 for (var key in localStorage){
					 	  	       if (key.indexOf(kind + ":")!=-1){
					 	  	         entity = new ASMEntity();
					 	  	         entity.initFromCache(localStorage[key]);
					 	  	         result.push(entity);
					 	  	       } 
					 	  	    }
					 	  	    future.return(result);
						}else{
							var request = { "deviceId": asm.getDeviceId(), "token": asm.getToken() };
							
							if(["antenna","schedule","infocard","campaign"].indexOf(kind) > -1 ) request.organizationId = asm.getCurrentOrganizationId();
							
			 	  			gapi.client.manager[kind].getAll(request).execute(function(resp){
			 	  				console.log("objetos: " + kind);
			 	  				console.log(resp.items);
			 	  				if(!resp.error){
			 	  					if(resp.items != undefined){
				 	  					resp.items.forEach(function(obj){
				 	  						console.log(obj);
				 	  						entity = new ASMEntity();
				 	  						entity.initWithId(kind,obj.id,obj);
				 	  						asm._insertInCache(entity);
				 	  						result.push(entity);
				 	  					});
			 	  					}
			 	  					asm.kinds[kind][this.cacheTimestampKey] = new Date().getTime();
			 	  					future.return(result);
			 	  				}else{
			 	  					asm.testCredentials(resp.error);
			 	  					future.return(null);
			 	  				}
			 	  			});
							
							
						}
			 	  	    return future;
		 	  	  },
		 	  	  
/*void*/ 		  removeAllEntitiesOfKind : function (/*String*/ kind){
					for (var key in localStorage){
		 	  	       if (key.indexOf(kind + ":")!=-1){
		 	  	         localStorage.removeItem(key);
		 	  	       }
		 	  	    }
		 	  	  },
		 	  		
/*Future<Map<String,String>>*/ 
		 	  	  save : function(/*ASMEntity*/ entity){
		 	  			var future = new asyncFuture();
			 	  	    
			    /*Map*/ var kindconfig = this.kinds[entity.kind()];
			 	  	    
			 	  	    if(kindconfig != null){
			 	  	    
			 	  	        if(kindconfig[this.syncableKey]){
			 	  	          /*//Enviar al servidor 
			 	  	          
			 	  	          // si es cacheable -> salvar en cache
			 	  	          var url = "http://fibitycloud.appspot.com/1/user/session_status";
			 	  	                    //var url = "http://127.0.0.1:8888/1/user/session_status";
			 	  	                    
			 	  	          var request = new HttpRequest();
			 	  	          request.open('GET', url);
			 	  	          request.setRequestHeader("Content-type", "application/json");
			 	  	          request.setRequestHeader("X-Fibity-App-ID", authAppId);
			 	  	          request.setRequestHeader("X-Fibity-App-Key", authAppKey);
			 	  	          request.setRequestHeader("X-Fibity-Authentication", authToken);
			 	  	          request.onLoad.listen( (event){
			 	  	            
			 	  	              String myRes = event.target.responseText;
			 	  	              Map obj = JSON.decode(myRes);
			 	  	              
			 	  	              //entity.updateFromMap(obj);
			 	  	                        
			 	  	           });
			 	  	           request.send();
			 	  	          
			 	  	          */
			 	  	    
			 	  	        var request = {};
			 	  	        request.auth = { "deviceId": asm.getDeviceId(), "token" : asm.getToken()};
			 	  	        request[	entity.kind()] = entity.getData();
								
			 	  	        	if(["schedule","campaign","infocard"].indexOf(entity.kind()) > -1 ) request.organizationId = asm.getCurrentOrganizationId();
							var self = this;
			 	  	        	gapi.client.manager[entity.kind()].save(request).execute(function(data){
				 	  				if(!data.error){
				 	  				    entity.id = data.response.id;
			 	  	                    	self._insertInCache(entity);
			 	  	                    future.return("Entity saved!");
				 	  				}else{
				 	  					asm.testCredentials(data.error);
				 	  					future.throw({"message":"Entity didn't save!"});
				 	  				}
				 	  			});
			 	  	          
			 	  	        }else{
			 	  	              if(kindconfig[this.cacheableKey] ){
			 	  	                    if(entity.id == ""){
			 	  	                      // DART: Uuid uuid = new Uuid();
			 	  	                      entity.id = uuid.v4();
			 	  	                    }
			 	  	                    this._insertInCache(entity);
			 	  	                 future.return("Entity saved!"); //Todo OK
			 	  	                    
			 	  	              }else{
			 	  	                    print("Auto Sync Model: Entity didn't save!");
			 	  	                 future.throw({"message":"Entity didn't save!"});
			 	  	              }
			 	  	        }
			 	  	    }else{
			 	  	        //DART: print("Auto Sync Model: kind " + entity.kind() +" no configured!");
			 	  	        future.throw({"message":"Kind " + entity.kind() +" no configured!"});
			 	  	    }
			 	  	    
			 	  	      return future;
		 	  	  },
		 	  	  
/*void*/ 		  _insertInCache : function(/*ASMEntity*/ entity){
		 	  	        //Actualizar _insert_timestamp
		 	  	     entity.updateCacheTimestamp();
		 	  	        //Almacenar en Local Storage
		 	  	     localStorage[entity.cacheKey()] = entity.json();
		 	  	  },

		 				  /*
		 				   * Create a new entity
		 				   */
/*ASMEntity*/ 		newEntityOfKind	: function( /*String*/ kind, /*Map*/ data){
		 				    if(kinds[kind] != null){
		 				      return new ASMEntity(kind, data);
		 				    }else{
		 				      print("Auto Sync Model: kind " + kind +" no configured!");
		 				      return null;
		 				    }
		 			},
/*Future<Map<String,String>>*/ 
		 			uploadImages: function(/*List<File>*/ files) {
		 			    var future = new asyncFuture;
		 			    
		 			    request = new XMLHttpRequest();
		 			    //request.open('POST', "http://api.fibity.com/1/storage/image",true);
		 			   request.open('POST', "https://1beta1-dot-fibitycloud.appspot.com/storage/v1beta1/image/",true);
		 			    //request.setRequestHeader("X-Fibity-App-ID", authAppId);
		 			    //request.setRequestHeader("X-Fibity-App-Key", authAppKey);
		 			    //request.setRequestHeader("X-Fibity-Authentication", authToken);
		 			    //request.setRequestHeader("X-Fibity-Org-ID", "34f34fasdfass43qfasedf434fsasdf3");
		 			    //request.setRequestHeader("Content-type", "multipart/form-data; charset=UFT-8");
		 			    
		 			    request.onreadystatechange = function(){
		 			      /*String*/ var myRes = request.responseText;
		 			      if (request.status == 200) {
		 			        
		 			        //print("Json: " + myRes);
		 			        var res = JSON.parse(myRes);
		 			        console.log(myRes);
		 			       future.return(res);
		 			      }else if (request.status != 200){
		 			    	 future.throw("Error uploading images");
		 			      }
		 			    };
		 			    
		 			    //Add files
		 			    var formData = new FormData();
		 			    files.forEach(function(/*File*/ f){
		 			      formData.append('file', f);
		 			    });
		 			    
		 			    //formData.append('tag', tag);
		 			    request.send(formData);

		 			    return future;
		 			  },
		 			
		 			uploadImagesSync: function(/*List<File>*/ files) {
		 			    var future = new asyncFuture();
		 			    
		 			    request = new XMLHttpRequest();
		 			    request.open('POST', "https://1beta1-dot-fibitycloud.appspot.com/storage/v1beta1/image/",false);
		 			    
		 			    //request.setRequestHeader("X-Fibity-App-ID", authAppId);
		 			    //request.setRequestHeader("X-Fibity-App-Key", authAppKey);
		 			    //request.setRequestHeader("X-Fibity-Authentication", authToken);
		 			    //request.setRequestHeader("X-Fibity-Org-ID", "34f34fasdfass43qfasedf434fsasdf3");
		 			    //request.setRequestHeader("Content-type", "multipart/form-data; charset=UFT-8");

		 			    //Add files
		 			    var formData = new FormData();
		 			    files.forEach(function(/*File*/ f){
		 			      formData.append('file', f);
		 			    });
		 			    
		 			    //formData.append('tag', tag);
		 			   request.send(formData);
		 			   var myRes = request.responseText;
		 			   console.log(myRes);
		 			      if (request.readyState == 4 && request.status == 200) {
		 			        
		 			        //print("Json: " + myRes);
		 			        var res = JSON.parse(myRes);
		 			        
		 			        future.return(res);
		 			      }else{
		 			    	  	future.throw("Error uploading images");
		 			      }

		 			    return future;
		 			  },
		 			  
		 			  testCredentials: function(error){
		 				  if(error.code == 401){
		 					 var deviceId = localStorage["deviceid"];
		 					 localStorage.clear();
		 					 localStorage["deviceid"] =  deviceId;
		 					 console.log(error.message);
		 					 //location.reload();
		 					 //document.getElementById("fbtm-security").style.display="block";
		 					jQuery( "#fbtm-security" ).fadeIn(200);
		 				  }
		 			  }
		 			  
};

var asm = new ASMFactory();

//angular.module('fbtmApp.services', []).factory('ASMFactory', ['$http', ASMFactoryFunction]);
 

 
 

/*************** Class Antenna ***************/


//Create Subclass  of ASMEntity
var Antenna =  Class.create(ASMEntity,{
	//Constructor
	initialize : function($super) {
		
		this.pName = "name";
		this.pSerialNumber = "serial";
		this.pLocation = "location";
		this.pSection = "section";
		this.pSchedulesList = "schedule_list";
		
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	},
	initFromEntity : function($super, entity){
		$super(entity);
	}
	});
		/*Future<List<Antenna>> */	
		    Antenna.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
		    		var future = new asyncFuture;
		    		asmFuture.then(function(list){
		    			  /*List<Antenna>*/ 
		    			  var result = [];
				      list.forEach(function(/*ASMEntity*/ e){
				    	  	var objAntenna = new Antenna();
				    	  	objAntenna.initFromEntity(e);
				        result.push(objAntenna);
				      });
				      future.return(result);
		        });
				return future;
			 };

	Antenna.entityKind = Antenna.prototype.entityKind = "antenna";
	//Create Setters and Getters

	Antenna.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Antenna.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
					 //Serial is Read only
	Antenna.prototype.getSerialNumber = function()  { return this.stringForKey(this.pSerialNumber); };
	
	Antenna.prototype.setLocation = function(/*String*/ location) { this.setStringForKey(location,this.pLocation); };
	Antenna.prototype.getLocation = function()  { return this.stringForKey(this.pLocation); };
	
	Antenna.prototype.setSection = function(/*String*/ section){ this.setStringForKey(section,this.pSection); };
	Antenna.prototype.getSection = function() { return this.stringForKey(this.pSection); };
	
	Antenna.prototype.setSchedulesList = function(/*List*/ schedulesList) { this.setListForKey(schedulesList,this.pSchedulesList); };
	Antenna.prototype.getSchedulesList = function()  { return this.listForKey(this.pSchedulesList); };
	
	Antenna.prototype.addScheduleToList = function(/*String Schedule.id */ scheduleId) { this.addItemToListForKey(scheduleId,this.pSchedulesList);};
	Antenna.prototype.removeScheduleIdInScheduleList = function(/*String Schedule.id */ scheduleId) { this.removeElementInListForKey(scheduleId,this.pSchedulesList);};
	Antenna.prototype.removeIndexInScheduleList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pSchedulesList);};

	
	//Create Properties
	
	Antenna.prototype.name = "";
	Object.defineProperty(Antenna.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
		
	Antenna.prototype.serialNumber = "";
	Object.defineProperty(Antenna.prototype, "serialNumber", {
		    get : function serialNumber()  { return this.getSerialNumber(); }
	});
	
	Antenna.prototype.location = "";
	Object.defineProperty(Antenna.prototype, "location", {
			set : function location(v) { this.setLocation(v); },
		    get : function location()  { return this.getLocation(); }
	});
		
	Antenna.prototype.section = "";
	Object.defineProperty(Antenna.prototype, "section", {
			set : function section(v) { this.setSection(v); },
		    get : function section()  { return this.getSection(); }
	});
	
	Antenna.prototype.schedulesList = [];
	Object.defineProperty(Antenna.prototype, "schedulesList", {
			set : function schedulesList(v) { this.setSchedulesList(v); },
		    get : function schedulesList()  { return this.getSchedulesList();}
	});
	
/*************** End Class Antenna ***************/


/********************	Class Antenna Activation   ******************/

// Create Subclass of ASMEntity
var AntennaActivation = Class.create(ASMEntity,{
	//construct
	initialize : function($super){
		this.pName = "name";
		this.pLocation = "location";
		this.pSection = "section";
		this.pKey = "key";

		//Call parent construct
		$super();
	},
	//initializer with data
	init : function($super,/*Map*/ data)
		{
			//Call parent init method
			$super(this.entityKind,data);
		}
});

		/*Future<List<AntennaActivation>> */	
			AntennaActivation.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
		    		var future = new asyncFuture;
		    		asmFuture.then(function(list){
		    			  /*List<AntennaActivation>*/ 
		    			  var result = [];
				      list.forEach(function(/*ASMEntity*/ e){
				    	  	var objAntennaActivation = new AntennaActivation();
				    	  	objAntennaActivation.initFromEntity(e);
				        result.push(objAntennaActivation);
				      });
				      future.return(result);
		        });
				return future;
			 };
	 
	AntennaActivation.entityKind = AntennaActivation.prototype.entityKind = "antenna_activation";
	//Create Setters and Getters
	
	AntennaActivation.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	AntennaActivation.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	AntennaActivation.prototype.setLocation = function(/*String*/ location) { this.setStringForKey(location,this.pLocation); };
	AntennaActivation.prototype.getLocation = function()  { return this.stringForKey(this.pLocation); };
	
	AntennaActivation.prototype.setSection = function(/*String*/ section) { this.setStringForKey(section,this.pSection); };
	AntennaActivation.prototype.getSection = function()  { return this.stringForKey(this.pSection); };
	
	AntennaActivation.prototype.setKey = function(/*String*/ key) { this.setStringForKey(key,this.pKey); };
	AntennaActivation.prototype.getKey = function()  { return this.stringForKey(this.pKey); };
	
	
	//Create Properties
	AntennaActivation.prototype.name = "";
	Object.defineProperty(AntennaActivation.prototype,"name",{
		set : function name(v){ this.setName(v); },
		get : function name() { return this.getName(); }
	});
	
	AntennaActivation.prototype.location = "";
	Object.defineProperty(AntennaActivation.prototype,"location",{
		set : function location(v){ this.setLocation(v); },
		get : function location() { return this.getLocation(); }
	});
	
	AntennaActivation.prototype.section = "";
	Object.defineProperty(AntennaActivation.prototype,"section",{
		set : function section(v){ this.setSection(v); },
		get : function section() { return this.getSection(); }
	});
	
	AntennaActivation.prototype.key = "";
	Object.defineProperty(AntennaActivation.prototype,"key",{
		set : function key(v){ this.setKey(v); },
		get : function key() { return this.getKey(); }
	});
/************* End Class Antenna Activation **************/	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

/*************** Class Billing ***************/


//Create Subclass  of ASMEntity
var Billing =  Class.create(ASMEntity,{

	//Constructor
	initialize : function($super) {
		/*String*/ this.pRazonSocial = "razonSocial";
		/*String*/ this.pCIF = "cif";
		
		/*String*/ this.pName = "name";
		/*String*/ this.pApellido = "apellido";
		/*String*/ this.pDni = "dni";
		 
		/*String*/ this.pDireccion1 = "direccion1";
		/*String*/ this.pDireccion2 = "direccion2";
		/*String*/ this.pPoblacion = "poblacion";
		/*String*/ this.pCodigoPostal = "codigo_postal";
		/*String*/ this.pProvincia = "provincia";
		/*String*/ this.pTelefono = "telefono";
		
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	},

	//initializer with id
	initWithId : function ($super, /*String*/ kind, /*String*/ id, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,id,data);	
	},
	initFromEntity : function($super, entity){
		$super(entity);
	}
	
});

		/*Future<List<Billing>> */	
			Billing.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<AntennaActivation>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objBilling = new Billing();
			    	  	objBilling.initFromEntity(e);
			        result.push(objBilling);
			      });
			      future.return(result);
		    });
			return future;
		 };
			
	Billing.entityKind = Billing.prototype.entityKind = "billing";
	//Create Setters and Getters

	Billing.prototype.setRazonSocial = function(/*String*/ razonSocial) { this.setStringForKey(razonSocial,this.pRazonSocial); };
	Billing.prototype.getRazonSocial = function()  { return this.stringForKey(this.pRazonSocial); };
	
	Billing.prototype.setCIF = function(/*String*/ cif) { this.setStringForKey(cif,this.pCIF); };
	Billing.prototype.getCIF = function()  { return this.stringForKey(this.pCIF); };
	
	Billing.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Billing.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Billing.prototype.setApellido = function(/*String*/ apellido) { this.setStringForKey(apellido,this.pApellido); };
	Billing.prototype.getApellido = function()  { return this.stringForKey(this.pApellido); };
	
	Billing.prototype.setDni = function(/*String*/ dni) { this.setStringForKey(dni,this.pDni); };
	Billing.prototype.getDni = function()  { return this.stringForKey(this.pDni); };
	
	Billing.prototype.setDireccion1 = function(/*String*/ direccion1){ this.setStringForKey(direccion1,this.pDireccion1); };
	Billing.prototype.getDireccion1 = function() { return this.stringForKey(this.pDireccion1); };
	
	Billing.prototype.setDireccion2 = function(/*String*/ direccion2){ this.setStringForKey(direccion2,this.pDireccion2); };
	Billing.prototype.getDireccion2 = function() { return this.stringForKey(this.pDireccion2); };
	
	Billing.prototype.setPoblacion = function(/*String*/ poblacion) { this.setStringForKey(poblacion,this.pPoblacion); };
	Billing.prototype.getPoblacion = function()  { return this.stringForKey(this.pPoblacion); };
	
	Billing.prototype.setCodigoPostal = function(/*String*/ codigoPostal){ this.setStringForKey(codigoPostal,this.pCodigoPostal); };
	Billing.prototype.getCodigoPostal = function() { return this.stringForKey(this.pCodigoPostal); };
	
	Billing.prototype.setProvincia = function(/*String*/ provincia) { this.setStringForKey(provincia,this.pProvincia); };
	Billing.prototype.getProvincia = function()  { return this.stringForKey(this.pProvincia); };
	
	Billing.prototype.setTelefono = function(/*String*/ telefono) { this.setStringForKey(telefono,this.pTelefono); };
	Billing.prototype.getTelefono = function()  { return this.stringForKey(this.pTelefono); };
	
	
	//Create Properties
	
	Billing.prototype.razonSocial = "";
	Object.defineProperty(Billing.prototype, "razonSocial", {
			set : function razonSocial(v) { this.setRazonSocial(v); },
		    get : function razonSocial()  { return this.getRazonSocial(); }
	});
		
	Billing.prototype.cif = "";
	Object.defineProperty(Billing.prototype, "cif", {
			set : function cif(v) { this.setCIF(v); },
		    get : function cif()  { return this.getCIF(); }
	});
		
	Billing.prototype.name = "";
	Object.defineProperty(Billing.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Billing.prototype.apellido = "";
	Object.defineProperty(Billing.prototype, "apellido", {
			set : function apellido(v) { this.setApellido(v); },
		    get : function apellido()  { return this.getApellido(); }
	});

	Billing.prototype.dni = "";
	Object.defineProperty(Billing.prototype, "dni", {
			set : function dni(v) { this.setDni(v); },
		    get : function dni()  { return this.getDni(); }
	});
	
	Billing.prototype.direccion1 = "";
	Object.defineProperty(Billing.prototype, "direccion1", {
			set : function direccion1(v) { this.setDireccion1(v); },
		    get : function direccion1()  { return this.getDireccion1(); }
	});
	
	Billing.prototype.direccion2 = "";
	Object.defineProperty(Billing.prototype, "direccion2", {
			set : function direccion2(v) { this.setDireccion2(v); },
		    get : function direccion2()  { return this.getDireccion2(); }
	});
	
	Billing.prototype.poblacion = "";
	Object.defineProperty(Billing.prototype, "poblacion", {
			set : function poblacion(v) { this.setPoblacion(v); },
		    get : function poblacion()  { return this.getPoblacion(); }
	});
	
	Billing.prototype.codigoPostal = "";
	Object.defineProperty(Billing.prototype, "codigoPostal", {
			set : function codigoPostal(v) { this.setCodigoPostal(v); },
		    get : function codigoPostal()  { return this.getCodigoPostal(); }
	});
	
	Billing.prototype.provincia = "";
	Object.defineProperty(Billing.prototype, "provincia", {
			set : function provincia(v) { this.setProvincia(v); },
		    get : function provincia()  { return this.getProvincia(); }
	});
		
	Billing.prototype.telefono = "";
	Object.defineProperty(Billing.prototype, "telefono", {
			set : function telefono(v) { this.setTelefono(v); },
		    get : function telefono()  { return this.getTelefono(); }
	});
	
/*************** End Class Billing ***************/


// Create Subclass of ASMEntity
var Campaign = Class.create(ASMEntity,{
	//construct
	initialize : function($super){
		/*String*/ 
		
		/*String*/ this.pInfoCardId = "infocardId";
		/*List*/   this.pAntennasList = "antennasList";
		/*String*/ this.pName = "name";
		/*Bool*/   this.pDynamic = "dynamic";
		/*List*/   this.pSchedulesList = "scheduleList";

		//Call parent construct
		$super();
	},
	//initializer with data
	init : function($super,/*Map*/ data)
		{
			//Call parent init method
			$super(this.entityKind,data);
		}
});

		
		Campaign.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
			var future = new asyncFuture;
			asmFuture.then(function(list){
				  
				  var result = [];
		      list.forEach(function(/*ASMEntity*/ e){
		    	  	var objCampaign = new Campaign();
		    	  	objCampaign.initFromEntity(e);
		        result.push(objCampaign);
		      });
		      future.return(result);
		});
		return future;
		};


	Campaign.entityKind = Campaign.prototype.entityKind = "campaign";
//Create Setters and Getters

	Campaign.prototype.setInfocardId = function(/*String*/ infocardId) { this.setStringForKey(infocardId,this.pInfoCardId); };
	Campaign.prototype.getInfocardId = function()  { return this.stringForKey(this.pInfoCardId); };

	Campaign.prototype.setAntennasList = function(/*List*/ antennasList) { this.setListForKey(antennasList,this.pAntennasList); };
	Campaign.prototype.getAntennasList = function()  { return this.listForKey(this.pAntennasList); };
	Campaign.prototype.addAntennasToList = function(/*String Schedule.id */ antennasId) { this.addItemToListForKey(antennasId,this.pAntennasList);};
	Campaign.prototype.removeAntennasIdInAntennasList = function(/*String Schedule.id */ antennasId) { this.removeElementInListForKey(antennasId,this.pAntennasList);};
	Campaign.prototype.removeIndexInAntennasList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pAntennasList);};

	Campaign.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Campaign.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Campaign.prototype.setDynamic = function(/*bool*/ dynamic) { this.setBoolForKey(dynamic,this.pDynamic); };
	Campaign.prototype.getDynamic = function()  { return this.boolForKey(this.pDynamic); };

	Campaign.prototype.setSchedulesList = function(/*List*/ schedulesList) { this.setListForKey(schedulesList,this.pSchedulesList); };
	Campaign.prototype.getSchedulesList = function()  { return this.listForKey(this.pSchedulesList); };
	Campaign.prototype.addScheduleToList = function(/*String Schedule.id */ scheduleId) { this.addItemToListForKey(scheduleId,this.pSchedulesList);};
	Campaign.prototype.removeScheduleIdInScheduleList = function(/*String Schedule.id */ scheduleId) { this.removeElementInListForKey(scheduleId,this.pSchedulesList);};
	Campaign.prototype.removeIndexInScheduleList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pSchedulesList);};

	
//Create Properties
	
	Campaign.prototype.infocardId = "";
	Object.defineProperty(Campaign.prototype, "infocardId", {
			set : function infocardId(v) { this.setInfocardId(v); },
		    get : function infocardId()  { return this.getInfocardId(); }
	});
	
	Campaign.prototype.dynamicMode = "";
	Object.defineProperty(Campaign.prototype, "dynamicMode", {
			set : function dynamicMode(v) { this.setDynamic(v); },
		    get : function dynamicMode()  { return this.getDynamic(); }
	});
		
		
	Campaign.prototype.antennasList = [];
	Object.defineProperty(Campaign.prototype, "antennasList", {
			set : function antennasList(v) { this.setAntennasList(v); },
		    get : function antennasList()  { return this.getAntennasList();}
	});
	
	Campaign.prototype.serialNumber = "";
	Object.defineProperty(Campaign.prototype, "serialNumber", {
		    get : function serialNumber()  { return this.getSerialNumber(); }
	});
	
	Campaign.prototype.location = "";
	Object.defineProperty(Campaign.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Campaign.prototype.location = "";
	Object.defineProperty(Campaign.prototype, "location", {
			set : function location(v) { this.setLocation(v); },
		    get : function location()  { return this.getLocation(); }
	});
		
	Campaign.prototype.section = "";
	Object.defineProperty(Campaign.prototype, "section", {
			set : function section(v) { this.setSection(v); },
		    get : function section()  { return this.getSection(); }
	});

	Campaign.prototype.schedulesList = [];
	Object.defineProperty(Campaign.prototype, "schedulesList", {
			set : function schedulesList(v) { this.setSchedulesList(v); },
		    get : function schedulesList()  { return this.getSchedulesList();}
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

/*************** Class Customers ***************/


//Create Subclass  of ASMEntity
var Customers =  Class.create(ASMEntity,{

	//Constructor
	initialize : function($super) {
		
		/*String*/ this.pName = "name";
		/*String*/ this.pApellido = "apellido";
		/*String*/ this.pFoto = "foto";
		/*String*/ this.pPuntos = "puntos";
		/*String*/ this.pLastVisita = "lastVisita";
		
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	}
	
});

		/*Future<List<Customers> */	
		Customers.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
			var future = new asyncFuture;
			asmFuture.then(function(list){
				  /*List<Customers>*/ 
				  var result = [];
		      list.forEach(function(/*ASMEntity*/ e){
		    	  	var objCustomers = new Customers();
		    	  	objCustomers.initFromEntity(e);
		        result.push(objCustomers);
		      });
		      future.return(result);
		});
		return future;
		};


	Customers.entityKind = Customers.prototype.entityKind = "customers";
	//Create Setters and Getters
	
	Customers.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Customers.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Customers.prototype.setApellido = function(/*String*/ apellido) { this.setStringForKey(apellido,this.pApellido); };
	Customers.prototype.getApellido = function()  { return this.stringForKey(this.pApellido); };
	
	Customers.prototype.setFoto = function(/*String*/ foto) { this.setStringForKey(foto,this.pFoto); };
	Customers.prototype.getFoto = function()  { return this.stringForKey(this.pFoto); };
	
	Customers.prototype.setPuntos = function(/*int*/ puntos){ this.setIntForKey(puntos,this.pPuntos); };
	Customers.prototype.getPuntos = function() { return this.intForKey(this.pPuntos); };
	
	Customers.prototype.setLastVisita = function(/*String*/ lastVisita) { this.setStringForKey(lastVisita,this.pLastVisita); };
	Customers.prototype.getLastVisita = function()  { return this.stringForKey(this.pLastVisita); };
	
	//Create Properties
	
	Customers.prototype.name = "";
	Object.defineProperty(Customers.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Customers.prototype.apellido = "";
	Object.defineProperty(Customers.prototype, "apellido", {
			set : function apellido(v) { this.setApellido(v); },
		    get : function apellido()  { return this.getApellido(); }
	});
	
	Customers.prototype.foto = "";
	Object.defineProperty(Customers.prototype, "foto", {
			set : function foto(v) { this.setFoto(v); },
		    get : function foto()  { return this.getFoto(); }
	});
	
	Customers.prototype.puntos = "";
	Object.defineProperty(Customers.prototype, "puntos", {
			set : function puntos(v) { this.setPuntos(v); },
		    get : function puntos()  { return this.getPuntos(); }
	});
		
	Customers.prototype.lastVisita = "";
	Object.defineProperty(Customers.prototype, "lastVisita", {
			set : function lastVisita(v) { this.setLastVisita(v); },
		    get : function lastVisita()  { return this.getLastVisita(); }
	});
	
/*************** End Class Customers ***************/



/********************	Class Infocard   ******************/

// Create Subclass of ASMEntity
var InfoCard = Class.create(ASMEntity,{
	//construct
	initialize : function($super){
		this.pUrlImg = "imgUrl";
		this.pTitle = "title";
		this.pDescription = "description";
		
		//Call parent construct
		$super();
	},
	//initializer with data
	init : function($super,/*Map*/ data)
		{
			//Call parent init method
			$super(this.entityKind,data);
		}
});

		/*Future<List<Antenna>> */	
		InfoCard.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<Antenna>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objInfoCard = new InfoCard();
			    	  	objInfoCard.initFromEntity(e);
			        result.push(objInfoCard);
			      });
			      future.return(result);
		    });
			return future;
		 };

	InfoCard.entityKind = InfoCard.prototype.entityKind = "infocard";
	//Create Setters and Getters

	InfoCard.prototype.setUrlImg = function(/*String*/ urlImg){ this.setStringForKey(urlImg,this.pUrlImg);};
	InfoCard.prototype.getUrlImg = function(){ return this.stringForKey(this.pUrlImg); };
	
	InfoCard.prototype.setTitle = function(/*String*/ title){ this.setStringForKey(title,this.pTitle); };
	InfoCard.prototype.getTitle = function() { return this.stringForKey(this.pTitle); };
	
	InfoCard.prototype.setDescription = function(/*String*/ description){ this.setStringForKey(description,this.pDescription); };
	InfoCard.prototype.getDescription = function(){ return this.stringForKey(this.pDescription); };
	//Create Properties

	InfoCard.prototype.urlImg = "";
	Object.defineProperty(InfoCard.prototype,"urlImg",{
		set	: function urlImg(v) { this.setUrlImg(v); },
		get : function urlImg() { return this.getUrlImg(); }
	});
	
	InfoCard.prototype.title = "";
	Object.defineProperty(InfoCard.prototype,"title",{
		set : function title(v) { this.setTitle(v); },
		get : function title() { return this.getTitle(); }
	});
	
	
	InfoCard.prototype.description = "";
	Object.defineProperty(InfoCard.prototype,"description",{
		set : function description(v) { this.setDescription(v); },
		get : function description() { return this.getDescription(); }
	});

/************* End Class InfoCard **************/	
	
	
	
	
	
	
	
	
	
	
	
	
	

/*************** Class Organization ***************/


//Create Subclass  of ASMEntity
var Organization =  Class.create(ASMEntity,{

	//Constructor
	initialize : function($super) {

		/*String*/ this.pUrlImgLogo = "urlImgLogo";
		/*String*/ this.pUrlImgBackground = "urlImgBackground";
		/*String*/ this.pName = "name";
		/*String*/ this.pSlogan = "slogan";
		/*String*/ this.pDescription = "description";
		
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	},
	
	//initializer with id
	initWithId : function ($super, /*String*/ kind, /*String*/ id, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,id,data);	
	},
	initFromEntity : function($super, entity){
		$super(entity);
	}
	
});

		/*Future<List<Antenna>> */	
		Organization.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<Antenna>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objOrganization = new InfoCard();
			    	  	objOrganization.initFromEntity(e);
			        result.push(objOrganization);
			      });
			      future.return(result);
		    });
			return future;
		 };

	Organization.entityKind = Organization.prototype.entityKind = "organization";
	//Create Setters and Getters

	Organization.prototype.setUrlImgLogo = function(/*String*/ urlImgLogo){ this.setStringForKey(urlImgLogo,this.pUrlImgLogo); };
	Organization.prototype.getUrlImgLogo = function() { return this.stringForKey(this.pUrlImgLogo); };

	Organization.prototype.setUrlImgBackground = function(/*String*/ urlImgBackground) { this.setStringForKey(urlImgBackground,this.pUrlImgBackground); };
	Organization.prototype.getUrlImgBackground = function()  { return this.stringForKey(this.pUrlImgBackground); };

	Organization.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Organization.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Organization.prototype.setSlogan = function(/*String*/ slogan) { this.setStringForKey(slogan,this.pSlogan); };
	Organization.prototype.getSlogan = function()  { return this.stringForKey(this.pSlogan); };
	
	Organization.prototype.setDescription = function(/*String*/ description) { this.setStringForKey(description,this.pDescription); };
	Organization.prototype.getDescription = function()  { return this.stringForKey(this.pDescription); };

	//Create Properties
	
	Organization.prototype.urlImgLogo = "";
	Object.defineProperty(Organization.prototype, "urlImgLogo", {
			set : function urlImgLogo(v) { this.setUrlImgLogo(v); },
		    get : function urlImgLogo()  { return this.getUrlImgLogo(); }
	});
		
	Organization.prototype.urlImgBackground = "";
	Object.defineProperty(Organization.prototype, "urlImgBackground", {
			set : function urlImgBackground(v) { this.setUrlImgBackground(v); },
		    get : function urlImgBackground()  { return this.getUrlImgBackground(); }
	});
	
	Organization.prototype.name = "";
	Object.defineProperty(Organization.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Organization.prototype.slogan = "";
	Object.defineProperty(Organization.prototype, "slogan", {
			set : function slogan(v) { this.setSlogan(v); },
		    get : function slogan()  { return this.getSlogan(); }
	});
	
	Organization.prototype.description = "";
	Object.defineProperty(Organization.prototype, "description", {
			set : function description(v) { this.setDescription(v); },
		    get : function description()  { return this.getDescription(); }
	});
	
	
/*************** End Class Organization ***************/



/*************** Class Schedule ***************/
//Create Subclass  of ASMEntity
var Schedule =  Class.create(ASMEntity,{
	//Constructor
	initialize : function($super) {
		
		/* FECHAS Y HORAS */
		/*String*/ this.pDateIni = "dateIni";
		/*String*/ this.pDateEnd = "dateEnd";
		/*String*/ this.pHourIni = "hourEni";
		/*String*/ this.pHourEnd = "hourEnd";
		/*String*/ this.pName = "name";
		
		/* ID DE INFOCARD Y LISTADO DE ANTENAS */
		/*String*/ this.pIdinfocard = "Idinfocard";
		/*String*/ this.pMaxUser = "maxUser";
		/*String*/ this.pAntennasList = "antennasList";
		
		/* REPETICION */
		/*String*/ this.pRepetition   = "repetition";
		/*String*/ this.pEveryDaily   = "every_daily";
		/*String*/ this.pEveryWeekly  = "every_weekly";
		/*String*/ this.pEveryMonthly = "every_monthly";
		/*String*/ this.pEveryYearly  = "every_yearly";
		/*String*/ this.pEveryExactlySelection = "every_exactly_selection";
		/*String*/ this.pEveryExactlyDay = "every_exactly_day";
		/*String*/ this.pEvery = "allDay"; 
		
		/* END && STATIC */
		/*String*/ this.pEnd = "end";
		/*String*/ this.pStatico = "statico";

		/* DIA DEL 1 AL 31 */
		
		/*String*/ this.pDay1 = "Day1";
		/*String*/ this.pDay2 = "Day2";
		/*String*/ this.pDay3 = "Day3";
		/*String*/ this.pDay4 = "Day4";
		/*String*/ this.pDay5 = "Day5";
		/*String*/ this.pDay6 = "Day6";
		/*String*/ this.pDay7 = "Day7";
		/*String*/ this.pDay8 = "Day8";
		/*String*/ this.pDay9 = "Day9";
		/*String*/ this.pDay10 = "Day10";
		/*String*/ this.pDay11 = "Day11";
		/*String*/ this.pDay12 = "Day12";
		/*String*/ this.pDay13 = "Day13";
		/*String*/ this.pDay14 = "Day14";
		/*String*/ this.pDay15 = "Day15";
		/*String*/ this.pDay16 = "Day16";
		/*String*/ this.pDay17 = "Day17";
		/*String*/ this.pDay18 = "Day18";
		/*String*/ this.pDay19 = "Day19";
		/*String*/ this.pDay20 = "Day20";
		/*String*/ this.pDay21 = "Day21";
		/*String*/ this.pDay22 = "Day22";
		/*String*/ this.pDay23 = "Day23";
		/*String*/ this.pDay24 = "Day24";
		/*String*/ this.pDay25 = "Day25";
		/*String*/ this.pDay26 = "Day26";
		/*String*/ this.pDay27 = "Day27";
		/*String*/ this.pDay28 = "Day28";
		/*String*/ this.pDay29 = "Day29";
		/*String*/ this.pDay30 = "Day30";
		/*String*/ this.pDay31 = "Day31";	
		
		/*DIAS DE LA SEMANA */
	   
		/*String*/ this.pMonday = "monday";
		/*String*/ this.pTuesday = "tuesday";
		/*String*/ this.pWednesday = "wednesday";
		/*String*/ this.pThursday = "thursday";
		/*String*/ this.pFriday = "friday";
		/*String*/ this.pSaturday = "saturday";
		/*String*/ this.pSunday = "sunday";
	    
	    /* MESES DEL ANYO */
		/*String*/ this.pJanuary = "january";
		/*String*/ this.pFebruary = "february";
		/*String*/ this.pMarch = "march";
		/*String*/ this.pApril = "april";
		/*String*/ this.pMay = "may";
		/*String*/ this.pJune = "june";
		/*String*/ this.pJuly = "july";
		/*String*/ this.pAugust = "august";
		/*String*/ this.pSeptember = "september";
		/*String*/ this.pOctober = "october";
		/*String*/ this.pNovember = "november";
		/*String*/ this.pDecember = "december";
	    
		//Call parent constructor
		$super();
	},
	
	//initializer with data
	init : function ($super, /*Map*/ data){
		//Call parent init method
		$super(this.entityKind,data);	
	}
	
});

		/*Future<List<Antenna>> */	
		Schedule.fromEntityList = function(/*Futute<List<ASMEntity>>*/ asmFuture){
				var future = new asyncFuture;
				asmFuture.then(function(list){
					  /*List<Antenna>*/ 
					  var result = [];
			      list.forEach(function(/*ASMEntity*/ e){
			    	  	var objSchedule = new InfoCard();
			    	  	objSchedule.initFromEntity(e);
			        result.push(objSchedule);
			      });
			      future.return(result);
		    });
			return future;
		 };

	Schedule.entityKind = Schedule.prototype.entityKind = "schedule";
	//Create Setters and Getters

	Schedule.prototype.setDateIni = function(/*String*/ dateIni){ this.setStringForKey(dateIni,this.pDateIni);};
	Schedule.prototype.getDateIni = function(){ return this.stringForKey(this.pDateIni); };
	
	Schedule.prototype.setDateEnd = function(/*String*/ dateEnd){ this.setStringForKey(dateEnd,this.pDateEnd);};
	Schedule.prototype.getDateEnd = function(){ return this.stringForKey(this.pDateEnd);};

	Schedule.prototype.setHourIni = function(/*String*/ hourIni){ this.setStringForKey(hourIni,this.pHourIni);};
	Schedule.prototype.getHourIni = function(){ return this.stringForKey(this.pHourIni); };
	
	Schedule.prototype.setHourEnd = function(/*String*/ hourEnd){ this.setStringForKey(hourEnd,this.pHourEnd);};
	Schedule.prototype.getHourEnd = function(){ return this.stringForKey(this.pHourEnd);};
	
	Schedule.prototype.setName = function(/*String*/ name) { this.setStringForKey(name,this.pName); };
	Schedule.prototype.getName = function()  { return this.stringForKey(this.pName); };
	
	Schedule.prototype.setIdinfocard = function(/*String*/ Idinfocard){ this.setStringForKey(Idinfocard,this.pIdinfocard);};
	Schedule.prototype.getIdinfocard = function(){ return this.stringForKey(this.pIdinfocard);};
	
	Schedule.prototype.setMaxUser = function(/*int*/ maxUser){ this.setIntForKey(maxUser,this.pMaxUser);};
	Schedule.prototype.getMaxUser = function(){ return this.intForKey(this.pMaxUser);};
	
	Schedule.prototype.setAntennasList = function(/*List*/ AntennasList) { this.setListForKey(AntennasList,this.pAntennasList); };
	Schedule.prototype.getAntennasList = function()  { return this.listForKey(this.pAntennasList); };
	Schedule.prototype.addAntennasToList = function(/*String Schedule.id */ AntennasId) { this.addItemToListForKey(AntennasId,this.pAntennasList);};
	Schedule.prototype.removeAntennasIdInAntennasList = function(/*String Schedule.id */ AntennasId) { this.removeElementInListForKey(AntennasId,this.pAntennasList);};
	Schedule.prototype.removeIndexInAntennasList = function(/*int posicion */ index) { this.removeIndexInListForKey(index,this.pAntennasList);};
	
	/* REPETICION */
	Schedule.prototype.setRepetition = function(/*int*/ repetition){this.setIntForKey(repetition,this.pRepetition);};
	Schedule.prototype.getRepetition = function(){ return this.intForKey(this.pRepetition);};
	
	Schedule.prototype.setEveryDaily = function(/*int*/ everyDaily){this.setIntForKey(everyDaily,this.pEveryDaily);};
	Schedule.prototype.getEveryDaily = function(){ return this.intForKey(this.pEveryDaily);};
	
	Schedule.prototype.setEveryWeekly = function(/*int*/ everyWeekly){this.setIntForKey(everyWeekly,this.pEveryWeekly);};
	Schedule.prototype.getEveryWeekly = function(){ return this.intForKey(this.pEveryWeekly);};
	
	Schedule.prototype.setEveryMonthly = function(/*int*/ everyMonthly){this.setIntForKey(everyMonthly,this.pEveryMonthly);};
	Schedule.prototype.getEveryMonthly = function(){ return this.intForKey(this.pEveryMonthly);};
	
	Schedule.prototype.setEveryYearly = function(/*int*/ everyYearly){this.setIntForKey(everyYearly,this.pEveryYearly);};
	Schedule.prototype.getEveryYearly = function(){ return this.intForKey(this.pEveryYearly);};
	
	Schedule.prototype.setEveryExactlySelection = function(/*int*/ everyExactlySelection){this.setIntForKey(everyExactlySelection,this.pEveryExactlySelection);};
	Schedule.prototype.getEveryExactlySelection = function(){ return this.intForKey(this.pEveryExactlySelection);};
	
	Schedule.prototype.setEveryExactlyDay = function(/*int*/ everyExactlyDay){this.setIntForKey(everyExactlyDay,this.pEveryExactlyDay);};
	Schedule.prototype.getEveryExactlyDay = function(){ return this.intForKey(this.pEveryExactlyDay);};
	
	Schedule.prototype.setEvery = function(/*int*/ every){this.setIntForKey(every,this.pEvery);};
	Schedule.prototype.getEvery = function(){ return this.intForKey(this.pEvery);};
	/**	FIN **/
	
	/*** END && STATIC ***/
	Schedule.prototype.setEnd = function(/*int*/ end){this.setIntForKey(end,this.pEnd);};
	Schedule.prototype.getEnd = function(){ return this.intForKey(this.pEnd);};
	
	Schedule.prototype.setStatico = function(/*bool*/ statico){this.setBoolForKey(statico,this.pStatico);};
	Schedule.prototype.getStatico = function(){ return this.boolForKey(this.pStatico);};
	
	
	/*********DIAS**********/
	
	Schedule.prototype.setDay1 = function(/*bool*/ day1){this.setBoolForKey(day1,this.pDay1);};
	Schedule.prototype.getDay1 = function(){ return this.boolForKey(this.pDay1);};
	
	Schedule.prototype.setDay2 = function(/*bool*/ day2){this.setBoolForKey(day2,this.pDay2);};
	Schedule.prototype.getDay2 = function(){ return this.boolForKey(this.pDay2);};
	
	Schedule.prototype.setDay3 = function(/*bool*/ day3){this.setBoolForKey(day3,this.pDay3);};
	Schedule.prototype.getDay3 = function(){ return this.boolForKey(this.pDay3);};
	
	Schedule.prototype.setDay4 = function(/*bool*/ day4){this.setBoolForKey(day4,this.pDay4);};
	Schedule.prototype.getDay4 = function(){ return this.boolForKey(this.pDay4);};
	
	Schedule.prototype.setDay5 = function(/*bool*/ day5){this.setBoolForKey(day5,this.pDay5);};
	Schedule.prototype.getDay5 = function(){ return this.boolForKey(this.pDay5);};
	
	Schedule.prototype.setDay6 = function(/*bool*/ day6){this.setBoolForKey(day6,this.pDay6);};
	Schedule.prototype.getDay6 = function(){ return this.boolForKey(this.pDay6);};
	
	Schedule.prototype.setDay7 = function(/*bool*/ day7){this.setBoolForKey(day7,this.pDay7);};
	Schedule.prototype.getDay7 = function(){ return this.boolForKey(this.pDay7);};
	
	Schedule.prototype.setDay8 = function(/*bool*/ day8){this.setBoolForKey(day8,this.pDay8);};
	Schedule.prototype.getDay8 = function(){ return this.boolForKey(this.pDay8);};

	Schedule.prototype.setDay9 = function(/*bool*/ day9){this.setBoolForKey(day9,this.pDay9);};
	Schedule.prototype.getDay9 = function(){ return this.boolForKey(this.pDay9);};
	
	Schedule.prototype.setDay10 = function(/*bool*/ day10){this.setBoolForKey(day10,this.pDay10);};
	Schedule.prototype.getDay10 = function(){ return this.boolForKey(this.pDay10);};
	
	Schedule.prototype.setDay11 = function(/*bool*/ day11){this.setBoolForKey(day11,this.pDay11);};
	Schedule.prototype.getDay11 = function(){ return this.boolForKey(this.pDay11);};
	
	Schedule.prototype.setDay12 = function(/*bool*/ day12){this.setBoolForKey(day12,this.pDay12);};
	Schedule.prototype.getDay12 = function(){ return this.boolForKey(this.pDay12);};
	
	Schedule.prototype.setDay13 = function(/*bool*/ day13){this.setBoolForKey(day13,this.pDay13);};
	Schedule.prototype.getDay13 = function(){ return this.boolForKey(this.pDay13);};
	
	Schedule.prototype.setDay14 = function(/*bool*/ day14){this.setBoolForKey(day14,this.pDay14);};
	Schedule.prototype.getDay14 = function(){ return this.boolForKey(this.pDay14);};
	
	Schedule.prototype.setDay15 = function(/*bool*/ day15){this.setBoolForKey(day15,this.pDay15);};
	Schedule.prototype.getDay15 = function(){ return this.boolForKey(this.pDay15);};
	
	Schedule.prototype.setDay16 = function(/*bool*/ day16){this.setBoolForKey(day16,this.pDay16);};
	Schedule.prototype.getDay16 = function(){ return this.boolForKey(this.pDay16);};
	
	Schedule.prototype.setDay17 = function(/*bool*/ day17){this.setBoolForKey(day17,this.pDay17);};
	Schedule.prototype.getDay17 = function(){ return this.boolForKey(this.pDay17);};
	
	Schedule.prototype.setDay18 = function(/*bool*/ day18){this.setBoolForKey(day18,this.pDay18);};
	Schedule.prototype.getDay18 = function(){ return this.boolForKey(this.pDay18);};
	
	Schedule.prototype.setDay19 = function(/*bool*/ day19){this.setBoolForKey(day19,this.pDay19);};
	Schedule.prototype.getDay19 = function(){ return this.boolForKey(this.pDay19);};
	
	Schedule.prototype.setDay20 = function(/*bool*/ day20){this.setBoolForKey(day20,this.pDay20);};
	Schedule.prototype.getDay20 = function(){ return this.boolForKey(this.pDay20);};
	
	Schedule.prototype.setDay21= function(/*bool*/ day21){this.setBoolForKey(day21,this.pDay21);};
	Schedule.prototype.getDay21 = function(){ return this.boolForKey(this.pDay21);};
	
	Schedule.prototype.setDay22 = function(/*bool*/ day22){this.setBoolForKey(day22,this.pDay22);};
	Schedule.prototype.getDay22 = function(){ return this.boolForKey(this.pDay22);};
	
	Schedule.prototype.setDay23 = function(/*bool*/ day23){this.setBoolForKey(day23,this.pDay23);};
	Schedule.prototype.getDay23 = function(){ return this.boolForKey(this.pDay23);};
	
	Schedule.prototype.setDay24 = function(/*bool*/ day24){this.setBoolForKey(day24,this.pDay24);};
	Schedule.prototype.getDay24 = function(){ return this.boolForKey(this.pDay24);};
	
	Schedule.prototype.setDay25 = function(/*bool*/ day25){this.setBoolForKey(day25,this.pDay25);};
	Schedule.prototype.getDay25 = function(){ return this.boolForKey(this.pDay25);};
	
	Schedule.prototype.setDay26 = function(/*bool*/ day26){this.setBoolForKey(day26,this.pDay26);};
	Schedule.prototype.getDay26 = function(){ return this.boolForKey(this.pDay26);};
	
	Schedule.prototype.setDay27 = function(/*bool*/ day27){this.setBoolForKey(day27,this.pDay27);};
	Schedule.prototype.getDay27 = function(){ return this.boolForKey(this.pDay27);};
	
	Schedule.prototype.setDay28 = function(/*bool*/ day28){this.setBoolForKey(day28,this.pDay28);};
	Schedule.prototype.getDay28 = function(){ return this.boolForKey(this.pDay28);};
	
	Schedule.prototype.setDay29 = function(/*bool*/ day29){this.setBoolForKey(day29,this.pDay29);};
	Schedule.prototype.getDay29 = function(){ return this.boolForKey(this.pDay29);};
	
	Schedule.prototype.setDay30 = function(/*bool*/ day30){this.setBoolForKey(day30,this.pDay30);};
	Schedule.prototype.getDay30 = function(){ return this.boolForKey(this.pDay30);};
	
	Schedule.prototype.setDay31 = function(/*bool*/ day31){this.setBoolForKey(day31,this.pDay31);};
	Schedule.prototype.getDay31 = function(){ return this.boolForKey(this.pDay31);};
	
	/*************** dias de la semana *****************/
	
	Schedule.prototype.setMonday = function(/*bool*/ monday){this.setBoolForKey(monday,this.pMonday);};
	Schedule.prototype.getMonday = function(){ return this.boolForKey(this.pMonday);};
	
	Schedule.prototype.setTuesday = function(/*bool*/ tuesday){this.setBoolForKey(tuesday,this.pTuesday);};
	Schedule.prototype.getTuesday = function(){ return this.boolForKey(this.pTuesday);};
	
	Schedule.prototype.setWednesday = function(/*bool*/ wednesday){this.setBoolForKey(wednesday,this.pWednesday);};
	Schedule.prototype.getWednesday = function(){ return this.boolForKey(this.pWednesday);};
	
	Schedule.prototype.setThursday = function(/*bool*/ thursday){this.setBoolForKey(thursday,this.pThursday);};
	Schedule.prototype.getThursday = function(){ return this.boolForKey(this.pThursday);};
	
	Schedule.prototype.setFriday = function(/*bool*/ friday){this.setBoolForKey(friday,this.pFriday);};
	Schedule.prototype.getFriday = function(){ return this.boolForKey(this.pFriday);};
	
	Schedule.prototype.setSaturday = function(/*bool*/ saturday){this.setBoolForKey(saturday,this.pSaturday);};
	Schedule.prototype.getSaturday = function(){ return this.boolForKey(this.pSaturday);};
	
	Schedule.prototype.setSunday = function(/*bool*/ sunday){this.setBoolForKey(sunday,this.pSunday);};
	Schedule.prototype.getSunday = function(){ return this.boolForKey(this.pSunday);};

	/********************* nombre de los meses **************************/
	
	Schedule.prototype.setJanuary = function(/*bool*/ january){this.setBoolForKey(january,this.pJanuary);};
	Schedule.prototype.getJanuary = function(){ return this.boolForKey(this.pJanuary);};
	
	Schedule.prototype.setFebruary = function(/*bool*/ february){this.setBoolForKey(february,this.pFebruary);};
	Schedule.prototype.getFebruary = function(){ return this.boolForKey(this.pFebruary);};
	
	Schedule.prototype.setMarch = function(/*bool*/ march){this.setBoolForKey(march,this.pMarch);};
	Schedule.prototype.getMarch = function(){ return this.boolForKey(this.pMarch);};
	
	Schedule.prototype.setApril = function(/*bool*/ april){this.setBoolForKey(april,this.pApril);};
	Schedule.prototype.getApril = function(){ return this.boolForKey(this.pApril);};
	
	Schedule.prototype.setMay = function(/*bool*/ may){this.setBoolForKey(may,this.pMay);};
	Schedule.prototype.getMay = function(){ return this.boolForKey(this.pMay);};
	
	Schedule.prototype.setJune = function(/*bool*/ june){this.setBoolForKey(june,this.pJune);};
	Schedule.prototype.getJune = function(){ return this.boolForKey(this.pJune);};
	
	Schedule.prototype.setJuly = function(/*bool*/ july){this.setBoolForKey(july,this.pJuly);};
	Schedule.prototype.getJuly = function(){ return this.boolForKey(this.pJuly);};
	
	Schedule.prototype.setAugust = function(/*bool*/ august){this.setBoolForKey(august,this.pAugust);};
	Schedule.prototype.getAugust = function(){ return this.boolForKey(this.pAugust);};
	
	Schedule.prototype.setSeptember = function(/*bool*/ september){this.setBoolForKey(september,this.pSeptember);};
	Schedule.prototype.getSeptember = function(){ return this.boolForKey(this.pSeptember);};
	
	Schedule.prototype.setOctober = function(/*bool*/ october){this.setBoolForKey(october,this.pOctober);};
	Schedule.prototype.getOctober = function(){ return this.boolForKey(this.pOctober);};
	
	Schedule.prototype.setNovember = function(/*bool*/ november){this.setBoolForKey(november,this.pNovember);};
	Schedule.prototype.getNovember = function(){ return this.boolForKey(this.pNovember);};
	
	Schedule.prototype.setDecember = function(/*bool*/ december){this.setBoolForKey(december,this.pDecember);};
	Schedule.prototype.getDecember = function(){ return this.boolForKey(this.pDecember);};
	/********************* fin nombre de los meses **************************/
	
	//Create Properties

	Schedule.prototype.dateIni = "";
	Object.defineProperty(Schedule.prototype,"dateIni",{
		set	: function dateIni(v) { this.setDateIni(v); },
		get : function dateIni() { return this.getDateIni(); }
	});

	Schedule.prototype.dateEnd = "";
	Object.defineProperty(Schedule.prototype,"dateEnd",{
		set	: function dateEnd(v) { this.setDateEnd(v); },
		get : function dateEnd() { return this.getDateEnd(); }
	});

	Schedule.prototype.hourIni = "";
	Object.defineProperty(Schedule.prototype,"hourIni",{
		set	: function hourIni(v) { this.setHourIni(v); },
		get : function hourIni() { return this.getHourIni(); }
	});

	Schedule.prototype.hourEnd = "";
	Object.defineProperty(Schedule.prototype,"hourEnd",{
		set	: function hourEnd(v) { this.setHourEnd(v); },
		get : function hourEnd() { return this.getHourEnd(); }
	});

	Schedule.prototype.name = "";
	Object.defineProperty(Schedule.prototype, "name", {
			set : function name(v) { this.setName(v); },
		    get : function name()  { return this.getName(); }
	});
	
	Schedule.prototype.Idinfocard = "";
	Object.defineProperty(Schedule.prototype,"Idinfocard",{
		set	: function Idinfocard(v) { this.setIdinfocard(v); },
		get : function Idinfocard() { return this.getIdinfocard(); }
	});

	Schedule.prototype.maxUser = "";
	Object.defineProperty(Schedule.prototype,"maxUser",{
		set	: function maxUser(v) { this.setMaxUser(v); },
		get : function maxUser() { return this.getMaxUser(); }
	});

	Schedule.prototype.AntennasList = [];
	Object.defineProperty(Schedule.prototype, "AntennasList", {
			set : function AntennasList(v) { this.setAntennasList(v); },
		    get : function AntennasList()  { return this.getAntennasList();}
	});
	
	/****************************** REPETICION *************************************/
	
	Schedule.prototype.repetition = "";
	Object.defineProperty(Schedule.prototype,"repetition",{
		set	: function repetition(v) { this.setRepetition(v); },
		get : function repetition() { return this.getRepetition(); }
	});
	
	Schedule.prototype.everyDaily = "";
	Object.defineProperty(Schedule.prototype,"everyDaily",{
		set	: function everyDaily(v) { this.setEveryDaily(v); },
		get : function everyDaily() { return this.getEveryDaily(); }
	});

	Schedule.prototype.everyWeekly = "";
	Object.defineProperty(Schedule.prototype,"everyWeekly",{
		set	: function everyWeekly(v) { this.setEveryWeekly(v); },
		get : function everyWeekly() { return this.getEveryWeekly(); }
	});
	
	Schedule.prototype.everyMonthly = "";
	Object.defineProperty(Schedule.prototype,"everyMonthly",{
		set	: function everyMonthly(v) { this.setEveryMonthly(v); },
		get : function everyMonthly() { return this.getEveryMonthly(); }
	});
	
	Schedule.prototype.everyYearly = "";
	Object.defineProperty(Schedule.prototype,"everyYearly",{
		set	: function everyYearly(v) { this.setEveryYearly(v); },
		get : function everyYearly() { return this.getEveryYearly(); }
	});
	
	Schedule.prototype.everyExactlySelection = "";
	Object.defineProperty(Schedule.prototype,"everyExactlySelection",{
		set	: function everyExactlySelection(v) { this.setEveryExactlySelection(v); },
		get : function everyExactlySelection() { return this.getEveryExactlySelection (); }
	});
	
	Schedule.prototype.everyExactlyDay = "";
	Object.defineProperty(Schedule.prototype,"everyExactlyDay",{
		set	: function everyExactlyDay(v) { this.setEveryExactlyDay(v); },
		get : function everyExactlyDay() { return this.getEveryExactlyDay(); }
	});
	
	Schedule.prototype.every = "";
	Object.defineProperty(Schedule.prototype,"every",{
		set	: function every(v) { this.setEvery(v); },
		get : function every() { return this.getEvery(); }
	});
	
	/** FIN **/
	
	/*** END && STATICO ***/
	
	Schedule.prototype.end = "";
	Object.defineProperty(Schedule.prototype,"end",{
		set	: function end(v) { this.setEnd(v); },
		get : function end() { return this.getEnd(); }
	});
	
	Schedule.prototype.statico = "";
	Object.defineProperty(Schedule.prototype,"statico",{
		set	: function statico(v) { this.setStatico(v); },
		get : function statico() { return this.getStatico(); }
	});
	
	/** DIAS **/
	
	Schedule.prototype.day1 = "";
	Object.defineProperty(Schedule.prototype,"day1",{
		set	: function day1(v) { this.setDay1(v); },
		get : function day1() { return this.getDay1(); }
	});
	
	Schedule.prototype.day2 = "";
	Object.defineProperty(Schedule.prototype,"day2",{
		set	: function day2(v) { this.setDay2(v); },
		get : function day2() { return this.getDay2(); }
	});
	
	Schedule.prototype.day3 = "";
	Object.defineProperty(Schedule.prototype,"day3",{
		set	: function day3(v) { this.setDay3(v); },
		get : function day3() { return this.getDay3(); }
	});
	
	Schedule.prototype.day4 = "";
	Object.defineProperty(Schedule.prototype,"day4",{
		set	: function day4(v) { this.setDay4(v); },
		get : function day4() { return this.getDay4(); }
	});
	
	Schedule.prototype.day5 = "";
	Object.defineProperty(Schedule.prototype,"day5",{
		set	: function day5(v) { this.setDay5(v); },
		get : function day5() { return this.getDay5(); }
	});
	
	Schedule.prototype.day6 = "";
	Object.defineProperty(Schedule.prototype,"day6",{
		set	: function day6(v) { this.setDay6(v); },
		get : function day6() { return this.getDay6(); }
	});
	

	Schedule.prototype.day7 = "";
	Object.defineProperty(Schedule.prototype,"day7",{
		set	: function day7(v) { this.setDay7(v); },
		get : function day7() { return this.getDay7(); }
	});
	
	Schedule.prototype.day8 = "";
	Object.defineProperty(Schedule.prototype,"day8",{
		set	: function day8(v) { this.setDay8(v); },
		get : function day8() { return this.getDay8(); }
	});
	
	Schedule.prototype.day9 = "";
	Object.defineProperty(Schedule.prototype,"day9",{
		set	: function day9(v) { this.setDay9(v); },
		get : function day9() { return this.getDay9(); }
	});
	
	Schedule.prototype.day10 = "";
	Object.defineProperty(Schedule.prototype,"day10",{
		set	: function day10(v) { this.setDay10(v); },
		get : function day10() { return this.getDay10(); }
	});
	
	Schedule.prototype.day11 = "";
	Object.defineProperty(Schedule.prototype,"day11",{
		set	: function day11(v) { this.setDay11(v); },
		get : function day11() { return this.getDay11(); }
	});
	
	Schedule.prototype.day12 = "";
	Object.defineProperty(Schedule.prototype,"day12",{
		set	: function day12(v) { this.setDay12(v); },
		get : function day12() { return this.getDay12(); }
	});

	Schedule.prototype.day13 = "";
	Object.defineProperty(Schedule.prototype,"day13",{
		set	: function day13(v) { this.setDay13(v); },
		get : function day13() { return this.getDay13(); }
	});
	
	Schedule.prototype.day14 = "";
	Object.defineProperty(Schedule.prototype,"day14",{
		set	: function day14(v) { this.setDay14(v); },
		get : function day14() { return this.getDay14(); }
	});
	
	Schedule.prototype.day15 = "";
	Object.defineProperty(Schedule.prototype,"day15",{
		set	: function day15(v) { this.setDay15(v); },
		get : function day15() { return this.getDay15(); }
	});
	
	Schedule.prototype.day16 = "";
	Object.defineProperty(Schedule.prototype,"day16",{
		set	: function day16(v) { this.setDay16(v); },
		get : function day16() { return this.getDay16(); }
	});
	
	Schedule.prototype.day17 = "";
	Object.defineProperty(Schedule.prototype,"day17",{
		set	: function day17(v) { this.setDay17(v); },
		get : function day17() { return this.getDay17(); }
	});
	
	Schedule.prototype.day18 = "";
	Object.defineProperty(Schedule.prototype,"day18",{
		set	: function day18(v) { this.setDay18(v); },
		get : function day18() { return this.getDay18(); }
	});
	

	Schedule.prototype.day19 = "";
	Object.defineProperty(Schedule.prototype,"day19",{
		set	: function day19(v) { this.setDay19(v); },
		get : function day19() { return this.getDay19(); }
	});
		
	Schedule.prototype.day20 = "";
	Object.defineProperty(Schedule.prototype,"day20",{
		set	: function day20(v) { this.setDay20(v); },
		get : function day20() { return this.getDay20(); }
	});
	
	Schedule.prototype.day21 = "";
	Object.defineProperty(Schedule.prototype,"day21",{
		set	: function day21(v) { this.setDay21(v); },
		get : function day21() { return this.getDay21(); }
	});
	
	Schedule.prototype.day22 = "";
	Object.defineProperty(Schedule.prototype,"day22",{
		set	: function day22(v) { this.setDay22(v); },
		get : function day22() { return this.getDay22(); }
	});
	
	Schedule.prototype.day23 = "";
	Object.defineProperty(Schedule.prototype,"day23",{
		set	: function day23(v) { this.setDay23(v); },
		get : function day23() { return this.getDay23(); }
	});
	
	Schedule.prototype.day24 = "";
	Object.defineProperty(Schedule.prototype,"day24",{
		set	: function day24(v) { this.setDay24(v); },
		get : function day24() { return this.getDay24(); }
	});

	Schedule.prototype.day25 = "";
	Object.defineProperty(Schedule.prototype,"day25",{
		set	: function day25(v) { this.setDay25(v); },
		get : function day25() { return this.getDay25(); }
	});
	
	Schedule.prototype.day26 = "";
	Object.defineProperty(Schedule.prototype,"day26",{
		set	: function day26(v) { this.setDay26(v); },
		get : function day26() { return this.getDay26(); }
	});
	
	Schedule.prototype.day27 = "";
	Object.defineProperty(Schedule.prototype,"day27",{
		set	: function day27(v) { this.setDay27(v); },
		get : function day27() { return this.getDay27(); }
	});
	
	Schedule.prototype.day28 = "";
	Object.defineProperty(Schedule.prototype,"day28",{
		set	: function day28(v) { this.setDay28(v); },
		get : function day28() { return this.getDay28(); }
	});
	
	Schedule.prototype.day29 = "";
	Object.defineProperty(Schedule.prototype,"day29",{
		set	: function day29(v) { this.setDay29(v); },
		get : function day29() { return this.getDay29(); }
	});

	Schedule.prototype.day30 = "";
	Object.defineProperty(Schedule.prototype,"day30",{
		set	: function day30(v) { this.setDay30(v); },
		get : function day30() { return this.getDay30(); }
	});
	
	Schedule.prototype.day31 = "";
	Object.defineProperty(Schedule.prototype,"day31",{
		set	: function day31(v) { this.setDay31(v); },
		get : function day31() { return this.getDay31(); }
	});


/********* dias de la semana *********/
		
	Schedule.prototype.monday = "";
	Object.defineProperty(Schedule.prototype,"monday",{
		set	: function monday(v) { this.setMonday(v); },
		get : function monday() { return this.getMonday(); }
	});
	
	Schedule.prototype.tuesday = "";
	Object.defineProperty(Schedule.prototype,"tuesday",{
		set	: function tuesday(v) { this.setTuesday(v); },
		get : function tuesday() { return this.getTuesday(); }
	});
	
	Schedule.prototype.wednesday = "";
	Object.defineProperty(Schedule.prototype,"wednesday",{
		set	: function wednesday(v) { this.setWednesday(v); },
		get : function wednesday() { return this.getWednesday(); }
	});
	
	Schedule.prototype.thursday = "";
	Object.defineProperty(Schedule.prototype,"thursday",{
		set	: function thursday(v) { this.setThursday(v); },
		get : function thursday() { return this.getThursday(); }
	});
	
	Schedule.prototype.friday = "";
	Object.defineProperty(Schedule.prototype,"friday",{
		set	: function friday(v) { this.setFriday(v); },
		get : function friday() { return this.getFriday(); }
	});

	Schedule.prototype.saturday = "";
	Object.defineProperty(Schedule.prototype,"saturday",{
		set	: function saturday(v) { this.setSaturday(v); },
		get : function saturday() { return this.getSaturday(); }
	});
	
	Schedule.prototype.sunday = "";
	Object.defineProperty(Schedule.prototype,"sunday",{
		set	: function sunday(v) { this.setSunday(v); },
		get : function sunday() { return this.getSunday(); }
	});

	/********************* nombre de los meses **************************/
	
	Schedule.prototype.january = "";
	Object.defineProperty(Schedule.prototype,"january",{
		set	: function january(v) { this.setJanuary(v); },
		get : function january() { return this.getJanuary(); }
	});
	
	Schedule.prototype.february = "";
	Object.defineProperty(Schedule.prototype,"february",{
		set	: function february(v) { this.setFebruary(v); },
		get : function february() { return this.getFebruary(); }
	});
	
	Schedule.prototype.march = "";
	Object.defineProperty(Schedule.prototype,"march",{
		set	: function march(v) { this.setMarch(v); },
		get : function march() { return this.getMarch(); }
	});
	
	Schedule.prototype.april = "";
	Object.defineProperty(Schedule.prototype,"april",{
		set	: function april(v) { this.setApril(v); },
		get : function april() { return this.getApril(); }
	});
	
	Schedule.prototype.may = "";
	Object.defineProperty(Schedule.prototype,"may",{
		set	: function may(v) { this.setMay(v); },
		get : function may() { return this.getMay(); }
	});
	
	Schedule.prototype.june = "";
	Object.defineProperty(Schedule.prototype,"june",{
		set	: function june(v) { this.setJune(v); },
		get : function june() { return this.getJune(); }
	});
	
	Schedule.prototype.july = "";
	Object.defineProperty(Schedule.prototype,"july",{
		set	: function july(v) { this.setJuly(v); },
		get : function july() { return this.getJuly(); }
	});

	Schedule.prototype.august = "";
	Object.defineProperty(Schedule.prototype,"august",{
		set	: function august(v) { this.setAugust(v); },
		get : function august() { return this.getAugust(); }
	});
	
	Schedule.prototype.september = "";
	Object.defineProperty(Schedule.prototype,"september",{
		set	: function september(v) { this.setSeptember(v); },
		get : function september() { return this.getSeptember(); }
	});
	
	Schedule.prototype.october = "";
	Object.defineProperty(Schedule.prototype,"october",{
		set	: function october(v) { this.setOctober(v); },
		get : function october() { return this.getOctober(); }
	});
	
	Schedule.prototype.november = "";
	Object.defineProperty(Schedule.prototype,"november",{
		set	: function november(v) { this.setNovember(v); },
		get : function november() { return this.getNovember(); }
	});
	
	Schedule.prototype.december = "";
	Object.defineProperty(Schedule.prototype,"december",{
		set	: function december(v) { this.setDecember(v); },
		get : function december() { return this.getDecember(); }
	});
	

	
	
	
asm.setServerUrl(fibity.manager.api.url);
asm.setServerAuthentication("2308jidj98iasughc87sh78ch8", "asdb87nauisjhbdi723uybhs8d7", "asdjn98787ashd87atsd7fguajh9");
asm.setExpiredTime(3600);
      
asm.configKind( Antenna.entityKind,				   true,  		   true,			 60);
asm.configKind( AntennaActivation.entityKind,       true,           true,          60);
asm.configKind( Schedule.entityKind,                true,           true,          60);
//asm.configKind( Config.entityKind,                false,          true,          60000);
asm.configKind( InfoCard.entityKind,                true,           true,          60);
asm.configKind( Organization.entityKind,            true,           true,          60);   
asm.configKind( Campaign.entityKind,        		   true,           true,          60);    
asm.configKind( Customers.entityKind,               true,           true,          60);  
asm.configKind( Billing.entityKind,                 true,           true,          60);        
asm.configKind(   "record",                         true,           true,          60);
asm.configKind(   "version",                        true,           true,          60);
(function (module) {
     
    var fileReader = function ($q, $log) {
 
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
        };
    };
 
    module.factory("fileReader",
                   ["$q", "$log", fileReader]);
 
}(angular.module("fbtmApp")));
// directiva del focus	
	
angular.module('ng').directive('ngFocus', ["$timeout", function($timeout) {
	    return {
	        link: function ( scope, element, attrs ) {
	            scope.$watch( attrs.ngFocus, function ( val ) {
	                if ( angular.isDefined( val ) && val ) {
	                    $timeout( function () { element[0].focus(); } );
	                }
	            }, true);
	            
	            element.bind('blur', function () {
	                if ( angular.isDefined( attrs.ngFocusLost ) ) {
	                    scope.$apply( attrs.ngFocusLost );
	                    
	                }
	            });
	        }
	    };
	}]);	

//angular.module('GTTopBarComponent', [])
fibity.manager.app.directive('fbtmTopbar', function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = 'views/components/fbtmTopbarComponent.html',

	 directive.scope = {
			 	profile : "=",
			 	path : "="
	 };
	 
	 return directive;
});
fibity.manager.app.directive('fbtmSidebar',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = 'views/components/fbtmSidebarComponent.html',

	 // atributos de la directiva <fbtmSidebar activeitem="atributo"></fbtmSidebar>
	 directive.scope = {
			 	active : "=activeitem"
	 };

	 directive.link = function (scope) {
		 scope.options = [{"id": "dashboard" ,"title": "Panel principal", "cssclass" : "glyphicon glyphicon-dashboard "},
		                  {"id": "organization", "title": "Organización", "cssclass" : "glyphicon glyphicon-list-alt"},
		                  {"id": "antennas", "title": "Antenas", "cssclass" : "glyphicon glyphicon-map-marker"},
		                  {"id": "infocard", "title": "Contenido", "cssclass" : "glyphicon glyphicon-picture"},
		                  {"id": "campaigns", "title": "Campañas", "cssclass" : "glyphicon glyphicon-calendar"},
		                  {"id": "customers", "title": "Clientes", "cssclass" : "glyphicon glyphicon-user"},
		                  {"id": "billing", "title": "Facturación", "cssclass" : "glyphicon glyphicon-credit-card"}
		                 ];
     };
     
	 return directive;
});

fibity.manager.app.directive('piechart',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = 'views/components/fbtm_piechart_component.html';
	 
	 return directive;
})
.controller('pieCtrl', ["$scope", function ($scope) {
	$scope.pieData = [
	                  {
	                    value: 30,
	                    color:"#F38630",
	                  },
	                  {
	                    value : 50,
	                    color : "#E0E4CC"
	                  },
	                  {
	                    value : 100,
	                    color : "#69D2E7"
	                  }
	                ];
}]);

fibity.manager.app.directive('linechart',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = 'views/components/fbtm_linechart_component.html';
	 
	 return directive;
});


fibity.manager.app.controller('lineCtrl', ["$scope", function ($scope) {
	$scope.lineData = {
	    labels : ["January","February","March","April","May","June","July"],
	    datasets : [
	      {
	        fillColor : "#B0F0B1", /*fondo*/
	        strokeColor : "#178F19", /* line que une los puntos*/
	        pointColor : "#04B431", /* color del puntos */
	        pointStrokeColor : "#178F19", /* border de los puntos*/
	        data : [28,48,40,19,96,27,100]
	      }
	    ]
	  };
}]);

fibity.manager.app.directive('barchart',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = 'views/components/fbtm_barchart_component.html';
	 
	 return directive;
});


fibity.manager.app.controller('barCtrl', ["$scope", function ($scope) {
	$scope.barData = {
		    labels : ["January","February","March","April","May","June","July"],
		    datasets : [
		      {
		        fillColor : "#B0F0B1",
		        strokeColor : "#04B431",
		        data : [65,59,90,81,56,55,40]
		      }
		    ]
		  };
}]);

fibity.manager.app.directive('swicthFibity',function(){
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = 'views/components/fbtm_switch_component.html';
	 directive.scope = {
			 profile : "=profile"
	 };

	 return directive;
});


fibity.manager.app.directive('donutChart', function(){
      function link(scope, el, attr){
        var color = d3.scale.category10();
        var width = 200;
        var height = 200;
        var min = Math.min(width, height);
        var svg = d3.select(el[0]).append('svg');
        var pie = d3.layout.pie().sort(null);
        var arc = d3.svg.arc()
          .outerRadius(min / 2 * 0.9)
          .innerRadius(min / 2 * 0.5);

        pie.value(function(d){ return d.value; });
    
        svg.attr({width: width, height: height});
        var g = svg.append('g')
          // center the donut chart
          .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        
        // add the <path>s for each arc slice
        var arcs = g.selectAll('path');

        scope.$watch('data', function(data){
          arcs = arcs.data(pie(data));
          arcs.enter().append('path')
            .style('stroke', 'white')
            .attr('fill', function(d, i){ return color(i); });
          arcs.exit().remove();
          arcs.attr('d', arc);
        }, true);
      }
      return {
        link: link,
        restrict: 'E',
        scope: { data: '=' }
      };
    });
fibity.manager.app.directive('fbtmInputFileLoader',['fileReader', function(fileReader) {
	 var directive = {};

	 directive.restrict = 'E'; /* restrict this directive to elements */

	 directive.templateUrl = 'views/components/fbtm_input_file_loader.html';

	 // atributos de la directiva <fbtmInputFileLoader imgmodel="modelo"></fbtmSidebar>
	 directive.scope = {
			 imgmodel : "=imgmodel",
			 file : "=file"
			// maxheight : "=maxheight";
	 		// ratio : "=ratio";
	 };

	 directive.link = function (scope, el) {
		 scope.only = false;
		 el.bind("change", function(e){
		        scope.file = (e.srcElement || e.target).files[0];
		        fileReader.readAsDataUrl(scope.file, scope)
		        .then(function(result) {
		            scope.imgmodel = result;
		        });
		  });
     };
	 return directive;
}]);
fibity.manager.app.controller('GTLoginVC',['$scope', '$http', '$route',  function($scope,$http,$route){
	$scope.errorMsg = false;
    $scope.doLogin = function(){
    		$scope.errorMsg = false;
    		asm.login($scope.email, $scope.password).then(function(processOK){
    			if(processOK){
    				asm.getProfile().then();
    			}else{
    				console.log("usuario y constraseña incorrecta!");
    				$scope.errorMsg = true;
    			}
    			$scope.$apply();
    		}).done();
    		
    };
}]);

fibity.manager.app.controller('GTLogoutVC',['$scope', '$http', '$route',  function($scope,$http,$route){
		console.log("logout");
    		asm.logout().then(function(){
    			$route.reload();
    		}).done();
    		
}]);

//var GTDashboardViewController = angular.module('GTDashboardViewController', [])
fibity.manager.app.controller('GTDashboardVC',['$scope', '$routeParams', function($scope,$routeParams){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	
	$scope.path = [{"name":"Panel principal", "href": "#/dashboard"}];

	$scope.title = "Panel Principal";
	$scope.activeitem = "dashboard";
	//$scope.param = $routeParams.param;
}]);



fibity.manager.app.controller('GTAntennasVC',['$scope','$routeParams', '$modal',  function($scope,$routeParams,$modal){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	$scope.path = [{"name":"Antenas", "href": "#/antennas/collection"}];
	$scope.title = "Antenas";
	$scope.activeitem = "antennas";
	//$scope.param = $routeParams.param;
	 $scope.listCab = ['Nombre','Lugar de instalaci\u00f3n','Departamento/Secci\u00f3n','Editar'];
	
     /* Mapa  */ $scope.antennaList = {};
     /* List  */ $scope.antennaKeyList = []; // Lista de ids de los objetos antenna del modelo

    Antenna.fromEntityList(asm.getAllEntitiesOfKind(Antenna.entityKind))
	.then(function(list){
		list.forEach(function(antenna){
			$scope.antennaKeyList.push(antenna.id);
			$scope.antennaList[antenna.id] = antenna;
			$scope.$apply();
		});
	}).done();

	 $scope.openAntennaModal = function(id){
		  
		  var modalInstance;
		  
		if(id == undefined){
			tmpAntenna = new Antenna();
			tmpAntenna.init({});
			tmpAntenna.name = "";
			tmpAntenna.location = "";
			tmpAntenna.section = "";

			modalInstance = $modal.open({
		    	templateUrl: '../views/antennas_modal_add.html',
		      	controller: "GTAntennasAddModalVC",
		      	size:'sm',
		    	resolve: {
		    		tmpAntenna: function () {
			                    return tmpAntenna;
			                }
		    		}
			});
			
		}else{
			modalInstance = $modal.open({
		    	templateUrl: '../views/antennas_modal_add.html',
		      	controller: "GTAntennasAddModalVC",
		      	size:'sm',
		    	resolve: {
		    		tmpAntenna: function () {
			                    return $scope.antennaList[id];
			                }
		    		}
			});
			
		}

	    modalInstance.result.then(function (tmpAntenna) {
	    	tmpAntenna.save()
	    	  .then(function(mapa){
	    		  if( $scope.antennaList[tmpAntenna.id] == undefined){
	    		  	$scope.antennaList[tmpAntenna.id] = tmpAntenna;
	    		  	$scope.antennaKeyList.push(tmpAntenna.id);
	    	  	}
	         }).done();  
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	  
	  $scope.crearListaAnt = function(){
		  
	       for(var i = 1; i <= 10 ; i++)
	              {
	    	   		 tmpAntenna = new Antenna();
	    	   		 tmpAntenna.init({});
    				 tmpAntenna.name = "Antena "+i;
    				 tmpAntenna.location = "Madrid";
    				 tmpAntenna.section = "Madrid";
    				 tmpAntenna.save()
    		    	  .then(function(mapa){
    		            $scope.antennaList[tmpAntenna.id] = tmpAntenna;
    		            $scope.antennaKeyList.push(tmpAntenna.id);
    		         }); 
	              }  
	    };
	  
	 $scope.borrarListaAnt = function()
	    { 
	      asm.removeAllEntitiesOfKind(Antenna.entityKind);
	      $scope.antennaKeyList = [];
	    };	
}]);

	
fibity.manager.app.controller('GTAntennasMapVC',['$scope','$routeParams','$modal', function($scope,$routeParams,$modal){
	/**
	 * Google Maps integration
	 */

	/******** Profile for TopBar Component *******/
	
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	
	$scope.path = [{"name":"Antenas", "href": "#/antennas"}, {"name":"Mapa", "href": "#/antennas/map"}];

	/********************************************/
	
	$scope.map = {center: {latitude: 40.358591, longitude: -3.68979 }, zoom: 18 };

	$scope.options = {
	          scrollwheel: true,
	          panControl: true,
	          streetViewControl: false,
	          zoomControlOptions : {
	            style: "SMALL"
	          }
	        };
    
    $scope.circles = [
                      {
                          id: 1,
                          center: {
                              latitude: 40.358650,
                              longitude: -3.69030
                          },
                          radius: 40,
                          stroke: {
                              color: '#08B21F',
                              weight: 2,
                              opacity: 1
                          },
                          fill: {
                              color: '#08B21F',
                              opacity: 0.5
                          },
                          geodesic: true, // optional: defaults to false
                          draggable: false, // optional: defaults to false
                          clickable: false, // optional: defaults to true
                          editable: false, // optional: defaults to false
                          visible: true // optional: defaults to true
                      }
                  ];
	
	$scope.title = "Mapa de Antenas (Fibity Zone)";
	$scope.activeitem = "antennas";
	$scope.marker = {
            id:0,
            coords: {
           	    latitude: 40.358650,
                longitude: -3.69030
            },
            options: { draggable: true },
            title: "Antena Fibity",
            icon: "images/fibity_marker.png",
            events: {
                dragend: function (marker, eventName, args) {
                    $log.log('marker dragend');
                    $log.log(marker.getPosition().lat());
                    $log.log(marker.getPosition().lng());
                    	$scope.circles[0].center.latitude = marker.getPosition().lat();
                    	$scope.circles[0].center.longitude = marker.getPosition().lng();
                   
                }
            }
    };
}]);

	
fibity.manager.app.controller('GTAntennasAddModalVC',['$scope','$modalInstance','tmpAntenna', function($scope,$modalInstance,tmpAntenna){

	 $scope.tmpAntenna = {};
	 $scope.activation = {};
	/*String*/ $scope.activation.txtcasilla1  = "";
	/*String*/ $scope.activation.txtcasilla2  = "";
	/*String*/ $scope.activation.txtcasilla3  = "";
	/*String*/ $scope.activation.txtcasilla4  = "";
    
    /*bool*/ $scope.ca1=false;
    /*bool*/ $scope.ca2=false;
    /*bool*/ $scope.ca3=false;
    /*bool*/ $scope.ca4=false;
    /*bool*/ $scope.boton1 = true;
    /*bool*/ $scope.boton2 = true;
    /*bool*/ $scope.cambio = false;
    /*bool*/ $scope.txtfocus1 = true;
    /*bool*/ $scope.txtfocus2 = false;
    /*bool*/ $scope.txtfocus3 = false;
    /*bool*/ $scope.txtfocus4 = false;
    /*bool*/ $scope.txtfocus5 = false;
    /*bool*/ $scope.txtfocus6 = false;
	
    /*String*/ $scope.urlImgOrgBackground = "";
	 
	 asm.getEntityOfKindById(Organization.entityKind,"myOrganization")
		.then(function(entity){
			if(entity != null){
				org = new Organization();
				org.initFromEntity(entity);
				$scope.urlImgOrgBackground = org.urlImgBackground;
			}
	 }).done();


	if(tmpAntenna.id != ""){
		$scope.cambio = true; // activar modo edicion.
		$scope.tmpAntenna.name = tmpAntenna.name;
		$scope.tmpAntenna.location = tmpAntenna.location;
		$scope.tmpAntenna.section = tmpAntenna.section;
	}else{
		$scope.tmpAntenna.name = "";
		$scope.tmpAntenna.location = "";
		$scope.tmpAntenna.section = "";
	}
	
    $scope.actualizarCasilla1 = function(){
    	if($scope.activation.txtcasilla1.length == 5)
    		{ 
    			$scope.ca1 = true;
    			$scope.txtfocus2 = true;
    		}
    	else
    		{
    			$scope.ca1 = false;
    		}
    	
    	$scope.activation.txtcasilla1 = $scope.activation.txtcasilla1.toUpperCase();
    	$scope.generarboton();
      };
      
      $scope.actualizarCasilla2 = function(){
      	if($scope.activation.txtcasilla2.length == 5)
      		{ 
      			$scope.ca2 = true;
      			$scope.txtfocus3 = true;
      		}
      	else
      		{
      			$scope.ca2 = false;
      		}
      		$scope.activation.txtcasilla2 = $scope.activation.txtcasilla2.toUpperCase();
	    	$scope.generarboton();
        };
        
        $scope.actualizarCasilla3 = function(){
        	if($scope.activation.txtcasilla3.length == 5)
        		{ 
        			$scope.ca3 = true;
        			$scope.txtfocus4 = true;
        		}
        	else
        		{
        			$scope.ca3 = false;	
        		}
        	$scope.activation.txtcasilla3 = $scope.activation.txtcasilla3.toUpperCase();
	    	$scope.generarboton();
          };  
      
        $scope.actualizarCasilla4 = function(){
          	if($scope.activation.txtcasilla4.length == 5)
          		{ 
          			$scope.ca4 = true;
          			$scope.txtfocus5 = true;
          		}
          	else
          		{
          			$scope.ca4 = false;
          		}
	  			$scope.activation.txtcasilla4 = $scope.activation.txtcasilla4.toUpperCase();
	  	    	$scope.generarboton();
            };
            
      $scope.comprobar = function(){
    	  $scope.tmpAntenna.name.length >=5 && $scope.tmpAntenna.location.length >=5 && $scope.tmpAntenna.section.length >=5 ? $scope.boton2 = false : $scope.boton2 = true;
      };  
	
      $scope.generarboton = function(){
    	  $scope.ca1 && $scope.ca2 && $scope.ca3 && $scope.ca4 ? $scope.boton1 = false : $scope.boton1 = true;
      };
    
      $scope.changeView = function(){
    	  $scope.cambio = true;
    	  $scope.txtfocus6 = true;
      };
	
	  $scope.ok = function () { 
		tmpAntenna.name = $scope.tmpAntenna.name;
		tmpAntenna.location = $scope.tmpAntenna.location;
		tmpAntenna.section = $scope.tmpAntenna.section;
	    $modalInstance.close(tmpAntenna);
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
}]);








fibity.manager.app.controller('GTBillingVC',['$scope', '$routeParams', '$modal',  function($scope,$routeParams,$modal){
	
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	
	$scope.title = "Facturación";
	$scope.activeitem = "billing";
	$scope.visible = true;
	$scope.cabecera = ['Periodo','Cuota','Consumo','Iva','Total','Download'];
	$scope.periodo = ['Enero 2014','Febrero 2014','Marzo 2014','Abril 2014','Mayo 2014', 'Junio 2014'];
	$scope.cuota = 19;
	$scope.factura = [];
	
	/* Mapa  */ $scope.billingList = {};
    /* List  */ $scope.billingKeyList = [];
    $scope.tmpbilling = new Billing();
	// Creamos La Factura
			for(var i = 0 ; i < $scope.periodo.length; i++)
			{
				var rng1 = Math.floor((Math.random() * 120) + 1);
				while(rng1 < 20)
					{
						rng1 = Math.floor((Math.random() * 120) + 1);
					}
				$scope.iva = $scope.cuota + rng1 * 0.21;
				$scope.total = $scope.cuota + rng1 + $scope.iva;
				$scope.factura.push({'periodo':$scope.periodo[i],'cuota':$scope.cuota,'consumo':rng1,'iva':$scope.iva.toFixed(2),'total':$scope.total.toFixed(2)});
			}
	// fin de la creacion de la factura
	
		$scope.billingId = "MyBilling";	
			
		 asm.getEntityOfKindById(Billing.entityKind,$scope.billingId)
			.then(function(entity){
				if(entity == null){
					$scope.tmpbilling.initWithId(Billing.entityKind,$scope.billingId,{});
					$scope.tmpbilling.razonSocial = "";
					$scope.tmpbilling.cif = "";
					$scope.tmpbilling.name = "";
					$scope.tmpbilling.apellido = "";
					$scope.tmpbilling.dni = "";
					$scope.tmpbilling.direccion1 = "";
					$scope.tmpbilling.direccion2 = "";
					$scope.tmpbilling.poblacion = "";
					$scope.tmpbilling.codigoPostal = "";
					$scope.tmpbilling.provincia = "";
					$scope.tmpbilling.telefono = "";
				}
				else
					{
						$scope.tmpbilling.initFromEntity(entity);
						$scope.tmpbilling.name == "" && $scope.tmpbilling.apellido == "" && $scope.tmpbilling.dni == "" ? $scope.visible = false : $scope.visible = true;
					}
				
			});
				
			$scope.openBillingModal = function () {
				var modalInstance; 
						modalInstance = $modal.open({
					    	templateUrl: '../views/billingEdit.html',
					      	controller: "GTBillingAddModalVC",
					    	resolve: {
					    		tmpbilling: function () {
						                    return $scope.tmpbilling;
						                }
					    		}
						});
					

				    modalInstance.result.then(function (tmpbilling) {
				    	tmpbilling.save();
				    }, function () {
				      $log.info('Modal dismissed at: ' + new Date());
				    });
				  };
}]);

fibity.manager.app.controller('GTBillingAddModalVC',['$scope', '$modalInstance', 'tmpbilling',  function($scope,$modalInstance,tmpbilling){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	
	console.log("Dentro"+tmpbilling);
	$scope.tmpbilling = tmpbilling;
	
	if($scope.tmpbilling.name == "" && $scope.tmpbilling.apellido == "" && $scope.tmpbilling.dni == ""){
		$scope.chequeandoEmpr = true;
		$scope.empr = true;
		$scope.aut = false;
	} 
	if($scope.tmpbilling.razonSocial == "" && $scope.tmpbilling.cif == ""){
		$scope.chequeandoAut = "checked"; 
		$scope.aut = true;
		$scope.empr = false;
	}
	
	

    /*bool*/ $scope.dni = false; // cambio de empresa
    /*bool*/ $scope.nif = true; // cambio de autonomo
    
    // placeholders
    
    /*String*/ $scope.plcrs = "Raz\u00f3n Social";
    /*String*/ $scope.plccif = "CIF";
    /*String*/ $scope.plcnb="Nombre";
    /*String*/ $scope.plcap="Apellidos";
    /*String*/ $scope.plcdni="00000000A";
    /*String*/ $scope.plcnif="X0000000A";
    //ambos
    /*String*/ $scope.plcdir1="av. Orovilla 54";
    /*String*/ $scope.plcdir2="Direccion Opcional";
    /*String*/ $scope.plcpob="Madrid";
    /*String*/ $scope.plctel="910000000";
   	/*String*/ $scope.plccp="28041";    
    /*String*/ $scope.plcpro="Provincia";     
    // fin
    //autonomo    
    /*String*/ $scope.prov = ['Seleccionar Provincia','\u00e1lava','Albacete','Alicante/Alacant','Almer\u00eda','Asturias','\u00e1vila','Badajoz','Barcelona','Burgos',
                             'C\u00e1ceres','C\u00e1diz','Cantabria','Castell\u00f3n','Ceuta','Ciudad real','C\u00f3rdoba','Cuenca',
                             'Girona','Las Palmas','Granada','Guadalajara','Guip\u00fazcoa','Huelva','Huesca','Illes Balears',
                             'Ja\u00e9n','A Coru\u00f1a','La Rioja','Le\u00f3n','Lleida','Lugo','Madrid','M\u00e1laga','Melilla','Murcia',
                             'Navarra','Ourense','Palencia','Pontevedra','Salamanca','Segovia','Sevilla','Soria',
                             'Tarragona','Santa Cruz de Tenerife','Teruel','Toledo','Valencia/Val\u00e9ncia','Valladolid',
                             'Vizcaya','Zamora','Zaragoza'];
    
    $scope.tmpbilling.provincia == "" ? $scope.pro = $scope.prov[0] : $scope.pro = $scope.tmpbilling.provincia;
    	
    	$scope.bmRS = false;
    	$scope.bmNB = false;
    	$scope.bmAp = false;
    	$scope.bmDI = false;
    	$scope.bmPB = false;
    	$scope.bmCP = false;
    	$scope.bmPV = false;
    	$scope.bmTF = false;
	    $scope.bmCF = false;
	    $scope.bmDN = false;
	    $scope.bmNF = false;
	    $scope.boton = true;
     
	    if($scope.tmpbilling.razonSocil == "" && $scope.tmpbilling.cif == "" &&
	    		$scope.tmpbilling.direccion1 == "" && $scope.tmpbilling.poblacion == "" && $scope.tmpbilling.codigoPostal == "" &&
	    		$scope.tmpbilling.provincia == "" && $scope.tmpbilling.telefono == "")
	    		{
	    			$scope.boton = true;
	    		}
	    	else{
	    		if($scope.tmpbilling.name == "" && $scope.tmpbilling.apellido == "" && $scope.tmpbilling.dni == "" && 
	    				$scope.tmpbilling.direccion1 == "" && $scope.tmpbilling.poblacion == "" && $scope.tmpbilling.codigoPostal == "" &&
	    				$scope.tmpbilling.provincia == "" && $scope.tmpbilling.telefono == "")
	    			{
	    				$scope.boton = true;
	    			}
	    		else{
	    			$scope.boton = false;
	    		}
	    	}
	    
      $scope.activar1 = function()  {
        $scope.empr = true;
        $scope.aut = false;
        $scope.bmNB = false;
        $scope.bmAP = false;
        $scope.bmDN = false;
        $scope.bmNF = false;
        $scope.tmpbilling.dni = "";
        $scope.tmpbilling.name = "";
        $scope.tmpbilling.apellido = "";
        $scope.boton = true;
        $scope.generarboton();
      };

      $scope.activar2 = function(){
    	  $scope.empr = false;
    	  $scope.aut = true;
    	  $scope.bmRS = false;
    	  $scope.bmCF = false;
    	  $scope.tmpbilling.cif = "";
    	  $scope.tmpbilling.razonSocial = "";
    	  $scope.boton = true;
    	  $scope.generarboton();
      };  
      
      $scope.cambioValor = function(prov){
      	if(prov == $scope.prov[0])
      		{
      			$scope.bmPV = false;
      		}
      	else
      		{
      			$scope.tmpbilling.provincia = prov;
      			$scope.bmPV = true;
      			$scope.generarboton();
      		}
      };
      
      $scope.actualizarRazonSocial = function(){
    	  $scope.tmpbilling.razonSocial.length >= 5 ? $scope.bmRS = true : $scope.bmRS = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarNombre = function(){
    	  $scope.tmpbilling.name.length >= 5 ? $scope.bmNB = true : $scope.bmNB = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarApellido = function(){
    	  $scope.tmpbilling.apellido.length >= 5 ? $scope.bmAP = true : $scope.bmAP = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarDireccion = function(){
    	  $scope.tmpbilling.direccion1.length >= 5 ? $scope.bmDI = true : $scope.bmDI = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarPoblacion = function(){
    	  $scope.tmpbilling.poblacion.length >= 5 ? $scope.bmPB = true : $scope.bmPB = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarCodigoPostal = function(){
    	  $scope.tmpbilling.codigoPostal.length == 5 ? $scope.bmCP = true : $scope.bmCP = false;
    	  $scope.generarboton();
      };
      
      $scope.actualizarTelefono = function(){
    	  $scope.tmpbilling.telefono.length == 9 ? $scope.bmTF = true : $scope.bmTF = false;
    	  $scope.generarboton();
      };
      
      $scope.comprobarCIF = function() {
          var cif = /^[a-zA-Z]{1}[0-9]{8}$/;
            if($scope.tmpbilling.cif.length == 9)
                  {
                      if(cif.test($scope.tmpbilling.cif) == true)
                          {
                              $scope.bmCF = true;
                              $scope.generarboton();
                          }
                      else
                          {
                              $scope.bmCF = false;
                              $scope.generarboton();
                          } 
                  }
                  else{
                      $scope.bmCF = false;
                      $scope.generarboton();
                  }
              
         };
      
      $scope.verificarDni = function() {
      var dni = /^[0-9]{8}[a-zA-Z]{1}$/;
      var nif = /^[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1}$/;
      
        if($scope.tmpbilling.dni.length == 9)
              {
                  if(dni.test($scope.tmpbilling.dni) == true)
                      {
                          $scope.bmDN = true;
                          $scope.generarboton();
                      }
                  else
                      {
                          $scope.bmDN = false;
                          $scope.generarboton();
                      } 
                  
                   if(nif.test($scope.tmpbilling.dni) == true)
                      {
                          $scope.bmNF = true;
                          $scope.generarboton();
                      }
                  else
                      {
                          $scope.bmNF = false;
                          $scope.generarboton();
                      }  
              }
              else
              {
                  $scope.bmDN = false;
                  $scope.bmNF = false;
                  $scope.generarboton();
              }
          
      };
      
      
     $scope.generarboton = function(){
    	if($scope.bmNB && $scope.bmAP && $scope.bmDN && $scope.bmDI && $scope.bmPB && $scope.bmCP && $scope.bmPV && $scope.bmTF)
    		{
    			$scope.boton = false;
    		}
    	else
    		{
    			if($scope.bmNB && $scope.bmAP && $scope.bmNF && $scope.bmDI && $scope.bmPB && $scope.bmCP && $scope.bmPV && $scope.bmTF)
    				{
    					$scope.boton = false;
    				}
    			else
    				{
    					if($scope.bmRS && $scope.bmCF && $scope.bmDI && $scope.bmPB && $scope.bmCP && $scope.bmPV && $scope.bmTF)
    						{
    							$scope.boton = false;
    						}
    					else
    						{
    							$scope.boton = true;
    						}	
    				}	
    		}
     };
      
     $scope.ok = function () { 
 	    $modalInstance.close($scope.tmpbilling);
 	  };

 	  $scope.cancel = function () {
 	    $modalInstance.dismiss('cancel');
 	  };
}]);



















fibity.manager.app.controller('GTOrganizationsVC',['$scope', '$http', function($scope,$http){

	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	$scope.path = [{"name":"Organización", "href": "#/organization"}];
	/********************************************/

	/*String*/   $scope.title = "Organización";
	/*Atributo*/ $scope.activeitem = "organization";
	
	/* bool */   $scope.boton = true;
	/* bool */   $scope.btn1 = false;
	/* bool */   $scope.btn2 = false;
	/* bool */   $scope.btn3 = false;
	/* bool */	 $scope.defaultFalse = false;
	/*List*/	 $scope.visibility = {};
	/* bool */   $scope.visibility.visible = false;
	/* bool */ 	 $scope.visibility.bm1 = false;
	
	/* bool Img */ $scope.bmImgLogo = false;
	/* bool Img */ $scope.bmImgBack = false;
	/*Img Loading*/ $scope.loading = "images/36.gif";
	
	/* ATRIBUTOS DE ESPEJO */
	/*String*/   $scope.txtEspNombre = "Bar Mauricio"; 
	/*String*/   $scope.txtEspslogan = "Desayuno 0.99€";
	/*String*/   $scope.Organizationid = asm.getCurrentOrganizationId();
	/*String*/   $scope.tmpOrganization = new Organization();
	/* Atributo temporal de la entity */

	/**
	 * generarboton()
	 * 
	 *  Comprueba si el botón debe ser visible o no y en caso afirmativo lo activa.
	 */
	$scope.generarboton = function(){
		$scope.btn1 && $scope.btn2 && $scope.btn3 ? $scope.boton = false : $scope.boton = true; 
	};
	
	$scope.mostrarBoton = function(){
		$scope.visibility.visible = true;
	};
	
	$scope.ocultarBoton = function(){
		$scope.visibility.visible = false;
	};

	/**
	 * initWatches
	 * 
	 * Crea la escucha de las casillas de texto;
	 * 
	 */
	$scope.initWatches = function() {	
		
		$scope.$watch('tmpOrganization.name',function(newValue,oldValue){
			$scope.tmpOrganization.name.length >= 5 ? $scope.btn1 = true : $scope.btn1= false;
			$scope.tmpOrganization.name.length == 0 ? $scope.txtEspNombre = "Bar Mauricio" : $scope.txtEspNombre = $scope.tmpOrganization.name;
			newValue == oldValue ? $scope.ocultarBoton() : $scope.mostrarBoton();
			$scope.generarboton();
		});
		
		$scope.$watch('tmpOrganization.slogan',function(newValue,oldValue){
			$scope.tmpOrganization.slogan.length >= 5 ? $scope.btn2 = true : $scope.btn2 = false;	
			$scope.tmpOrganization.slogan.length == 0 ? $scope.txtEspslogan = "Desayuno 0.99€" : $scope.txtEspslogan = $scope.tmpOrganization.slogan;
			newValue == oldValue ? $scope.ocultarBoton() : $scope.mostrarBoton();
		 	$scope.generarboton();	
		});
		
		$scope.$watch('tmpOrganization.description',function(newValue,oldValue){
			$scope.tmpOrganization.description.length >= 10 ? $scope.btn3 = true : $scope.btn3 = false;
			newValue == oldValue ? $scope.ocultarBoton() : $scope.mostrarBoton();
			$scope.generarboton();	
		});
		
		$scope.$watch("tmpOrganization.urlImgLogo",function(newValue,oldValue){
			newValue != oldValue ? $scope.bmImgLogo = true : $scope.bmImgLogo = false;
			newValue == oldValue ? $scope.ocultarBoton() : $scope.mostrarBoton();
		});
			
		$scope.$watch("tmpOrganization.urlImgBackground",function(newValue,oldValue){
			newValue != oldValue ?  $scope.bmImgBack = true : $scope.bmImgBack = false;
			newValue == oldValue ? $scope.ocultarBoton() : $scope.mostrarBoton();
		});
		$scope.$apply();
	};

	
	/**
	 * Recuperamos la entidad Ornanización
	 */
	 asm.getEntityOfKindById(Organization.entityKind,$scope.Organizationid).then(function(entity){
		
		if(entity == null){
			
				$scope.tmpOrganization.initWithId(Organization.entityKind,$scope.Organizationid,{});
				$scope.tmpOrganization.urlImgBackground = "http://lasaventurasdeperle.com/wp-content/uploads/2012/07/chile.jpg";
				$scope.tmpOrganization.urlImgLogo = "http://s3-eu-west-1.amazonaws.com/fibity/images/mauricio.png";
				$scope.tmpOrganization.name = "";
				$scope.tmpOrganization.slogan = "";
				$scope.tmpOrganization.description = "";
			
		}else{
			
				$scope.tmpOrganization.initFromEntity(entity);
				$scope.txtEspNombre = $scope.tmpOrganization.name;
				$scope.txtEspslogan = $scope.tmpOrganization.slogan;
		}
		
		$scope.initWatches();
		
	}).done();
	
	/*	funciones de espejo */
	 
	 /**
	  * guardarCambios()
	  * 
	  * - activa el botón de espera
	  * - sube las imágenes que han sido modificadas
	  * - salva la organización con las modificaciones realizadas
	  * - oculta el botón
	  * 
	  */
	$scope.guardarCambios = function(){
			 
			 //Activamos el botón de espera
			 $scope.visibility.bm1 = true;
			 
			 //Inicializamos el array de ficheros.
			 var files = [];
			 
			 //Asignamos los ficheros modificados al array files
			 if($scope.bmImgLogo) files.push($scope.fileLogo);
			 if($scope.bmImgBack) files.push($scope.fileBackground);

			 //Si ha sido modificada alguna imagen, files.length es mayor que 0 y por tanto salvamos las imagenes en el servidor
             if(files.length > 0)
             {
            	 //Subir imagenes al servidor
            	 asm.uploadImages(files).then(function(res){
	            	 //Asignar urls a organizacion y salvar
            		 
            		 //Asignamos las urls de las imagenes modificadas
	            	 if($scope.bmImgLogo) $scope.tmpOrganization.urlImgLogo = res[$scope.fileLogo.name];
	            	 if($scope.bmImgBack) $scope.tmpOrganization.urlImgBackground = res[$scope.fileBackground.name];
	            	 //Salvamos la organización
	            	
	            	 $scope.tmpOrganization.save().then(function(mapa){
	            		 //Ocultamos el boton
	            		 $scope.initWatches(); 
	            		 $scope.visibility.bm1 = false;
	            		 $scope.$apply();
	            	 }).done();
	             }).done();
	           }else{
	        	 //Salvamos la organización
	            	 $scope.tmpOrganization.save().then(function(mapa){
	            		 //Ocultamos el boton
	            		 $scope.initWatches(); 
	            		 $scope.visibility.bm1 = false;
	            		 $scope.$apply();
	            	 }).done();
	           }
		};	 
		

}]);





















fibity.manager.app.controller('GTInfoCardsVC',['$scope', '$http', '$routeParams','$modal', function($scope,$http,$routeParams,$modal){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	$scope.path = [{"name":"Tartejas de información", "href": "#/infocard/collection"}];
	
	/**
	 * ******************************************/
	
	$scope.title = "Tarjeta de Información";
	$scope.activeitem = "infocard";
	//$scope.param = $routeParams.param;
	
	
	 /* List<String> */ 	    $scope.cabeceras	        = ['Imagen','Titulo','Descripción','Editar'];
	 /* Map<String, InfoCard>*/ $scope.infoCardList     = {}; 
	 /* List<String> */ 	    $scope.infoCardKeyList  = [];
	
	$scope.functionInfocardEntity = function(){
	 	InfoCard.fromEntityList(asm.getAllEntitiesOfKind(InfoCard.entityKind))
		.then(function(list){
			list.forEach(function(infocard){
				info = new InfoCard();
				info.initFromEntity(infocard);
				
				$scope.infoCardKeyList.push(info.id);
				$scope.infoCardList[info.id] = info;
				$scope.$apply();
			});
		}).done();
	};
	 
	$scope.functionInfocardEntity();
	
	 $scope.openInfocardModal = function (id) {
		  
		  var modalInstance;
		  
		if(id == undefined){
			var tmpInfocard = new InfoCard();
			tmpInfocard.init({});
			tmpInfocard.urlImg = "";
			tmpInfocard.title  = "";
			tmpInfocard.description = "";
			modalInstance = $modal.open({
		    	templateUrl: '../views/infocards_modal_add.html',
		      	controller: "GTInfoCardAddModalVC",
		    	resolve: {
		    		tmpInfocard: function () {
			                    return tmpInfocard;
			                }
		    		}
			});
			
		}else{
			var tmpInfocard = $scope.infoCardList[id];
			modalInstance = $modal.open({
		    	templateUrl: '../views/infocards_modal_add.html',
		      	controller: "GTInfoCardAddModalVC",
		    	resolve: {
		    		tmpInfocard: function () {
			                    return tmpInfocard;
			                }
		    		}
			});
			
		}

	    modalInstance.result.then(function (tmpInfocard) {
	    	tmpInfocard.save()
	    	  .then(function(mapa){
	    		if($scope.infoCardList[tmpInfocard.id] == undefined){
	            $scope.infoCardList[tmpInfocard.id] = tmpInfocard;
	            $scope.infoCardKeyList.push(tmpInfocard.id);
	            }
	    		
	    		$scope.$apply(function(){
	    			  $scope.functionInfocardEntity();
	    		  });
	         }).done();  
	    	$scope.$apply();
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	
}]);








fibity.manager.app.controller('GTInfoCardAddModalVC',['$scope','$modalInstance', 'tmpInfocard','fileReader',  function($scope,$modalInstance,tmpInfocard,fileReader){
	  
	 	$scope.tmpInfocard = {};
	 	if(tmpInfocard.id != "")
	 		{
	 			$scope.tmpInfocard.title = tmpInfocard.title;
	 			$scope.tmpInfocard.description = tmpInfocard.description;
	 			$scope.tmpInfocard.urlImg = tmpInfocard.urlImg;	
	 			$scope.defaultTitle = $scope.tmpInfocard.title;
	 			$scope.defaultDescription = $scope.tmpInfocard.description;
	 			$scope.tmpInfocard.urlImg = $scope.tmpInfocard.urlImg;
	 		}
	 	else
	 		{
	 			/*String*/ $scope.defaultTitle = "Desayuno 0,99€"; // espejo del titulo con un valor predeterminado
				/*String*/ $scope.defaultDescription = "Esto es un desayuno que incluye café, zumo y fruta."; //espejo de la descripcion con valor predeterminado.
				/*String*/ $scope.tmpInfocard.urlImg = "http://lasaventurasdeperle.com/wp-content/uploads/2012/07/chile.jpg";
				
				
				// Atributo para comprobar si las casillas estan rellenas
				/*bool*/ $scope.btn1 = false;
				/*bool*/ $scope.btn2 = false;
				
				//Atributo que comprueba si la imagen ha sido cambiada
				/* bool Img */ $scope.bmImgBack = false;
				// Atributo para activar el boton de guardar
				/*bool*/ $scope.boton = true;
	 		}
	 	
	 	/*String*/ $scope.title = "Tarjeta de Información";
		/*String*/ $scope.plctitleInfocard = "Desayuno 0,99€";
		/*String*/ $scope.plcdescription = "Esto es un desayuno que incluye café, zumo y fruta.";
	    /*String*/ $scope.urlImgOrgBackground = "";
		/*List*/   $scope.visibility = {};
		/*bool*/   $scope.visibility.visible = true;
		/*bool*/   $scope.visibility.botonLoading = false;
	    $scope.images = {};
	    
		 asm.getEntityOfKindById(Organization.entityKind,asm.getCurrentOrganizationId())
			.then(function(entity){
				if(entity != null){
					org = new Organization();
					org.initFromEntity(entity);
					$scope.urlImgOrgBackground = org.urlImgBackground;
					$scope.$apply();
				}
		 }).done();
		
		 $scope.$watch("tmpInfocard.title",function(newValue,oldValue){
			 newValue.length == 0 ? $scope.defaultTitle = "Desayuno 0,99€" : $scope.defaultTitle = newValue;
			 newValue.length >= 5 ? $scope.btn1 = true : $scope.btn1 = false;
			 $scope.generarboton();
		 });
		 
		 $scope.$watch("tmpInfocard.description",function(newValue,oldValue){
			 newValue.length == 0 ? $scope.defaultDescription = "Esto es un desayuno que incluye café, zumo y fruta." : $scope.defaultDescription = newValue;
			 newValue.length >= 5 ? $scope.btn2 = true : $scope.btn2 = false;
			 $scope.generarboton();
		 });

		 $scope.$watch("tmpInfocard.urlImg",function(newValue,oldValue){
			 newValue != oldValue ? $scope.bmImgBack = true : $scope.bmImgBack = false;
		 });
		 
		 $scope.generarboton = function(){
				$scope.btn1 && $scope.btn2 ? $scope.boton = false : $scope.boton = true;
			};	
				
			
	  $scope.guardarCambios = function(){
		  var fileImg = [];
		  $scope.visibility.visible = false;
		  $scope.visibility.botonLoading = true;
		  $scope.boton = true;
		  if($scope.bmImgBack) fileImg.push($scope.images.fileUrlImg);
		  
		  if(fileImg.length > 0){
			  asm.uploadImages(fileImg).then(function(res){
					 if($scope.bmImgBack) $scope.tmpInfocard.urlImg = res[$scope.images.fileUrlImg.name];
					 tmpInfocard.title = $scope.tmpInfocard.title;
					 tmpInfocard.description =$scope.tmpInfocard.description;
					 tmpInfocard.urlImg = $scope.tmpInfocard.urlImg;
			   		 $modalInstance.close(tmpInfocard);
				  }).done();
		  }
		  else{
			  tmpInfocard.title = $scope.tmpInfocard.title;
			  tmpInfocard.description =$scope.tmpInfocard.description;
			  tmpInfocard.urlImg = $scope.tmpInfocard.urlImg;
			 $modalInstance.close(tmpInfocard);
		  }
	  };
			
	
	  $scope.ok = function () { 
		 $scope.guardarCambios(); 
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
}]);






























fibity.manager.app.controller('GTCampaignsVC',['$scope', '$http', '$routeParams', '$modal', function($scope,$http,$routeParams,$modal){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	$scope.path = [{"name":"Campañas", "href": "#/campaigns/collection"}];

	
	$scope.title = "Campañas";
	$scope.activeitem = "campaigns";
	$scope.antennasSchedulesMap = {};
	//$scope.param = $routeParams.param;
	
	/*List<String>*/ $scope.cabeceras = ['Nombre de la Campaña','InfoCard','Antenas','Editar'];  // cabecera para la lista

	/*bool*/ $scope.btnCamp2;
	
	/*Map<String, CampaignsSchedule>*/ $scope.schedulecampList = {}; 
		/*List<String>*/ 	  $scope.schedulecampKeyList = [];  
    	/*Schedule*/ 		  $scope.tmpCampaign;
    	  
    	 /*Map<String>*/   $scope.infoCardList = []; //Mapa que contiene todos los objetos Infocard del modelo
    	 /*Map<String>*/   $scope.infoCardMap = {}; //Mapa que contiene todos los objetos Infocard del modelo
    	 /*List<String>*/  $scope.infoCardKeyList = []; 	  
    	
    	 /*Map<String>*/   $scope.AntennaList = {}; //Mapa que contiene todos los objetos Infocard del modelo
    	 /*List<String>*/  $scope.AntennaKeyList = [];  
    	 

    	
    /**
     * updateAntennasScheduleMap()
     * 
     * Actualiza el mapa que relaciona las antenas con los schedules a los que estan asociadas.
     * 
     */
    $scope.updateAntennasScheduleMap = function(){
        /**
         * Inicializamos antennasSchedulesMap con todas las antenas; 
         */	 
        $scope.AntennaKeyList.forEach(function(id){
        		 $scope.antennasSchedulesMap[id] = [];
        });	 
    				
        Campaign.fromEntityList(asm.getAllEntitiesOfKind(Campaign.entityKind))
          	.then(function(list){
        			list.forEach(function(campaignsSchedule){
        				
        				camp = new Campaign();
        				camp.initFromEntity(campaignsSchedule);
        				
        				$scope.schedulecampList[camp.id] = camp;
        				$scope.schedulecampKeyList.push(camp.id);
        				
        				//Actualizamos el mapa mapAtennasSchedules para conocer que schedule estan asociados a que antennas
        				if(camp.getAntennasList() != undefined){
	        				camp.getAntennasList().forEach(function(antennaId){
	        					
	            				
	            				if(camp.getSchedulesList() != undefined){
	            					$scope.antennasSchedulesMap[antennaId].push({"campaignId" :camp.id, "scheduleId": camp.getSchedulesList()[0]});
	            				}else{
	            					$scope.antennasSchedulesMap[antennaId].push({"campaignId" :camp.id});
	            				}
	        				});
        				 }
        			});
        			
        	}).finally(function(){
        		$scope.$apply();
        	}).done(); 
    };
    
    
    InfoCard.fromEntityList(asm.getAllEntitiesOfKind(InfoCard.entityKind))
	.then(function(list){
		list.forEach(function(infocard){
			$scope.infoCardMap[infocard.id] = infocard;
			$scope.infoCardList.push(infocard);
		});
		list.length == 0 ? $scope.btnCamp2 = true : $scope.btnCamp2 = false;
	}).done();
    
    Antenna.fromEntityList(asm.getAllEntitiesOfKind(Antenna.entityKind))
	.then(function(list){
		list.forEach(function(antenna){
			$scope.AntennaKeyList.push(antenna.id);
		});
	}).finally(function(){
		$scope.updateAntennasScheduleMap();
	}).done();
   
    
    $scope.openCampaignsScheduleModal = function(id){
		  var modalInstance;
		//  $scope.updateAntennasScheduleMap();
		if(id == undefined){
			var tmpCampaign = new Campaign();
    		tmpCampaign.init({});
    		tmpCampaign.infocardId = "";	
    		tmpCampaign.antennasList = [];
    		tmpCampaign.name = "";
    		tmpCampaign.dynamicMode = false;

			modalInstance = $modal.open({
		    	templateUrl: '/views/campaigns_modal_add.html',
		      	controller: "GTCampaignAddModalVC",
		      	size: 'lg',
		    	resolve: {
		    		tmpCampaign: function () {
			                    return tmpCampaign;
			                },
			         antennasSchedulesMap : function(){
			        	 	return $scope.antennasSchedulesMap;
			         	},       
		    		}
			});
			
		}else{
			modalInstance = $modal.open({
				templateUrl: '../views/campaigns_modal_add.html',
		      	controller: "GTCampaignAddModalVC",
		      	size: 'lg',
		    	resolve: {
		    		tmpCampaign: function () {
			                    return $scope.schedulecampList[id];  
			                },
	                antennasSchedulesMap : function(){
		        	 	return $scope.antennasSchedulesMap;
		         	},        
		    	}
			});
			
		}

	    modalInstance.result.then(function (tmpCampaign) {
	    	tmpCampaign.save()
	    	  .then(function(mapa){
	    		 if($scope.schedulecampList[tmpCampaign.id] == undefined){
	    		 	$scope.schedulecampList[tmpCampaign.id] = tmpCampaign;
	    		 	$scope.schedulecampKeyList.push(tmpCampaign.id);
	    	  	}
	    		 
	    		 $scope.$apply(function(){
	             	$scope.updateAntennasScheduleMap();
	             });
	         }).done();  

           
	    }, function () {
	    	console.log('Modal dismissed at: ' + new Date());
	    });
	  };
}]);






















fibity.manager.app.controller('GTCampaignAddModalVC',['$scope', '$modalInstance', '$timeout', 'tmpCampaign', 'antennasSchedulesMap', function($scope,$modalInstance,$timeout,tmpCampaign,antennasSchedulesMap){

	console.log(antennasSchedulesMap);
	/*Campaign*/		   $scope.tmpCampaign = new Campaign(); //Copia de la campañaña
	
	/*List<String>*/   $scope.campaignsKeyList = [];  //Lista que contiene todos los ids de Campaña del modelo
	                   $scope.campaignsMap = {};  //Mapa que contiene todos los objetos Campaña del modelo 
	
	 /*List<String>*/  $scope.infoCardsKeyList = []; //Lista que contiene todos los ids de Infocard del modelo
	 /*Map<String>*/   $scope.infoCardsMap = {}; //Mapa que contiene todos los objetos Infocard del modelo
	 
	 /*Map<String>*/   $scope.AntennasMap = {}; //Mapa que contiene todos las antenas del modelo
	 				   $scope.AntennasKeyList = [];
	 				   
	 				   $scope.AntennasKeyListValid = [];  // Antenas filtradas que cumplen las condiciones de los modos estatico y dinamico.
	 				   $scope.AntennasKeyListSelected = [];  // Antenas asociadas a la campaña
	 				   $scope.AntennasKeyListAvailable = []; // = AntennasKeyListValids - AntennasKeyListSelected
	 				   
 	/*Map<String, Schedule Calendar>*/ $scope.scheduleList = {}; 
	/*List<String>*/ 	  $scope.scheduleKeyList = []; 
	/*Schedule*/ 		  $scope.tmpschedule;
	/*Map<ScheduleId,List<AntennaId>>*/ $scope.mapSchedulesExt = {}; 
	/*List<ScheduleId>*/ $scope.listSchedulesExt = []; 
	
	$scope.visibility = {};
	$scope.visibility.visible = true;
	$scope.visibility.botonLoading = false;
	/*bool*/   $scope.txtfocus1 = true;
	
	/**
	 * T	extos de la vista
	 */
		$scope.msgs = {};
		$scope.msgs.enableDynamicMode = "Activar modo dinámico";
		$scope.msgs.disableDynamicMode = "Desactivar modo dinámico";
		$scope.msgs.dynamicMode = "Dinámica";
		$scope.msgs.staticMode = "Estática";
	
	/**
	 * Control de pestaña activa
	 */
		$scope.tab = [];	
		$scope.tab[0] = {"active": true};
		
	/**
	 * Inicializamos el modelo asociado al calendario.
	 */
	
		$scope.calEvents = 0;
		$scope.calEventsExt = 1;
		
		$scope.actualEvent = 0;
		/* event sources array*/
	    $scope.eventSources = [];
	
		/*mapa de eventos excluyentes*/ 
		$scope.eventSources[$scope.calEventsExt] = [];
		
		$scope.eventSources[$scope.calEvents] =[];
		//$scope.eventSources[$scope.calEventsExt].events
	
	/**
	 * FIN configuración modelo asociado al calendario
	 */
		
	/**
	* Objeto Calendario
	*/
		$scope.myCalendar1;
	
	/**
	 *  Métodos auxiliares de Calendario
	 */
	
	/**
	 *  Renderiza un calendario
	 */
		$scope.renderCalender = function(calendar) {
			console.log("renderCalendar()");
	        if(calendar){
	          calendar.fullCalendar('render');
	          calendar.fullCalendar('refetchEvents');
	        }
		};
      
     /**
      *  Renderiza myCalendar1
      */
	     $scope.updateCalendar = function(){
	    	 	console.log("updateCalendar()");
	    	 	console.log($scope.eventSources);
	  		$scope.renderCalender(jQuery('#calendar'));
	  	 };
	
	
	  // Variables
    $scope.datosEvents = {};
    $scope.datosEvents.allDay = true;
    $scope.btncalen = true;
    $scope.showError = false;
    $scope.showConflict = false;
    $scope.showTime = false;
    $scope.showDelete = false;
    $scope.showConfirm = false;
    $scope.disabledCalendar = false;
    $scope.infoCalendar = false;
    $scope.modeStatic = false;
    $scope.txtDinamic = "Dinámico";
    $scope.txtStatic = "Estático";
    $scope.btnStatic = "Activar modo estático";
    $scope.btnDinamic = "Desactivar modo estático";
	
	 /*bool*/ $scope.viewAnt = true;
	 $scope.show = false;
	 $scope.phase2 = false;
	 
	    /*String*/ $scope.urlImgOrgBackground = "";
		 
	   
	    
	    
	    
	    
	    
	/**
	 * 
	 * 
	 * 				Load Entities
	 * 
	 * 
	 * 
	 * 
	 * 
	 */    
	    
	$scope.entitiesLoadedNumber = 0;
	  
	$scope.entityLoaded = function(){
		$scope.entitiesLoadedNumber++;
		if($scope.entitiesLoadedNumber == 5)
			$scope.loadDataView();
		
	};
	    
	$scope.loadOrganization = function(){  
		asm.getEntityOfKindById(Organization.entityKind, asm.getCurrentOrganizationId())
				.then(function(entity){
					if(entity != null){
						org = new Organization();
						org.initFromEntity(entity);
						$scope.urlImgOrgBackground = org.urlImgBackground;
					}
		 }).finally(function(){
			 $scope.entityLoaded();
		 }).done();
	};
	 
	 $scope.loadCampaigns = function(){  
		 Campaign.fromEntityList(asm.getAllEntitiesOfKind(Campaign.entityKind))
	  	.then(function(list){
				list.forEach(function(campaigns){
					$scope.campaignsKeyList.push(campaigns.id);
					$scope.campaignsMap[campaigns.id] = campaigns;
				});
		}).finally(function(){
			 $scope.entityLoaded();
		 }).done();
     };
     $scope.loadSchedules = function(){  
		 Schedule.fromEntityList(asm.getAllEntitiesOfKind(Schedule.entityKind))
		 .then(function(list){
			 list.forEach(function(schedule){
				$scope.scheduleKeyList.push(schedule.id);
				$scope.scheduleList[schedule.id] = new Schedule();
				$scope.scheduleList[schedule.id].initFromEntity(schedule);
			 });
		 }).finally(function(){
			 $scope.entityLoaded();
		 }).done();
     };	 
     $scope.loadInfocards = function(){
		 InfoCard.fromEntityList(asm.getAllEntitiesOfKind(InfoCard.entityKind))
			.then(function(list){
				list.forEach(function(infocard){
					$scope.infoCardsMap[infocard.id] = infocard;
					$scope.infoCardsKeyList.push(infocard);
				});
			}).finally(function(){
				 $scope.entityLoaded();
			 }).done();
     };
     $scope.loadAntennas = function(){ 
		 Antenna.fromEntityList(asm.getAllEntitiesOfKind(Antenna.entityKind))
			.then(function(list){
				list.forEach(function(antenna){
					$scope.AntennasKeyList.push(antenna.id);
					$scope.AntennasMap[antenna.id] = antenna;
				});
			}).finally(function(){
				 $scope.entityLoaded();
			 }).done();
     };
     
     $scope.loadEntities = function(){
    	 	$scope.loadOrganization();
    	 	$scope.loadSchedules();
    	 	$scope.loadInfocards();
    	 	$scope.loadAntennas();
    	 	$scope.loadCampaigns();
     }

     
     
     
     
     
     
     
     
     
	 $scope.activarDynamic = function(changeState){
		 console.log("activarDynamic("+ changeState +")");
	  		if($scope.tmpCampaign.dynamicMode == false){
	  			//Activamos modo dinamico 
	  			$scope.changeDynamicMode(true);
	  		}else{
	  		// desactivamos Modo dinamico
	  			$scope.changeDynamicMode(false);
	  		}
		};   

		
	$scope.changeDynamicMode = function(changeState){
		console.log("changeDynamicMode("+ changeState +")");
		if(changeState){
			//Activamos modo dinamico 
			$scope.tmpCampaign.dynamicMode = true;
			$scope.disabledCalendar = false;
			$scope.btnCampaignTypeName = $scope.msgs.disableDynamicMode;
			$scope.lblDynamicModeState = $scope.msgs.dynamicMode;
			
			$scope.dynamicValidFilter();
		}else{
		// desactivamos Modo dinamico
			$scope.tmpCampaign.dynamicMode = false;
			$scope.disabledCalendar = true;
			$scope.tab[0].active = true; 
			$scope.btnCampaignTypeName = $scope.msgs.enableDynamicMode;
			$scope.lblDynamicModeState = $scope.msgs.staticMode;
			
			$scope.staticValidFilter();
		}
		$scope.updateCalendarForCampaignAntenas();
	};   
	 
	
	//Actualizamos el calendario para las antenas asignadas a la campaña.
	$scope.updateCalendarForCampaignAntenas = function(){
		console.log("updateCalendarForCampaignAntenas()");
		$scope.mapSchedulesExt = {}; 
		$scope.listSchedulesExt = []; 
		$scope.AntennasKeyListSelected.forEach(function(/*AntennaId*/ antId){
			$scope.addAntenaInMapSchedulesExt(antId);
		});
		$scope.updateEventsExtInCalendar();
		$scope.updateCalendar();
	};
	

	/*Añadir antenaID a lista de antenas asociadas a un scheduleId*/
	$scope.addAntenaInMapSchedulesExt = function(/*AntennaId*/ antId){

		console.log("addAntenaInMapSchedulesExt()");
		sid = "";
		if(tmpCampaign.getSchedulesList() != undefined) { sid = tmpCampaign.getSchedulesList()[0]; }
			if(antennasSchedulesMap[antId] != undefined){
				antennasSchedulesMap[antId].forEach(function(/*{"campaignId": ID , "scheduleId": ID}*/ data){
					if(data.scheduleId != undefined && data.scheduleId != sid){
						if($scope.mapSchedulesExt[data.scheduleId] == undefined)
							$scope.mapSchedulesExt[data.scheduleId] = [];
						
						$scope.mapSchedulesExt[data.scheduleId].push(antId); 
						
						
						
						//Añadimos el schedule ID a la lista de schedules utilizados.
						encontrado  = false;
						$scope.listSchedulesExt.forEach( function(sId){
							if(data.scheduleId == sId) encontrado = true;
						});
						
						if(!encontrado)
							$scope.listSchedulesExt.push(data.scheduleId);
					}
				});
			}
	};
	
	/*Actualizar lista de eventos excluyentes a partir de Schedules*/
	$scope.updateEventsExtInCalendar = function(){
		console.log("updateEventsExtInCalendar()");
		$scope.eventSources[$scope.calEventsExt] = [];
		
		//$scope.eventSources[$scope.calEventsExt].events.splice(0, $scope.eventSources[$scope.calEventsExt].events.length);

		$scope.listSchedulesExt.forEach(function(scheduleId){
			antenasName = " ( ";
			
			$scope.mapSchedulesExt[scheduleId].forEach(function (antenaID){
				antenasName = antenasName + $scope.AntennasMap[antenaID].name + " ";
			});
			antenasName = antenasName + ")";
			event = {};
			event.title = $scope.scheduleList[scheduleId].name + antenasName;
			event.start = new Date($scope.scheduleList[scheduleId].dateIni);
			event.end = new Date($scope.scheduleList[scheduleId].dateEnd);
			event.allDay = $scope.scheduleList[scheduleId].every;
			event.color = "#fc969e";
			event.editable = false;
			$scope.eventSources[$scope.calEventsExt].push(event);
			
		});
	};
	
	
	/**
	 *  Filtro Estatico
	 *  
	 *  Calculamos la lista de antenas validas: Aquellas que no tengan asocada ninguna campaña o que la campaña que tienen asociada sea la actual.
	 */
	
	$scope.staticValidFilter = function(){
		console.log("staticValidFilter");
		$scope.AntennasKeyListValid = [];
		for(key in antennasSchedulesMap){
			//value = ARRAY[{"campaignId" :id "scheduleId": [id,...]}]
			var value = antennasSchedulesMap[key];
			var valid = true;
			if(value.length > 1){
				valid = false;
			}else if(value.length  == 1){
				if(value[0].campaignId  != tmpCampaign.id) 
					valid = false;
			}
			if(valid) $scope.AntennasKeyListValid.push(key);
		}
		$scope.calculateAntennasKeyListAvailable();
	};
	
	/**
	 *  Filtro Dinamico
	 *  
	 *  Calculamos la lista de antenas válidas: Aquellas que no tengan asocada ninguna campaña o
	 *  										   Aquellas que tengan un schedule valido con el evento actual;
	 */
	$scope.dynamicValidFilter = function(){
		console.log("dynamicValidFilter");
		console.log(antennasSchedulesMap);

		$scope.AntennasKeyListValid = [];
		/*antennasSchedulesMap;
		$scope.AntennasKeyListValid;
		tmpCampaign.id;
		tmpCampaign.getSchedulesList()[0];*/
		
		//Creamos la lista de eventos de la campaña actual
		var schedules = [];
		var comprobarEventos = false;
		if($scope.tmpCampaign.getSchedulesList() != undefined){
			$scope.tmpCampaign.getSchedulesList().forEach(function(scheduleId){
				var schedule = $scope.scheduleList[scheduleId];
				schedules.push({start: schedule.dateIni, end:schedule.dateEnd, allDay: schedule.allDay});
			});
			
			if(schedules.length >0) 
				comprobarEventos = true;
		}
		//Recorremos la lista de campañas y schedules asociada a cada antena
		for(key in antennasSchedulesMap){
			//value = ARRAY[{"campaignId" :id "scheduleId": [id,...]}]
			var valid = true; //Supenemos que la antena cumple las condiciones, debemos comprobar si realmente las cumple.
			var value = antennasSchedulesMap[key];
			
			
			//Por cada antena, debemos recorrer cada una de las campañas que tiene
			value.forEach(function(antennaAsociateInfo){
				if(antennaAsociateInfo.campaignId != $scope.tmpCampaign.id){
					var camp = $scope.campaignsMap[antennaAsociateInfo.campaignId];
					if(!camp.dynamicMode){
						valid = false;
					}else{
						if(antennaAsociateInfo.scheduleId != undefined && comprobarEventos){
							var schedule = $scope.scheduleList[antennaAsociateInfo.scheduleId];
							var eventValidator = new EventValidator(schedules,{start: schedule.dateIni, end:schedule.dateEnd, allDay: schedule.allDay});
							if(!eventValidator.isValid())
									valid = false;
						}
					}
				}
			});
			if(valid) $scope.AntennasKeyListValid.push(key);
		}
		$scope.calculateAntennasKeyListAvailable();
	};
	
	/**
	 *  Calcula lista de antenas disponibles
	 *  
	 *  Antenas disponibles = antenas validas - antenas seleccionadas;
	 *  
	 */
	$scope.calculateAntennasKeyListAvailable = function(){
		var mapa = {};
		$scope.AntennasKeyListAvailable = [];
		$scope.AntennasKeyListValid.forEach(function(id){
			mapa[id] = true;
		});
		
		$scope.AntennasKeyListSelected.forEach(function(id){
			mapa[id] = false;
		});
		
		for(key in mapa){
			if(mapa[key]) $scope.AntennasKeyListAvailable.push(key);
		}
	};
	
	$scope.optionsInfocard = {};
	$scope.optionsInfocard.optInfo; 
	$scope.optionsAntennas = {};
	$scope.optionsAntennas.optAnt; 
	$scope.bmInfo = false;
	$scope.bmTitle = false;
	$scope.bmAnt = false;
	/*String*/ $scope.tmpCampaign.name = "";
	/*String*/ $scope.urlImg 	= "";
	/*String*/ $scope.txtTitle = ""; 
	/*String*/ $scope.txtDescription = "";
	/*List*/   $scope.AntennasKeyListSelected = []; 
	/*bool*/   $scope.oculto = false;
	/*bool*/   $scope.bm1 = false;
	/*bool*/   $scope.boton = true;
	/*bool*/   $scope.tmpCampaign.dynamicMode = false;
	
	

    $scope.datepicker = {};
    var fechaactual = new Date();
    	var dia = fechaactual.getDate();
	var mes = fechaactual.getMonth();
	var anio = fechaactual.getFullYear();
	      
	$scope.editingEvent = false;
	$scope.timepicker = {};
	$scope.timepicker.myTime = new Date();
	$scope.timepickerEnd = {};
	$scope.timepickerEnd.myTimeEnd = new Date();
	
	$scope.loadDataView = function(){

			if(tmpCampaign.id != ""){
				/*String*/ $scope.tmpCampaign.name = tmpCampaign.name;
				/*String*/ $scope.optionsInfocard.optInfo = $scope.infoCardsMap[tmpCampaign.infocardId];
				/*String*/ $scope.urlImg 	= $scope.infoCardsMap[tmpCampaign.infocardId].urlImg;
				/*String*/ $scope.txtTitle = $scope.infoCardsMap[tmpCampaign.infocardId].title; 
				/*String*/ $scope.txtDescription = $scope.infoCardsMap[tmpCampaign.infocardId].description;
						   var json = JSON.stringify(tmpCampaign.antennasList);
						   $scope.AntennasKeyListSelected = JSON.parse(json);
				 /*bool*/  $scope.tmpCampaign.dynamicMode = tmpCampaign.dynamicMode;
				 /*bool*/  $scope.oculto = true;
				 /*bool*/  $scope.boton = false;
			}

			$scope.changeDynamicMode($scope.tmpCampaign.dynamicMode);
			
			$scope.changeViews = function(){
				$scope.show == true ? $scope.show = false : $scope.show = true;
			};
			
			// Eventos del Calendario
			/* event source that contains custom events on the scope */
		
			///
		
			$scope.tmpschedule = new Schedule();
			if(tmpCampaign.getSchedulesList() != undefined){   // La campaña ya tiene asignada un Schedule
				sid = tmpCampaign.getSchedulesList()[0];
				 asm.getEntityOfKindById(Schedule.entityKind,sid)
					.then(function(entity){
						if(entity != null){
								$scope.tmpschedule.initFromEntity(entity);
								//transformación
								$scope.eventSources[$scope.calEvents][$scope.actualEvent] = {};
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].title = $scope.tmpschedule.name;
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].start = moment($scope.tmpschedule.dateIni);
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].end = moment($scope.tmpschedule.dateEnd);
								$scope.eventSources[$scope.calEvents][$scope.actualEvent].allDay = $scope.tmpschedule.every;
								
								
						}
					}).done();
				
			}else{  // La campaña no tiene asignada un Schedule
				
				$scope.tmpschedule.init({});
				$scope.tmpschedule.name = "";
				$scope.tmpschedule.dateIni = "";
				$scope.tmpschedule.dateEnd = "";
				$scope.tmpschedule.every = "";
			}
			
		
			
		
			 	$scope.$watch('tmpCampaign.name', function(newValue, oldValue) {
			 		$scope.tmpCampaign.name = newValue;
			 		$scope.tmpCampaign.name.length >= 5 ? $scope.btn = true : $scope.btn = false;
			 		$scope.tmpCampaign.name.length >= 5 ? $scope.bmTitle = true : $scope.bmTitle = false;
			 		
		        });
			 	
			 	$scope.$watch('optionsInfocard.optInfo', function(selectedObject) 
			 	 {
			 		if(selectedObject != undefined && selectedObject != ""){
				 		$scope.urlImg = selectedObject.urlImg;
				 		$scope.txtTitle = selectedObject.title;
				 		$scope.txtDescription = selectedObject.description;
				 		tmpCampaign.infocardId = selectedObject.id;
				 		$scope.bmInfo = true;
			 		}
		        });
		
			 	$scope.actualizarName = function(){
					console.log("actualizarName()");
			 		$scope.tmpCampaign.name.length >= 5 ? $scope.bm1 = true : $scope.bm1 = false;
			 		$scope.generarboton();
			 	};
			 	
			 	$scope.generarboton = function(){
		
					console.log("generarboton()");
			 		$scope.bm1 ? $scope.boton = false : $scope.boton = true;
			 	}; 
			 	
			 	$scope.AntennasKeyListAvailable.length == 0 ? $scope.viewAnt = false : $scope.viewAnt = true;
			 	
			 	$scope.$watch('optionsAntennas.optAnt', function(selectedObject) {
			 				console.log("$watch('optionsAntennas.optAnt')");
			 		 		if(selectedObject != "" && selectedObject != undefined && selectedObject != null)
			 		 			{
			 		 				$scope.AntennasKeyListSelected.push(selectedObject);
							 		var j = $scope.AntennasKeyListAvailable.indexOf(selectedObject);
							 		if(j != -1){ $scope.AntennasKeyListAvailable.splice(j,1);}
							 		$scope.AntennasKeyListAvailable.length == 0 ? $scope.viewAnt = false : $scope.viewAnt = true;
							 		$scope.updateCalendarForCampaignAntenas();
			 		 			};
			 	});
			 	
		
				 $scope.deleteAnt = function(Ant){
					 console.log("deleteAnt()");
					 	$scope.AntennasKeyListAvailable.push(Ant);
					 	$scope.viewAnt = true;
					 	var i = $scope.AntennasKeyListSelected.indexOf(Ant);
					 	if(i != -1)
					 		{
					 			$scope.AntennasKeyListSelected.splice(i, 1);
					 			//Asignar al calendario
					 		}
					 	$scope.updateCalendarForCampaignAntenas();
					 	$scope.optionsAntennas.optAnt = "";
				 	};
				 
		
				 $scope.showCalendar = function(){
					 console.log("showCalendar()");
					 $scope.bmInfo && $scope.bmTitle ? $scope.infoCalendar = false : $scope.infoCalendar = true; 
				};
					 
					 
			
							 
				 	
			  /****************************************** CALENDAR FUNCTION ***************************************/
		
			      /* add custom event*/
				/**
				 *  @param start : objeto moment
				 *  @param end : objeto moment
				 */
			      $scope.addEvent = function(start, end, allDay, jsEvent, view ) {
			    	  	console.log("addEvent()");
			    	  	console.log(start);
			    	  	console.log(end);
			    	  	if(!$scope.editingEvent){
				    	  	$scope.editingEvent = true;
				    	  	
				    	  	if(start != undefined && end != undefined && $scope.tmpCampaign.name != undefined){
						    	  var eventValidator = new EventValidator($scope.eventSources[$scope.calEventsExt],{start: start, end: end, allday: $scope.datosEvents.allDay});
						    	  
						    	  if($scope.eventSources[$scope.calEvents].length == 0){
						    		  console.log("no había evento, pero ahora si");
						    		  $scope.eventSources[$scope.calEvents][$scope.actualEvent] = {};
						    	  } 
						    	  
						    	  if($scope.datosEvents.allDay){
								    	  if(eventValidator.isValid()){
									    		  $scope.showConflict = false;
									    		  $scope.eventSources[$scope.calEvents] = [{}];
									    		  var n = $scope.eventSources[$scope.calEvents].length-1;
									    		  if($scope.tmpCampaign.title == ""){
										    		  $scope.eventSources[$scope.calEvents][n].title = "Campaña";
									    		  }else{
										    		  $scope.eventSources[$scope.calEvents][n].title = $scope.tmpCampaign.name;
									    		  }
									    		  $scope.eventSources[$scope.calEvents][n].title = $scope.tmpCampaign.name;
									   	      $scope.eventSources[$scope.calEvents][n].start = start;
									   	      $scope.eventSources[$scope.calEvents][n].end = end;
									   	      $scope.eventSources[$scope.calEvents][n].allDay = $scope.datosEvents.allDay;
									   	     
									   	      //if($scope.datepickerend.dtend == undefined || $scope.datepickerend.dtend == "") $scope.datepickerend.dtend = $scope.datepicker.dt }
									   	      console.log(start);
									   	      console.log(end);
									   	      $scope.datepicker.dt = start.toDate();
											  $scope.datepickerend.dtend = end.toDate();
								    	  	
								    	  }else{
								    		  // mostrar un mensaje de información diciendo que el evento ya esta asignado
								    		  $scope.showConflict = true;
								    	  }
								      
							  }
				    		  }	
				    	  	$scope.updateCalendar();
				    	  	$timeout(function(){$scope.editingEvent = false;},300,true);
			      	}
			      };
			      
			      
			      
			      /* remove event */
			      $scope.replaceEvent = function() {
			    	  	console.log("replaceEvent()");
			    		if($scope.events.length == 2) $scope.events.splice(0, 1);
			    		$scope.$apply();
			     };
			      
			      $scope.deleteEvents = function(){
		
			    	  	  console.log("deleteEvents()");
				    	  $scope.datepicker.dt = new Date();
			
				    	  $scope.datepickerend.dtend =  null;
				    	  $scope.events.splice(0, 1);
				    	  $scope.showDelete = false;
			      };
		
			      
		
			    $scope.eventUpdate = function(event, delta, revertFunc, jsEvent, ui, view){
			    			console.log("eventResize()");
			    			var eventValidator = new EventValidator($scope.eventSources[$scope.calEventsExt],event);
					    	 if(eventValidator.isValid()){
					    		 	editingEvent = true;
					    		 	$scope.eventSources[$scope.calEvents][$scope.actualEvent].start = event.start;
					    		 	$scope.eventSources[$scope.calEvents][$scope.actualEvent].end = event.end;
					    		 	$scope.showConflict = false;
					    		  	$scope.btncalen = true;
					    		  	$scope.datepicker.dt = event.start.toDate();
					    		  	$scope.datepickerend.dtend = event.end.toDate();
					    		  	$timeout(function(){$scope.editingEvent = false;},300,true);
					    	  }else{
					    		  revertFunc();
					    	  }
			      };
				      	      

			      $scope.selectableEvents = function(){
			    	  		console.log("selectableEvents()");
			    	  		$scope.uiConfig.calendar.selectable = true;
			      };
			      
				  $scope.changeView = function(view,calendar) {
					  	console.log("changeView()");
				        calendar.fullCalendar('changeView',view);
				  };
			      
			       
		          $scope.$watch("datepicker.dt",function(newValue,oldValue){
				        	
		          		console.log("$watch(datepicker.dt)");
		           		 $scope.fechaminend = $scope.datepicker.dt.getFullYear()+"-"+($scope.datepicker.dt.getMonth()+1)+"-"+$scope.datepicker.dt.getDate();
		           		 $scope.datepickerend.minDateEnd = $scope.fechaminend;
		          		 //newValue == oldValue ? $scope.toggleMin() : "";
		          		 $scope.formats = ['dd-MMMM-yyyy'];
		          		 $scope.format = $scope.formats[0];
		          		 
		          		 if(!$scope.editingEvent){
					    	  	 $scope.editingEvent = true;
					    	  		
			          		 if($scope.eventSources[$scope.calEvents][$scope.actualEvent] != undefined){
			          			 console.log("datepicker.dt newValue");
			          			console.log(newValue);
			          			console.log(moment(newValue));
			          			console.log("datepicker.dt oldValue");
			          			console.log(oldValue);
			          			console.log(moment(oldValue));
			          			 $scope.eventSources[$scope.calEvents][$scope.actualEvent].start = moment(newValue);
			          		 }else{
			          			 /**
			          			  * TODO: Crear el evento actual
			          			  */
			          			$scope.eventSources[$scope.calEvents][$scope.actualEvent] = {};
			          			 
			          		 }
			          		 
			          		$scope.updateCalendar();
					    	  	$scope.editingEvent = false;
				      	}
		          	});
		          	
		          	  $scope.toggleMin = function() {
		 	    	    $scope.datepicker.minDate = $scope.datepicker.minDate ? null : new Date();
		 	    	  };
			    	
			    	  $scope.updateMinDateEnd = function(){
			    		  console.log("updateMinDateEnd()");
			    		  $scope.fechaminend = $scope.datepicker.dt.getFullYear()+"-"+($scope.datepicker.dt.getMonth()+1)+"-"+$scope.datepicker.dt.getDate();
				    	  $scope.datepickerend.minDateEnd = $scope.fechaminend;
			    	  };
			    	  
			    	  $scope.open = function($event) {
		
			    		  	console.log("open()");
				    	    $event.preventDefault();
				    	    $event.stopPropagation();
				    	    $scope.datepicker.opened = true;
				    	    $scope.datepickerend.openedEnd = false;
				    	    $scope.btncalen = false;
				    	  };
			    	 
			    	  /* FECHA FINAL */
			    	  $scope.datepickerend = {};
			    	  $scope.tmpschedule.dateEnd == "" ? $scope.datepickerend.dtend = new Date($scope.datepicker.dt) : $scope.datepickerend.dtend = new Date($scope.tmpschedule.dateEnd);
			    	  
			    	  $scope.$watch("datepickerend.dtend",function(newValue,oldValue){
			    			
				    		  console.log("$watch(datepickerend.dtend)");
				    		  $scope.fechamaxend = $scope.datepickerend.dtend.getFullYear()+"-"+($scope.datepickerend.dtend.getMonth()+1)+"-"+$scope.datepickerend.dtend.getDate();
				    		  $scope.datepicker.maxDate = $scope.fechamaxend;
				    		  //newValue == oldValue ? "" : $scope.toggleMax();
				    		  $scope.formats = ['dd-MMMM-yyyy'];
					    	  $scope.format = $scope.formats[0];
					    	  
						  if(!$scope.editingEvent){
						    	  	$scope.editingEvent = true;
						    	  	$scope.eventSources[$scope.calEvents][$scope.actualEvent].end = moment(newValue);
						    	  	$scope.updateCalendar();
						    	  	$scope.editingEvent = false;
					      }
			    	  });
			    	  
			    	  $scope.toggleMax = function() {
			    		    console.log("toggleMax()");
				    	    $scope.datepicker.maxDate = $scope.datepicker.maxDate;
				    	};
				      
			    	  
			    	  $scope.openEnd = function($event) {
			    		  console.log("openEnd()");
			    	    $event.preventDefault();
			    	    $event.stopPropagation();
			    	    $scope.datepickerend.openedEnd = true;
			    	    $scope.datepicker.opened = false;
			    	  };
		
			    	  
			    	   $scope.tmpschedule.dateIni == '1970-01-01T00:00:00.000Z' ? $scope.datepicker.dt = new Date(anio,mes,dia) : $scope.datepicker.dt = new Date($scope.tmpschedule.dateIni);
			       	     
			    	  
			    /************ END DATEPICKER *************/	  
			    	  
			  /************ TIMEPICKER *************/	 
			    	  
			    	  
			    	  
			    	  $scope.openTime = function($event) {
			    	    $event.preventDefault();
			    	    $event.stopPropagation();
		
			    	    $scope.timepicker.openedTime == true ?  $scope.timepicker.openedTime = false :  $scope.timepicker.openedTime = true;
			    	    $scope.timepickerEnd.openedTimeEnd = false;
			    	  };  
			    	  
			    	  
			    	  
			    	  $scope.openTimeEnd = function($event) {
			    	    $event.preventDefault();
			    	    $event.stopPropagation();
		
			    	    $scope.timepicker.openedTime = false;
			    	    $scope.timepickerEnd.openedTimeEnd == true ?  $scope.timepickerEnd.openedTimeEnd = false :  $scope.timepickerEnd.openedTimeEnd = true;
			    	    
			    	  };  
			    	  
			    	  
			  /************ END TIMEPICKER *************/	  
			    	  
				      
				      $scope.$watch('datosEvents.allDay',function(newValue,oldValue){  
				    	  	$scope.showError = false; 
				    	  	$scope.datosEvents.allDay.valueOf() ? $scope.showTime = false : $scope.showTime = true;
				      });
				      
				    $scope.saveSchedule = function(){
				    		
						    	if($scope.tmpCampaign.dynamicMode)
						    		{ 
						    		//Asignacion de valores
						    		//$scope.visibility.visible = false;
						    		//$scope.visibility.botonLoading = true;	
						/*String*/  tmpCampaign.name = $scope.tmpCampaign.name;
						/*List*/    tmpCampaign.antennasList = $scope.AntennasKeyListSelected;
									tmpCampaign.dynamicMode = $scope.tmpCampaign.dynamicMode;
						    			$scope.tmpschedule.name = $scope.eventSources[$scope.calEvents][$scope.actualEvent].title;
						    			$scope.tmpschedule.dateIni = $scope.eventSources[$scope.calEvents][$scope.actualEvent].start.toDate();
						    			$scope.tmpschedule.dateEnd = $scope.eventSources[$scope.calEvents][$scope.actualEvent].end.toDate();
						    			$scope.tmpschedule.every = $scope.eventSources[$scope.calEvents][$scope.actualEvent].allDay;
							    		$scope.tmpschedule.save().then(function(mapa){
							    			
						    				var encontrado = false;
						    				for( sid in tmpCampaign.getSchedulesList()){
						    					if(sid == $scope.tmpschedule.id) encontrado = true;
						    				}
						    				
						    				if(!encontrado) tmpCampaign.addScheduleToList($scope.tmpschedule.id);
						    				
							    		}).finally(function(){
							    			$modalInstance.close(tmpCampaign);
							    		}).done();
								
						    	}else{
						    		tmpCampaign.name = $scope.tmpCampaign.name;
						    		tmpCampaign.antennasList = $scope.AntennasKeyListSelected;
						    		tmpCampaign.dynamicMode = $scope.tmpCampaign.dynamicMode;
						    		$scope.visibility.visible = false;
						    		$scope.visibility.botonLoading = true;
						    		$modalInstance.close(tmpCampaign);
						    	}
				    }; 
					 	
				    	$scope.cancel = function () {
				    		console.log("cancel()");
				  	    $modalInstance.dismiss('cancel');
				  	 };	
				  	 
				  	 
				 	/* config object */
				     $scope.uiConfig = {
				       calendar:{
				         select: $scope.addEvent,
				         height: 514,
				         editable: true,
				         defaultView : "month",
				         header:{
				           left: 'agendaWeek agendaDay month',
				           center: 'title',
				           right: 'today prev,next'
				         },
				         selectable: true,
				 		  firstDay: 1,
				 		  eventResize: $scope.eventUpdate,
				 		  eventDrop : $scope.eventUpdate,
				       }
				     };
				     
				     if(!$scope.phase2){
				   	  	$scope.uiConfig.calendar.header.left = '';
				     }

				     $scope.uiConfig.calendar.monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
				     $scope.uiConfig.calendar.monthNamesShort = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
				     $scope.uiConfig.calendar.dayNames = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
				     $scope.uiConfig.calendar.dayNamesShort = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];


				  	 $scope.$apply();  
	};			  	 
		  	
	
	$scope.load = function(){
		
		  	$scope.loadEntities();
		  		 
		  	 /**
		  	  * Chart Data
		  	  */ 
		  	$scope.chartObject = {
		  		  "type": "AreaChart",
		  		  "displayed": true,
		  		  "data": {
		  		    "cols": [
		  		      {
		  		        "id": "month",
		  		        "label": "Month",
		  		        "type": "string",
		  		        "p": {}
		  		      },
		  		      {
		  		        "id": "all-users",
		  		        "label": "Total usuarios",
		  		        "type": "number",
		  		        "p": {}
		  		      },
		  		      {
		  		        "id": "users",
		  		        "label": "Usuarios interesados",
		  		        "type": "number",
		  		        "p": {}
		  		      }
		  		    ],
		  		    "rows": [
		  		      {
		  		        "c": [
		  		          {
		  		            "v": "Lunes"
		  		          },
		  		          {
		  		            "v": 340,
		  		            "f": "340 Usuarios detectaron esta información"
		  		          },
		  		          {
		  		            "v": 124,
		  		            "f": "124 usuarios se interesaron por la información"
		  		          }
		  		        ]
		  		      },
		  		      {
			  		        "c": [
			  		          {
			  		            "v": "Martes"
			  		          },
			  		          {
			  		            "v": 105,
			  		            "f": "105 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 48,
			  		            "f": "48 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		 {
			  		        "c": [
			  		          {
			  		            "v": "Miércoles"
			  		          },
			  		          {
			  		            "v": 89,
			  		            "f": "89 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 36,
			  		            "f": "36 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		 {
			  		        "c": [
			  		          {
			  		            "v": "Jueves"
			  		          },
			  		          {
			  		            "v": 185,
			  		            "f": "185 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 65,
			  		            "f": "65 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		{
			  		        "c": [
			  		          {
			  		            "v": "Viernes"
			  		          },
			  		          {
			  		            "v": 250,
			  		            "f": "250 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 160,
			  		            "f": "160 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		{
			  		        "c": [
			  		          {
			  		            "v": "Sábado"
			  		          },
			  		          {
			  		            "v": 545,
			  		            "f": "545 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 289,
			  		            "f": "289 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
			  		{
			  		        "c": [
			  		          {
			  		            "v": "Domingo"
			  		          },
			  		          {
			  		            "v": 369,
			  		            "f": "369 Usuarios detectaron esta información"
			  		          },
			  		          {
			  		            "v": 198,
			  		            "f": "198 usuarios se interesaron por la información"
			  		          }
			  		        ]
			  		  },
		  		    ]
		  		  },
		  		  "options": {
		  		    "title": "Metricas de la semana",
		  		    "isStacked": "false",
		  		    "fill": 20,
		  		    "displayExactValues": true,
		  		    "vAxis": {
		  		      "title": "Número de usuarios",
		  		      "gridlines": {
		  		        "count": 10
		  		      }
		  		    },
		  		    "hAxis": {
		  		      "title": "Día de la semana"
		  		    },
		  		    "lineWidth": 3,
		  		    "colors" :['#1c91c0','#5bb85b']
		  		  },
		  		  "formatters": {}
		  		};
	};
		  	
	$scope.load();


}]);






		


















fibity.manager.app.controller('GTCustomersVC',['$scope', '$routeParams',  function($scope,$routeParams){
	
	/******** Profile for TopBar Component *******/
	$scope.profile = {"name":"","lastname" : "","email" : ""};
	asm.getProfile().then(function(profile){ 
		$scope.profile.name = profile.name;
		$scope.profile.lastname = profile.lastname;
		$scope.profile.email = profile.email;
	});
	/********************************************/
	
	$scope.title = "Cliente";
	$scope.activeitem = "customers";
	//$scope.param = $routeParams.param;
	
	/*List*/ $scope.cabecera = ["Foto","Nombre","Apellidos","Puntos","Ultima Visita"];
	/*List*/ $scope.nombre = ['Jorge','Ruben','Jhuliana','Olena','Angel'];
	/*List*/ $scope.apellido = ['Rodriguez','Torres',"Garcia","Gomez","Casado"]; 
	/*List*/ $scope.foto = ['1.jpg',"2.jpeg","3.jpeg","4.jpeg","5.jpeg",'6.jpeg',"7.jpeg","8.jpeg","9.jpeg","10.jpeg",
	                       '11.jpeg',"12.jpeg","13.jpeg","14.jpeg","15.jpeg",'16.jpeg',"17.jpeg","18.jpeg","19.jpeg","20.jpeg",
	                       "21.jpeg","22.jpeg","23.jpeg","24.jpeg"];
	/*List*/ $scope.puntos = [30,20,35,22,10];
	/*List*/ $scope.visita = ['Ayer','15:53 PM',"3 de Junio",'17:34 PM','9:00 AM','10 de Julio','22:11 PM',"13 de Julio","15 de Septiembre","12:00 PM"];
	  
	  
	/*String*/ $scope.titleList = "Vista Modo Lista";
	/*String*/ $scope.titleCollec = "Vista Modo Icono";
	  
	/*Map*/	     	  $scope.customersList = {}; //Mapa que contiene todos los objetos antenna del modelo
	/*List<String>*/  $scope.customersKeyList = []; // Lista de ids de los objetos antenna del modelo
	  
	Customers.fromEntityList(asm.getAllEntitiesOfKind(Customers.entityKind))
	.then(function(list){
		list.forEach(function(customers){
			$scope.customersKeyList.push(customers.id);
			$scope.customersList[customers.id] = customers;
		});
	}).done();
	 
	 $scope.crearlista = function(){
	       for(var i = 0; i < 3 ; i++)
	              {
	    	   var rng1 = Math.floor((Math.random() * 5) + 1);
	 	      var rng2 = Math.floor((Math.random() * 24) + 1);
	 	      var rng3 = Math.floor((Math.random() * 10) + 1);
	    	   		 $scope.tmpCustomers = new Customers();
	    	   		 $scope.tmpCustomers.init({});
	                 $scope.tmpCustomers.name = $scope.nombre[rng1];
	                 $scope.tmpCustomers.apellido = $scope.apellido[rng1];
	                 $scope.tmpCustomers.foto = $scope.foto[rng2];
	                 $scope.tmpCustomers.puntos = $scope.puntos[rng1];
	                 $scope.tmpCustomers.lastVisita = $scope.visita[rng3];
	                 $scope.tmpCustomers.save(); 
	                 $scope.customersList[$scope.tmpCustomers.id] = $scope.tmpCustomers;
	                 $scope.customersKeyList.push($scope.tmpCustomers.id);
	              }  
	    };
	  
	 $scope.borrarlista = function()
	    { 
	      asm.removeAllEntitiesOfKind(Customers.entityKind);
	      $scope.customersKeyList = [];
	    };	    
	
}]);
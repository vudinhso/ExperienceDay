// var JoyStick = function (t, e) {
//     var i = void 0 === (e = e || {}).title ? "joystick" : e.title,
//       n = void 0 === e.width ? 0 : e.width,
//       o = void 0 === e.height ? 0 : e.height,
//       h = void 0 === e.internalFillColor ? "#00AA00" : e.internalFillColor,
//       r = void 0 === e.internalLineWidth ? 2 : e.internalLineWidth,
//       d =
//         void 0 === e.internalStrokeColor
//           ? "#003300"
//           : e.internalStrokeColor,
//       a = void 0 === e.externalLineWidth ? 2 : e.externalLineWidth,
//       l =
//         void 0 === e.externalStrokeColor
//           ? "#008000"
//           : e.externalStrokeColor,
//       c = document.getElementById(t),
//       u = document.createElement("canvas");
//     (u.id = i),
//       0 == n && (n = c.clientWidth),
//       0 == o && (o = c.clientHeight),
//       (u.width = n),
//       (u.height = o),
//       c.appendChild(u);
//     var s = u.getContext("2d"),
//       f = 0,
//       v = 2 * Math.PI,
//       g = (u.width - 110) / 2,
//       w = g + 5,
//       C = g + 30,
//       m = u.width / 2,
//       p = u.height / 2,
//       L = u.width / 10,
//       E = -1 * L,
//       S = u.height / 10,
//       k = -1 * S,
//       W = m,
//       G = p;
//     function x() {
//       s.beginPath(),
//         s.arc(m, p, C, 0, v, !1),
//         (s.lineWidth = a),
//         (s.strokeStyle = l),
//         s.stroke();
//     }
//     function y() {
//       s.beginPath(),
//         W < g && (W = w),
//         W + g > u.width && (W = u.width - w),
//         G < g && (G = w),
//         G + g > u.height && (G = u.height - w),
//         s.arc(W, G, g, 0, v, !1);
//       var t = s.createRadialGradient(m, p, 5, m, p, 200);
//       t.addColorStop(0, h),
//         t.addColorStop(1, d),
//         (s.fillStyle = t),
//         s.fill(),
//         (s.lineWidth = r),
//         (s.strokeStyle = d),
//         s.stroke();
//     }
//     "ontouchstart" in document.documentElement
//       ? (u.addEventListener(
//           "touchstart",
//           function (t) {
//             f = 1;
//           },
//           !1
//         ),
//         u.addEventListener(
//           "touchmove",
//           function (t) {
//             t.preventDefault(),
//               1 == f &&
//                 ((W = t.touches[0].pageX),
//                 (G = t.touches[0].pageY),
//                 (W -= u.offsetLeft),
//                 (G -= u.offsetTop),
//                 s.clearRect(0, 0, u.width, u.height),
//                 x(),
//                 y());
//           },
//           !1
//         ),
//         u.addEventListener(
//           "touchend",
//           function (t) {
//             (f = 0),
//               (W = m),
//               (G = p),
//               s.clearRect(0, 0, u.width, u.height),
//               x(),
//               y();
//           },
//           !1
//         ))
//       : (u.addEventListener(
//           "mousedown",
//           function (t) {
//             f = 1;
//           },
//           !1
//         ),
//         u.addEventListener(
//           "mousemove",
//           function (t) {
//             1 == f &&
//               ((W = t.pageX),
//               (G = t.pageY),
//               (W -= u.offsetLeft),
//               (G -= u.offsetTop),
//               s.clearRect(0, 0, u.width, u.height),
//               x(),
//               y());
//           },
//           !1
//         ),
//         u.addEventListener(
//           "mouseup",
//           function (t) {
//             (f = 0),
//               (W = m),
//               (G = p),
//               s.clearRect(0, 0, u.width, u.height),
//               x(),
//               y();
//           },
//           !1
//         )),
//       x(),
//       y(),
//       (this.GetWidth = function () {
//         return u.width;
//       }),
//       (this.GetHeight = function () {
//         return u.height;
//       }),
//       (this.GetPosX = function () {
//         return W;
//       }),
//       (this.GetPosY = function () {
//         return G;
//       }),
//       (this.GetX = function () {
//         return (((W - m) / w) * 100).toFixed();
//       }),
//       (this.GetY = function () {
//         return (((G - p) / w) * 100 * -1).toFixed();
//       }),
//       (this.GetDir = function () {
//         var t = "",
//           e = W - m,
//           i = G - p;
//         return (
//           i >= k && i <= S && (t = "C"),
//           i < k && (t = "N"),
//           i > S && (t = "S"),
//           e < E && ("C" == t ? (t = "W") : (t += "W")),
//           e > L && ("C" == t ? (t = "E") : (t += "E")),
//           t
//         );
//       });
//   };

var JoyStick = (function(container, parameters, callback)
 {
     parameters = parameters || {};
     var title = (typeof parameters.title === "undefined" ? "joystick" : parameters.title),
         width = (typeof parameters.width === "undefined" ? 0 : parameters.width),
         height = (typeof parameters.height === "undefined" ? 0 : parameters.height),
         internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#00AA00" : parameters.internalFillColor),
         internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth),
         internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor),
         externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth),
         externalStrokeColor = (typeof parameters.externalStrokeColor ===  "undefined" ? "#008000" : parameters.externalStrokeColor),
         autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter);
 
     callback = callback || function(StickStatus) {};
 
     // Create Canvas element and add it in the Container object
     var objContainer = document.getElementById(container);
     
     // Fixing Unable to preventDefault inside passive event listener due to target being treated as passive in Chrome [Thanks to https://github.com/artisticfox8 for this suggestion]
     objContainer.style.touchAction = "none";
 
     var canvas = document.createElement("canvas");
     canvas.id = title;
     if(width === 0) { width = objContainer.clientWidth; }
     if(height === 0) { height = objContainer.clientHeight; }
     canvas.width = width;
     canvas.height = height;
     objContainer.appendChild(canvas);
     var context=canvas.getContext("2d");
 
     var pressed = 0; // Bool - 1=Yes - 0=No
     var circumference = 2 * Math.PI;
    //  var internalRadius = (canvas.width-((canvas.width/2)+10))/2;
    var internalRadius = (canvas.width-((canvas.width/2)))/3;
    //  var maxMoveStick = internalRadius + 5;
    var maxMoveStick = internalRadius + 0;
    //  var externalRadius = internalRadius + 30;
     var externalRadius = canvas.width / 2;
     var centerX = canvas.width / 2;
     var centerY = canvas.height / 2;
     var directionHorizontalLimitPos = canvas.width / 10;
     var directionHorizontalLimitNeg = directionHorizontalLimitPos * -1;
     var directionVerticalLimitPos = canvas.height / 10;
     var directionVerticalLimitNeg = directionVerticalLimitPos * -1;
     // Used to save current position of stick
     var movedX=centerX;
     var movedY=centerY;
 
     // Check if the device support the touch or not
     if("ontouchstart" in document.documentElement)
     {
         canvas.addEventListener("touchstart", onTouchStart, false);
         document.addEventListener("touchmove", onTouchMove, false);
         document.addEventListener("touchend", onTouchEnd, false);
     }
     else
     {
         canvas.addEventListener("mousedown", onMouseDown, false);
         document.addEventListener("mousemove", onMouseMove, false);
         document.addEventListener("mouseup", onMouseUp, false);
     }
     // Draw the object
     drawExternal();
     drawInternal();
 
     /******************************************************
      * Private methods
      *****************************************************/
 
     /**
      * @desc Draw the external circle used as reference position
      */
     function drawExternal()
     {
         context.beginPath();
         context.arc(centerX, centerY, externalRadius, 0, circumference, false);
         context.lineWidth = externalLineWidth;
         context.strokeStyle = externalStrokeColor;
         context.stroke();
     }
 
     /**
      * @desc Draw the internal stick in the current position the user have moved it
      */
     function drawInternal()
     {
         context.beginPath();
         if(movedX<internalRadius) { movedX=maxMoveStick; }
         if((movedX+internalRadius) > canvas.width) { movedX = canvas.width-(maxMoveStick); }
         if(movedY<internalRadius) { movedY=maxMoveStick; }
         if((movedY+internalRadius) > canvas.height) { movedY = canvas.height-(maxMoveStick); }
         context.arc(movedX, movedY, internalRadius, 0, circumference, false);
         // create radial gradient
         var grd = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 200);
         // Light color
         grd.addColorStop(0, internalFillColor);
         // Dark color
         grd.addColorStop(1, internalStrokeColor);
         context.fillStyle = grd;
         context.fill();
         context.lineWidth = internalLineWidth;
         context.strokeStyle = internalStrokeColor;
         context.stroke();
     }
 
     /**
      * @desc Events for manage touch
      */
     let touchId = null;
     function onTouchStart(event)
     {
         pressed = 1;
         touchId = event.targetTouches[0].identifier;
     }
 
     function onTouchMove(event)
     {
         if(pressed === 1 && event.targetTouches[0].target === canvas)
         {
             movedX = event.targetTouches[0].pageX;
             movedY = event.targetTouches[0].pageY;
             // Manage offset
             if(canvas.offsetParent.tagName.toUpperCase() === "BODY")
             {
                 movedX -= canvas.offsetLeft;
                 movedY -= canvas.offsetTop;
             }
             else
             {
                 movedX -= canvas.offsetParent.offsetLeft;
                 movedY -= canvas.offsetParent.offsetTop;
             }
             // Delete canvas
             context.clearRect(0, 0, canvas.width, canvas.height);
             // Redraw object
             drawExternal();
             drawInternal();
 
             // Set attribute of callback
             StickStatus.xPosition = movedX;
             StickStatus.yPosition = movedY;
            //  StickStatus.x = (100*((movedX - centerX)/maxMoveStick)).toFixed();
            //  StickStatus.y = ((100*((movedY - centerY)/maxMoveStick))*-1).toFixed();
             StickStatus.x = ( 100*((movedX - centerX)/(centerX-internalRadius))).toFixed();
             StickStatus.y = (-100*((movedY - centerY)/(centerY-internalRadius))).toFixed();
             StickStatus.cardinalDirection = getCardinalDirection();
             callback(StickStatus);
         }
     }
 
     function onTouchEnd(event)
     {
         if (event.changedTouches[0].identifier !== touchId) return;
 
         pressed = 0;
         // If required reset position store variable
         if(autoReturnToCenter)
         {
             movedX = centerX;
             movedY = centerY;
         }
         // Delete canvas
         context.clearRect(0, 0, canvas.width, canvas.height);
         // Redraw object
         drawExternal();
         drawInternal();
 
         // Set attribute of callback
         StickStatus.xPosition = movedX;
         StickStatus.yPosition = movedY;
        //  StickStatus.x = (100*((movedX - centerX)/maxMoveStick)).toFixed();
        //  StickStatus.y = ((100*((movedY - centerY)/maxMoveStick))*-1).toFixed();
         StickStatus.x = ( 100*((movedX - centerX)/(centerX-internalRadius))).toFixed();
         StickStatus.y = (-100*((movedY - centerY)/(centerY-internalRadius))).toFixed();
         StickStatus.cardinalDirection = getCardinalDirection();
         callback(StickStatus);
     }
 
     /**
      * @desc Events for manage mouse
      */
     function onMouseDown(event) 
     {
         pressed = 1;
     }
 
     /* To simplify this code there was a new experimental feature here: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX , but it present only in Mouse case not metod presents in Touch case :-( */
     function onMouseMove(event) 
     {
         if(pressed === 1)
         {
             movedX = event.pageX;
             movedY = event.pageY;
             // Manage offset
             if(canvas.offsetParent.tagName.toUpperCase() === "BODY")
             {
                 movedX -= canvas.offsetLeft;
                 movedY -= canvas.offsetTop;
             }
             else
             {
                 movedX -= canvas.offsetParent.offsetLeft;
                 movedY -= canvas.offsetParent.offsetTop;
             }
             // Delete canvas
             context.clearRect(0, 0, canvas.width, canvas.height);
             // Redraw object
             drawExternal();
             drawInternal();
 
             // Set attribute of callback
             StickStatus.xPosition = movedX;
             StickStatus.yPosition = movedY;
            //  StickStatus.x = (100*((movedX - centerX)/maxMoveStick)).toFixed();
            //  StickStatus.y = ((100*((movedY - centerY)/maxMoveStick))*-1).toFixed();
             StickStatus.x = ( 100*((movedX - centerX)/(centerX-internalRadius))).toFixed();
             StickStatus.y = (-100*((movedY - centerY)/(centerY-internalRadius))).toFixed();
             StickStatus.cardinalDirection = getCardinalDirection();
             callback(StickStatus);
         }
     }
 
     function onMouseUp(event) 
     {
         pressed = 0;
         // If required reset position store variable
         if(autoReturnToCenter)
         {
             movedX = centerX;
             movedY = centerY;
         }
         // Delete canvas
         context.clearRect(0, 0, canvas.width, canvas.height);
         // Redraw object
         drawExternal();
         drawInternal();
 
         // Set attribute of callback
         StickStatus.xPosition = movedX;
         StickStatus.yPosition = movedY;
        //  StickStatus.x = (100*((movedX - centerX)/maxMoveStick)).toFixed();
        //  StickStatus.y = ((100*((movedY - centerY)/maxMoveStick))*-1).toFixed();
         StickStatus.x = ( 100*((movedX - centerX)/(centerX-internalRadius))).toFixed();
         StickStatus.y = (-100*((movedY - centerY)/(centerY-internalRadius))).toFixed();
         StickStatus.cardinalDirection = getCardinalDirection();
         callback(StickStatus);
     }
 
     function getCardinalDirection()
     {
         let result = "";
         let orizontal = movedX - centerX;
         let vertical = movedY - centerY;
         
         if(vertical >= directionVerticalLimitNeg && vertical <= directionVerticalLimitPos)
         {
             result = "C";
         }
         if(vertical < directionVerticalLimitNeg)
         {
             result = "N";
         }
         if(vertical > directionVerticalLimitPos)
         {
             result = "S";
         }
         
         if(orizontal < directionHorizontalLimitNeg)
         {
             if(result === "C")
             { 
                 result = "W";
             }
             else
             {
                 result += "W";
             }
         }
         if(orizontal > directionHorizontalLimitPos)
         {
             if(result === "C")
             { 
                 result = "E";
             }
             else
             {
                 result += "E";
             }
         }
         
         return result;
     }
 
     /******************************************************
      * Public methods
      *****************************************************/
 
     /**
      * @desc The width of canvas
      * @return Number of pixel width 
      */
     this.GetWidth = function () 
     {
         return canvas.width;
     };
 
     /**
      * @desc The height of canvas
      * @return Number of pixel height
      */
     this.GetHeight = function () 
     {
         return canvas.height;
     };
 
     /**
      * @desc The X position of the cursor relative to the canvas that contains it and to its dimensions
      * @return Number that indicate relative position
      */
     this.GetPosX = function ()
     {
         return movedX;
     };
 
     /**
      * @desc The Y position of the cursor relative to the canvas that contains it and to its dimensions
      * @return Number that indicate relative position
      */
     this.GetPosY = function ()
     {
         return movedY;
     };
 
     /**
      * @desc Normalizzed value of X move of stick
      * @return Integer from -100 to +100
      */
     this.GetX = function ()
     {
         return (100*((movedX - centerX)/maxMoveStick)).toFixed();
     };
 
     /**
      * @desc Normalizzed value of Y move of stick
      * @return Integer from -100 to +100
      */
     this.GetY = function ()
     {
         return ((100*((movedY - centerY)/maxMoveStick))*-1).toFixed();
     };
 
     /**
      * @desc Get the direction of the cursor as a string that indicates the cardinal points where this is oriented
      * @return String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center
      */
     this.GetDir = function()
     {
         return getCardinalDirection();
     };
 });


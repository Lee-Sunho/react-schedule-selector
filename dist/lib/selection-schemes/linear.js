"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _is_before = _interopRequireDefault(require("date-fns/is_before"));

var dateUtils = _interopRequireWildcard(require("../date-utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const linear = (selectionStart, selectionEnd, dateList) => {
  let selected = [];

  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart];
  } else if (selectionStart) {
    const reverseSelection = (0, _is_before.default)(selectionEnd, selectionStart);
    selected = dateList.reduce((acc, dayOfTimes) => acc.concat(dayOfTimes.filter(t => selectionStart && selectionEnd && dateUtils.dateHourIsBetween(reverseSelection ? selectionEnd : selectionStart, t, reverseSelection ? selectionStart : selectionEnd))), []);
  }

  return selected;
};

var _default = linear;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc2VsZWN0aW9uLXNjaGVtZXMvbGluZWFyLnRzIl0sIm5hbWVzIjpbImxpbmVhciIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uRW5kIiwiZGF0ZUxpc3QiLCJzZWxlY3RlZCIsInJldmVyc2VTZWxlY3Rpb24iLCJyZWR1Y2UiLCJhY2MiLCJkYXlPZlRpbWVzIiwiY29uY2F0IiwiZmlsdGVyIiwidCIsImRhdGVVdGlscyIsImRhdGVIb3VySXNCZXR3ZWVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7Ozs7Ozs7O0FBRUEsTUFBTUEsTUFBTSxHQUFHLENBQUNDLGNBQUQsRUFBOEJDLFlBQTlCLEVBQXlEQyxRQUF6RCxLQUF1RztBQUNwSCxNQUFJQyxRQUFxQixHQUFHLEVBQTVCOztBQUNBLE1BQUlGLFlBQVksSUFBSSxJQUFwQixFQUEwQjtBQUN4QixRQUFJRCxjQUFKLEVBQW9CRyxRQUFRLEdBQUcsQ0FBQ0gsY0FBRCxDQUFYO0FBQ3JCLEdBRkQsTUFFTyxJQUFJQSxjQUFKLEVBQW9CO0FBQ3pCLFVBQU1JLGdCQUFnQixHQUFHLHdCQUFTSCxZQUFULEVBQXVCRCxjQUF2QixDQUF6QjtBQUNBRyxJQUFBQSxRQUFRLEdBQUdELFFBQVEsQ0FBQ0csTUFBVCxDQUNULENBQUNDLEdBQUQsRUFBTUMsVUFBTixLQUNFRCxHQUFHLENBQUNFLE1BQUosQ0FDRUQsVUFBVSxDQUFDRSxNQUFYLENBQ0VDLENBQUMsSUFDQ1YsY0FBYyxJQUNkQyxZQURBLElBRUFVLFNBQVMsQ0FBQ0MsaUJBQVYsQ0FDRVIsZ0JBQWdCLEdBQUdILFlBQUgsR0FBa0JELGNBRHBDLEVBRUVVLENBRkYsRUFHRU4sZ0JBQWdCLEdBQUdKLGNBQUgsR0FBb0JDLFlBSHRDLENBSkosQ0FERixDQUZPLEVBY1QsRUFkUyxDQUFYO0FBZ0JEOztBQUNELFNBQU9FLFFBQVA7QUFDRCxDQXhCRDs7ZUEwQmVKLE0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNCZWZvcmUgZnJvbSAnZGF0ZS1mbnMvaXNfYmVmb3JlJ1xyXG5cclxuaW1wb3J0ICogYXMgZGF0ZVV0aWxzIGZyb20gJy4uL2RhdGUtdXRpbHMnXHJcblxyXG5jb25zdCBsaW5lYXIgPSAoc2VsZWN0aW9uU3RhcnQ6IERhdGUgfCBudWxsLCBzZWxlY3Rpb25FbmQ6IERhdGUgfCBudWxsLCBkYXRlTGlzdDogQXJyYXk8QXJyYXk8RGF0ZT4+KTogQXJyYXk8RGF0ZT4gPT4ge1xyXG4gIGxldCBzZWxlY3RlZDogQXJyYXk8RGF0ZT4gPSBbXVxyXG4gIGlmIChzZWxlY3Rpb25FbmQgPT0gbnVsbCkge1xyXG4gICAgaWYgKHNlbGVjdGlvblN0YXJ0KSBzZWxlY3RlZCA9IFtzZWxlY3Rpb25TdGFydF1cclxuICB9IGVsc2UgaWYgKHNlbGVjdGlvblN0YXJ0KSB7XHJcbiAgICBjb25zdCByZXZlcnNlU2VsZWN0aW9uID0gaXNCZWZvcmUoc2VsZWN0aW9uRW5kLCBzZWxlY3Rpb25TdGFydClcclxuICAgIHNlbGVjdGVkID0gZGF0ZUxpc3QucmVkdWNlKFxyXG4gICAgICAoYWNjLCBkYXlPZlRpbWVzKSA9PlxyXG4gICAgICAgIGFjYy5jb25jYXQoXHJcbiAgICAgICAgICBkYXlPZlRpbWVzLmZpbHRlcihcclxuICAgICAgICAgICAgdCA9PlxyXG4gICAgICAgICAgICAgIHNlbGVjdGlvblN0YXJ0ICYmXHJcbiAgICAgICAgICAgICAgc2VsZWN0aW9uRW5kICYmXHJcbiAgICAgICAgICAgICAgZGF0ZVV0aWxzLmRhdGVIb3VySXNCZXR3ZWVuKFxyXG4gICAgICAgICAgICAgICAgcmV2ZXJzZVNlbGVjdGlvbiA/IHNlbGVjdGlvbkVuZCA6IHNlbGVjdGlvblN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgdCxcclxuICAgICAgICAgICAgICAgIHJldmVyc2VTZWxlY3Rpb24gPyBzZWxlY3Rpb25TdGFydCA6IHNlbGVjdGlvbkVuZFxyXG4gICAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICApLFxyXG4gICAgICBbXVxyXG4gICAgKVxyXG4gIH1cclxuICByZXR1cm4gc2VsZWN0ZWRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGluZWFyXHJcbiJdfQ==
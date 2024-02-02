"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _is_before = _interopRequireDefault(require("date-fns/is_before"));

var _start_of_day = _interopRequireDefault(require("date-fns/start_of_day"));

var dateUtils = _interopRequireWildcard(require("../date-utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const square = (selectionStart, selectionEnd, dateList) => {
  let selected = [];

  if (selectionEnd == null) {
    if (selectionStart) selected = [selectionStart];
  } else if (selectionStart) {
    const dateIsReversed = (0, _is_before.default)((0, _start_of_day.default)(selectionEnd), (0, _start_of_day.default)(selectionStart));
    const timeIsReversed = selectionStart.getHours() > selectionEnd.getHours();
    selected = dateList.reduce((acc, dayOfTimes) => acc.concat(dayOfTimes.filter(t => selectionStart && selectionEnd && dateUtils.dateIsBetween(dateIsReversed ? selectionEnd : selectionStart, t, dateIsReversed ? selectionStart : selectionEnd) && dateUtils.timeIsBetween(timeIsReversed ? selectionEnd : selectionStart, t, timeIsReversed ? selectionStart : selectionEnd))), []);
  }

  return selected;
};

var _default = square;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc2VsZWN0aW9uLXNjaGVtZXMvc3F1YXJlLnRzIl0sIm5hbWVzIjpbInNxdWFyZSIsInNlbGVjdGlvblN0YXJ0Iiwic2VsZWN0aW9uRW5kIiwiZGF0ZUxpc3QiLCJzZWxlY3RlZCIsImRhdGVJc1JldmVyc2VkIiwidGltZUlzUmV2ZXJzZWQiLCJnZXRIb3VycyIsInJlZHVjZSIsImFjYyIsImRheU9mVGltZXMiLCJjb25jYXQiLCJmaWx0ZXIiLCJ0IiwiZGF0ZVV0aWxzIiwiZGF0ZUlzQmV0d2VlbiIsInRpbWVJc0JldHdlZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFFQTs7Ozs7Ozs7QUFFQSxNQUFNQSxNQUFNLEdBQUcsQ0FBQ0MsY0FBRCxFQUE4QkMsWUFBOUIsRUFBeURDLFFBQXpELEtBQXVHO0FBQ3BILE1BQUlDLFFBQXFCLEdBQUcsRUFBNUI7O0FBQ0EsTUFBSUYsWUFBWSxJQUFJLElBQXBCLEVBQTBCO0FBQ3hCLFFBQUlELGNBQUosRUFBb0JHLFFBQVEsR0FBRyxDQUFDSCxjQUFELENBQVg7QUFDckIsR0FGRCxNQUVPLElBQUlBLGNBQUosRUFBb0I7QUFDekIsVUFBTUksY0FBYyxHQUFHLHdCQUFTLDJCQUFXSCxZQUFYLENBQVQsRUFBbUMsMkJBQVdELGNBQVgsQ0FBbkMsQ0FBdkI7QUFDQSxVQUFNSyxjQUFjLEdBQUdMLGNBQWMsQ0FBQ00sUUFBZixLQUE0QkwsWUFBWSxDQUFDSyxRQUFiLEVBQW5EO0FBRUFILElBQUFBLFFBQVEsR0FBR0QsUUFBUSxDQUFDSyxNQUFULENBQ1QsQ0FBQ0MsR0FBRCxFQUFNQyxVQUFOLEtBQ0VELEdBQUcsQ0FBQ0UsTUFBSixDQUNFRCxVQUFVLENBQUNFLE1BQVgsQ0FDRUMsQ0FBQyxJQUNDWixjQUFjLElBQ2RDLFlBREEsSUFFQVksU0FBUyxDQUFDQyxhQUFWLENBQ0VWLGNBQWMsR0FBR0gsWUFBSCxHQUFrQkQsY0FEbEMsRUFFRVksQ0FGRixFQUdFUixjQUFjLEdBQUdKLGNBQUgsR0FBb0JDLFlBSHBDLENBRkEsSUFPQVksU0FBUyxDQUFDRSxhQUFWLENBQ0VWLGNBQWMsR0FBR0osWUFBSCxHQUFrQkQsY0FEbEMsRUFFRVksQ0FGRixFQUdFUCxjQUFjLEdBQUdMLGNBQUgsR0FBb0JDLFlBSHBDLENBVEosQ0FERixDQUZPLEVBbUJULEVBbkJTLENBQVg7QUFxQkQ7O0FBRUQsU0FBT0UsUUFBUDtBQUNELENBaENEOztlQWtDZUosTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpc0JlZm9yZSBmcm9tICdkYXRlLWZucy9pc19iZWZvcmUnXHJcbmltcG9ydCBzdGFydE9mRGF5IGZyb20gJ2RhdGUtZm5zL3N0YXJ0X29mX2RheSdcclxuXHJcbmltcG9ydCAqIGFzIGRhdGVVdGlscyBmcm9tICcuLi9kYXRlLXV0aWxzJ1xyXG5cclxuY29uc3Qgc3F1YXJlID0gKHNlbGVjdGlvblN0YXJ0OiBEYXRlIHwgbnVsbCwgc2VsZWN0aW9uRW5kOiBEYXRlIHwgbnVsbCwgZGF0ZUxpc3Q6IEFycmF5PEFycmF5PERhdGU+Pik6IEFycmF5PERhdGU+ID0+IHtcclxuICBsZXQgc2VsZWN0ZWQ6IEFycmF5PERhdGU+ID0gW11cclxuICBpZiAoc2VsZWN0aW9uRW5kID09IG51bGwpIHtcclxuICAgIGlmIChzZWxlY3Rpb25TdGFydCkgc2VsZWN0ZWQgPSBbc2VsZWN0aW9uU3RhcnRdXHJcbiAgfSBlbHNlIGlmIChzZWxlY3Rpb25TdGFydCkge1xyXG4gICAgY29uc3QgZGF0ZUlzUmV2ZXJzZWQgPSBpc0JlZm9yZShzdGFydE9mRGF5KHNlbGVjdGlvbkVuZCksIHN0YXJ0T2ZEYXkoc2VsZWN0aW9uU3RhcnQpKVxyXG4gICAgY29uc3QgdGltZUlzUmV2ZXJzZWQgPSBzZWxlY3Rpb25TdGFydC5nZXRIb3VycygpID4gc2VsZWN0aW9uRW5kLmdldEhvdXJzKClcclxuXHJcbiAgICBzZWxlY3RlZCA9IGRhdGVMaXN0LnJlZHVjZShcclxuICAgICAgKGFjYywgZGF5T2ZUaW1lcykgPT5cclxuICAgICAgICBhY2MuY29uY2F0KFxyXG4gICAgICAgICAgZGF5T2ZUaW1lcy5maWx0ZXIoXHJcbiAgICAgICAgICAgIHQgPT5cclxuICAgICAgICAgICAgICBzZWxlY3Rpb25TdGFydCAmJlxyXG4gICAgICAgICAgICAgIHNlbGVjdGlvbkVuZCAmJlxyXG4gICAgICAgICAgICAgIGRhdGVVdGlscy5kYXRlSXNCZXR3ZWVuKFxyXG4gICAgICAgICAgICAgICAgZGF0ZUlzUmV2ZXJzZWQgPyBzZWxlY3Rpb25FbmQgOiBzZWxlY3Rpb25TdGFydCxcclxuICAgICAgICAgICAgICAgIHQsXHJcbiAgICAgICAgICAgICAgICBkYXRlSXNSZXZlcnNlZCA/IHNlbGVjdGlvblN0YXJ0IDogc2VsZWN0aW9uRW5kXHJcbiAgICAgICAgICAgICAgKSAmJlxyXG4gICAgICAgICAgICAgIGRhdGVVdGlscy50aW1lSXNCZXR3ZWVuKFxyXG4gICAgICAgICAgICAgICAgdGltZUlzUmV2ZXJzZWQgPyBzZWxlY3Rpb25FbmQgOiBzZWxlY3Rpb25TdGFydCxcclxuICAgICAgICAgICAgICAgIHQsXHJcbiAgICAgICAgICAgICAgICB0aW1lSXNSZXZlcnNlZCA/IHNlbGVjdGlvblN0YXJ0IDogc2VsZWN0aW9uRW5kXHJcbiAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICksXHJcbiAgICAgIFtdXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICByZXR1cm4gc2VsZWN0ZWRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgc3F1YXJlXHJcbiJdfQ==
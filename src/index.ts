// import { preloadImages } from "./preloadImages";
// import type { preloadImagesOptions, Dirs } from "./preloadImages";

import date from "./date";
import {
  fixDate,
  dateFormat,
  relativeDate,
  timeSpanSecond,
  timeSpanMinute,
  timeSpanHour,
  timeSpanDay,
  formatNumber,
  mixedSort,
  weekStartTime,
  weekEndTime,
  monthStartTime,
  monthEndTime,
  yearStartTime,
  yearEndTime,
  today,
} from "./date";
import type { myDate } from "./date";

const tools = {
  // preloadImages,/
  date,
};
export default tools;
export {
  // preloadImages,
  fixDate,
  dateFormat,
  relativeDate,
  timeSpanSecond,
  timeSpanMinute,
  timeSpanHour,
  timeSpanDay,
  formatNumber,
  mixedSort,
  weekStartTime,
  weekEndTime,
  monthStartTime,
  monthEndTime,
  yearStartTime,
  yearEndTime,
  today,
};

export type {
  //preloadImagesOptions, Dirs,
  myDate,
};

// console.log("tools", today());

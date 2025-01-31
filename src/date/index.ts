const dayLong = 1000 * 60 * 60 * 24;
const hourLong = 1000 * 60 * 60;
const minLong = 1000 * 60;
type myDate = string | number | Date;
function validateDate(date: myDate) {
  if (!date) {
    throw new Error("传入的日期不能为空");
  }
}

/**
 * @description 日期分隔符转为 /  防止safari不支持new Date('yyyy-MM-dd')
 * @param date  传入的日期时间 必须转换为日期字符串 比如 "2023-03-05 00:00:00"
 * @param separator  需要替换的分隔符 默认是 -
 * @returns  返回转换后的日期 比如 "2023/03/05"
 */
function fixDate(date: string, separator = "-") {
  validateDate(date);
  if (typeof date === "string") {
    const fix = date.replace(new RegExp(`\\${separator}`, "g"), "/"); //替换日期分隔符为 /

    return Number.isNaN(Date.parse(fix))
      ? date
      : fix.replace(/\+(\d{2})(\d{2})$/, "+$1:$2");
  }
}

/**
 * @description 格式化日期
 * @param date  传入的日期 可以是时间戳（毫秒），也可以是日期字符串, 也可以是Date
 * @param format  日期格式 默认是 yyyy/MM/dd HH:mm:ss
 * @returns  返回格式化后的日期
 */
function dateFormat(date: myDate, format = "yyyy/MM/dd HH:mm:ss"): string {
  validateDate(date);
  const d = new Date(date).getDay();
  const option = {
    "M+": new Date(date).getMonth() + 1, // 月份
    "d+": new Date(date).getDate(), // 日
    "H+": new Date(date).getHours(), // 小时
    "m+": new Date(date).getMinutes(), // 分
    "s+": new Date(date).getSeconds(), // 秒
    "q+": Math.floor((new Date(date).getMonth() + 3) / 3), // 季度
    S: new Date(date).getMilliseconds(), // 毫秒
    D: `星期${["日", "一", "二", "三", "四", "五", "六"][d]}`, // 星期
  };
  let _format = format;

  if (/(y+)/.test(_format)) {
    const match = /(y+)/.exec(_format);
    if (match)
      _format = _format.replace(
        match[0],
        String(new Date(date).getFullYear()).substring(4 - RegExp.$1.length)
      );
  }
  for (const k in option) {
    if (new RegExp(`(${k})`).test(_format)) {
      const match = new RegExp(`(${k})`).exec(_format);

      if (match) {
        const value = String((option as { [key: string]: number | string })[k]);

        _format = _format.replace(
          match[0],
          match[0].length === 1 ? value : `00${value}`.substring(value.length)
        );
      }
    }
  }
  return _format;
}

/**
 *@description 相对日期 根据传入的日期和当前日期做比较，计算相对日期
 * @param date  日期，可以是时间戳（毫秒），也可以是日期字符串
 * @returns 返回的是 刚刚，昨天，几天前，几小时前，几分钟前
 */
function relativeDate(date: myDate): string {
  validateDate(date);
  const now = new Date().getTime();
  const time = new Date(date).getTime();
  const span = now - time;
  const day = Math.floor(span / dayLong);
  const hour = Math.floor(span / hourLong);
  const min = Math.floor(span / minLong);

  if (day > 0 && day <= 1) {
    return "昨天";
  }
  if (day > 1) {
    return `${day.toString()}天前`;
  }
  if (hour > 0) {
    return `${hour.toString()}小时前`;
  }
  if (min > 0) {
    return `${min.toString()}分钟前`;
  }
  return "刚刚";
}

/**
 * @description 获取当天
 * @param format 传入的日期格式 默认是 yyyy/MM/dd
 * @returns  返回当天
 */
function today(format = "yyyy/MM/dd"): string {
  const td = new Date(new Date().setHours(0, 0, 0, 0));
  return dateFormat(td, format);
}

/**
 * @description 获取传入日期的最早时间 ，获取传入日期的0点0分0秒
 * @param date 传入的日期 可以是时间戳（毫秒），也可以是日期字符串 也可以是Date类型
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0 可以是负数
 * @returns  返回格式化后和偏移后的日期
 * @example  startTime("2025-01-31 00:00:00", "yyyy/MM/dd HH:mm:ss", 2);  // 2025/02/02 00:00:00
 *
 */
function startTime(date: myDate, format = "yyyy/MM/dd", offset = 0): string {
  validateDate(date);
  const td = new Date(new Date(date).setHours(0, 0, 0, 0) + dayLong * offset);
  return dateFormat(td, format);
}

/**
 * @description 获取传入的日期的最晚时间 ，获取传入日期的23点59分59秒
 * @param date 传入的日期 可以是时间戳（毫秒），也可以是日期字符串 也可以是Date类型
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0 可以是负数
 * @returns  返回格式化后和偏移后的日期
 * @example  endTime("2025-01-31 00:00:00", "yyyy/MM/dd HH:mm", 2);  // 2025/02/02 23:59:59
 *
 */
function endTime(date: myDate, format = "yyyy/MM/dd", offset = 0): string {
  validateDate(date);
  const td = new Date(
    new Date(date).setHours(23, 59, 59, 0) + dayLong * offset
  );
  return dateFormat(td, format);
}

/**
 *@description 根据传入的日期获取当前周的开始时间
 * @param date  传入的日期 不传入的话默认是当前日期
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0
 * @returns  根据传入的日期获取当前周的开始时间
 * @example  weekStartTime("2025-01-31 00:00:00", "yyyy/MM/dd",);  // 2025/01/27
 */
function weekStartTime(
  date?: myDate,
  format = "yyyy/MM/dd",
  offset = 0
): string {
  const now = date ? startTime(date, format, offset) : today(format);
  const day = new Date(now).getDay();

  const td = new Date(
    new Date(now).getTime() -
      dayLong * (day === 0 ? 6 : day - 1) +
      dayLong * 7 * offset
  );

  return dateFormat(td, format);
}

/**
 *@description 根据传入的日期获取当前周的结束时间
 * @param date  传入的日期 不传入的话默认是当前日期
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0
 * @returns  根据传入的日期获取当前周的结束时间
 * @example  weekEndTime("2025-01-27 00:00:00", "yyyy/MM/dd",);  // 2025/01/31
 */
function weekEndTime(date?: myDate, format = "yyyy/MM/dd", offset = 0): string {
  const now = date ? endTime(date, format, offset) : today(format);
  const day = new Date(now).getDay();

  const td = new Date(
    new Date(now).getTime() -
      dayLong * (day === 0 ? 6 : day - 1) +
      dayLong * 7 * offset
  );

  return dateFormat(td, format);
}

/**
 *@description 根据传入的日期获取当前月的开始时间
 * @param date  传入的日期 不传入的话默认是当前日期
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0
 * @returns  根据传入的日期获取当前月的开始时间
 * @example  monthStartTime("2025-01-27 00:00:00", "yyyy/MM/dd",);  // 2025/01/01
 */

function monthStartTime(
  date?: myDate,
  format = "yyyy/MM/dd",
  offset = 0
): string {
  const now = date ? startTime(date, format, offset) : today(format);
  const month = new Date(now).getMonth();
  const td = new Date(new Date(now).setMonth(month + offset, 1));
  return dateFormat(td, format);
}

/**
 *@description 根据传入的日期获取当前月的结束时间
 * @param date  传入的日期 不传入的话默认是当前日期
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0
 * @returns  根据传入的日期获取当前月的结束时间
 * @example  monthEndTime("2025-01-27 00:00:00", "yyyy/MM/dd",);  // 2025/01/31
 */
function monthEndTime(
  date?: myDate,
  format = "yyyy/MM/dd",
  offset = 0
): string {
  const now = date ? endTime(date, format, offset) : today(format);
  const month = new Date(now).getMonth();
  const td = new Date(new Date(now).setMonth(month + 1 + offset, 0));
  return dateFormat(td, format);
}

/**
 *@description 根据传入的日期获取当前年的开始时间
 * @param date  传入的日期 不传入的话默认是当前日期
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0
 * @returns  根据传入的日期获取当前年的开始时间
 * @example  yearStartTime("2025-01-27 00:00:00", "yyyy/MM/dd",);  // 2025/01/01
 * */
function yearStartTime(date?: myDate, format = "yyyy/MM/dd", offset = 0) {
  const now = date ? startTime(date, format, offset) : today(format);
  const year = new Date(now).getFullYear();
  const td = new Date(new Date(now).setFullYear(year + offset, 0, 1));
  return dateFormat(td, format);
}

/**
 *@description 根据传入的日期获取当前年的结束时间
 * @param date  传入的日期 不传入的话默认是当前日期
 * @param format  传入的日期格式 默认是 yyyy/MM/dd
 * @param offset  传入的偏移量 默认是 0
 * @returns  根据传入的日期获取当前年的结束时间
 * @example  yearEndTime("2025-01-27 00:00:00", "yyyy/MM/dd",);  // 2025/12/31
 */
function yearEndTime(date?: myDate, format = "yyyy/MM/dd", offset = 0) {
  const now = date ? endTime(date, format, offset) : today(format);
  const year = new Date(now).getFullYear();
  const td = new Date(new Date(now).setFullYear(year + offset, 12, 0));
  return dateFormat(td, format);
}

/**
 * @description 获取时间差 秒
 * @param start 开始时间
 * @param end 结束时间
 * @returns  时间差 单位是秒
 */
function timeSpanSecond(start: myDate, end: myDate) {
  validateDate(start);
  validateDate(end);
  return Math.floor(
    (new Date(end).getTime() - new Date(start).getTime()) / 1000
  );
}

/**
 * @description 获取时间差 分钟
 * @param start 开始时间
 * @param end 结束时间
 * @returns  时间差 单位是分钟
 */
function timeSpanMinute(start: myDate, end: myDate) {
  validateDate(start);
  validateDate(end);
  return Math.floor(
    (new Date(end).getTime() - new Date(start).getTime()) / minLong
  );
}

/**
 * @description 获取时间差 小时
 * @param start 开始时间
 * @param end 结束时间
 * @returns  时间差 单位是小时
 */
function timeSpanHour(start: myDate, end: myDate) {
  validateDate(start);
  validateDate(end);
  return Math.floor(
    (new Date(end).getTime() - new Date(start).getTime()) / hourLong
  );
}

/**
 * @description 获取时间差 天
 * @param start 开始时间
 * @param end 结束时间
 * @returns  时间差 单位是天
 */
function timeSpanDay(start: myDate, end: myDate) {
  validateDate(start);
  validateDate(end);
  return Math.floor(
    (new Date(end).getTime() - new Date(start).getTime()) / dayLong
  );
}

/**
 * @description 格式化数字为千分位，千分位符号默认为逗号，保留小数点后的位数
 * @param num  传入的数字
 * @param fixed  保留小数点后的位数
 * @returns  按照千分位格式化后的数字
 */
function formatNumber(num: number | string, numSymbol = ",", fixed?: number) {
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+$)/g, numSymbol);
  if (fixed) {
    parts[1] = parts[1] ? parts[1].slice(0, fixed) : "";
  }
  if (parts[1].length === 0) {
    return parts[0];
  }
  return parts.join(".");
}

/**
 * @description 按照type 字段进行排序
 * @param arr  需要排序的数组
 * @param type 需要排序的字段
 * @returns  按照type 字段进行排序后的数组
 */
function mixedSort<T>(arr: T[], type: keyof T): T[] {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  const numberRegex = /^\d+$/;

  const compare = (a: T, b: T): number => {
    // 字符串或数字比较
    if (typeof a[type] === "string" || typeof a[type] === "number") {
      // 中文
      if (
        chineseRegex.test(a[type] as string) &&
        chineseRegex.test(b[type] as string)
      ) {
        return (a[type] as string).localeCompare(b[type] as string, "zh");
      }
      // 数字
      if (
        numberRegex.test(a[type] as string) &&
        numberRegex.test(b[type] as string)
      ) {
        return (a[type] as number) - (b[type] as number);
      }
      // 英文
      return (a[type] as string)
        .toString()
        .localeCompare((b[type] as string).toString(), "en");
    }
    return -1;
  };

  return arr.sort(compare);
}

export {
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

export type { myDate };

export default {
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

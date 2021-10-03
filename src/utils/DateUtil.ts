import moment from 'moment';
import {isNil, chunk, dropRight} from 'lodash'
import {func} from "prop-types";

export function dayOfWeek(date: Date): number {
  const mdate = moment(date || new Date());
  return parseInt(mdate.format('e'), 10);
}

export function daysAgo(date: Date): string {
  const mdate = moment(date).startOf('day');
  const mtoday = moment().startOf('day');
  if (mdate.isSame(mtoday)) {
    return 'Today';
  }
  const myesterday = mtoday.clone().add(-1, 'days');
  if (mdate.isSame(myesterday)) {
    return 'Yesterday';
  }
  let diff = mtoday.diff(mdate, 'months');
  if (diff === 1) {
    return `${diff} month ago`;
  } else if (diff > 0) {
    return `${diff} months ago`;
  }
  diff = mtoday.diff(mdate, 'days');
  return `${diff} days ago`;
}

export function daysAgoShort(date: Date): string {
  const mdate = moment(date).startOf('day');
  const mtoday = moment().startOf('day');
  if (mdate.isSame(mtoday)) {
    return 'Today';
  }
  const myesterday = mtoday.clone().add(-1, 'days');
  if (mdate.isSame(myesterday)) {
    return 'Yesterday';
  }
  let diff = mtoday.diff(mdate, 'months');
  if (diff > 0) {
    return `${diff}m`;
  }
  diff = mtoday.diff(mdate, 'days');
  return `${diff}d`;
}

function join(...params:Array<any>) {
  return params.filter(i => !isNil(i)).join(' ')
}

export function getAddressMultiline(site: any) {
  if (!site) {
    return ''
  }
  if (site.id) {
    const _1stLine = join(site.address, site.address2)
    const _2ndLine = join(site.city, site.state, site.postalCode)
    return `${_1stLine}\n${_2ndLine}`;
  } else if (site.details && site.details.place_id) {
    // In case of google place id
    const arr = dropRight(site.details.formatted_address.split(', '))   // Just drop the country
    const chunks = chunk(arr, Math.ceil(arr.length / 2))
    return chunks.filter(chunk => chunk.length).map(chunk => join(...chunk)).join('\n')
  } else if (site.details && site.details.coords) {
    // Name expreses all for this
    return ''
  }
  return site.address || ''
}

export function formatDeliveryDate(date){
  if (!date) {
      return '';
  }
  return moment(date).format('M/D/YYYY h:mm A')
}

export function getHumanDate (date = null) {
  const d = date ? new Date(date) : new Date();
  return moment(d).format('MMM D, YYYY')
}

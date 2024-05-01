/* tslint:disable */
/* eslint-disable */
import { FeedBackResponse } from '../models/feed-back-response';
export interface PageResponseFeedBackResponse {
  content?: Array<FeedBackResponse>;
  first?: boolean;
  last?: boolean;
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

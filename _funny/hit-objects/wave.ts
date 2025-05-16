import { BaseObject } from './base';

export interface WaveObject extends BaseObject {
  clicks_total: number;
  clicks_performed: number; //can start from any key - in any direction
}

export interface BaseObject {
  timing_ms: number;
  screen_pos: any; //vec2 custom coords
  appear_time_ms: number; //every object has unique ar
  size: any; //every object has unique custom size value
  uuid: any; //for identification for custom map skin etc
}

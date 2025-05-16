// flash pattern needed to perform: star, or X
//time stops, or music gets quiter
//percent based pattern match

import { BaseObject } from "./base";

export interface DrawerObject extends BaseObject {
    endpoints: any[]; //custom vec2 pos
    endpoint_rad: number; //radii allowed for each endpoint
    
}
import { BeatmapData } from "../beatmap/beatmap-data";

export class Gameplay {

  private currentTime: number = 0;
  private bgImg: any = null;
  private audio: any = null;
  private beatmapData: BeatmapData = null;

  constructor() {}

  public load(lvlPath: string) {}

  public start() {}

  public stop() {}

  public unload() {}
}

export interface Station {
  name: string;
  position: [number, number];
}

export const stations: Station[] = [
  { name: '胥湖心', position: [31.1593, 120.4318] },
  { name: '锡东水厂', position: [31.4483, 120.3722] },
  { name: '五里湖心', position: [31.5148, 120.2573] },
  { name: '乌龟山南', position: [31.621, 119.02] },
  { name: '平台山', position: [31.233, 120.11] },
  { name: '拖山', position: [31.406, 120.14] },
  { name: '兰山嘴', position: [31.212, 119.89] }
];
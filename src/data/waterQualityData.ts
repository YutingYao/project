export interface WaterQualityData {
  date: string;
  temperature: number;
  pH: number;
  oxygen: number;
  permanganate: number;
  NH: number;
  TP: number;
  TN: number;
  conductivity: number;
  turbidity: number;
  chla: number;
  density: number;
}

// Parse CSV data directly without using Node.js specific features
const csvContent = `date,temperature,pH,oxygen,permanganate,NH,TP,TN,conductivity,turbidity,chla,density
2021-6-2 8:00,26.15,8.342,6.67,4.473,0.025,0.0658,1.141,445.866,82.242,0.00388,14200000.0
2021-6-2 12:00,26.43,8.294,6.668,4.001,0.025,0.0609,0.967,464.492,68.413,0.00451,10600000.0
2021-6-2 16:00,26.1,8.315,6.78,5.257,0.025,0.0767,1.23,453.714,96.001,0.00384,18500000.0
2021-6-2 20:00,26.07,8.291,6.548,4.704,0.025,0.0697,0.955,452.943,75.0,0.00362,14300000.0
2021-6-3 0:00,25.78,8.138,6.343,4.704,0.025,0.073,1.144,468.651,77.518,0.00344,15700000.0
2021-6-3 4:00,25.7,8.057,6.163,3.012,0.025,0.0537,0.83,475.594,53.556,0.00339,10500000.0
2021-6-3 8:00,25.73,8.156,6.67,4.473,0.025,0.0658,1.141,445.866,82.242,0.00388,14200000.0`;

export const waterQualityData: WaterQualityData[] = csvContent
  .split('\n')
  .slice(1) // Skip header row
  .map(row => {
    const [
      date,
      temperature,
      pH,
      oxygen,
      permanganate,
      NH,
      TP,
      TN,
      conductivity,
      turbidity,
      chla,
      density
    ] = row.split(',');

    return {
      date,
      temperature: parseFloat(temperature),
      pH: parseFloat(pH),
      oxygen: parseFloat(oxygen),
      permanganate: parseFloat(permanganate),
      NH: parseFloat(NH),
      TP: parseFloat(TP),
      TN: parseFloat(TN),
      conductivity: parseFloat(conductivity),
      turbidity: parseFloat(turbidity),
      chla: parseFloat(chla),
      density: parseFloat(density)
    };
  });
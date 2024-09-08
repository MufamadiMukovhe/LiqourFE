
export class CompleteGISReport {
    latitude: any;
    longitude: any;
    schoolIn100m!: string;
    churchIn100m!: string;
    wardBoundriesIn100m!: string;
    councilorContacted!:string;
}
export class Image {
    src: string;
    description: string;
  
    constructor(src: string, description: string) {
      this.src = src;
      this.description = description;
    }
  
    
    getLowerCaseDescription(): string {
      return this.description.toLowerCase();
    }
  }
  
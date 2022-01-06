export interface ScoreResponse {
  score: number;
  scoreInfo: {
    creditCheckInfo: {
      scoreCard: {
        classDescription: string;
        classDescriptionDetailed: string;
      };
      trafficLight: string;
    };
    companyDataPacket: {
      companyData: {
        companyName: string;
      };
    };
  };
}

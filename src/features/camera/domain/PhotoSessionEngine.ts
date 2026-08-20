/**
 * PhotoSessionEngine — Multi-Pose Capture Session & AI Best-Shot Ranker.
 *
 * Manages photo session sequences (Pose 1 → Pose 2 → Pose 3 → Pose 4),
 * scores each capture, ranks the full session, and awards the Best Shot 🏆.
 */

export interface CapturedSessionPhoto {
  id: string;
  poseId: string;
  poseTitle: string;
  photoUri: string;
  snapScore: number;
  capturedAt: string;
}

export interface SessionResultSummary {
  sessionId: string;
  photos: CapturedSessionPhoto[];
  bestShot: CapturedSessionPhoto;
  averageScore: number;
  totalCaptures: number;
}

export class PhotoSessionEngine {
  private currentSessionId: string | null = null;
  private sessionPhotos: CapturedSessionPhoto[] = [];

  public startSession(): string {
    this.currentSessionId = `session_${Date.now()}`;
    this.sessionPhotos = [];
    return this.currentSessionId;
  }

  public recordCapture(
    poseId: string,
    poseTitle: string,
    photoUri: string,
    snapScore: number,
  ): CapturedSessionPhoto {
    const photoItem: CapturedSessionPhoto = {
      id: `photo_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      poseId,
      poseTitle,
      photoUri,
      snapScore,
      capturedAt: new Date().toISOString(),
    };

    this.sessionPhotos.push(photoItem);
    return photoItem;
  }

  public finishSession(): SessionResultSummary | null {
    if (this.sessionPhotos.length === 0) return null;

    // Rank photos by Snap Score descending
    const sorted = [...this.sessionPhotos].sort((a, b) => b.snapScore - a.snapScore);
    const bestShot = sorted[0];

    const totalScore = this.sessionPhotos.reduce((sum, p) => sum + p.snapScore, 0);
    const averageScore = Math.round(totalScore / this.sessionPhotos.length);

    const result: SessionResultSummary = {
      sessionId: this.currentSessionId || `session_${Date.now()}`,
      photos: this.sessionPhotos,
      bestShot,
      averageScore,
      totalCaptures: this.sessionPhotos.length,
    };

    this.currentSessionId = null;
    this.sessionPhotos = [];
    return result;
  }

  public getActiveSessionCount(): number {
    return this.sessionPhotos.length;
  }
}

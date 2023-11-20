import {IsDefined, IsString} from "class-validator";

export class AppendToCsvEvent {

  @IsString()
  @IsDefined()
  targetS3Bucket: string;

  @IsString()
  @IsDefined()
  targetS3Key: string;

  @IsDefined()
  itemWillBeAdded: Record<string, any>;
}

export type Handler = (event: AppendToCsvEvent) => Promise<void>;
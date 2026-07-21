import {
  type OrderPreviewDto,
  OrderPreviewDtoSchema,
  type TrackDto,
  TrackDtoSchema,
} from "@/features/track/api/dto";
import { TRACK_API } from "@/features/track/api/endpoints";
import {
  mapOrderPreviewDtoToOrderPreview,
  mapTrackDtoToTrack,
} from "@/features/track/lib/adapters";
import { type OrderPreview, type Track } from "@/features/track/types";
import { get } from "@/shared/api/api";
import { parseDto } from "@/shared/api/parseDto";

export const trackApi = {
  getOrderTracking: async (token: string): Promise<Track> => {
    const response = await get<{ data: TrackDto }>(TRACK_API.track(token));
    const validated = parseDto(TrackDtoSchema, response.data);
    return mapTrackDtoToTrack(validated);
  },
  getOrderStatus: async (orderNumber: string): Promise<OrderPreview> => {
    const response = await get<{ data: OrderPreviewDto }>(
      TRACK_API.status(orderNumber),
      { silentErrorStatuses: [404] },
    );
    const validated = parseDto(OrderPreviewDtoSchema, response.data);
    return mapOrderPreviewDtoToOrderPreview(validated);
  },
};

import { mapWorkDtoToWork } from "@/entities/work/adapters";
import { WorksResponseDtoSchema } from "@/entities/work/dto";
import { type Work } from "@/entities/work/types";
import { WORKS_API } from "@/features/works/api/endpoints";
import { parseDto } from "@/shared/api/parseDto";
import { getServer } from "@/shared/api/server";

export const worksServerApi = {
  getAllWorks: async (): Promise<Work[]> => {
    const firstResponse = await getServer<unknown>(
      `${WORKS_API.landingWorks()}?page=1`,
    );
    const firstValidated = parseDto(WorksResponseDtoSchema, firstResponse);
    const { last_page: lastPage } = firstValidated.meta;

    const remainingPages = await Promise.all(
      Array.from({ length: lastPage - 1 }, (_, index) => {
        const page = index + 2;
        return getServer<unknown>(
          `${WORKS_API.landingWorks()}?page=${page}`,
        ).then((response) => parseDto(WorksResponseDtoSchema, response));
      }),
    );

    return [firstValidated, ...remainingPages].flatMap((validated) =>
      validated.data.map(mapWorkDtoToWork),
    );
  },
};

import { HeaderAuthArea } from "@/widgets/site-shell/Header/HeaderAuthArea";

export const MobileHeaderAuthArea = () => {
  return (
    <div className="flex justify-end pb-3 pt-[10px] md:hidden">
      <HeaderAuthArea buttonClassName="w-full" showUserName />
    </div>
  );
};

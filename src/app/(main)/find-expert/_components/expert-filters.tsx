import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Cross, Filter } from "lucide-react";

export function ExpertFilters() {
  const handleApply = () => {};
  const handleClearAll = () => {};

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button className="w-12 h-12 bg-[#005864]">
          <Filter className="w-8 h-8 text-white" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" overflow-hidden bg-white">
        <DrawerHeader>
          <DrawerTitle className="heading">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button className="absolute top-4 right-4">
              <Cross className="w-6 h-6  " />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4">
          <span className="text-[20px] font-semibold">Status</span>

          <div className="flex flex-col gap-3 mb-4">
            <Button variant="ghost" className="justify-start">
              Active
            </Button>
            <Button variant="ghost" className="justify-start">
              Inactive
            </Button>
          </div>
        </div>

        <DrawerFooter className=" w-50 mx-auto flex justify-center">
          <Button variant="outline" className="w-full">
            Cancel
          </Button>
          <DrawerClose asChild>
            <Button onClick={handleApply} className="w-full">
              Apply
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

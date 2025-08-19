import { Input } from "@heroui/input";
import { FaSearch } from "react-icons/fa";

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export const Searchbar = ({ value, setValue }: Props) => {
  return (
    <Input
      label={
        <div className="flex flex-row items-center gap-1 ml-1">
          <FaSearch /> <span>Search</span>
        </div>
      }
      labelPlacement="inside"
      type="text"
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
    />
  );
};

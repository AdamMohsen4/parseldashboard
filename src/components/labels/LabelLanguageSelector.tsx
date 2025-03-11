
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LabelLanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LabelLanguageSelector = ({ value, onChange }: LabelLanguageSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="label-language">Label Language</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="label-language" className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fi">Finnish</SelectItem>
          <SelectItem value="sv">Swedish</SelectItem>
          <SelectItem value="no">Norwegian</SelectItem>
          <SelectItem value="da">Danish</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LabelLanguageSelector;

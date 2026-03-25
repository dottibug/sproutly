import { Switch } from 'react-native-paper';
import { SearchFilter } from '../../state/filters/filterTypes';

type ToggleProps = {
  readonly filter: SearchFilter;
  readonly value: boolean;
  readonly onToggle: (filter: SearchFilter) => void;
};

// Toggle component
export default function Toggle({ filter, value, onToggle }: ToggleProps) {
  return <Switch value={value} onValueChange={() => onToggle(filter)} />;
}

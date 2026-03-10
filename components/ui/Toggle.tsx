import { Switch } from 'react-native-paper';
import { Filter } from '../../lib/types';

type ToggleProps = {
  readonly filter: Filter;
  readonly value: boolean;
  readonly onToggle: (filter: Filter) => void;
};

export default function Toggle({ filter, value, onToggle }: ToggleProps) {
  return <Switch value={value} onValueChange={() => onToggle(filter)} />;
}

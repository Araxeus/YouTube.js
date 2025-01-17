import Text from './misc/Text.js';
import { YTNode } from '../helpers.js';

class CallToActionButton extends YTNode {
  static type = 'CallToActionButton';

  label: Text;
  icon_type: string;
  style: string;

  constructor(data: any) {
    super();
    this.label = new Text(data.label);
    this.icon_type = data.icon.iconType;
    this.style = data.style;
  }
}

export default CallToActionButton;